import axios from 'axios'
import config from '@/config/config'
import { precision } from '@@/utils/utils'
import { BollingerBands, RSI, MACD, SMA, Stochastic } from '@@/indicators/TechnicalIndicators'
import { KLINES } from '@@/api/constants'
export default class Binance {
  constructor({ host = config.endpoints.production.exchange } = {}) {
    this.host = host
    this.path = {
      ping: 'ping',
      time: 'time',
      info: 'exchangeInfo',
      depth: 'depth',
      trades: 'trades',
      klines: 'klines'
    }
  }
  async klines({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const base = `${this.host}${this.path.klines}`
    const query = `?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    const url = base.concat(query)
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
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
      console.trace(error.stack)
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
      console.trace(error.stack)
    }
  }
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const timestamp = new Date().valueOf()
    const candles = await this.klines({ symbol, interval, limit })
    const prices = {
      close: candles.map(price => precision(price[KLINES.CLOSE_PRICE])),
      open: candles.map(price => precision(price[KLINES.OPEN_PRICE])),
      high: candles.map(price => precision(price[KLINES.HIGH_PRICE])),
      low: candles.map(price => precision(price[KLINES.LOW_PRICE]))
    }
    const depth = await this.depth({ symbol })
    const trades = await this.trades({ symbol })
    const ask = precision(depth.asks[0][0])
    const bid = precision(depth.bids[0][0])
    const trade = trades.shift()
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

    return {
      trade,
      ask,
      bid,
      ma,
      rsi,
      bollingerbands,
      macd,
      stochastic,
      timestamp
    }
  }
}