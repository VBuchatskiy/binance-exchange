import axios from 'axios'
import config from '@/config/config'
import crypto from 'crypto'
import chalk from 'chalk'
import querystring from 'querystring'
// import querystring from 'querystring'
export default class BinanceRest {
  constructor({ host = config.endpoints.test.future } = {}) {
    this.host = host
    this.timestamp = Date.now()
    this.recvWindow = 5000
    this.request = (() => {
      return axios.create({
        baseURL: this.host,
        headers: {
          'X-MBX-APIKEY': config.key,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    })()
    this.path = {
      account: 'account',
      order: 'order',
      active: 'openOrders'
    }
  }
  assign(params = {}) {
    return crypto.createHmac('sha256', config.secret).update(querystring.stringify(params)).digest('hex')
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
  async order(params = {}) {
    console.warn(params)
    try {
      const { data } = await this.request.post(`${this.path.order}?${this.query(params)}`)
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
}