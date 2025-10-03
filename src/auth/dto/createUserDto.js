import { body } from 'express-validator';
import { regexObject } from '../../common/utils.js';
import { TYPE } from '../../common/enums/index.js';

const loginIdValid = body('loginId')
  .notEmpty()
  .withMessage('아이디를 입력해 주세요.')
  .trim()
  .isString()
  .isLength({ min: 2, max: 30 })
  .withMessage('아이디는 2자 이상 30자 이하로 입력해 주세요.');

const nameValid = body('name')
  .notEmpty()
  .withMessage('이름을 입력해 주세요.')
  .trim()
  .isString()
  .isLength({ min: 2, max: 5 })
  .withMessage('이름은 2자 이상 5자 이하로 입력해 주세요.');

const emailValid = body('email')
  .optional()
  .trim()
  .isEmail()
  .matches(regexObject.email)
  .withMessage('이메일 형식이 올바르지 않습니다. 다시 시도 해주세요.')
  .isLength({ max: 64 })
  .withMessage('64자 이내로 작성해 주세요.');

const passwordValid = body('password')
  .notEmpty()
  .withMessage('패스워드를 입력해 주세요.')
  .trim()
  .isString()
  .matches(regexObject.password)
  .withMessage('패스워드는 영문자, 숫자 8자 이상 20자 이하로 입력해 주세요.')
  .isLength({ max: 64 })
  .withMessage('64자 이내로 작성해 주세요.');

const nicknameValid = body('nickname')
  .notEmpty()
  .withMessage('닉네임을 입력해 주세요.')
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
  .notEmpty()
  .withMessage('전화번호를 입력해 주세요.')
  .trim()
  .isString()
  .matches(regexObject.phoneNumber)
  .withMessage('전화번호 형식이 올바르지 않습니다. 다시 시도 해주세요.')
  .isLength({ max: 15 })
  .withMessage('15자 이내로 작성해 주세요.');

export default function CreateUserDto() {
  return [
    loginIdValid,
    nameValid,
    emailValid,
    passwordValid,
    nicknameValid,
    genderValid,
    birthValid,
    phoneNumberValid,
  ];
}
