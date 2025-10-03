import { StatusCodes } from "http-status-codes";
export class PostLikesService {
  constructor(postLikesRepository) {
    this.postLikesRepository = postLikesRepository;
  }

  // 게시글 좋아요 생성
  createAndRemove = async (userId, postId) => {
    const post = await this.postLikesRepository.findByPostId(postId);

    if (!post) {
      let error = new Error("해당 게시글은 존재하지 않습니다.");
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    // 게시글 좋아요 유무 조회
    const like = await this.postLikesRepository.findPostLike(userId, postId);

    if (!like) {
      await this.postLikesRepository.create(userId, postId);

      return true;
    } else {
      await this.postLikesRepository.remove(like.id);

      return false;
    }
  };

  // 게시글 좋아요한 사람 내역
  find = async (postId) => {
    const post = await this.postLikesRepository.findByPostId(postId);

    if (!post) {
      let error = new Error("해당 게시글은 존재하지 않습니다.");
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    return await this.postLikesRepository.find(postId);
  };
}
