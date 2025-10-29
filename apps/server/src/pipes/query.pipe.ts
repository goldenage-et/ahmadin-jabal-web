import { formatZodError } from '@repo/common';
import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  PipeTransform,
} from '@nestjs/common';

export function QueryPipe(validationSchema: any) {
  return class Pipe implements PipeTransform {
    readonly logger = new Logger(QueryPipe.name);
    transform(data: any, metadata: ArgumentMetadata) {
      this.logger.log(this.transform.name);

      if (!data || metadata.type !== 'query') {
        return data;
      }
      const result = validationSchema.safeParse(data);
      if (!result.success) {
        throw new BadRequestException(formatZodError(result.error));
      }
      return result.data;
    }
  };
}
