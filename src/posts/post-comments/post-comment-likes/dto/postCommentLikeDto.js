import { param } from 'express-validator';

const postIdValid = param('postid')
  .trim()
  .isUUID()
  .withMessage('uuid 형식이 올바르지 않습니다.');

const commnetIdValid = param('id')
  .optional()
  .trim()
  .isUUID()
  .withMessage('uuid 형식이 올바르지 않습니다.');

export function PostCommentLikeDto() {
  return [postIdValid, commnetIdValid];
}
