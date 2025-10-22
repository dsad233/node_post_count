import express from 'express';
import { prisma } from '../../prisma/prismaClient.js';

import { PostsRepository } from './posts.repository.js';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { PostRequestDto, CreatePostDto, UpdatePostDto } from './dto/index.js';

import { PostLikesRepository } from './post-likes/post-likes.repository.js';
import { PostLikesService } from './post-likes/post-likes.service.js';
import { PostLikesController } from './post-likes/post-likes.controller.js';
import { PostLikeRequestDto } from './post-likes/dto/postLikeRequestDto.js';

import { PostCommentsRepository } from './post-comments/post-comments.repository.js';
import { PostCommentsService } from './post-comments/post-comments.service.js';
import { PostCommentsController } from './post-comments/post-comments.controller.js';
import {
  PostCommentRequestDto,
  CreatePostComments,
  UpdatePostComments,
  PostReplyRequestDto,
} from './post-comments/dto/index.js';

import { PostCommentLikesRepository } from './post-comments/post-comment-likes/post-comment-likes.repository.js';
import { PostCommentLikesService } from './post-comments/post-comment-likes/post-comment-likes.service.js';
import { PostCommentLikesController } from './post-comments/post-comment-likes/post-comment-likes.controller.js';
import { PostCommentLikeDto } from './post-comments/post-comment-likes/dto/postCommentLikeDto.js';

import { AsyncWrapper } from '../common/middlewares/async.js';
import { SessionValidation } from '../common/middlewares/session-validation.js';
import { GuestValidation } from '../common/middlewares/guest-validation.js';

import { validate } from '../common/middlewares/validate.js';

const router = express.Router();

// Posts
const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

router.post(
  '',
  validate(CreatePostDto()),
  SessionValidation,
  AsyncWrapper(postsController.create)
);

router.get('', GuestValidation, postsController.find);
router.get(
  '/:id',
  validate(PostRequestDto()),
  GuestValidation,
  AsyncWrapper(postsController.findOne)
);

router.patch(
  '/:id',
  validate([...PostRequestDto(), ...UpdatePostDto()]),
  SessionValidation,
  AsyncWrapper(postsController.update)
);
router.delete(
  '/:id',
  validate(PostRequestDto()),
  SessionValidation,
  AsyncWrapper(postsController.remove)
);

// Post-Likes
const postLikesRepository = new PostLikesRepository(prisma);
const postLikesService = new PostLikesService(postLikesRepository);
const postLikesController = new PostLikesController(postLikesService);

router.post(
  '/:postid/postlikes',
  validate(PostLikeRequestDto()),
  SessionValidation,
  AsyncWrapper(postLikesController.createAndRemove)
);
router.get(
  '/:postid/postlikes',
  validate(PostLikeRequestDto()),
  GuestValidation,
  AsyncWrapper(postLikesController.find)
);

// Post-Comments
const postCommentsRepository = new PostCommentsRepository(prisma);
const postCommentsService = new PostCommentsService(postCommentsRepository);
const postCommentsController = new PostCommentsController(postCommentsService);

router.post(
  '/:postid/postcomments',
  validate([...PostCommentRequestDto(), ...CreatePostComments()]),
  SessionValidation,
  AsyncWrapper(postCommentsController.create)
);
router.patch(
  '/:postid/postcomments/:id',
  validate([...PostCommentRequestDto(), ...UpdatePostComments()]),
  SessionValidation,
  AsyncWrapper(postCommentsController.update)
);
router.delete(
  '/:postid/postcomments/:id',
  validate(PostCommentRequestDto()),
  SessionValidation,
  AsyncWrapper(postCommentsController.remove)
);
router.post(
  '/:postid/postcomments/parent/:parentid',
  validate([...PostReplyRequestDto(), ...CreatePostComments()]),
  SessionValidation,
  AsyncWrapper(postCommentsController.replyCreate)
);
router.patch(
  '/:postid/postcomments/parent/:parentid/id/:id',
  validate([...PostReplyRequestDto(), ...UpdatePostComments()]),
  SessionValidation,
  AsyncWrapper(postCommentsController.replyUpdate)
);
router.delete(
  '/:postid/postcomments/parent/:parentid/id/:id',
  validate(PostReplyRequestDto()),
  SessionValidation,
  AsyncWrapper(postCommentsController.replyRemove)
);

// Post-Comment-Likes

const postCommentLikesRepository = new PostCommentLikesRepository(prisma);
const postCommentLikesService = new PostCommentLikesService(
  postCommentLikesRepository
);
const postCommentLikesController = new PostCommentLikesController(
  postCommentLikesService
);

router.post(
  '/:postid/postcomments/:id',
  validate(PostCommentLikeDto()),
  SessionValidation,
  AsyncWrapper(postCommentLikesController.createAndRemove)
);

export default router;
