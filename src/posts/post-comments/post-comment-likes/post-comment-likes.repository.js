export class PostCommentLikesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 댓글 ID 조회
  findByCommentId = async (commentId) => {
    return await this.prisma.postComment.findFirst({
      where: { id: commentId },
      select: { id: true },
    });
  };

  // 게시글 ID 조회
  findByPostId = async (postId) => {
    return await this.prisma.post.findFirst({
      where: { id: postId },
      select: {
        id: true,
      },
    });
  };

  // 댓글 좋아요 존재 유무 확인
  findByCommentLike = async (userId, postId, id) => {
    return await this.prisma.postCommentLike.findFirst({
      where: { userId, postId, commentId: id },
    });
  };

  // 댓글 좋아요 생성
  create = async (userId, postId, id) => {
    await this.prisma.postCommentLike.create({
      data: {
        userId,
        postId,
        commentId: id,
      },
    });
  };

  // 댓글 좋아요 삭제
  remove = async (id) => {
    await this.prisma.postCommentLike.delete({
      where: { id },
    });
  };
}
