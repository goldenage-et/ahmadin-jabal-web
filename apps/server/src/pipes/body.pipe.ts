import { formatZodError } from '@repo/common';
import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

type ZodSchema = z.ZodRawShape;

export function BodyPipe(validationSchema: any) {
  return class Pipe implements PipeTransform {
    readonly logger = new Logger(BodyPipe.name);
    transform(data: any, metadata: ArgumentMetadata) {
      this.logger.log(this.transform.name);

      if (!data || metadata.type !== 'body') {
        return data;
      }
      const result = validationSchema.safeParse(data as z.ZodObject<ZodSchema>);
      if (!result.success) {
        throw new BadRequestException(formatZodError(result.error));
      }
      return result.data;
    }
  };
}
