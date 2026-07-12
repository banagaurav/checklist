import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const handleError = (error: any, message?: string) => {
  if (error.code === 'UNIQUE_CONSTRAINT') {
    throw new BadRequestException(
      'Record already exists',
    );
  } else {
    throw new InternalServerErrorException(
      message || 'Failed to create/update record',
      error.message,
    );
  }
};
