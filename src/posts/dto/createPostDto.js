import { body } from 'express-validator';
import { TYPE } from '../../common/enums/index.js';

const titleValid = body('title')
  .notEmpty()
  .withMessage('게시글 제목을 작성해 주세요.')
  .trim()
  .isString()
  .isLength({ min: 2, max: 15 })
  .withMessage('게시글 제목은 2자 이상 15자 이하로 입력해 주세요.');

const contextValid = body('context').optional().trim().isString();

const genreValid = body('genre')
  .optional()
  .trim()
  .isString()
  .isIn([TYPE.GenreType.COMPUTER, TYPE.GenreType.MOBILE])
  .withMessage('컴퓨터, 모바일 둘 중 하나를 선택해 주세요.')
  .isLength({ max: 10 });

export default function CreatePostDto() {
  return [titleValid, contextValid, genreValid];
}
