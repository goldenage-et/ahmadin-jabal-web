import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import { EmailVerificationEvent } from '@/events/auth/auth-event.interface';
import { generateOtp } from '@/utils/generate-otp';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ErrorType,
  OAuthProvider,
  TAuthUser,
  TChangeEmail,
  TChangePassword,
  TEmailVerification,
  TForgetPassword,
  TLogin,
  TLoginOption,
  TRegister,
  TSession,
  TSessionBasic,
  TSetPassword,
  TUserBasic,
  TUserQueryUnique,
  TVerifyEmail,
  ZAuthUser,
  ZSession,
  ZSessionBasic,
  ZUserBasic
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { Response } from 'express';
import z from 'zod';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  cookieDomain: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PRISMA_CLIENT) private readonly db: PrismaClient,
  ) {
    const clientHost = this.configService.get('CLIENT_HOST');
    const url = new URL(clientHost);
    const hostname = url.hostname;
    if (
      this.configService.get('NODE_ENV') === 'development' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      this.cookieDomain = undefined;
    } else {
      const parts = hostname.split('.');
      if (parts.length > 2) {
        this.cookieDomain = `.${parts.slice(1).join('.')}`;
      } else {
        this.cookieDomain = hostname.startsWith('.')
          ? hostname
          : `.${hostname}`;
      }
    }
    this.logger.debug(
      `Cookie domain set to: ${this.cookieDomain || 'undefined (localhost)'}`,
    );
  }

  // --- Private Helper Methods ---

  private async _validateEmailPassword(data: TLogin): Promise<TUserBasic> {
    const foundUser = await this.db.user.findUnique({
      where: {
        email: data.email.toLowerCase(),
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found with this email');
    }

    if (!foundUser.active) {
      throw new UnauthorizedException('User account is inactive');
    }

    if (!foundUser.ltpHash) {
      throw new UnauthorizedException('Wrong Credential');
    }

    const valid = await argon2.verify(foundUser.ltpHash ?? '', data.password);

    if (!valid) {
      throw new UnauthorizedException('Wrong Credential');
    }

    if (!foundUser.emailVerified) {
      const { otp } = await this._setUserOtp({ idOrEmail: foundUser.email });
      this.eventEmitter.emit(
        'email.verification',
        new EmailVerificationEvent({
          otp: otp,
          email: foundUser.email,
          firstName: foundUser.firstName,
          middleName: foundUser.middleName,
        }),
      );
      throw new UnauthorizedException('Email not verified', {
        cause: ErrorType.EMAIL_NOT_VERIFIED,
      });
    }


    return ZUserBasic.parse(foundUser);
  }

  private async _setUserOtp({ idOrEmail }: { idOrEmail: string }): Promise<{
    otp: string;
    user: TUserBasic;
  }> {
    const otp = generateOtp();
    const otpHash = await argon2.hash(otp);
    let foundUser;
    if (z.email().safeParse(idOrEmail).success) {
      foundUser = await this.db.user.findUnique({
        where: { email: idOrEmail },
      });
    } else {
      foundUser = await this.db.user.findUnique({
        where: { id: idOrEmail },
      });
    }

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }
    foundUser = await this.db.user.update({
      where: { id: foundUser.id },
      data: { otpHash },
    });
    return { otp, user: ZUserBasic.parse(foundUser) };
  }

  // --- Public Authentication Methods ---

  setSession(response: Response, sessionId: string): Response {
    response.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: this.cookieDomain,
      path: '/',
    });
    return response;
  }

  clearSession(response: Response): Response {
    response.clearCookie('sessionId', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      domain: this.cookieDomain,
      path: '/',
    });
    return response;
  }

  async createSession(
    user: TUserBasic,
    options?: TLoginOption,
  ): Promise<string> {
    const sessionId = crypto.randomBytes(64).toString('hex').normalize();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.db.session.create({
      data: {
        sessionId,
        expiresAt,
        userId: user.id,
        ipAddress: '',
        userAgent: options?.clientAgent,
      },
    });

    return sessionId;
  }

  async register(data: TRegister): Promise<TUserBasic> {
    const userExist = await this.findUserByEmail(data.email);

    if (userExist && userExist.email === data.email.toLowerCase()) {
      throw new ConflictException('User already exist with this Email');
    }

    const otp = generateOtp();
    const otpHash = await argon2.hash(otp);
    const ltpHash = await argon2.hash(data.password);

    const newUser = await this.db.user.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        otpHash: otpHash,
        ltpHash: ltpHash,
        phone: data.phone,
        emailVerified: false,
        active: true,
        image: '',
      },
    });

    this.eventEmitter.emit(
      'user.registration',
      new EmailVerificationEvent({
        otp: otp,
        email: newUser.email,
        firstName: newUser.firstName,
        middleName: newUser.middleName,
      }),
    );

    return ZUserBasic.parse(newUser);
  }

  async login({
    email,
    password,
    ...options
  }: TLogin & TLoginOption): Promise<{ user: TUserBasic; sessionId: string }> {
    const user = await this._validateEmailPassword({ email, password });
    const sessionId = await this.createSession(user, options);

    return { user, sessionId };
  }

  async connectToAccount(
    data: {
      id: string;
      email: string;
      firstName: string;
      middleName: string;
      lastName?: string;
    },
    provider: {
      provider: OAuthProvider;
      providerId: string;
      accessToken: string;
      idToken: string;
      tokenType: string;
      expiresIn: number;
    },
  ) {
    let user = await this.db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      user = await this.db.user.create({
        data: {
          email: data.email.toLowerCase(),
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          emailVerified: true,
          active: true,
          image: '',
          ltpHash: '',
          otpHash: '',
        },
      });
    }

    const account = await this.db.account.findFirst({
      where: { userId: user.id, provider: provider.provider },
    });

    if (!account) {
      await this.db.account.create({
        data: {
          userId: user.id,
          providerId: provider.providerId,
          provider: provider.provider,
          accessToken: provider.accessToken,
          idToken: provider.idToken,
          expiresIn: provider.expiresIn,
          tokenType: provider.tokenType,
        },
      });
    }

    return ZUserBasic.parse(user);
  }

  async myAuth(query: TUserQueryUnique): Promise<TUserBasic> {
    let foundUser;

    if (query.id) {
      foundUser = await this.db.user.findUnique({
        where: { id: query.id },
      });
    } else if (query.email) {
      foundUser = await this.db.user.findUnique({
        where: { email: query.email },
      });
    }

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return ZUserBasic.parse(foundUser);
  }

  async emailVerification(data: TEmailVerification) {
    const { otp, user } = await this._setUserOtp({ idOrEmail: data.email });
    this.eventEmitter.emit(
      'email.verification',
      new EmailVerificationEvent({
        otp: otp,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
      }),
    );
    return { message: `Verification email sent. ${user.email}` };
  }

  async verifyEmail(data: TVerifyEmail): Promise<TUserBasic> {
    const foundUser = await this.db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }

    if (!foundUser.otpHash) {
      throw new NotFoundException('OTP not found with this email');
    }

    const valid = await argon2.verify(foundUser.otpHash, data.otp);

    if (!valid) {
      throw new UnauthorizedException('Wrong OTP Credential');
    }

    const updatedUser = await this.db.user.update({
      where: { id: foundUser.id },
      data: {
        emailVerified: true,
        otpHash: null,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }

    return ZUserBasic.parse(updatedUser);
  }

  async changeEmail(
    userId: string,
    data: TChangeEmail,
  ): Promise<{ message: string }> {
    const updatedUser = await this.db.user.update({
      where: { id: userId },
      data: { email: data.email.toLowerCase(), emailVerified: false },
    });

    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }

    const { otp, user } = await this._setUserOtp({ idOrEmail: data.email });
    this.eventEmitter.emit(
      'email.verification',
      new EmailVerificationEvent({
        otp: otp,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
      }),
    );

    return { message: `Verification email sent. ${user.email}` };
  }

  async forgetPassword(data: TForgetPassword) {
    const { otp, user } = await this._setUserOtp({ idOrEmail: data.email });
    this.eventEmitter.emit(
      'forget.password',
      new EmailVerificationEvent({
        otp: otp,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
      }),
    );
    return { message: `OTP sent to ${user.email}` };
  }

  async setPassword(data: TSetPassword): Promise<TUserBasic> {
    const foundUser = await this.db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }

    if (!foundUser.otpHash) {
      throw new NotFoundException('OTP not found with this email');
    }

    const valid = await argon2.verify(foundUser.otpHash, data.otp);

    if (!valid) {
      throw new UnauthorizedException('Wrong OTP Credential');
    }

    const ltpHash = await argon2.hash(data.password);

    const updatedUser = await this.db.user.update({
      where: { id: foundUser.id },
      data: {
        ltpHash,
        otpHash: null,
        emailVerified: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }

    return ZUserBasic.parse(updatedUser);
  }

  async changePassword(
    userId: string,
    data: TChangePassword,
  ): Promise<TUserBasic> {
    const userCheck = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!userCheck) {
      throw new NotFoundException('User Not Found');
    }

    if (userCheck.ltpHash) {
      const valid = await argon2.verify(userCheck.ltpHash, data.oldPassword);
      if (!valid) {
        throw new UnauthorizedException('Wrong Credential');
      }
    }

    const ltpHash = await argon2.hash(data.newPassword);

    const updatedUser = await this.db.user.update({
      where: { id: userCheck.id },
      data: { ltpHash },
    });

    await this.logoutAll(userCheck.id);

    return ZUserBasic.parse(updatedUser);
  }

  async validateSession(sessionId: string): Promise<{
    user: TAuthUser;
    session: TSession;
  }> {
    const foundSession = await this.db.session.findUnique({
      where: { sessionId: sessionId },
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!foundSession) {
      throw new UnauthorizedException('Session not found', {
        cause: ErrorType.NOT_ACCESS_SESSION,
      });
    }

    if (new Date() > foundSession.expiresAt) {
      await this.db.session.delete({
        where: { sessionId: sessionId },
      });
      throw new UnauthorizedException('Session expired', {
        cause: ErrorType.EXPIRED_SESSION,
      });
    }

    const foundUser = foundSession.user

    if (!foundUser || !foundUser.active) {
      throw new UnauthorizedException('User account inactive or not found', {
        cause: ErrorType.USER_DISABLED,
      });
    }

    if (!foundUser.emailVerified) {
      throw new UnauthorizedException('Email not verified', {
        cause: ErrorType.EMAIL_NOT_VERIFIED,
      });
    }
    return {
      user: ZAuthUser.parse(foundUser),
      session: ZSession.parse(foundSession),
    };
  }

  async logout(sessionId: string): Promise<{ success: boolean }> {
    const deletedSession = await this.db.session.delete({
      where: { sessionId: sessionId },
    });

    if (!deletedSession) {
      return { success: false };
    }
    return { success: true };
  }

  async logoutOther(data: {
    id: string;
    user: string;
  }): Promise<{ success: boolean }> {
    const deletedSession = await this.db.session.delete({
      where: {
        id: data.id,
        userId: data.user,
      },
    });

    if (!deletedSession) {
      return { success: false };
    }
    return { success: true };
  }

  async logoutAll(user: string): Promise<{ deletedCount: number }> {
    const result = await this.db.session.deleteMany({
      where: { userId: user },
    });
    return { deletedCount: result.count };
  }

  async getUserSessions(user: string): Promise<TSessionBasic[]> {
    const sessions = await this.db.session.findMany({
      where: { userId: user },
      orderBy: { createdAt: 'desc' },
    });
    return ZSessionBasic.array().parse(sessions);
  }

  // Helper methods
  private async findUserByEmail(email: string) {
    const foundUser = await this.db.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!foundUser) return null;
    return ZUserBasic.parse(foundUser);
  }
}
