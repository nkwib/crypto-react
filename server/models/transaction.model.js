import mongoose from 'mongoose';

const { Schema } = mongoose;
const transactionSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  crypto: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amountCurrency: {
    type: Number,
    required: true,
  },
  amountCrypto: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
});

export default mongoose.model('Transaction', transactionSchema);