// I usually make modules for each API provider.
// This one is for CoinAPI.

import fetch from 'node-fetch';
const baseUrl = 'https://rest.coinapi.io'

import { getConfig } from '../global.js';
const config = getConfig(process.env.NODE_ENV);

export async function listAllAssets(filter_asset_id = []) {
  if (filter_asset_id.length === 0) {
    filter_asset_id = ['BTC', 'ETH', 'LTC']
  }
  let path = `v1/assets?filter_asset_id=${filter_asset_id.join(',')}`
  if (config.APIKEY && config.production) {
    return makeRequest(path, 'GET')
    .then(res => res.json())
    .catch(err => console.log(err))
  } else {
    console.log('mocking listAllAssets')
    // mock request for development
    return new Promise((resolve, reject) => {
      resolve(
        [
          {
            asset_id: 'BTC',
            name: 'Bitcoin',
            type_is_crypto: 1,
            data_quote_start: '2014-02-24T17:43:05.0000000Z',
            data_quote_end: (new Date()).toISOString(),
            data_orderbook_start: '2014-02-24T17:43:05.0000000Z',
            data_orderbook_end: '2020-08-05T14:38:38.3413202Z',
            data_trade_start: '2010-07-17T23:09:17.0000000Z',
            data_trade_end: (new Date()).toISOString(),
            data_symbols_count: 83607,
            volume_1hrs_usd: 7071403001048.65,
            volume_1day_usd: 99656320502706.72,
            volume_1mth_usd: 2687410528407313.5,
            price_usd: Math.random() * 14000 + 40000,
            id_icon: '4caf2b16-a017-4e26-a348-2cea69c34cba',
            data_start: '2010-07-17',
            data_end: (new Date()).toISOString().split('T')[0]
          },
          {
            asset_id: 'LTC',
            name: 'Litecoin',
            type_is_crypto: 1,
            data_quote_start: '2014-04-20T15:06:34.0000000Z',
            data_quote_end: (new Date()).toISOString(),
            data_orderbook_start: '2014-04-20T15:06:34.0000000Z',
            data_orderbook_end: '2020-08-05T14:37:59.4868435Z',
            data_trade_start: '2013-05-19T15:23:45.0000000Z',
            data_trade_end: (new Date()).toISOString(),
            data_symbols_count: 4653,
            volume_1hrs_usd: 1712779645.22,
            volume_1day_usd: 33328319257.28,
            volume_1mth_usd: 1144715638592.79,
            price_usd: Math.random() * 60 + 100,
            id_icon: 'a201762f-1499-41ef-9b84-e0742cd00e48',
            data_start: '2013-05-19',
            data_end: (new Date()).toISOString().split('T')[0]
          },
          {
            asset_id: 'ETH',
            name: 'Ethereum',
            type_is_crypto: 1,
            data_quote_start: '2015-08-07T14:50:38.1774950Z',
            data_quote_end: (new Date()).toISOString(),
            data_orderbook_start: '2015-08-07T14:50:38.1774950Z',
            data_orderbook_end: '2020-08-05T14:38:33.4327540Z',
            data_trade_start: '2015-08-07T15:21:48.1062520Z',
            data_trade_end: (new Date()).toISOString(),
            data_symbols_count: 68062,
            volume_1hrs_usd: 527968549563.31,
            volume_1day_usd: 4770915497771.08,
            volume_1mth_usd: 169796247697871.56,
            price_usd: Math.random() * 500 + 3200,
            id_icon: '604ae453-3d9f-4ad0-9a48-9905cce617c2',
            data_start: '2015-08-07',
            data_end: (new Date()).toISOString().split('T')[0]
          }
        ]
        )
    })
  }
}

function makeRequest(path, method, body = null) {
  return fetch(`${baseUrl}/${path}`, {
    method: method,
    headers: {
      'X-CoinAPI-Key': config.APIKEY
    },
    body: body
  })
}

