import axios from 'axios'
import { BollingerBands, RSI, MACD, SMA } from '@@/indicators/TechnicalIndicators'
import { klines, trades } from '@@/api/constants'
//https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
const Binance = class {
  constructor({ host = 'https://api.binance.com/api/v3/', query = '' } = {}) {
    this.host = host
    this.path = {
      ping: '/api/v3/ping',
      time: '/api/v3/time',
      info: '/api/v3/exchangeInfo',
      depth: '/api/v3/depth',
      trades: '/api/v3/trades',
      klines: '/api/v3/klines'
    }
    this.query = query
  }
  async klines({ symbol = 'BTCUSDT', interval = '4h', limit = 120, param } = {}) {
    const base = `${this.host}${this.path.klines}`
    const query = `?symbol=${symbol}&interval=${interval}&limit=${limit}`
    const url = base.concat(query)
    try {
      if (!isNaN(param)) {
        const { data } = await axios.get(url)
        return data.map(kline => parseFloat(kline[param]))
      } else {
        const { data } = await axios.get(url)
        return data;
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  async trades({ symbol = 'BTCUSDT', limit = 1, param = 'price' } = {}) {
    const base = `${this.host}${this.path.trades}`
    const query = `?symbol=${symbol}&limit=${limit}`
    const url = base.concat(query)
    try {
      if (param) {
        const { data } = await axios.get(url)
        return data.map(item => parseFloat(item[param]))
      } else {
        const { data } = await axios.get(url)
        return data;
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const price = await this.trades({ symbol, param: trades[2] })
    const prices = await this.klines({ symbol, interval, limit, param: klines['CLOSE_PRICE'] })
    const ma = {
      fast: new SMA({
        values: prices,
        period: 12
      }).pop(),
      slow: new SMA({
        values: prices,
        period: 26
      }).pop()
    }
    const rsi = new RSI({
      values: prices,
      period: 14
    }).pop()
    const bollingerbands = new BollingerBands({
      values: prices,
      period: 20,
      stdDev: 2
    }).pop()
    const macd = new MACD({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).pop()

    return {
      price,
      ma,
      rsi,
      bollingerbands,
      macd
    }
  }
}

export {
  Binance
}