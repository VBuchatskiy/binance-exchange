const Technicalindicators = require('technicalindicators')
// import Technicalindicators from 'technicalindicators/lib'

// const technicalindicators = Technicalindicators()
const RSI = Technicalindicators.rsi
const BollingerBands = Technicalindicators.bollingerbands
const MACD = Technicalindicators.macd
const SMA = Technicalindicators.sma
const MorningStar = Technicalindicators.morningstar
const BullishHammer = Technicalindicators.bullishhammerstick
const Stochastic = Technicalindicators.stochastic

export {
  RSI,
  BollingerBands,
  MACD,
  SMA,
  MorningStar,
  BullishHammer,
  Stochastic
}