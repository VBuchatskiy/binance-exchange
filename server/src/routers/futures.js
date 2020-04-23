import { Router } from 'express'
import { Binance } from '@@/api'
import config from '@/config/config'

const futures = Router()

futures.all('/', async (req, res) => {
  if (!Object.keys(req.query).length) {
    const binance = new Binance({
      host: config.endpoints.test.future,
      key: config.key,
      secret: config.secret
    })
    const symbol = 'BTCUSDT'
    const ping = await binance.ping()
    const time = await binance.time()
    const exchangeInfo = await binance.exchangeInfo()
    const depth = await binance.depth({ symbol })
    const trades = await binance.depth({ symbol, limit: 10 })
    const historicalTrades = await binance.historicalTrades({ symbol, limit: 10 })
    const aggTrades = await binance.aggTrades({ symbol, limit: 10 })
    const klines = await binance.klines({ symbol, limit: 10 })
    const premiumIndex = await binance.premiumIndex({ symbol })
    const tickerDay = await binance.tickerDay({ symbol })
    const tickerPrice = await binance.tickerPrice({ symbol })
    const bookTicker = await binance.bookTicker({ symbol })
    const allForceOrders = await binance.allForceOrders({ symbol, limit: 1 })
    const openInterest = await binance.openInterest({ symbol })
    const leverageBracket = await binance.leverageBracket({ symbol })
    const allOpenOrders = await binance.allOpenOrders({ symbol })F
    const limitOreder = await binance.order({ method: 'POST', symbol, type: 'LIMIT', side: 'BUY', quantity: 1, price: 6000, timeInForce: 'GTC' })

    //
    // async function stopLoss(data) {
    //   if (!data) return;
    //   return binance.order("POST", {
    //     symbol: data.symbol,
    //     type: data.type,
    //     side: data.side,
    //     quantity: data.quantity,
    //     price: data.price,
    //     stopPrice: data.stopPrice
    //   });
    // }
    //
    // async function takeProfit(data) {
    //   if (!data) return;
    //   return binance.order("POST", {
    //     symbol: data.symbol,
    //     type: data.type,
    //     side: data.side,
    //     quantity: data.quantity,
    //     price: data.price,
    //     stopPrice: data.stopPrice
    //   });
    // }
    //
    // async function stopMarket(data) {
    //   if (!data) return;
    //   return binance.order("POST", {
    //     symbol: data.symbol,
    //     type: data.type,
    //     side: data.side,
    //     quantity: data.quantity,
    //     price: data.price,
    //     stopPrice: data.stopPrice
    //   });
    // }
    //
    // async function takeProfitMarket(data) {
    //   if (!data) return;
    //   return binance.order("POST", {
    //     symbol: data.symbol,
    //     type: data.type,
    //     side: data.side,
    //     quantity: data.quantity,
    //     price: data.price,
    //     stopPrice: data.stopPrice
    //   });
    // }
    //
    // async function deleteOrder(data) {
    //   return binance.order("DELETE", {
    //     symbol: data.symbol,
    //     orderId: data.orderId,
    //     origClientOrderId: data.origClientOrderId
    //   });
    // }
    //
    // async function getOrder(data) {
    //   return binance.order("GET", {
    //     symbol: data.symbol,
    //     orderId: data.orderId
    //   });
    // }
    //
    // async function getOpenedOrder(data) {
    //   return binance.openOrder({
    //     symbol: data.symbol,
    //     orderId: data.orderId,
    //     origClientOrderId: data.origClientOrderId
    //   });
    // }

    const data = Object.assign({},
      ping,
      time,
      exchangeInfo,
      depth,
      trades,
      historicalTrades,
      limitOreder,
      aggTrades,
      klines,
      premiumIndex,
      tickerDay,
      tickerPrice,
      bookTicker,
      allForceOrders,
      openInterest,
      leverageBracket,
      allOpenOrders,
      limitOreder
    )

    res.json(data)
  }
})

export default futures