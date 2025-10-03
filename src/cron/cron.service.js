import {
  sendMessage,
  consumerMessage,
} from '../common/configs/rabbitMQ.config.js';
import { TYPE } from '../common/enums/index.js';
import redisClient from '../common/configs/redis.config.js';
import postViewSchema from '../../mongodb/schema/postView.schema.js';
export class CronService {
  // 주기마다(2분) 게시글 조회수 Redis에서 추출하여 RabbitMQ에 푸쉬
  updateViews = async () => {
    const keys = await redisClient.keys(
      `${TYPE.PrefixType.COUNT}:${TYPE.PrefixType.POST}:*`
    );

    if (keys.length !== 0) {
      for (const key of keys) {
        const value = await redisClient.get(key);
        await sendMessage(key, value);
      }
    }
  };

  // RabbitMQ에 누적된 조회수 합산 후 NoSQL에 업로드
  getViews = async () => {
    let count = 0;
    const keys = await redisClient.keys(
      `${TYPE.PrefixType.COUNT}:${TYPE.PrefixType.POST}:*`
    );

    if (keys.length !== 0) {
      for (const key of keys) {
        const messages = await consumerMessage(key);

        if (messages.length > 0) {
          for (const msg of messages) {
            // Redis Key에 있는 postId 뒤에 있는 값을 추출
            const postId = key.slice(key.search('postId=') + 7);

            const postView = await postViewSchema.findOne({ postId }).exec();

            count = Number(postView.view) + Number(msg);
            // 조회수 업데이트
            await postViewSchema.updateOne({ postId }, { view: count });
          }
        }
      }
      // 기존 저장 되었었던 Redis 데이터들 삭제
      await redisClient.del(keys);
    }
  };
}
