import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ContextHelper } from '../helpers/context.helper';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return ContextHelper.getCurrentUser(context);
  },
);
