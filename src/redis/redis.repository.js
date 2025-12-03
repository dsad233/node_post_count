export class RedisRepository {
  constructor(redis) {
    this.redis = redis;
  }

  // 조회
  async get(key) {
    return await this.redis.get(key);
  }

  // 키 설정
  async set(key, value) {
    await this.redis.set(key, value);
  }

  // 1씩 증감식
  async incr(key) {
    await this.redis.incr(key);
  }

  // 키 설정 및 ttl 설정
  async setex(key, ttl, value) {
    await this.redis.setEx(key, ttl, value);
  }

  // 락 설정
  async setnx(key, ttl, value) {
    // NX 설정을 통해 키가 존재하지 않으면 설정, 존재한다면 nil 반환
    return await this.redis.set(key, value, { NX: true, PX: ttl });
  }

  // 키 삭제
  async delete(key) {
    await this.redis.del(key);
  }
}
