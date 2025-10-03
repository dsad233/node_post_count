import { body } from 'express-validator';

const titleValid = body('title')
  .optional()
  .trim()
  .isString()
  .isLength({ min: 2, max: 15 })
  .withMessage('게시글 제목은 2자 이상 15자 이하로 입력해 주세요.');

const contextValid = body('context').optional().trim().isString();

const genreValid = body('genre')
  .optional()
  .trim()
  .isString()
  .isLength({ max: 10 })
  .withMessage('10자 이내로 작성해 주세요.');

export default function UpdatePostDto() {
  return [titleValid, contextValid, genreValid];
}
