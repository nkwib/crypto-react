import mongoose from 'mongoose';
import { getConfig } from '../global.js';

const config = getConfig(process.env.NODE_ENV);

mongoose.Promise = global.Promise;

console.log(config.MONGO_URI);
export const connect = () => mongoose.connect(config.MONGO_URI);