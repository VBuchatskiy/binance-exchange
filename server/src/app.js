import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import chalk from 'chalk'
import parser from 'body-parser'
import { exchange, futures } from '@@/routers'
import { port } from '@/config/config'

const app = express()

app.use(logger('dev'))
app.use(parser.json())
app.use(cors())

app.use('/exchange', exchange)
app.use('/futures', futures)

app.listen(port, () => {
  console.warn(chalk.cyan(`http://localhost:${port}/`))
})