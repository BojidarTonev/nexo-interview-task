import { createContext } from "react";
import { observable, action, makeObservable } from "mobx";

export class CryptoStore {
  cryptoData = {
    BINANCE: {},
    HUOBI: {},
  };

  constructor() {
    makeObservable(this, {
      cryptoData: observable,
      updateCryptoPairInMarket: action,
      getCryptoData: action,
      setCryptoData: action,
    });
  }

  updateCryptoPairInMarket(marketName, cryptoPair, newPrice) {
    this.cryptoData[marketName][cryptoPair] = newPrice;
  }
  getCryptoData() {
    return this.cryptoData;
  }
  setCryptoData(newCryptoData) {
    this.cryptoData = newCryptoData;
  }
}

export const cryptoContext = createContext(new CryptoStore());
