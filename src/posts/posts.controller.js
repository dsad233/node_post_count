import { asyncWrapper } from '../common/middlewares/async.js';
import { StatusCodes } from 'http-status-codes';
import { PagenationDto } from '../common/pagination/paginetionDto.js';
import { PostQuery } from './dto/postRequestDto.js';
import { dateConvert } from '../common/utils.js';
export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  // 게시글 생성
  create = asyncWrapper(async (req, res) => {
    const { id } = req.user;
    const { title, context, genre } = req.body;

    await this.postsService.create(title, context, genre, id);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 생성 완료.' });
  });

  // 게시글 전체 조회
  find = asyncWrapper(async (req, res) => {
    const { page, pages, ...args } = req.query;

    const posts = await this.postsService.find(
      PagenationDto(page, pages),
      PostQuery(args)
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 전체 조회 완료.', data: posts });
  });

  // 게시글 상세 목록 조회
  // 조회수
  findOne = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { page, pages, ...args } = req.query;
    const record = req.cookies[`${id}`]
      ? req.cookies[`${id}`].trim()
      : undefined;

    const post = await this.postsService.findOne(
      id,
      PagenationDto(page, pages),
      PostQuery(args)
    );

    if (!record) {
      // 쿠키 저장 -> 조회한 날짜 쿠키에 저장
      res.cookie(id, dateConvert(new Date()), {
        httpOnly: true,
        maxAge: 600000,
        secure: true,
      });

      await this.postsService.countUpdate(id);
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 상세 목록 조회 완료.', data: post });
  });

  // 게시글 업데이트
  update = asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, context, genre } = req.body;

    await this.postsService.update(id, title, context, genre, userId);

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 업데이트 완료.' });
  });

  // 게시글 삭제 (소프트 삭제)
  remove = asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await this.postsService.remove(id, userId);

    return res.status(StatusCodes.OK).json({ message: '게시글 삭제 완료.' });
  });
}
