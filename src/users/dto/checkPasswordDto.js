import { body } from 'express-validator';
import { regexObject } from '../../common/utils.js';

const passwordValid = body('password')
  .notEmpty()
  .withMessage('패스워드를 입력해 주세요.')
  .trim()
  .isString()
  .matches(regexObject.password)
  .withMessage('패스워드는 영문자, 숫자 8자 이상 20자 이하로 입력해 주세요.')
  .isLength({ max: 64 })
  .withMessage('64자 이내로 작성해 주세요.');

export default function CheckPasswordDto() {
  return [passwordValid];
}
