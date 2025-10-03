import { header } from 'express-validator';

const refreshTokenValild = header('refreshtoken')
  .notEmpty()
  .withMessage('refresh 토큰이 존재하지 않습니다.')
  .trim()
  .isString();

export default function AuthRequestDto() {
  return [refreshTokenValild];
}
