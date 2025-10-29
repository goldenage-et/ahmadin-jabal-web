import { AuthService } from '@/features/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorType, TAuthUser, TSession, TUserBasic } from '@repo/common';
import { Request } from 'express';
import { ContextHelper } from '../helpers/context.helper';

export const UserAuthOptions = (options: {
  safeAuth?: boolean;
}) => SetMetadata('authOptions', options);

@Injectable()
export class UserAuthGuard implements CanActivate {
  private readonly logger = new Logger(UserAuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = ContextHelper.getRequest<
      Request & {
        user: TAuthUser;
        session: TSession
      }
    >(context);
    const sessionId = request.cookies?.sessionId;

    const options = this.reflector.get<{
      safeAuth?: boolean;
      requiredActive?: boolean;
      requiredEmailVerified?: boolean;
      systemOwner?: boolean;
    }>('authOptions', context.getHandler()) || {
      safeAuth: false,
      requiredActive: true,
      requiredEmailVerified: true,
    };

    if (!sessionId) {
      if (!options.safeAuth) {
        throw new UnauthorizedException(
          'Unauthorized: No Session ID provided',
          {
            cause: ErrorType.NOT_ACCESS_SESSION,
          },
        );
      }
    }

    let user: TAuthUser | null = null;
    let session: TSession | null = null;
    try {
      const res = await this.authService.validateSession(sessionId);
      user = res.user;
      session = res.session;
    } catch (error: any) {
      this.logger.warn(`Session validation failed: ${error?.message}`);
      if (!options.safeAuth) {
        throw new UnauthorizedException(
          'Unauthorized: Invalid or Expired Session',
          {
            cause: error.cause || ErrorType.INVALID_SESSION,
          },
        );
      }
    }

    if (!user) {
      if (!options.safeAuth) {
        throw new UnauthorizedException(
          'Unauthorized: Session validation failed',
          {
            cause: ErrorType.INVALID_SESSION,
          },
        );
      }
    }

    if (!user?.active) {
      if (!options.safeAuth) {
        throw new ForbiddenException('Forbidden: User Deactivated', {
          cause: ErrorType.PERMISSION_DENIED,
        });
      }
    }

    if (!user?.emailVerified) {
      if (!options.safeAuth) {
        throw new ForbiddenException('Forbidden: Email Not Verified', {
          cause: ErrorType.EMAIL_NOT_VERIFIED,
        });
      }
    }

    request.user = user;
    request.session = session;


    return true;
  }
}
