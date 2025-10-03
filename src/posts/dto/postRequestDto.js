import { param } from 'express-validator';

const postIdValid = param('id')
  .trim()
  .isUUID()
  .withMessage('uuid 형식이 올바르지 않습니다.');

export default function PostRequestDto() {
  return [postIdValid];
}

// 게시글 쿼리 타입 검증 -> int, string 검증
// string이라면 trim()으로 공백 제거
export function PostQuery(args) {
  const newObject = {};
  for (const data in args) {
    const numberData = Number(args[data]);
    if (!numberData) {
      newObject[data] = args[data].trim();
    } else {
      newObject[data] = numberData;
    }
  }

  return newObject;
}
