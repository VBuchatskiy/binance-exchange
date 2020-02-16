import axios from 'axios'
import config from '@/config/config'
import crypto from 'crypto'
import chalk from 'chalk'
export default class BinanceRest {
  constructor({ host = config.endpoints.test.future, key = config.key, secret = config.secret, reconect = 10000 } = {}) {
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
        place: 'order'
      }
    }
  }
  get request() {
    const headers = {
      'X-MBX-APIKEY': `${this.key}`,
      'content-type': 'application/x-www-form-urlencoded'
    }
    return axios.create({ url: this.host, headers })
  }
  get signature() {
    const timestamp = Date.now()
    const reconect = `recvWindow=${this.reconect}&timestamp=${timestamp}`
    return `${reconect}&signature=${crypto.createHmac('sha256', this.secret).update(reconect).digest('hex')}`
  }
  async account() {
    const instance = this.request
    const url = `${this.host}${this.path.account}?${this.signature}`
    try {
      const { data } = await instance.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
  async orders() {
    const instance = this.request
    const url = `${this.host}${this.path.orders.open}`
    try {
      const { data } = await instance.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
  async buy({ symbol = 'BTCUSDT', side = 'BUY', type = 'LIMIT', timeInForce = 'GTC', quantity = 1, price = 8800 } = {}) {
    const instance = this.request
    const query = `?symbol=${symbol}&side=${side}&type=${type}&timeInForce=${timeInForce}&quantity=${quantity}&price=${price}&${this.signature}`
    const url = `${this.host}${this.path.order.place}${query}`
    try {
      const { data } = await instance.post(url)
      return data
    } catch (error) {
      console.error(chalk.red('Faild buy order'))
      console.trace(error.stack)
    }
  }
}