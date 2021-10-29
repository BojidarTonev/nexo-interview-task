import React, { useState } from "react";
import { SearchField } from "./components/search-field/search-field.jsx";
import { ResultSection } from "./components/result-section/result-section.jsx";
import "./App.scss";
import "./assets/main.scss";

function App() {
  const [cryptoData, setCryptoData] = useState({ BINANCE: {}, HUOBI: {} });
  const cryptoMarkets = ["BINANCE", "HUOBI"];
  return (
    <div className="App">
      <SearchField
        cryptoMarkets={cryptoMarkets}
        setData={setCryptoData}
        cryptoData={cryptoData}
      />
      {<ResultSection data={cryptoData} />}
    </div>
  );
}

export default App;
