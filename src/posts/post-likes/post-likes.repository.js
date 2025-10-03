export class PostLikesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 게시글 ID 조회
  findByPostId = async (postId) => {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });
  };

  // 게시글 좋아요 존재 유무 확인
  findPostLike = async (userId, postId) => {
    return await this.prisma.postLike.findFirst({
      where: { userId, postId },
      select: {
        id: true,
      },
    });
  };

  // 게시글 좋아요 생성
  create = async (userId, postId) => {
    await this.prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });
  };

  // 게시글 좋아요 삭제
  remove = async (id) => {
    await this.prisma.postLike.delete({
      where: { id },
    });
  };

  // 게시글 좋아요한 사람 내역
  find = async (postId) => {
    return await this.prisma.postLike.findMany({
      where: { postId },
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };
}
