import { StatusCodes } from 'http-status-codes';
import redisClient from '../common/configs/redis.config.js';
import { TYPE } from '../common/enums/index.js';
import { dateConvert, timeConvert } from '../common/utils.js';
export class PostsService {
  constructor(postsRepository) {
    this.postsRepository = postsRepository;
  }

  // 게시글 생성
  create = async (title, context, genre, userId) => {
    await this.postsRepository.create(title, context, genre, userId);

    return true;
  };

  // 게시글 조회 수 업데이트
  countUpdate = async (id) => {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const cached = await redisClient.get(
      `${TYPE.PrefixType.COUNT}:${TYPE.PrefixType.POST}:postId=${id}`
    );

    // Redis에 게시글 조회 목록이 없다면 키를 설정, 있다면 조회수 +1
    if (!cached) {
      await redisClient.set(
        `${TYPE.PrefixType.COUNT}:${TYPE.PrefixType.POST}:postId=${id}`,
        1
      );
    } else {
      await redisClient.incr(
        `${TYPE.PrefixType.COUNT}:${TYPE.PrefixType.POST}:postId=${id}`
      );
    }
  };

  // 게시글 전체 조회
  find = async (pagenationDto, args) => {
    if (!args.sort) {
      args.sort = 'asc';
    }
    const posts = await this.postsRepository.find(pagenationDto, args);

    const result = await Promise.all(
      posts.map(async (data) => {
        const now = new Date().getDate();
        const postView = await this.postsRepository.getPostViews(data.id);
        // 게시글을 작성한 일수가 현재 시간의 일수와 같은지 비교
        // 같지 않다면 date 출력
        if (data.createdAt.getDate() === now) {
          return {
            id: data.id,
            title: data.title,
            genre: data.genre,
            createdAt: timeConvert(data.createdAt),
            user: {
              nickname: data.user?.nickname,
            },
            post_view: postView,
          };
        } else {
          return {
            id: data.id,
            title: data.title,
            genre: data.genre,
            createdAt: dateConvert(data.createdAt),
            user: {
              nickname: data.user?.nickname,
            },
            post_view: postView,
          };
        }
      })
    );

    // 게시글 갯수 조회
    const count = await this.postsRepository.count();

    return {
      posts: result,
      pagenation: {
        page: pagenationDto.page,
        pages: pagenationDto.pages,
        totalPage: Math.ceil(count / pagenationDto.pages),
        count: count,
      },
    };
  };

  // 게시글 상세 목록 조회
  findOne = async (id, pagenationDto, args) => {
    if (!args.sort) {
      args.sort = 'asc';
    }

    const post = await this.postsRepository.findOne(id);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postCommnets = await this.postsRepository.findComments(
      id,
      pagenationDto
    );

    const postCommentArray = [];
    const parentIds = [];

    for (const data of postCommnets) {
      // 댓글 생성일이 댓글 수정일 보다 작을때, updatedAt을 기준으로 댓글들을 정렬
      if (data.createdAt < data.updatedAt) {
        const date = dateConvert(data.updatedAt);
        const time = timeConvert(data.updatedAt);

        const parentCommentNewMap = data.childComments.map((data) => {
          const date = dateConvert(data.updatedAt);
          const time = timeConvert(data.updatedAt);

          parentIds.push(data.id);

          return {
            id: data.id,
            context: data.context,
            date: date,
            time: time,
            like: data._count?.postCommentLikes,
            user: {
              nickname: data.user?.nickname,
            },
          };
        });

        postCommentArray.push({
          id: data.id,
          context: data.context,
          date: date,
          time: time,
          like: data._count?.postCommentLikes,
          user: {
            nickname: data.user?.nickname,
          },
          child_comments:
            parentCommentNewMap.length > 0 ? parentCommentNewMap : undefined,
        });
      } else {
        const date = dateConvert(data.createdAt);
        const time = timeConvert(data.createdAt);

        const parentCommentNewMap = data.childComments.map((data) => {
          const date = dateConvert(data.createdAt);
          const time = timeConvert(data.createdAt);

          // parentId 수집
          parentIds.push(data.id);

          return {
            id: data.id,
            context: data.context,
            date: date,
            time: time,
            like: data._count?.postCommentLikes,
            user: {
              nickname: data.user?.nickname,
            },
          };
        });

        // parentComments 정렬
        if (args.sort === 'asc') {
          parentCommentNewMap.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
        } else if (args.sort === 'desc') {
          parentCommentNewMap.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
        }

        postCommentArray.push({
          id: data.id,
          context: data.context,
          date: date,
          time: time,
          like: data._count?.postCommentLikes,
          user: {
            nickname: data.user?.nickname,
          },
          child_comments:
            parentCommentNewMap.length > 0 ? parentCommentNewMap : undefined,
        });
      }
    }

    // 중복 데이터 제거
    const postCommentFilter = postCommentArray.filter((data) => {
      if (!parentIds.includes(data.id)) {
        return data;
      }
    });

    // postComments 정렬
    if (args.sort === 'asc') {
      postCommentFilter.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    } else if (args.sort === 'desc') {
      postCommentFilter.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }

    // 게시글 좋아요 수 조회
    const likeCount = await this.postsRepository.countPostLike(id);

    // 게시글 댓글 수 조회
    const commentCount = await this.postsRepository.countPostComment(id);

    // NoSQL에서 해당 게시글 조회수 조회
    const postView = await this.postsRepository.getPostViews(id);

    return {
      id: post.id,
      title: post.title,
      context: post.context,
      genre: post.genre,
      date: dateConvert(post.createdAt),
      time: timeConvert(post.createdAt),
      user: {
        nickname: post.user.nickname,
      },
      post_view: postView,
      postlike_count: likeCount,
      post_comments:
        postCommentFilter.length > 0 ? postCommentFilter : undefined,
      pagenation: {
        page: pagenationDto.page,
        pages: pagenationDto.pages,
        totalPage: Math.ceil(commentCount / pagenationDto.pages),
        count: commentCount,
      },
    };
  };

  // 게시글 업데이트
  update = async (id, title, context, genre, userId) => {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (post.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postsRepository.update(id, title, context, genre);
  };

  // 게시글 삭제 (소프트 삭제)
  remove = async (id, userId) => {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (post.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postsRepository.remove(id);
  };
}
