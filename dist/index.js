import * as ioredis from 'ioredis';
const ONE_DAY_IN_SECONDS = 86400;
export default class RedisStore {
    constructor(options) {
        this.client = options.client;
        this.prefix = options.prefix || 'sess:';
        this.serializer = options.serializer || JSON;
        this.ttl = options.ttl || ONE_DAY_IN_SECONDS * 1000;
    }
    /**
     * An instance of [`redis`](https://www.npmjs.com/package/redis) or [`ioredis`](https://www.npmjs.com/package/ioredis).
     */
    client;
    /**
     * The prefix of the key in redis.
     * @default 'sess:'
     */
    prefix;
    /**
     * The serializer to use.
     * @default JSON
     */
    serializer;
    /**
     * Time to live in milliseconds.
     * default: 86400 * 1000
     */
    ttl;
    async get(id) {
        const key = this.prefix + id;
        const storeData = (await this.client.get(key));
        return storeData ? this.serializer.parse(storeData) : null;
    }
    async set(id, storeData, ttl) {
        const key = this.prefix + id;
        const serialized = this.serializer.stringify(storeData);
        // Infinite time does not support, so it is implemented separately.
        if (ttl !== Infinity) {
            if (this.client instanceof ioredis.Redis) {
                await this.client.set(key, serialized, 'PX', ttl);
                return;
            }
            await this.client.set(key, serialized, { PX: ttl });
            return;
        }
        if (this.client instanceof ioredis.Redis) {
            await this.client.set(key, serialized, 'PX', this.ttl);
            return;
        }
        await this.client.set(key, serialized, { PX: this.ttl });
    }
    async destroy(id) {
        const key = this.prefix + id;
        await this.client.del(key);
    }
    async touch(id, ttl) {
        const key = this.prefix + id;
        await this.client.expire(key, ttl);
    }
}
//# sourceMappingURL=index.js.map