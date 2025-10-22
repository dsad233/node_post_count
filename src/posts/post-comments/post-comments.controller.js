import { StatusCodes } from 'http-status-codes';

export class PostCommentsController {
  constructor(postCommentsService) {
    this.postCommentsService = postCommentsService;
  }

  // 게시글 댓글 생성
  create = async (req, res) => {
    const userId = req.user.id;
    const { postid } = req.params;
    const { context } = req.body;

    await this.postCommentsService.create(context, userId, postid);

    return res.status(StatusCodes.CREATED).json({ message: '댓글 생성 완료.' });
  };

  // 게시글 댓글 수정
  update = async (req, res) => {
    const userId = req.user.id;
    const { postid, id } = req.params;
    const { context } = req.body;

    await this.postCommentsService.update(id, context, userId, postid);

    return res.status(StatusCodes.OK).json({ message: '댓글 수정 완료.' });
  };

  // 게시글 댓글 삭제
  remove = async (req, res) => {
    const userId = req.user.id;
    const { postid, id } = req.params;

    // 이게 구현 될려면, 게시글 상세 조회 부분이 댓글 부분 조회와 게시글 상세 조회가 분리되어서 응답이 이루어져야 함. (페이지 네이션, 댓글 삭제된 내역 조회 제외)
    await this.postCommentsService.remove(id, userId, postid);

    return res.status(StatusCodes.OK).json({ message: '댓글 삭제 완료.' });
  };

  // 대댓글 생성
  replyCreate = async (req, res) => {
    const userId = req.user.id;
    const { postid, parentid } = req.params;
    const { context } = req.body;

    await this.postCommentsService.replyCreate(
      context,
      userId,
      postid,
      parentid
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '대댓글 생성 완료.' });
  };

  // 대댓글 수정
  replyUpdate = async (req, res) => {
    const userId = req.user.id;
    const { postid, parentid, id } = req.params;
    const { context } = req.body;

    await this.postCommentsService.replyUpdate(
      id,
      context,
      userId,
      postid,
      parentid
    );

    return res.status(StatusCodes.OK).json({ message: '대댓글 수정 완료.' });
  };

  // 대댓글 삭제
  replyRemove = async (req, res) => {
    const userId = req.user.id;
    const { postid, parentid, id } = req.params;

    await this.postCommentsService.replyRemove(id, userId, postid, parentid);

    return res.status(StatusCodes.OK).json({ message: '대댓글 삭제 완료.' });
  };
}
