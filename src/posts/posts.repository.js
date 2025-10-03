import { STATUS } from '../common/enums/index.js';
import postViewSchema from '../../mongodb/schema/postView.schema.js';
export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 게시글 pk 조회
  findById = async (id) => {
    return await this.prisma.post.findFirst({
      where: { id },
      select: { userId: true },
    });
  };

  // 게시글 좋아요 수 조회
  countPostLike = async (id) => {
    return await this.prisma.postLike.count({
      where: { postId: id },
    });
  };

  // 게시글 댓글 수 조회
  countPostComment = async (id) => {
    return await this.prisma.postComment.count({
      where: {
        postId: id,
        OR: [
          {
            deletedAt: STATUS.Status.FALSE,
          },
          {
            childComments: { some: { deletedAt: STATUS.Status.FALSE } },
          },
        ],
      },
    });
  };

  // 게시글 생성
  create = async (title, context, genre, userId) => {
    const post = await this.prisma.post.create({
      data: {
        title,
        context,
        genre,
        userId,
      },
    });

    const postView = new postViewSchema({
      postId: post.id,
    });

    await postView.save();
  };

  // 게시글 전체 조회
  find = async (pagenationDto, args) => {
    const where = { deletedAt: STATUS.Status.FALSE };

    if (args.genre) {
      where.genre = args.genre;
    }

    if (args.search) {
      where.OR = [
        {
          title: {
            contains: args.search,
          },
        },
        {
          context: {
            contains: args.search,
          },
        },
      ];
    }

    if (args.title) {
      where.title = {
        contains: args.title,
      };
    }

    if (args.context) {
      where.OR = [
        {
          postComments: {
            some: {
              context: {
                contains: args.context,
              },
            },
          },
        },
        {
          postComments: {
            some: {
              childComments: {
                some: {
                  context: {
                    contains: args.context,
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (args.user) {
      where.user = {
        nickname: {
          contains: args.user,
        },
      };
    }

    if (args.date) {
      if (args.date === 'now') {
        const now = new Date();
        where.createdAt = now;
      } else if (args.date === '1d') {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        where.createdAt = now;
      } else if (args.date === '7d') {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        where.createdAt = now;
      } else if (args.date === '1m') {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        where.createdAt = now;
      } else if (args.date === '7m') {
        const now = new Date();
        now.setMonth(now.getMonth() + 7);
        where.createdAt = now;
      } else if (args.date === '1y') {
        const now = new Date();
        now.setFullYear(now.getFullYear() + 1);
        where.createdAt = now;
      } else {
        const [gte, lte] = [...args.date.split(',')];
        where.createdAt = {
          gte: new Date(gte),
          lte: new Date(lte),
        };
      }
    }

    return await this.prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        genre: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
        postComments: {
          select: {
            id: true,
            context: true,
            childComments: {
              select: {
                id: true,
                context: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: args.sort,
      },
      skip: pagenationDto.pages * (pagenationDto.page - 1),
      take: pagenationDto.pages,
    });
  };

  // 게시글 상세 목록 조회
  findOne = async (id) => {
    return await this.prisma.post.findFirst({
      where: { id, deletedAt: STATUS.Status.FALSE },
      select: {
        id: true,
        title: true,
        context: true,
        genre: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  // 게시글 업데이트
  update = async (id, title, context, genre) => {
    await this.prisma.post.update({
      where: { id },
      data: {
        title,
        context,
        genre,
      },
    });
  };

  // 게시글 삭제 (소프트 삭제)
  remove = async (id) => {
    await this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: STATUS.Status.TRUE,
      },
    });
  };

  // 게시글에 달린 댓글 목록들 조회
  findComments = async (postId, pagenationDto) => {
    return await this.prisma.postComment.findMany({
      where: {
        postId,
        deletedAt: STATUS.Status.FALSE,
      },
      select: {
        id: true,
        context: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: {
            postCommentLikes: true,
          },
        },
        childComments: {
          where: {
            deletedAt: STATUS.Status.FALSE,
          },
          select: {
            id: true,
            parentId: true,
            context: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                nickname: true,
              },
            },
            _count: {
              select: {
                postCommentLikes: true,
              },
            },
          },
        },
      },
      skip: pagenationDto.pages * (pagenationDto.page - 1),
      take: pagenationDto.pages,
    });
  };

  // NoSQL에서 해당 게시글 조회수 조회
  getPostViews = async (id) => {
    const view = await postViewSchema.findOne({ postId: id }).exec();
    return view?.view ? Number(view.view) : 0;
  };
}
