import mongoose from 'mongoose';

const { Schema } = mongoose;
const cryptoCoinSchema = new Schema({
  asset_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'cryptoCoin must have name'],
  },
  icon: {
    type: String,
  },
  type_is_crypto: {
    type: Number,
    required: true,
  },
  data_quote_start: {
    type: Date,
  },
  data_quote_end: {
    type: Date,
  },
  data_orderbook_start: {
    type: Date,
  },
  data_orderbook_end: {
    type: Date,
  },
  data_trade_start: {
    type: Date,
  },
  data_trade_end: {
    type: Date,
  },
  data_symbols_count: {
    type: Number,
  },
  volume_1hrs_usd: {
    type: Number,
  },
  volume_1day_usd: {
    type: Number,
  },
  volume_1mth_usd: {
    type: Number,
  },
  price_usd: {
    type: Number,
  },
  id_icon: {
    type: String,
  },
  data_start: {
    type: Date,
  },
  data_end: {
    type: Date,
    max: Date.now,
  },
});

export default mongoose.model('CryptoCoin', cryptoCoinSchema);