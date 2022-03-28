import fetch from 'node-fetch';
const baseUrl = 'https://rest.coinapi.io'
const api = process.env.API_KEY

export async function listAllAssets(filter_asset_id = []) {
  if (filter_asset_id.length === 0) {
    filter_asset_id = ['BTC', 'ETH', 'LTC']
  }
  let path = `v1/assets?filter_asset_id=${filter_asset_id.join(',')}`
  return makeRequest(path, 'GET')
}

export async function listAllExchange(filter_asset_id = []) {
  if (filter_asset_id.length === 0) {
    filter_asset_id = ['BITSTAMP', 'GEMINI']
  }
  let path = `v1/exchanges?filter_asset_id=${filter_asset_id.join(',')}`
  return makeRequest(path, 'GET')
}

export async function getAllAssetIcons(size = 128) {
  let path = `v1/assets/icons/${size}`
  return makeRequest(path, 'GET')
}

export async function getCurrentRate(asset_id_base) {
  let path = `v1/exchangerate/${asset_id_base}`
  return makeRequest(path, 'GET')
}

function makeRequest(path, method, body = null) {
  return fetch(`${baseUrl}/${path}`, {
    method: method,
    headers: {
      'X-CoinAPI-Key': api
    },
    body: body
  })
}

