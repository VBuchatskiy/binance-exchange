import axios from 'axios'
import { BollingerBands, RSI, MACD, SMA, Stochastic } from '@@/indicators/TechnicalIndicators'
import { KLINES } from '@@/api/constants'
//https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
//https://binance-docs.github.io/apidocs/futures/en/#change-log
const Binance = class {
  constructor({ host = 'https://api.binance.com/api/v3/' } = {}) {
    this.host = host
    this.path = {
      ping: 'ping',
      time: 'time',
      info: 'exchangeInfo',
      depth: 'depth',
      trades: 'trades',
      klines: 'klines'
    }
    // this.data = null,
  }
  // async load({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
  //   const trades = await this.trades({ symbol })
  //   const candles = await this.klines({ symbol, interval, limit })
  //   this.data = { trades, candles }
  // }
  async klines({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const base = `${this.host}${this.path.klines}`
    const query = `?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    const url = base.concat(query)
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.error(error.stack)
    }
  }
  async trades({ symbol = 'BTCUSDT', limit = 1 } = {}) {
    const base = `${this.host}${this.path.trades}`
    const query = `?symbol=${symbol.toUpperCase()}&limit=${limit}`
    const url = base.concat(query)
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.error(error.stack)
    }
  }
  async depth({ symbol = 'BTCUSDT', limit = 5 } = {}) {
    const base = `${this.host}${this.path.depth}`
    const query = `?symbol=${symbol.toUpperCase()}&limit=${limit}`
    const url = base.concat(query)
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.error(error.stack)
    }
  }
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const timestamp = new Date().valueOf()
    const candles = await this.klines({ symbol, interval, limit })
    const prices = {
      close: candles.map(price => parseFloat(price[KLINES['CLOSE_PRICE']])),
      open: candles.map(price => parseFloat(price[KLINES['OPEN_PRICE']])),
      high: candles.map(price => parseFloat(price[KLINES['HIGH_PRICE']])),
      low: candles.map(price => parseFloat(price[KLINES['LOW_PRICE']]))
    }
    const depth = await this.depth({ symbol })
    const trades = await this.trades({ symbol })
    const ask = parseFloat(parseFloat(depth.asks[0][0]).toFixed(2))
    const bid = parseFloat(parseFloat(depth.bids[0][0]).toFixed(2))
    const trade = trades[0]
    const macd = new MACD({
      values: prices.close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).pop()
    const bollingerbands = new BollingerBands({
      values: prices.close,
      period: 20,
      stdDev: 2
    }).pop()
    const stochastic = new Stochastic({
      high: prices.high,
      low: prices.low,
      close: prices.close,
      period: 14,
      signalPeriod: 3
    }).pop()
    const ma = {
      fast: new SMA({
        values: prices.close,
        period: 12
      }).pop(),
      slow: new SMA({
        values: prices.close,
        period: 26
      }).pop()
    }
    const rsi = new RSI({
      values: prices.close,
      period: 14
    }).pop()

    let order = null

    if (stochastic.d < 15) {
      const type = 'long'
      const entry = bid
      const stop = parseFloat((entry - (entry * 0.001)).toFixed(2))
      const take = parseFloat((entry * 1.002).toFixed(2))
      order = {
        type,
        entry,
        stop,
        take,
        timestamp
      }
    }

    if (stochastic.d > 80) {
      const type = 'short'
      const entry = bid
      const stop = parseFloat((entry * 1.002).toFixed(2))
      const take = parseFloat((entry - (entry * 0.001)).toFixed(2))
      order = {
        type,
        entry,
        stop,
        take,
        timestamp
      }
    }

    return {
      trade,
      ask,
      bid,
      order,
      ma,
      rsi,
      bollingerbands,
      macd,
      stochastic,
      timestamp
    }
  }
}

export {
  Binance
}