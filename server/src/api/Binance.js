import axios from 'axios'
import config from '@/config/config'
import chalk from 'chalk'
import querystring from 'querystring'
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
    this.request = (() => {
      return axios.create({
        baseURL: this.host
      })
    })()
  }
  query(params = {}) {
    return querystring.stringify(params)
  }
  async klines({ params = { symbol: 'BTCUSDT', interval: '4h', limit: 120 } } = {}) {
    try {
      const { data } = await this.request.get(`${this.path.klines}?${this.query(params)}`)
      return data
    } catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
  async trades({ params = { symbol: 'BTCUSDT', limit: 1 } } = {}) {
    try {
      const { data } = await this.request.get(`${this.path.trades}?${this.query(params)}`)
      return data
    } catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
  async depth({ params = { symbol: 'BTCUSDT', limit: 5 } } = {}) {
    try {
      const { data } = await this.request.get(`${this.path.depth}?${this.query(params)}`)
      return data
    } catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
}