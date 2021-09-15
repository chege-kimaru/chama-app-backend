import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';

@Injectable()
export class DecodeQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    // Make sure to only run your logic on queries
    if (type === 'query') return this.transformQuery(value);

    return value;
  }

  transformQuery(query: any) {
    try {
      return JSON.parse(decodeURIComponent(query));
    } catch (e) {
      return {};
    }
  }
}
