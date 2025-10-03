import { STATUS } from '../../common/enums/index.js';
export class PostCommentsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 게시글 댓글 pk 조회
  findById = async (id) => {
    return await this.prisma.postComment.findFirst({
      where: { id },
      select: {
        userId: true,
      },
    });
  };

  // 게시글 ParentId 조회
  findByParentId = async (parentId) => {
    return await this.prisma.postComment.findFirst({
      where: { parentId },
      select: {
        parentId: true,
      },
    });
  };

  // 게시글 ID 조회
  findByPostId = async (postId) => {
    return await this.prisma.post.findFirst({
      where: { id: postId },
      select: { id: true },
    });
  };

  // 게시글 댓글 수 조회
  countComment = async (postId) => {
    return await this.prisma.postComment.count({
      where: { postId },
    });
  };

  // 게시글 댓글 생성
  create = async (context, userId, postId) => {
    await this.prisma.postComment.create({
      data: {
        context,
        userId,
        postId,
      },
    });
  };

  // 게시글 댓글 수정
  update = async (id, context, postId) => {
    await this.prisma.postComment.update({
      where: { postId, id },
      data: {
        context,
      },
    });
  };

  // 게시글 댓글 삭제
  remove = async (id, postId) => {
    await this.prisma.postComment.update({
      where: { id, postId },
      data: {
        deletedAt: STATUS.Status.TRUE,
      },
    });
  };

  // 대댓글 생성
  replyCreate = async (context, userId, postId, parentId) => {
    await this.prisma.postComment.create({
      data: {
        context,
        userId,
        postId,
        parentId,
      },
    });
  };

  // 대댓글 수정
  replyUpdate = async (id, context, postId, parentId) => {
    await this.prisma.postComment.update({
      where: { id, postId, parentId },
      data: {
        context,
      },
    });
  };

  // 대댓글 삭제
  replyRemove = async (id, postId, parentId) => {
    await this.prisma.postComment.update({
      where: { id, postId, parentId },
      data: {
        deletedAt: STATUS.Status.TRUE,
      },
    });
  };
}
