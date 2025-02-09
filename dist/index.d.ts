import type { SessionStoreData, Store } from 'svelte-kit-sessions';
import * as ioredis from 'ioredis';
import * as redis from 'redis';
interface Serializer {
    parse(s: string): SessionStoreData | Promise<SessionStoreData>;
    stringify(data: SessionStoreData): string;
}
interface RedisStoreOptions {
    /**
     * An instance of [`redis`](https://www.npmjs.com/package/redis) or [`ioredis`](https://www.npmjs.com/package/ioredis).
     */
    client: ioredis.Redis | redis.RedisClientType;
    /**
     * The prefix of the key in redis.
     * @default 'sess:'
     */
    prefix?: string;
    /**
     * The serializer to use.
     * @default JSON
     */
    serializer?: Serializer;
    /**
     * Time to live in milliseconds.
     * This ttl to be used if ttl is _Infinity_ when used from `svelte-kit-sessions`
     * @default 86400 * 1000
     */
    ttl?: number;
}
export default class RedisStore implements Store {
    constructor(options: RedisStoreOptions);
    /**
     * An instance of [`redis`](https://www.npmjs.com/package/redis) or [`ioredis`](https://www.npmjs.com/package/ioredis).
     */
    client: ioredis.Redis | redis.RedisClientType;
    /**
     * The prefix of the key in redis.
     * @default 'sess:'
     */
    prefix: string;
    /**
     * The serializer to use.
     * @default JSON
     */
    serializer: Serializer;
    /**
     * Time to live in milliseconds.
     * default: 86400 * 1000
     */
    ttl: number;
    get(id: string): Promise<SessionStoreData | null>;
    set(id: string, storeData: SessionStoreData, ttl: number): Promise<void>;
    destroy(id: string): Promise<void>;
    touch(id: string, ttl: number): Promise<void>;
}
export {};
