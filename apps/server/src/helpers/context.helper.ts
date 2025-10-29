import { ExecutionContext } from '@nestjs/common';
import {
  TSession,
  TUserBasic,
} from '@repo/common';

export class ContextHelper {
  static getCurrentUser(context: ExecutionContext): TUserBasic | undefined {
    try {
      const request = ContextHelper.getRequest<any>(context);
      return request.user;
    } catch (error) {
      return undefined;
    }
  }

  static getCurrentSession(context: ExecutionContext): TSession | undefined {
    try {
      const request = ContextHelper.getRequest<any>(context);
      return request.session;
    } catch (error) {
      return undefined;
    }
  }

  static getRequest<T extends object>(context: ExecutionContext): T {
    let request: any;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest<T>();
    } else if (context.getType() === 'rpc') {
      request = context.switchToRpc().getData<T>();
    }
    return request;
  }
}
