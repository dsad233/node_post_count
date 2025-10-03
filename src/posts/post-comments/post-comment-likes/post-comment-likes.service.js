import { StatusCodes } from "http-status-codes";
export class PostCommentLikesService {
  constructor(postCommentLikesRepository) {
    this.postCommentLikesRepository = postCommentLikesRepository;
  }

  // 댓글 좋아요 생성 및 삭제
  createAndRemove = async (userId, postId, id) => {
    const post = await this.postCommentLikesRepository.findByPostId(postId);

    if (!post) {
      let error = new Error("해당 게시글은 존재하지 않습니다.");
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentLikesRepository.findByCommentId(
      id
    );

    if (!postComment) {
      let error = new Error("해당 댓글은 존재하지 않습니다.");
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postCommentLike =
      await this.postCommentLikesRepository.findByCommentLike(
        userId,
        postId,
        id
      );

    if (!postCommentLike) {
      await this.postCommentLikesRepository.create(userId, postId, id);

      return true;
    } else {
      await this.postCommentLikesRepository.remove(postCommentLike.id);

      return false;
    }
  };
}
