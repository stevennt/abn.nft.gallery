import { defineStore } from 'pinia'

export type FiatPrice = string | number | null

interface State {
  fiatPrice: {
    kusama: {
      usd: FiatPrice
    }
    basilisk: {
      usd: FiatPrice
    }
    polkadot: {
      usd: FiatPrice
    }
  }
}

export const useFiatStore = defineStore('fiat', {
  state: (): State => ({
    fiatPrice: {
      kusama: {
        usd: null,
      },
      basilisk: {
        usd: null,
      },
      polkadot: {
        usd: null,
      },
    },
  }),
  getters: {
    incompleteFiatValues(): boolean {
      return (
        this.getCurrentKSMValue === null ||
        this.getCurrentDOTValue === null ||
        this.getCurrentBSXValue === null
      )
    },
    getCurrentKSMValue: (state): FiatPrice => state.fiatPrice.kusama.usd,
    getCurrentBSXValue: (state): FiatPrice => state.fiatPrice.basilisk.usd,
    getCurrentDOTValue: (state): FiatPrice => state.fiatPrice.polkadot.usd,
    getCurrentTokenValue:
      (state) =>
      (token: string): FiatPrice => {
        switch (token) {
          case 'KSM':
            return state.fiatPrice.kusama.usd
          case 'BSX':
            return state.fiatPrice.basilisk.usd
          case 'DOT':
            return state.fiatPrice.polkadot.usd
          default:
            return 0
        }
      },
  },
  actions: {
    async fetchFiatPrice() {
      const ksmPrice = await getPrice('KSM', 'object')
      this.fiatPrice = Object.assign({}, this.fiatPrice, ksmPrice)
      const bsxPrice = await getPrice('BSX', 'object')
      this.fiatPrice = Object.assign({}, this.fiatPrice, bsxPrice)
      const dotPrice = await getPrice('DOT', 'object')
      this.fiatPrice = Object.assign({}, this.fiatPrice, dotPrice)
    },
    setFiatPrice(payload) {
      this.fiatPrice = Object.assign({}, this.fiatPrice, payload)
    },
  },
})
