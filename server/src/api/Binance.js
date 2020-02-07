import axios from 'axios'
import { BollingerBands, RSI, MACD, SMA, MorningStar, BullishHammer } from '@@/indicators/TechnicalIndicators'
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
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const trades = await this.trades({ symbol })
    const candlas = await this.klines({ symbol, interval, limit })
    const prices = {
      close: candlas.map(price => parseFloat(price[KLINES['CLOSE_PRICE']])),
      open: candlas.map(price => parseFloat(price[KLINES['OPEN_PRICE']])),
      hight: candlas.map(price => parseFloat(price[KLINES['HIGHT_PRICE']])),
      low: candlas.map(price => parseFloat(price[KLINES['LOW_PRICE']]))
    }
    const trade = trades.pop()
    const bullishhammer = {
      status: BullishHammer({
        open: [...prices.open.slice(-1)],
        close: [...prices.close.slice(-1)],
        high: [...prices.hight.slice(-1)],
        low: [...prices.low.slice(-1)]
      }),
      entry: {
        price: bullishhammer ? prices.close.candlas.slice(-2) : 0,
        stop: bullishhammer ? prices.low.candlas.slice(-1) : 0,
        take: bullishhammer ? prices.hight.candlas.slice(-2) : 0
      }
    }
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

    const entry = {
      price: bullishhammer ? prices.close.candlas.slice(-2) : 0,
      stop: bullishhammer ? prices.low.candlas.slice(-2) : 0,
      take: bollingerbands ? bollingerbands.middle : 0
    }

    return {
      trade,
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