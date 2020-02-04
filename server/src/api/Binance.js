import axios from 'axios'
import { BollingerBands, RSI, MACD, SMA, MorningStar, BullishHammer } from '@@/indicators/TechnicalIndicators'
import { klines, trades } from '@@/api/constants'
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
  }
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
  async trades({ symbol = 'BTCUSDT', limit = 1, param = '' } = {}) {
    const base = `${this.host}${this.path.trades}`
    const query = `?symbol=${symbol.toUpperCase()}&limit=${limit}`
    const url = base.concat(query)
    try {
      if (param) {
        const { data } = await axios.get(url)
        return data.map(item => parseFloat(item[param]))
      } else {
        const { data } = await axios.get(url)
        return data
      }
    } catch (error) {
      console.error(error.stack)
    }
  }
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const price = await this.trades({ symbol, param: trades[2] })
    const candlas = await this.klines({ symbol, interval, limit })
    const prices = {
      close: candlas.map(price => parseFloat(price[klines['CLOSE_PRICE']])),
      open: candlas.map(price => parseFloat(price[klines['OPEN_PRICE']])),
      hight: candlas.map(price => parseFloat(price[klines['HIGHT_PRICE']])),
      low: candlas.map(price => parseFloat(price[klines['LOW_PRICE']]))
    }
    const bullishhammer = BullishHammer({
      open: [...prices.open.slice(-1)],
      close: [...prices.close.slice(-1)],
      high: [...prices.hight.slice(-1)],
      low: [...prices.low.slice(-1)]
    })
    const morningstar = MorningStar({
      open: [...prices.open.slice(-3)],
      close: [...prices.close.slice(-3)],
      high: [...prices.hight.slice(-3)],
      low: [...prices.low.slice(-3)]
    })
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
    const bollingerbands = new BollingerBands({
      values: prices.close,
      period: 20,
      stdDev: 2
    }).pop()
    const macd = new MACD({
      values: prices.close,
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
      macd,
      morningstar,
      bullishhammer
    }
  }
}

export {
  Binance
}