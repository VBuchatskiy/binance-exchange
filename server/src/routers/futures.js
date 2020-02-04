import { Router } from 'express'
import { Binance } from '@@/api/Binance'
import { endpoints } from '@@/api/constants'

const futures = new Router()

futures.get('/', (req, res) => {
  new Binance(endpoints[1])
    .indicators()
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.warn(error.message)
    })
})

export default futures