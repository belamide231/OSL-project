import { createClient, RedisClientType } from 'redis';

export class getRedisConnection {

    public db1: RedisClientType;
    public db2: RedisClientType;
    public db3: RedisClientType;

    constructor() {

        const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/`;

        this.db1 = createClient({ url: `${url}1` });
        this.db2 = createClient({ url: `${url}2` });
        this.db3 = createClient({ url: `${url}3` });

        this.initialize();
    }

    private async initialize() {

        await this.db1.connect();
        await this.db2.connect();
        await this.db3.connect();
    }
}
