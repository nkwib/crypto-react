import mongoose from 'mongoose';
import { getConfig } from '../global.js';

const config = getConfig(process.env.NODE_ENV);
mongoose.Promise = global.Promise;

export const connect = () => mongoose.connect(config.MONGO_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('MongoDB connected');
  }
});