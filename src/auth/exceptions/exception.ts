import { HttpException, HttpStatus } from '@nestjs/common';

export class Exception extends HttpException {
  constructor() {
    super('Issue', HttpStatus.CONFLICT);
  }
}
