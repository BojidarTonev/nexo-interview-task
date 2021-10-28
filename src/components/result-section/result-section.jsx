import React from "react";
import { BINANCE, HUOBI } from "../../constants";
import "./result.section.scss";

const ASCENDING_ORDER = "ASCENDING_ORDER";
const DESCENDING_ORDER = "DESCENDING_ORDER";

const renderCryptoTable = (data) => {
  const changeOrder = () => {};
  return (
    <table>
      <thead>
        <td>CRYPTO PAIR</td>
        <td onClick={changeOrder}>PRICE</td>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr>
            <td>{item.symbol}</td>
            <td>{Number(item.price).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ResultSection = (props) => {
  const { data } = props;

  return (
    <div className="result-section-wrapper">
      <div className="result-section">
        <h1>BINANCE RESULTS</h1>
        {renderCryptoTable(data[BINANCE])}
      </div>
      <div className="result-section">
        <h1>HUOBI RESULTS</h1>
        {renderCryptoTable(data[HUOBI])}
      </div>
    </div>
  );
};
