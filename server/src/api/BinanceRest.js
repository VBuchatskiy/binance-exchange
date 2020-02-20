import axios from 'axios'
import config from '@/config/config'
import crypto from 'crypto'
// import chalk from 'chalk'
// import querystring from 'querystring'
export default class BinanceRest {
  constructor({ host = config.endpoints.test.future, key = config.key, secret = config.secret, reconect = 5000 } = {}) {
    this.host = host
    this.key = key
    this.secret = secret
    this.reconect = reconect
    this.path = {
      account: 'account',
      risk: 'positionRisk',
      margin: {
        type: 'marginType',
        position: 'positionMargin',
        history: 'positionMargin/history'
      },
      orders: {
        open: 'allOpenOrders',
        batch: 'batchOrders'
      },
      order: {
        open: 'order'
      },
      server: {
        info: 'exchangeInfo'
      }
    }
  }
  get request() {
    const headers = {
      'X-MBX-APIKEY': `${this.key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return axios.create({ url: this.host, headers })
  }
  get signature() {
    const timestamp = Date.now()
    const reconect = `recvWindow=${this.reconect}&timestamp=${timestamp}`
    return `${reconect}&signature=${crypto.createHmac('sha256', this.secret).update(reconect).digest('hex')}`
  }
  async info() {
    const url = `${this.host}${this.path.server.info}?${this.signature}`
    const instance = this.request
    try {
      const { data } = await instance.get(url)
      console.warn(data.rateLimits)
      return data
    }
    catch (error) {
      console.trace(error.stack)
    }
  }
  async account() {
    const instance = this.request
    const url = `${this.host}${this.path.account}?${this.signature}`
    try {
      const { data } = await instance.get(url)
      console.warn(data)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
  async orders() {
    const instance = this.request
    const url = `${this.host}${this.path.orders.open}?${this.signature}`
    try {
      const { data } = await instance.get(url)
      console.warn(data)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
  async buy({ symbol = 'BTCUSDT', side = 'BUY', timeInForce = 'GTC', type = 'LIMIT', quantity = 0.1, price = 9000 } = {}) {
    // const instance = this.request
    const timestamp = Date.now()
    const query = `symbol=${symbol}&side=${side}&timeInForce=${timeInForce}&type=${type}&quantity=${quantity}&price=${price}&recvWindow=5000&timestamp=${timestamp}`
    const signature = crypto.createHmac('sha256', this.secret).update(query).digest('hex')
    const url = `${this.host}${this.path.order.open}?${query}&signature=${signature}`
    const headers = {
      'X-MBX-APIKEY': `${this.key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    console.warn(url)
    axios.post(url, null, { headers })
      .then(response => {
        console.warn(response)
      })
      .catch((data) => {
        data
        console.warn(data)
        // console.warn(chalk.red(error))
      })
    // try {
    //   const response = await instance.post(url)
    //   console.warn(chalk.red(response))
    // } catch (error) {
    //   console.trace(error.stack)
    // }
  }
}