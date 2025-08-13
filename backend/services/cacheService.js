const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initializeRedis();
  }

  async initializeRedis() {
    // Check if Redis is explicitly disabled or not configured
    if (process.env.DISABLE_REDIS === 'true' || !process.env.REDIS_HOST) {
      console.log('Redis disabled or not configured, using in-memory cache');
      this.initializeInMemoryCache();
      return;
    }

    try {
      // Try to connect to Redis (if available)
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          connectTimeout: 5000, // 5 second timeout
          lazyConnect: true, // Don't connect immediately
        },
        password: process.env.REDIS_PASSWORD || undefined,
        retry_strategy: (retries) => {
          if (retries > 3) {
            console.log('Redis connection failed after 3 attempts, using in-memory cache');
            return false; // Stop retrying
          }
          return Math.min(retries * 50, 500);
        }
      });

      this.client.on('connect', () => {
        console.log('✅ Connected to Redis server successfully');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        if (!this.errorLogged) {
          console.log('⚠️  Redis not available, using in-memory cache instead');
          this.errorLogged = true; // Prevent spam logging
        }
        this.isConnected = false;
        if (!this.memoryCache) {
          this.initializeInMemoryCache();
        }
      });

      this.client.on('end', () => {
        this.isConnected = false;
        if (!this.memoryCache) {
          this.initializeInMemoryCache();
        }
      });

      // Try to connect with timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 3000);
      });

      await Promise.race([connectPromise, timeoutPromise]);
      
    } catch (error) {
      if (!this.errorLogged) {
        console.log('⚠️  Redis not available, using in-memory cache instead');
        this.errorLogged = true;
      }
      this.initializeInMemoryCache();
    }
  }

  initializeInMemoryCache() {
    if (!this.memoryCache) {
      // Fallback in-memory cache
      this.memoryCache = new Map();
      this.cacheTimestamps = new Map(); // Track expiration times
      console.log('📝 In-memory cache initialized for translations');
    }
    this.isConnected = false;
  }

  async get(key) {
    try {
      if (this.isConnected && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Use in-memory cache with expiration check
        if (this.memoryCache && this.memoryCache.has(key)) {
          const timestamp = this.cacheTimestamps?.get(key);
          if (timestamp && Date.now() - timestamp < 3600000) { // 1 hour expiration
            return this.memoryCache.get(key);
          } else {
            // Expired, remove from cache
            this.memoryCache.delete(key);
            this.cacheTimestamps?.delete(key);
            return null;
          }
        }
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expireInSeconds = 3600) {
    try {
      if (this.isConnected && this.client) {
        await this.client.setEx(key, expireInSeconds, JSON.stringify(value));
      } else {
        // Use in-memory cache with timestamp tracking
        if (this.memoryCache) {
          this.memoryCache.set(key, value);
          if (this.cacheTimestamps) {
            this.cacheTimestamps.set(key, Date.now());
          }
          // Clean up expired entries periodically
          this.cleanupExpiredEntries();
        }
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      if (this.isConnected && this.client) {
        await this.client.del(key);
      } else {
        // Use in-memory cache
        if (this.memoryCache) {
          this.memoryCache.delete(key);
        }
        if (this.cacheTimestamps) {
          this.cacheTimestamps.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async exists(key) {
    try {
      if (this.isConnected && this.client) {
        return await this.client.exists(key);
      } else {
        // Use in-memory cache with expiration check
        if (this.memoryCache && this.memoryCache.has(key)) {
          const timestamp = this.cacheTimestamps?.get(key);
          if (timestamp && Date.now() - timestamp < 3600000) { // 1 hour expiration
            return true;
          } else {
            // Expired, remove from cache
            this.memoryCache.delete(key);
            this.cacheTimestamps?.delete(key);
            return false;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async flushAll() {
    try {
      if (this.isConnected && this.client) {
        await this.client.flushAll();
      } else {
        // Clear in-memory cache
        if (this.memoryCache) {
          this.memoryCache.clear();
        }
        if (this.cacheTimestamps) {
          this.cacheTimestamps.clear();
        }
      }
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  // Generate cache key for translations
  getTranslationCacheKey(text, targetLanguage, sourceLanguage = 'en') {
    return `translation:${sourceLanguage}:${targetLanguage}:${Buffer.from(text).toString('base64')}`;
  }

  // Generate cache key for UI translations
  getUITranslationCacheKey(language) {
    return `ui_translations:${language}`;
  }

  // Clean up expired entries from in-memory cache
  cleanupExpiredEntries() {
    if (!this.memoryCache || !this.cacheTimestamps) return;
    
    // Run cleanup every 100 cache operations
    this.cleanupCounter = (this.cleanupCounter || 0) + 1;
    if (this.cleanupCounter % 100 !== 0) return;
    
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (now - timestamp > 3600000) { // 1 hour expiration
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.memoryCache.delete(key);
      this.cacheTimestamps.delete(key);
    }
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  async disconnect() {
    try {
      if (this.client && this.isConnected) {
        await this.client.disconnect();
      }
    } catch (error) {
      // Silently handle disconnect errors
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;