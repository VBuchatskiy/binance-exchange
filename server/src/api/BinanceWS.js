import { w3cwebsocket as WebSocket } from 'websocket'

class BinanceWS {
  constructor({ host = '', key = '', secret = '' } = {}) {
    this.host = `${host}/ws/`
    this.key = key
    this.secret = secret
  }

  instance({ path = '' } = {}, callback) {
    const ws = new WebSocket(`${this.host}${path ? path : ''}`)
    ws.onopen = callback
    ws.onmessage = callback
    ws.onerror = callback

    return ws
  }

  query({ name = '', symbol = '', interval = '', levels = 0, time = '', allTickers = false } = {}) {
    if (allTickers) {
      return `!@${name}@arr
        ${interval ? `_${interval}` : ''}
        ${levels ? levels : ''}
        ${time ? `@${time}` : ''}`
        .split(/\s|\n/)
        .join('')
        .toLowerCase()
    } else {
      return `${symbol ? symbol : ''}@
        ${name}${interval ? `_${interval}` : ''}
        ${levels ? levels : ''}
        ${time ? `@${time}` : ''}`
        .split(/\s|\n/)
        .join('')
        .toLowerCase()
    }
  }
  // The Aggregate Trade Streams push trade information that is aggregated for a single taker order every 100 milliseconds
  aggTrade({ symbol = '' } = {}, callback) {
    return this.instance({
      path: this.query({
        symbol,
        name: this.aggTrade.name
      })
    }, callback)
  }
  // Mark price and funding rate for a single symbol pushed every 3 secends or every secends
  markPrice({ symbol = '', time = '1s', allTickers = false } = {}, callback) {
    return this.instance({
      path: this.query({
        name: this.markPrice.name,
        symbol,
        time,
        allTickers
      })
    }, callback)
  }
  // The Kline/Candlestick Stream push updates to the current klines/candlestick every 250 milliseconds (if existing)
  kline({ symbol = '', interval = '' } = {}, callback) {
    return this.instance({
      path: this.query({ symbol, name: this.kline.name, interval })
    }, callback)
  }
  // 24hr rolling window mini-ticker statistics for a single symbol. These are NOT the statistics of the UTC day, but a 24hr rolling window from requestTime to 24hrs before

  depth({ symbol = '', level = 5 } = {}, callback) {
    return this.instance({
      path: this.query({ symbol, name: this.depth.name, level })
    }, callback)
  }
  //24hr rolling window mini-ticker statistics for a single symbol. These are NOT the statistics of the UTC day, but a 24hr rolling window from requestTime to 24hrs before.
  miniTicker({ symbol = '' } = {}, callback) {
    return this.instance({
      path: this.query({ symbol, name: this.miniTicker.name })
    }, callback)
  }
  // Pushes any update to the best bid or ask's price or quantity in real-time for a specified symbol
  bookTicker({ symbol = '' } = {}, callback) {
    return this.instance({
      path: this.query({ name: this.bookTicker.name, symbol })
    }, callback)
  }
  // The Liquidation Order Streams push force liquidation order information for specific symbol
  forceOrder({ symbol = '', allTickers = false } = {}, callback) {
    return this.instance({
      path: this.query({ name: this.forceOrder.name, symbol, allTickers })
    }, callback)
  }

  userData({ listenKey } = {}, callback) {
    return this.instance({ path: listenKey }, callback)
  }
}

export default BinanceWS
