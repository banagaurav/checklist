import { BadRequestException, HttpStatus } from '@nestjs/common';

export function formatErrors(errors: any[]) {
  const errs = parseErrors(errors);
  const objErrors = {};
  errs.forEach((e: any) => {
    Object.keys(e).forEach((k) => {
      objErrors[k] = e[k];
    });
  });
  const upErrors = { errors: objErrors, statusCode: HttpStatus.BAD_REQUEST };
  return new BadRequestException(upErrors);
}
export function parseErrors(errors: any[], parent: string | null = null) {
  const r = errors.map((error) => {
    if (error.children.length < 1) {
      return parseError(error, parent);
    } else {
      return parseErrors(error.children, error.property)[0];
    }
  });
  return r;
}

function parseError(error: any, parent = null) {
  const err = {};
  const key = parent ? [parent, error.property].join('.') : error.property;
  err[key] = Object.keys(error.constraints).map((c) => error.constraints[c]);
  return err;
}
