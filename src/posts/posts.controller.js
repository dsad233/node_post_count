import { StatusCodes } from 'http-status-codes';
import { PagenationDto } from '../common/pagination/paginationDto.js';
import { PostQuery } from './dto/postRequestDto.js';
import { dateConvert } from '../common/utils.js';
export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  // 게시글 생성
  create = async (req, res) => {
    const { id } = req.user;
    const { title, context, genre } = req.body;

    await this.postsService.create(title, context, genre, id);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 생성 완료.' });
  };

  // 게시글 전체 조회
  find = async (req, res) => {
    const { page, pages, ...args } = req.query;

    const posts = await this.postsService.find(
      PagenationDto(page, pages),
      PostQuery(args)
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 전체 조회 완료.', data: posts });
  };

  // 게시글 상세 목록 조회
  findOne = async (req, res) => {
    const { id } = req.params;
    const { page, pages, ...args } = req.query;
    // 인섬니아 origin 해결 해봐야함. -> 오리진을 설정하면 인섬니아는 접속이 안댐.
    const signedRecord = req.signedCookies[`${id}`]
      ? req.signedCookies[`${id}`].trim()
      : undefined;

    const post = await this.postsService.findOne(
      id,
      PagenationDto(page, pages),
      PostQuery(args)
    );

    if (!signedRecord) {
      // 쿠키 저장 -> 조회한 날짜 쿠키에 저장
      await Promise.all([
        res.cookie(id, dateConvert(new Date()), {
          httpOnly: true,
          maxAge: 600000,
          secure: true,
          sameSite: true,
          signed: true,
        }),

        await this.postsService.countUpdate(id),
      ]);
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 상세 목록 조회 완료.', data: post });
  };

  // 게시글 업데이트
  update = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, context, genre } = req.body;

    await this.postsService.update(id, title, context, genre, userId);

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 업데이트 완료.' });
  };

  // 게시글 삭제 (소프트 삭제)
  remove = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await this.postsService.remove(id, userId);

    return res.status(StatusCodes.OK).json({ message: '게시글 삭제 완료.' });
  };
}
