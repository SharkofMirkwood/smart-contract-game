import Vue from 'vue';
import Vuex from 'vuex';
import Web3 from 'web3';
import { Contract as Web3Contract } from 'web3-eth-contract';
import * as nftContractAbi from '../contracts/VillageNft.sol/VillageNft.json';
import * as goldContractAbi from '../contracts/VillageGold.sol/VillageGold.json';

Vue.use(Vuex);

export interface AppState {
  web3Instance: Web3;
  ethAccountAccessed: boolean;
  ethAddress: string;
  nftContract: Web3Contract;
  goldContract: Web3Contract;
}

const chainId = parseInt(process.env.VUE_APP_CHAIN_ID, 10);
const chainIdHex = `0x${chainId.toString(16)}`; // chainId must be in hexadecimal numbers

export default new Vuex.Store<AppState>({
  state: {
    web3Instance: null,
    ethAccountAccessed: null,
    ethAddress: null,
    nftContract: null,
    goldContract: null,
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
    setEthAddress: (state, payload: string) => {
      console.log('setEthAddress Mutation being executed', payload);
      state.ethAddress = payload.toLowerCase();
    },
    setContracts: (state, payload) => {
      console.log('setContract Mutation being executed', payload);
      state.nftContract = payload.nftContract;
      state.goldContract = payload.goldContract;
    },
  },
  actions: {
    registerWeb3: async ({ commit, dispatch }) => {
      console.log('registerWeb3 Action being executed');
      const { ethereum } = (window as any);
      if (typeof ethereum === 'undefined') {
        console.error('Unable to connect to Metamask');
        return;
      }
      const web3 = new Web3(ethereum);
      commit('registerWeb3Instance', web3);

      ethereum.on('accountsChanged', (accounts: any) => {
        console.log('accountsChanges', accounts);
        dispatch('requestEthAccounts');
      });
      ethereum.on('chainChanged', (networkId: string) => {
        console.log('chainChanged', networkId);
        // if (networkId !== chainIdHex) {
        window.location.reload();
        // }
      });

      const [coinbase, currentChainId] = await Promise.all([web3.eth.getCoinbase(), web3.eth.net.getId()]);
      if (coinbase && chainId === currentChainId) {
        console.log('chainId', chainId);
        commit('ethAccountAccessed', true);
        commit('setEthAddress', coinbase);
      }
      dispatch('initialiseContracts');
    },
    requestEthAccounts: async ({ commit, state }) => {
      const web3 = state.web3Instance;
      if (!web3) {
        console.error('Web3 not yet initialised');
        return;
      }
      const { ethereum } = (window as any);
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
      } catch (e: any) {
        if (e.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: process.env.VUE_APP_CHAIN_NAME,
              rpcUrls: [`http://${process.env.VUE_APP_PROVIDER_ADDRESS}`],
            }],
          });
        } else {
          console.error(e);
          throw e;
        }
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
    initialiseContracts: async ({ commit, state }) => {
      const web3 = state.web3Instance;
      if (!web3) {
        console.error('Web3 not yet initialised');
        return;
      }
      commit('setContracts', {
        nftContract: new web3.eth.Contract((nftContractAbi.abi as any), process.env.VUE_APP_NFT_CONTRACT_ADDRESS),
        goldContract: new web3.eth.Contract((goldContractAbi.abi as any), process.env.VUE_APP_GOLD_CONTRACT_ADDRESS),
      });
    },
  },
  modules: {
  },
});
