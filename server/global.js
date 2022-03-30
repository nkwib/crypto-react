import dotenv from "dotenv";
dotenv.config();

const config = {
  production: {
    APIKEY: process.env.APIKEY,
    MONGO_URI: process.env.MONGO_URI,
    printLog: false,
    production: true
  },
  development: {
    APIKEY: process.env.APIKEY,
    MONGO_URI: "mongodb://localhost:27017/",
    printLog: true,
    production: false
  }
}

// depending on the NODE_ENV env variable, the config will be different
export const getConfig = env => config[env] || config.development;