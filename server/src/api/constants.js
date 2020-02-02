const klines = {
  'OPEN_TIME': 1,
  'OPEN_PRICE': 2,
  'HIGHT_PRICE': 3,
  'LOW_PRICE': 4,
  'CLOSE_PRICE': 5,
  'VOLUME': 6,
  'CLOSE_TIME': 7,
  'QUATE_ASSET_VOLUME': 8,
  'NUMBER_OF_TRADES': 9,
  'TAKER_BUY_BASE_ASSET_VOLUME': 10,
  'TAKER_BUY_QUATE_ASSET_VOLUME': 11,
  'IGNORE': 12
}

const trades = {
  'ID': 1,
  'PRICE': 2,
  'QTY': 3,
  'TIME': 4,
  'iSBUYERMAKER': 5,
  'ISBESTMATCH': 6
}

export {
  klines,
  trades
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