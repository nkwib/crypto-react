import { listAllAssets, getAllAssetIcons } from '../modules/currency.js';
import CoinModel from '../models/coin.model.js';
import CoinIcon from '../models/coinIcon.model.js';
import Transaction from '../models/transaction.model.js';
import fs from 'fs';

export default {
  async getLatestRates() {
    const data = await listAllAssets().then(res => res.json())
    for (let c of data) {
      let transaction = await Transaction.create({
        amountCrypto: 1,
        amountCurrency: c.price_usd,
        crypto: c.name,
        currency: 'USD',
        type: 'Live Price',
        date: new Date(c.data_quote_end)
      });
    }
  },
  async getIcons() {
    await CoinIcon.deleteMany({});
    let dbIcons = await CoinIcon.find();
    console.log(dbIcons.length);

    let file = './icons.json';
    let icons = fs.readFileSync(file, 'utf8');
    icons = JSON.parse(icons);
    let iconsArray = [];
    for (let i = 0; i < icons.length; i++) {
      let icon = new CoinIcon({
        asset_id: icons[i].asset_id,
        url: icons[i].url,
      });
      let dbIco = await CoinIcon.findOne({ asset_id: icon.asset_id });
      if (!dbIco) {
        console.log('Creating icon: ' + icon.asset_id);
        await CoinIcon.create(icon).catch((err) => {
          console.log(err);
          console.log(icon.asset_id);
        });
      } else {
        console.log(`${icon.asset_id} already exists`);
      }
    }

    // let icons = await getAllAssetIcons().then(res => res.json());
    // write res to file
    // let data = JSON.stringify(icons);
    // if (!fs.existsSync(file)) {
    //   fs.writeFileSync(file, data);
    // }
    // fs.writeFile(file, data, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log('The file has been saved!');
    // });

    // if (dbIcons.length === 0) {
    //   let icons = await getAllAssetIcons().then(res => res.json());
    //   console.log(icons[0]);

    //   await CoinIcon.create(icons);
    //   return icons;
    // }
    return dbIcons;
  },
  create(rawCoin) {
    return CoinModel.create(rawCoin);
  },
  createBulk(data) {
    for (let coin of data) {
      CoinModel.create(coin);
    }
  },
  upsertBulk(data) {
    for (let coin of data) {
      let exist = CoinModel.findOne({ asset_id: coin.asset_id });
      if (exist) {
        CoinModel.updateOne({ asset_id: coin.asset_id }, coin);
      } else {
        CoinModel.create(coin);
      }
    }
  },
  emptyDB() {
    return CoinModel.deleteMany({});
  },

  async getTransaction(req, res) {
    try {
      const [sortingColumn, sortingDirection] = req.params.sort.split(":");
      const [page, limit] = [req.query.page || 1, req.query.limit || 10];
      let total = await Transaction.count();
      return Transaction.find({})
        .sort({ [sortingColumn]: sortingDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .then(transactions => res.json({ transactions, total }));
    } catch (err) {
      res.send({ error: err }).code(500);
    }
  },

  async createTransaction(req, res) {
    let transaction = await Transaction.create(req.body);
    res.send(transaction)
  },

  async findAll(req, res) {
    const coins = await CoinModel.find();
    res.send(coins.map(e => ({ ...e.toJSON(), price_usd: e.price_usd.toFixed(2) })));
  },
};