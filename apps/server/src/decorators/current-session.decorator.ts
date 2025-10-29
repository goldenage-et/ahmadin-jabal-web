import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ContextHelper } from '../helpers/context.helper';

export const CurrentSession = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return ContextHelper.getCurrentSession(context);
  },
);
