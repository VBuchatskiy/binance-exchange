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
    this.data = null
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
  async indicators({ symbol = 'BTCUSDT', interval = '4h', limit = 120 } = {}) {
    const time = new Date().valueOf()
    const trades = await this.trades({ symbol })
    const candles = await this.klines({ symbol, interval, limit })
    const prices = {
      close: candles.map(price => parseFloat(price[KLINES['CLOSE_PRICE']])),
      open: candles.map(price => parseFloat(price[KLINES['OPEN_PRICE']])),
      high: candles.map(price => parseFloat(price[KLINES['HIGH_PRICE']])),
      low: candles.map(price => parseFloat(price[KLINES['LOW_PRICE']]))
    }
    const trade = {
      price: trades[trades.length - 1]
    }
    this.data = {
      trades,
      candles
    }
    const last = {
      candle: {
        time: {
          close: candles.pop()[KLINES['CLOSE_TIME']]
        }
      }
    }

    let ma = null
    let rsi = null
    let macd = null
    let bollingerbands = null
    let bullishhammer = null
    let morningstar = null

    if (time > last.candle.time.close - 1000) {
      bullishhammer = BullishHammer({
        open: [...prices.open.slice(-1)],
        close: [...prices.close.slice(-1)],
        high: [...prices.high.slice(-1)],
        low: [...prices.low.slice(-1)],
        time: {
          close: last.candle.time.close
        }
      })
      morningstar = MorningStar({
        open: [...prices.open.slice(-3)],
        close: [...prices.close.slice(-3)],
        high: [...prices.high.slice(-3)],
        low: [...prices.low.slice(-3)],
        time: {
          close: last.candle.time.close
        }
      })
      ma = {
        fast: new SMA({
          values: prices.close,
          period: 12
        }).pop(),
        slow: new SMA({
          values: prices.close,
          period: 26
        }).pop()
      }
      rsi = new RSI({
        values: prices.close,
        period: 14
      }).pop()
      macd = new MACD({
        values: prices.close,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      }).pop()
      bollingerbands = new BollingerBands({
        values: prices.close,
        period: 20,
        stdDev: 2
      }).pop()
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
    return null
  }
}

export {
  Binance
}