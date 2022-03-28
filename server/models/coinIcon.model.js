import mongoose from 'mongoose';

const { Schema } = mongoose;
const coinIconSchema = new Schema({
  asset_id: {
    type: String
  },
  url: {
    type: String,
    required: [true, 'Icon must have url'],
  }
});

export default mongoose.model('CoinIcon', coinIconSchema);