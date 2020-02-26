import axios from 'axios'
import crypto from 'crypto'
import chalk from 'chalk'
import querystring from 'querystring'
export default class BinanceRest {
  constructor({ host = null, key = null, secret = null }) {
    this.host = host
    this.key = key
    this.secret = secret
    this.timestamp = Date.now()
    this.recvWindow = 5000
    this.path = {
      account: 'account',
      order: 'order',
      active: 'openOrders',
      balance: 'balance',
      trades: 'userTrades'
    }
    this.request = (() => {
      return axios.create({
        baseURL: this.host,
        headers: {
          'X-MBX-APIKEY': this.key,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    })()
  }
  assign(params = {}) {
    return crypto.createHmac('sha256', this.secret).update(querystring.stringify(params)).digest('hex')
  }
  query(params = {}) {
    Object.assign(params, { recvWindow: this.recvWindow, timestamp: this.timestamp })
    Object.assign(params, { signature: this.assign(params) })
    return querystring.stringify(params)
  }
  async account(params = {}) {
    try {
      const { data } = await this.request.get(`${this.path.account}?${this.query(params)}`)
      return data
    }
    catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
  async order({ method, params = {} } = {}) {
    try {
      const { data } = await this.request({
        url: `${this.path.order}?${this.query(params)}`,
        method
      })
      return data
    }
    catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }

  }
  async active(params = {}) {
    try {
      const { data } = await this.request.get(`${this.path.active}?${this.query(params)}`)
      return data
    }
    catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
  async balance(params = {}) {
    try {
      const { data } = await this.request.get(`${this.path.balance}?${this.query(params)}`)
      return data
    }
    catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
  async trades(params = {}) {
    try {
      const { data } = await this.request.get(`${this.path.trades}?${this.query(params)}`)
      return data
    }
    catch (error) {
      console.warn(chalk.red(error, this.constructor.name))
    }
  }
}