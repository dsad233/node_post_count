import { StatusCodes } from 'http-status-codes';

export class PostCommentLikesController {
  constructor(postCommentLikesService) {
    this.postCommentLikesService = postCommentLikesService;
  }

  // 댓글 좋아요 생성 및 삭제
  createAndRemove = async (req, res) => {
    const userId = req.user.id;
    const { postid, id } = req.params;

    const like = await this.postCommentLikesService.createAndRemove(
      userId,
      postid,
      id
    );

    if (like) {
      return res
        .status(StatusCodes.CREATED)
        .json({ message: '댓글 좋아요 생성 완료.' });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ message: '댓글 좋아요 삭제 완료.' });
    }
  };
}
