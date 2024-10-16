import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // create redis client
    this.client = createClient();

    // set up error handling
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
    });

    // added log successful connection to Redis server
    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });
  }

  /**
   * isAlive function that returns True when the connection to Redis is a success otherwise, False.
   */
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  // Asynchronous Functions (get, set & del)
  /**
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const getValue = await getAsync(key);
    return getValue;
  }

  /**
   * Sets a key-value pair in the Redis server with an optional time-to-live.
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value);
    await this.client.expire(key, duration);
  }

  /**
   * Deletes the value associated with a key from the Redis server.
   * @param {string} key - The key to delete from the Redis server.
   * @returns {Promise<number>} - The number of keys that were deleted.
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

// create and export instance of RedisClient
const redisClient = new RedisClient();

module.exports = redisClient;
