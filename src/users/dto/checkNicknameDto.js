import { body } from 'express-validator';

const nicknameValid = body('nickname')
  .notEmpty()
  .withMessage('닉네임을 입력해 주세요.')
  .trim()
  .isString()
  .isLength({ min: 2, max: 16 })
  .withMessage('닉네임은 2자 이상 16자 이하로 입력해 주세요.');

export default function CheckNicknameDto() {
  return [nicknameValid];
}
