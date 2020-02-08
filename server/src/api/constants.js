const endpoints = {
  1: 'https://api.binance.com/api/v3/',
  2: 'https://fapi.binance.com/fapi/v1/'
}

const KLINES = {
  'OPEN_TIME': 0,
  'OPEN_PRICE': 1,
  'HIGH_PRICE': 2,
  'LOW_PRICE': 3,
  'CLOSE_PRICE': 4,
  'VOLUME': 5,
  'CLOSE_TIME': 6,
  'QUATE_ASSET_VOLUME': 7,
  'NUMBER_OF_TRADES': 8,
  'TAKER_BUY_BASE_ASSET_VOLUME': 9,
  'TAKER_BUY_QUATE_ASSET_VOLUME': 10,
  'IGNORE': 11
}

const TRADES = {
  1: 'id',
  2: 'price',
  3: 'qty',
  4: 'time',
  5: 'isBuyerMaker',
  6: 'isBestMatch'
}

export {
  endpoints,
  KLINES,
  TRADES
}

// [
//   [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     "2434.19055334",    // Quote asset volume
//     308,                // Number of trades
//     "1756.87402397",    // Taker buy base asset volume
//     "28.46694368",      // Taker buy quote asset volume
//     "17928899.62484339" // Ignore.
//   ]
// ]

// [
//   {
//     "id": 28457,
//     "price": "4.00000100",
//     "qty": "12.00000000",
//     "quoteQty": "48.000012",
//     "time": 1499865549590,
//     "isBuyerMaker": true,
//     "isBestMatch": true
//   }
// ]