import React, { useContext } from "react";
import { SearchField } from "./components/search-field/search-field.jsx";
import { ResultSection } from "./components/result-section/result-section.jsx";
import { observer } from "mobx-react";
import { cryptoContext } from "./store/crypto-store";
import "./App.scss";
import "./assets/main.scss";

const App = observer(() => {
  const cryptoStore = useContext(cryptoContext);
  const cryptoMarkets = ["BINANCE", "HUOBI"];
  const cryptoData = cryptoStore.cryptoData;

  return (
    <div className="App">
      <SearchField cryptoMarkets={cryptoMarkets} cryptoData={cryptoData} />
      <ResultSection cryptoData={cryptoData} />
    </div>
  );
});

export default App;
