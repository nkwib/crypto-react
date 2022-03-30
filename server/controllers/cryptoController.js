import { listAllAssets } from '../modules/currency.js';
import Transaction from '../models/transaction.model.js';
import Socket from '../utils/socket.js';

export default {
  async getLatestRates() {
    // to clean testing results decomment the following block

    // if (process.env.NODE_ENV !== 'production') {
    //   await Transaction.deleteMany({
    //     type: 'Live Price',
    //   })
    // }

    const data = await listAllAssets() || [];
    if (!Array.isArray(data)) {
      return;
    }
    for (let c of data) {

      // Check if the transaction already exists

      let recentTransaction = await Transaction.findOne({
        crypto: c.name,
        type: 'Live Price',
      }).sort({
        date: -1,
      });

      if (recentTransaction) {
        if (recentTransaction.date.getTime() + 60_000 > Date.now()) {
          // if a recent transaction already exists, do not create a new one
          continue;
        }
      }

      // create a new transaction of type "Live Price"

      await Transaction.create({
        amountCrypto: 1,
        amountCurrency: c.price_usd,
        crypto: c.name,
        currency: 'USD',
        type: 'Live Price',
        date: new Date(c.data_quote_end)
      });
    }
    // emit the new data to the client
    Socket.emit('updated_rates',data);
  },

  // find the latest rates for each crypto
  async findLatestRates(req, res) {
    const data = await Transaction.aggregate([
      {
        $match: { type: 'Live Price' }
      },
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: {
            crypto: '$crypto',
          },
          price: {
            $first: '$amountCurrency'
          }
        }
      }
    ]);

    const result = {}
    for (let d of data) {
      result[d._id.crypto] = d.price;
    }

    return res.json(result);
  },

  async getTransaction(req, res) {
    try {
      const [sortingColumn, sortingDirection] = req.params.sort.split(":");
      const [page, limit] = [req.query.page || 1, req.query.limit || 10];
      let [startDate, endDate] = [req.query.start || new Date(0), req.query.end || new Date()];
      let total = await Transaction.count({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return Transaction.find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
        .sort({ [sortingColumn]: sortingDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .then(transactions => res.json({ transactions, total }));
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
  },

  async createTransaction(req, res) {
    let transaction = await Transaction.create(req.body);
    // emit the new data to the client
    Socket.emit('saved_transaction', transaction);
    res.send(transaction)
  },
};