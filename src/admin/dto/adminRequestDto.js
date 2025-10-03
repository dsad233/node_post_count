import { param } from 'express-validator';

const userIdValid = param('userid')
  .trim()
  .isUUID()
  .withMessage('uuid 형식이 올바르지 않습니다.');

export function AdminRequestDto() {
  return [userIdValid];
}
