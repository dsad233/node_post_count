import { body } from 'express-validator';

const contextValid = body('context')
  .notEmpty()
  .withMessage('댓글 내용을 적성해 주세요.')
  .trim()
  .isString()
  .isLength({ min: 2 })
  .withMessage('댓글 내용을 2자 이상으로 작성해주세요.');

export default function CreatePostComments() {
  return [contextValid];
}
