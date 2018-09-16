import Vue from 'vue'
import Vuex from 'vuex'
import singer from './modules/singer'
import player from './modules/player'
import getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    singer,
    player
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
