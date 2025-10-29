import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@repo/prisma';
import { errorTypes } from '@repo/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let response = ctx.getResponse<Response>();
    let request = ctx.getRequest<Request>();
    let statusCode = exception?.status;
    let errorType = exception?.cause;
    let message = exception?.message;

    let details = undefined;
    if (typeof exception?.response?.message === 'string') {
      message = exception?.response?.message;
    } else {
      details = exception?.response?.message;
    }

    if (exception instanceof ZodError) {
      details = exception.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      statusCode = HttpStatus.BAD_REQUEST;
      errorType = 'validationError';
      message = 'Validation failed';
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // this.logger.error(`PrismaClientValidationError: ${exception.message}`);
      details = null;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorType = 'unknownError';
      message = 'Internal server error';
    }

    if (!statusCode || statusCode < 400 || statusCode > 500) {
      statusCode = 500;
    }

    if (!errorType || errorType === 'unknownError') {
      errorType =
        errorTypes && statusCode in errorTypes
          ? errorTypes[statusCode]
          : 'unknownError';
    }

    const error = {
      error: true,
      method: request.method,
      details: details,
      statusCode: statusCode,
      errorType: errorType,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (![401, 403].includes(statusCode)) {
      this.logger.error(`HTTP Error: `, error);
    }

    response.status(statusCode).json(error);
  }
}
