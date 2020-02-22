const KLINES = Object.freeze({
  OPEN_TIME: 0,
  OPEN_PRICE: 1,
  HIGH_PRICE: 2,
  LOW_PRICE: 3,
  CLOSE_PRICE: 4,
  VOLUME: 5,
  CLOSE_TIME: 6,
  QUATE_ASSET_VOLUME: 7,
  NUMBER_OF_TRADES: 8,
  TAKER_BUY_BASE_ASSET_VOLUME: 9,
  TAKER_BUY_QUATE_ASSET_VOLUME: 10,
  IGNORE: 11
})

const TRADES = Object.freeze({
  ID: 'id',
  PRICE: 'price',
  QTY: 'qty',
  TIME: 'time',
  QUOTE: 'quoteQty',
  iSBUYERMAKER: 'isBuyerMaker',
  ISBESTMATCH: 'isBestMatch'
})

const ORDER = Object.freeze({
  SYDE: {
    BUY: 'buy',
    STOP: 'stop'
  }
})

export {
  KLINES,
  TRADES,
  ORDER
}