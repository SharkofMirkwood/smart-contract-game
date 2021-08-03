import Vue from 'vue';
import Vuex from 'vuex';
import Web3 from 'web3';

Vue.use(Vuex);

export interface AppState {
  web3Instance: Web3;
  ethAccountAccessed: boolean;
  ethAddress: string;
}

export default new Vuex.Store<AppState>({
  state: {
    web3Instance: null,
    ethAccountAccessed: null,
    ethAddress: null,
  },
  mutations: {
    registerWeb3Instance: (state, payload) => {
      console.log('registerWeb3instance Mutation being executed', payload);
      state.web3Instance = payload;
    },
    ethAccountAccessed: (state, payload) => {
      console.log('ethAccountAccessed Mutation being executed', payload);
      state.ethAccountAccessed = payload;
    },
    setEthAddress: (state, payload) => {
      console.log('setEthAddress Mutation being executed', payload);
      state.ethAddress = payload;
    },
  },
  actions: {
    registerWeb3: async ({ commit }) => {
      console.log('registerWeb3 Action being executed');
      const web3js = (window as any).ethereum;
      if (typeof web3js === 'undefined') {
        console.error('Unable to connect to Metamask');
        return;
      }
      const web3 = new Web3(web3js);
      commit('registerWeb3Instance', web3);

      const coinbase = await web3.eth.getCoinbase();
      if (coinbase) {
        commit('ethAccountAccessed', true);
        commit('setEthAddress', coinbase);
      }
    },
    requestEthAccounts: async ({ commit, state }) => {
      const web3 = state.web3Instance;
      if (!web3) {
        console.error('Web3 not yet initialised');
        return;
      }
      try {
        await web3.eth.requestAccounts();
        const coinbase = await web3.eth.getCoinbase();
        console.log('coinbase', coinbase);
        commit('ethAccountAccessed', true);
        commit('setEthAddress', coinbase);
      } catch (e: any) {
        console.error(e);
      }
    },
  },
  modules: {
  },
});
