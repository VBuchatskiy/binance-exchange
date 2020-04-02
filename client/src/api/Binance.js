import axios from 'axios'
import chalk from 'chalk'
import crypto from 'crypto'
import querystring from 'querystring'
import config from '@/config/config'

class Binance {
  constructor({ recvWindow = 5000 } = {}) {
    this.host = config.endpoints.test.future
    this.key = config.key
    this.secret = config.secret
    this.recvWindow = recvWindow
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

  assign(query = {}) {
    return crypto.createHmac('sha256', this.secret).update(querystring.stringify(query)).digest('hex')
  }

  query({ path = '', params = '' } = {}) {
    if (params) {
      Object.assign(params, { recvWindow: this.recvWindow, timestamp: Date.now() })
      Object.assign(params, { signature: this.assign(params) })
      return path.concat('?', querystring.stringify(params))
    } else {
      return path
    }
  }
  // Test connectivity to the Rest API
  async ping() {
    try {
      const { data } = await this.request.get(this.query({ path: this.ping.name }))
      return data
    }
    catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.ping.name))
    }
  }
  // Test connectivity to the Rest API and get the current server time
  async time() {
    try {
      const { data } = await this.request.get(this.query({ path: this.time.name }))
      return data
    }
    catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.time.name))
    }
  }
  // Current exchange trading rules and symbol information
  async exchangeInfo() {
    try {
      const { data } = await this.request.get(this.query({ path: this.exchangeInfo.name }))
      return data
    }
    catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.exchangeInfo.name))
    }
  }
  // Adjusted based on the limit
  async depth({ params = { symbol: '', limits: 50 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.depth.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.depth.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }
  // Get recent trades (up to last 24h).
  async trades({ params = { symbol: '', limits: 500 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.trades.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.trades.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }
  // Get older market historical trades
  async historicalTrades({ params = { symbol: '', limits: 500, fromid: '' } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.historicalTrades.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.historicalTrades.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }
  // Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated
  async aggTrades({ params = { symbol: '', limit: 500, fromId: '', startTime: 0, endTime: 0 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.aggTrades.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.aggTrades.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }
  // If both startTime and endTime are sent, time between startTime and endTime must be less than 1 hour
  // If fromId, startTime, and endTime are not sent, the most recent aggregate trades will be returned
  async klines({ params = { symbol: '', interval: 0, limit: 500, startTime: 0, endTime: 0 } } = {}) {
    if (params.symbol && params.interval) {
      try {
        const { data } = await this.request.get(this.query({ path: this.klines.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.klines.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }
  // Mark Price and Funding Rate
  async premiumIndex({ params = { symbol: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: this.premiumIndex.name, params }))
      return data
    }
    catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.premiumIndex.name))
    }
  }
  // 24 hour rolling window price change statistics
  // Careful when accessing this with no symbol
  async fundingRate({ params = { symbol: '', limit: 100, startTime: 0, endTime: 0 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.fundingRate.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.fundingRate.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }
  // 24 hour rolling window price change statistics
  // Careful when accessing this with no symbol
  async tickerDay({ params = { symbol: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: '/ticker/24hr', params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.tickerDay.name))
    }
  }
  // 1 for a single symbol;
  // 2 when the symbol parameter is omitted
  async tickerPrice({ params = { symbol: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: '/ticker/price', params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.tickerPrice.name))
    }
  }
  //  Best price/qty on the order book for a symbol or symbols
  async bookTicker({ params = { symbol: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: '/ticker/bookTicker', params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.bookTicker.name))
    }
  }

  async allForceOrders({ params = { symbol: '', startTime: '', endTime: '', limit: 100 } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: this.allForceOrders.name, params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.allForceOrders.name))
    }
  }
  // Get present open interest of a specific symbol
  async openInterest({ params = { symbol: '' } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.openInterest.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.openInterest.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param symbol')))
    }
  }

  async leverageBracket({ params = { symbol: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: this.leverageBracket.name, params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.leverageBracket.name))
    }
  }

  // open delete get status of orders
  async order({ method = '', params = { symbol: '', side: '', type: '', quantity: 0, stopPrice: 0, price: 0, reduceOnly: false, workingType: 'CONTRACT_PRICE', timeInForce: 'GTC', activationPrice: 0, callbackRate: 0, newClientOrderId: '', orderId: '' } } = {}) {
    const path = this.order.name
    switch (method) {
      case 'GET': {
        if (params.symbol && params.orderId) {
          try {
            const { data } = await this.request.get(this.query({ path, params }))
            return data
          } catch (error) {
            console.trace(chalk.red(error, this.constructor.name, this.order.name))
          }
        } else {
          throw console.trace(chalk.red(new Error('missing mandatory param')))
        }
      }
        break
      case 'POST': {
        switch (params.type) {
          case 'LIMIT': {
            console.warn(this.query({ path, params }))
            if (params.symbol && params.side && params.quantity && params.price && params.timeInForce) {
              try {
                const { data } = await this.request({
                  url: this.query({ path, params }),
                  method
                })
                return data
              } catch (error) {
                console.trace(chalk.red(error, this.constructor.name, this.order.name))
              }
            } else {
              throw console.trace(chalk.red(new Error('missing mandatory param')))
            }
          }
            break
          case 'STOP' || 'TAKE_PROFIT': {
            if (params.symbol && params.side && params.quantity && params.price && params.stopPrice) {
              try {
                const { data } = await this.request({
                  url: this.query({ path, params }),
                  method
                })
                return data
              } catch (error) {
                console.trace(chalk.red(error, this.constructor.name, this.order.name))
              }
            }
            else {
              throw console.trace(chalk.red(new Error('missing mandatory param')))
            }
          }
            break
          case 'STOP_MARKET' || 'TAKE_PROFIT_MARKET': {
            if (params.symbol && params.side && params.quantity && params.stopPrice) {
              try {
                const { data } = await this.request({
                  url: this.query({ path, params }),
                  method
                })
                return data
              } catch (error) {
                console.trace(chalk.red(error, this.constructor.name, this.order.name))
              }
            }
          }
            break
          case 'TRAILING_STOP_MARKET': {
            if (params.symbol && params.side && params.quantity && params.callbackRate) {
              try {
                const { data } = await this.request({
                  url: this.query({ path, params }),
                  method
                })
                return data
              } catch (error) {
                console.trace(chalk.red(error, this.constructor.name, this.order.name))
              }
            }
          }
        }
      }
        break

      case 'DELETE': {
        // cancel an active order
        if (params.symbol) {
          try {
            const { data } = await this.request({
              url: this.query({ path, params }),
              method
            })
            return data
          } catch (error) {
            console.trace(chalk.red(error, this.constructor.name, this.order.name))
          }
        }
      }
        break
    }
  }
  // cancel all open orders
  async allOpenOrders() {
    try {
      const { data } = await this.request.delete(this.query({ path: this.allOpenOrders.name }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.allOpenOrders.name))
    }
  }

  async batchOrders({ params = { symbol: '', orderList: '', origClientOrderIdList: '' } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.delete(this.query({ path: this.batchOrders.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.batchOrders.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async openOrder({ params = { symbol: '', orderId: '', origClientOrderIdList: '' } } = {}) {
    try {
      const { data } = await this.request.get(this.query({ path: this.openOrder.name, params }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.openOrder.name))
    }
  }

  async openOrders({ params = { symbol: '' } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.openOrders.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.openOrders))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async allOrders({ params = { symbol: '', orderId: '', startTime: 0, endTime: 0, limit: 500 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.allOrders.name, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.allOrders.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async balance() {
    try {
      const { data } = await this.request.get(this.query({ path: this.balance.name }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.balance.name))
    }
  }

  async account() {
    try {
      const { data } = await this.request.get(this.query({ path: this.account.name }))
      return data
    }
    catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.account.name))
    }
  }

  async leverage({ params = { symbol: '', leverage: 0 } } = {}) {
    if (params.symbol && params.leverage) {
      try {
        const { data } = await this.request.post(this.query({ path: this.leverage, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.leverage.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }
  //ISOLATED, CROSSED
  async marginType({ params = { symbol: '', marginType: '' } } = {}) {
    if (params.symbol && params.marginType) {
      try {
        const { data } = await this.request.post(this.query({ path: this.marginType, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.marginType.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }
  //1: Add postion margin，2: Reduce postion margin
  async positionMargin({ params = { symbol: '', amount: 0, type: 0 } } = {}) {
    if (params.symbol && params.amount) {
      try {
        const { data } = await this.request.get(this.query({ path: this.positionMargin, params }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.positionMargin.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async positionRisk() {
    try {
      const { data } = await this.request.post(this.query({ path: this.positionMargin }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.positionMargin.name))
    }
  }

  async userTrades({ params = { symbol: '', startTime: 0, endTime: 0, fromId: 0, limit: 500 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.userTrades.name }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.userTrades.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async income({ params = { symbol: '', incomeType: '', startTime: 0, endTime: 0, limit: 100 } } = {}) {
    if (params.symbol) {
      try {
        const { data } = await this.request.get(this.query({ path: this.income.name }))
        return data
      } catch (error) {
        console.trace(chalk.red(error, this.constructor.name, this.income.name))
      }
    } else {
      throw console.trace(chalk.red(new Error('missing mandatory param')))
    }
  }

  async listenKey() {
    try {
      const { data } = await this.request.post(this.query({ path: this.listenKey.name }))
      return data
    } catch (error) {
      console.trace(chalk.red(error, this.constructor.name, this.userDataStream.name))
    }
  }
}

export {
  Binance
}