import axios from 'axios'
import config from '@/config/config'
import chalk from 'chalk'
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
      console.warn(chalk.red(error, this.constructor.name))
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
      console.warn(chalk.red(error, this.constructor.name))
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
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
}