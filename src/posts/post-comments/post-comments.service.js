import { StatusCodes } from 'http-status-codes';
export class PostCommentsService {
  constructor(postCommentsRepository) {
    this.postCommentsRepository = postCommentsRepository;
  }

  // 게시글 댓글 생성
  create = async (context, userId, postId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    await this.postCommentsRepository.create(context, userId, postId);

    return true;
  };

  // 게시글 댓글 수정
  update = async (id, context, userId, postId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentsRepository.findById(id);

    if (!postComment) {
      let error = new Error('해당 게시글 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (postComment.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postCommentsRepository.update(id, context, postId);
  };

  // 게시글 댓글 삭제
  remove = async (id, userId, postId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentsRepository.findById(id);

    if (!postComment) {
      let error = new Error('해당 게시글 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (postComment.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postCommentsRepository.remove(id, postId);
  };

  // 대댓글 생성
  replyCreate = async (context, userId, postId, parentId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentsRepository.findById(parentId);

    if (!postComment) {
      let error = new Error('해당 게시글 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const parentComment =
      await this.postCommentsRepository.findByParentId(parentId);

    if (!parentComment) {
      let error = new Error('해당 게시글 부모 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    await this.postCommentsRepository.replyCreate(
      context,
      userId,
      postId,
      parentId
    );

    return true;
  };

  // 대댓글 수정
  replyUpdate = async (id, context, userId, postId, parentId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentsRepository.findById(id);

    if (!postComment) {
      let error = new Error('해당 게시글 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const parentComment =
      await this.postCommentsRepository.findByParentId(parentId);

    if (!parentComment) {
      let error = new Error('해당 게시글 부모 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (postComment.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postCommentsRepository.replyUpdate(
      id,
      context,
      postId,
      parentId
    );
  };

  // 대댓글 삭제
  replyRemove = async (id, userId, postId, parentId) => {
    const post = await this.postCommentsRepository.findByPostId(postId);

    if (!post) {
      let error = new Error('해당 게시글은 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const postComment = await this.postCommentsRepository.findById(id);

    if (!postComment) {
      let error = new Error('해당 게시글 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    const parentComment =
      await this.postCommentsRepository.findByParentId(parentId);

    if (!parentComment) {
      let error = new Error('해당 게시글 부모 댓글이 존재하지 않습니다.');
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    if (postComment.userId !== userId) {
      let error = new Error('유저 정보가 일치하지 않아 수정이 불가합니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    await this.postCommentsRepository.replyRemove(id, postId, parentId);
  };
}
