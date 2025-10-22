import { StatusCodes } from 'http-status-codes';

export class PostLikesController {
  constructor(postLikesService) {
    this.postLikesService = postLikesService;
  }

  // 게시글 좋아요 생성
  createAndRemove = async (req, res) => {
    const userId = req.user.id;
    const { postid } = req.params;

    const like = await this.postLikesService.createAndRemove(userId, postid);

    if (like) {
      return res
        .status(StatusCodes.CREATED)
        .json({ message: '게시글 좋아요 생성 완료.' });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ message: '게시글 좋아요 삭제 완료.' });
    }
  };

  // 게시글 좋아요한 사람 내역
  find = async (req, res) => {
    const postId = req.params.postid;

    const likes = await this.postLikesService.find(postId);

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시글 좋아요 내역 조회 완료.', data: likes });
  };
}
