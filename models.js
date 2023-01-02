const shortId = require("shortid");
const redisModule = require("redis");
const redis = redisModule.createClient({
    host: process.env.redisHost || "127.0.0.1",
    port: process.env.redisPort || 6379,
    password: process.env.redisPort || ""
});

redis.on('connect', () => {
    console.log("Connected to redis server");
});

redis.on('ready', () =>{
   console.log("Ready to work");
});

redis.on('error', (err) => {
    console.log("Error occurred while connecting to redis");
});

const storeURL = (url) => {
    return new Promise((resolve, reject) => {
        redis.get(url, (err, reply) => {
            if (err) {
                return reject("error occurred during redis operation");
            }
            if (reply) {
                resolve(reply);
            } else {
                let id = shortId.generate();
                redis.set(id, url, 'EX', 86400);
                redis.set(url, id, 'EX', 86400);
                resolve(id);
            }
        })
    })
};

const findURL = (key) => {
    return new Promise((resolve, reject) => {
        redis.get(key, (err,reply) => {
            if (err) {
                return reject("error occurred during redis operation");
            }
            if (reply === null) {
                resolve(null);
            } else {
                resolve(reply);
            }
        })
    })
};

module.exports = {
    storeURL: storeURL,
    findURL: findURL
}