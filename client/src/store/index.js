import Vue from 'vue'
import Vuex from 'vuex'
import Binance from "@/api/Binance"
import config from '@/config/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orders: {
      active: '',
      history: {},
      indicators: {}
    }
  },
  mutations: {
    indicators({ state }, { indicators }) {
      Vue.set(state, 'indicators', indicators);
    }
  },
  actions: {
    async indicators({ commit }, { symbol, interval, limits }) {
      const binance = new Binance({ host: config.endpoints.test })
      const klines = await binance.klines({ symbol, interval, limits });
      console.warn(klines);
    }
  },
  modules: {}
})
