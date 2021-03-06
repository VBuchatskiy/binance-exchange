import { BollingerBands, RSI, MACD, SMA, Stochastic } from './TechnicalIndicators'
import { KLINES } from '@@/constants'
import { precision } from '@@/utils'

export default class Indicators {
  constructor({ klines } = {}) {
    this.close = klines.map(price => precision(price[KLINES.CLOSE_PRICE]))
    this.open = klines.map(price => precision(price[KLINES.OPEN_PRICE]))
    this.high = klines.map(price => precision(price[KLINES.HIGH_PRICE]))
    this.low = klines.map(price => precision(price[KLINES.LOW_PRICE]))
  }
  calculate() {
    const timstamp = Date.now()
    const macd = new MACD({
      values: this.close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).pop()
    const bollingerbands = new BollingerBands({
      values: this.close,
      period: 20,
      stdDev: 2
    }).pop()
    const stochastic = new Stochastic({
      high: this.high,
      low: this.low,
      close: this.close,
      period: 14,
      signalPeriod: 3
    }).pop()
    const ma = {
      fast: new SMA({
        values: this.close,
        period: 12
      }).pop(),
      slow: new SMA({
        values: this.close,
        period: 26
      }).pop()
    }
    const rsi = new RSI({
      values: this.close,
      period: 14
    }).pop()

    return {
      ma,
      rsi,
      bollingerbands,
      macd,
      stochastic,
      timstamp
    }
  }
}