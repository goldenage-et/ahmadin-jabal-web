import {
  BadRequestException,
  Body,
  Controller,
  Delete, // Import Delete
  Get, // Import Get for a potential 'me' endpoint
  Headers, // Import Headers
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Req, // Import Req
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CurrentSession } from '@/decorators/current-session.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import {
  OAuthProvider,
  TChangeEmail,
  TChangePassword,
  TForgetPassword,
  TLogin,
  TRegister,
  TSession,
  TSetPassword,
  TAuthUser,
  TVerifyEmail,
  ZChangeEmail,
  ZChangePassword,
  ZEmailVerification,
  ZForgetPassword,
  ZLogin,
  ZRegister,
  ZSetPassword,
  ZVerifyEmail,
  TUserBasic,
} from '@repo/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { OAuthClientProvider } from '@/providers/oauth/oauth2.provider';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly oAuthProvider: OAuthClientProvider,
  ) { }

  @Post('register')
  @HttpCode(201)
  @UsePipes(BodyPipe(ZRegister))
  async register(@Body() data: TRegister) {
    const user = await this.authService.register(data);
    return {
      message: 'Registration successful. Please verify your email.',
      user: user.id,
    };
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(BodyPipe(ZLogin))
  async login(
    @Body() data: TLogin,
    @Headers('user-agent') clientAgent: string | undefined,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<TUserBasic> {
    const { user, sessionId } = await this.authService.login({
      ...data,
      clientAgent,
    });
    this.authService.setSession(response, sessionId);
    return user;
  }


  @Get('url/:provider')
  async getAuthUrl(
    @Param('provider') provider: OAuthProvider,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oAuthClient = this.oAuthProvider.getClient(provider);
    const { url, cookieState, codeVerifier } = oAuthClient.createAuthUrl();

    response.cookie('cookieState', cookieState, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 60 * 10 * 1000,
      domain: this.authService.cookieDomain,
    });

    response.cookie('codeVerifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 60 * 10 * 1000,
      domain: this.authService.cookieDomain,
    });

    return { url };
  }

  @Get('redirect/:provider')
  @Redirect(process.env.CLIENT_HOST || 'http://localhost:3001')
  async oauthRedirect(
    @Param('provider') provider: OAuthProvider,
    @Headers('user-agent') clientAgent: string | undefined,
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const cookieState = request.cookies?.cookieState;
      const codeVerifier = request.cookies?.codeVerifier;
      if (cookieState !== state) throw new BadRequestException('Invalid State');
      if (codeVerifier == null)
        throw new BadRequestException('Invalid Verifier');

      const oAuthClient = this.oAuthProvider.getClient(provider);
      const oAuthUser = await oAuthClient.fetchUser(code, codeVerifier);

      const user = await this.authService.connectToAccount(oAuthUser.user, {
        provider: provider,
        providerId: oAuthUser.user.id,
        accessToken: oAuthUser.accessToken,
        idToken: oAuthUser.idToken,
        expiresIn: oAuthUser.expiresIn,
        tokenType: oAuthUser.tokenType,
      });

      const sessionId = await this.authService.createSession(user, {
        clientAgent: clientAgent,
      });

      this.authService.setSession(response, sessionId);

      return { url: process.env.CLIENT_HOST || 'http://localhost:3001' };
    } catch (error) {
      console.error(error);
      return {
        url: `${process.env.CLIENT_HOST || 'http://localhost:3001'}/login?oauthError=${encodeURIComponent(
          'Failed to connect. Please try again.',
        )}`,
      };
    }
  }

  @Post('change-email')
  @HttpCode(200)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZChangeEmail))
  async changeEmail(
    @CurrentUser() user: TAuthUser,
    @Body() data: TChangeEmail,
  ): Promise<{ message: string }> {
    const { message } = await this.authService.changeEmail(user.id, data);
    return { message };
  }

  @Post('email-verification')
  @HttpCode(200)
  @UsePipes(BodyPipe(ZEmailVerification))
  async emailVerification(@Body() data: { email: string }) {
    const { message } = await this.authService.emailVerification(data);
    return { message };
  }

  @Post('verify-email')
  @HttpCode(200)
  @UsePipes(BodyPipe(ZVerifyEmail))
  async verifyEmail(
    @Body() data: TVerifyEmail,
  ): Promise<{ message: string; user: string }> {
    const user = await this.authService.verifyEmail(data);
    return {
      message: 'Email verified successfully. Please log in.',
      user: user.id,
    };
  }

  @Post('forget-password')
  @HttpCode(200)
  @UsePipes(BodyPipe(ZForgetPassword))
  async forgetPassword(@Body() data: TForgetPassword) {
    const { message } = await this.authService.forgetPassword(data);
    return { message };
  }

  @Post('set-password')
  @HttpCode(200)
  @UsePipes(BodyPipe(ZSetPassword))
  async setPassword(
    @Body() data: TSetPassword,
  ): Promise<{ message: string; user: string }> {
    const user = await this.authService.setPassword(data);
    return {
      message: 'Password set successfully. Please log in.',
      user: user.id,
    };
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZChangePassword))
  async changePassword(
    @CurrentUser() user: TAuthUser,
    @Body() data: TChangePassword,
  ) {
    await this.authService.changePassword(user.id, data);
    this.logger.log(`User ${user.email} changed password successfully.`);
    return { message: 'Password changed successfully.' };
  }

  @Get('session')
  @UseGuards(UserAuthGuard)
  async getSession(
    @CurrentSession() session: TSession,
    @CurrentUser() user: TAuthUser,
  ): Promise<{ session: TSession; user: TAuthUser }> {
    return { session, user };
  }

  @Get('sessions')
  @UseGuards(UserAuthGuard)
  async getUserSessions(@CurrentUser() user: TAuthUser) {
    return await this.authService.getUserSessions(user.id);
  }


  @Delete('logout')
  @UseGuards(UserAuthGuard)
  @HttpCode(204)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies?.sessionId;

    if (sessionId) {
      try {
        await this.authService.logout(sessionId);
      } catch (error) {
        console.error('Error logging out session on server:', error);
      }
    }
    this.authService.clearSession(response);
  }

  @Delete('logout/all')
  @UseGuards(UserAuthGuard)
  async logoutAll(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return await this.authService.logoutAll(user.id);
  }

  @Delete('logout/:id')
  @UseGuards(UserAuthGuard)
  async logoutOther(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return await this.authService.logoutOther({
      id,
      user: user.id,
    });
  }

  @Get('me')
  @UseGuards(UserAuthGuard)
  async getMe(@CurrentUser() user: TAuthUser): Promise<TAuthUser> {
    return user;
  }
}
