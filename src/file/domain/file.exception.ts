import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`File not found with id: ${id}`);
  }
}
