import React, { useState } from "react";
import { BINANCE, HUOBI } from "./constants";
import { SearchField } from "./components/search-field/search-field.jsx";
import { ResultSection } from "./components/result-section/result-section.jsx";
import "./App.scss";
import "./assets/main.scss";

const checkIfDataAlreadyExistsInCurrentCryptoResults = (
  market,
  data,
  currentData
) => {
  if (!data) return [];
  if (currentData[market].some((item) => item.symbol == data.symbol)) return [];
  return [data];
};

function App() {
  const [cryptoData, setCryptoData] = useState({ [BINANCE]: [], [HUOBI]: [] });
  const getResultCb = (resultCb) => {
    const binanceData = checkIfDataAlreadyExistsInCurrentCryptoResults(
      BINANCE,
      resultCb[BINANCE],
      cryptoData
    );
    const huobiData = checkIfDataAlreadyExistsInCurrentCryptoResults(
      HUOBI,
      resultCb[HUOBI],
      cryptoData
    );
    setCryptoData({
      [BINANCE]: [...cryptoData[BINANCE], ...binanceData],
      [HUOBI]: [...cryptoData[HUOBI], ...huobiData],
    });
  };
  return (
    <div className="App">
      <SearchField getResultCb={getResultCb} />
      <ResultSection data={cryptoData} />
    </div>
  );
}

export default App;
