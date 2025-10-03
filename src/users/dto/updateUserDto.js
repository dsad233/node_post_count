import { body } from 'express-validator';
import { regexObject } from '../../common/utils.js';
import { TYPE } from '../../common/enums/index.js';

const nameValid = body('name')
  .optional()
  .trim()
  .isString()
  .isLength({ min: 2, max: 5 })
  .withMessage('이름은 2자 이상 5자 이하로 입력해 주세요.');

const newPasswordValid = body('newPassword')
  .optional()
  .trim()
  .isString()
  .matches(regexObject.password)
  .withMessage('패스워드는 영문자, 숫자 8자 이상 20자 이하로 입력해 주세요.')
  .isLength({ max: 64 })
  .withMessage('64자 이내로 작성해 주세요.');

const nicknameValid = body('nickname')
  .optional()
  .trim()
  .isString()
  .isLength({ min: 2, max: 16 })
  .withMessage('닉네임은 2자 이상 16자 이하로 입력해 주세요.');

const genderValid = body('gender')
  .optional()
  .trim()
  .isString()
  .isIn([TYPE.GenderType.MAN, TYPE.GenderType.WOMEN])
  .withMessage('남자, 여자 둘 중 하나를 선택해 주세요.')
  .isLength({ min: 2, max: 5 });

const birthValid = body('birth')
  .optional()
  .trim()
  .isDate()
  .withMessage('날짜 형식이 올바르지 않습니다. 다시 시도 해주세요.');

const phoneNumberValid = body('phoneNumber')
  .optional()
  .trim()
  .isString()
  .matches(regexObject.phoneNumber)
  .withMessage('전화번호 형식이 올바르지 않습니다. 다시 시도 해주세요.')
  .isLength({ max: 15 })
  .withMessage('15자 이내로 작성해 주세요.');

export default function UpdateUserDto() {
  return [
    nameValid,
    newPasswordValid,
    nicknameValid,
    genderValid,
    birthValid,
    phoneNumberValid,
  ];
}
