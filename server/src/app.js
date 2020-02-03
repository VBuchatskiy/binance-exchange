import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import chalk from 'chalk'
import parser from 'body-parser'
import exchange from '@@/routers/exchange'
import { port } from '@/config/config'

const app = express()

app.use(logger('combined'))
app.use(parser.json())
app.use(cors())

app.use('/exchange', exchange)
app.use('/futures', (req, res) => {
  res.send('!!!')
})

app.listen(port, () => {
  console.log(chalk.cyan(`http://localhost:${port}/`))
})