import React from "react";
import { CryptoResultTable } from "../result-section/crypto-result-table";
import "./result.section.scss";

export const ResultSection = (props) => {
  const { cryptoData } = props;

  const renderPlatforms = () => {
    return Object.keys(cryptoData).map((item, index) => (
      <div className="result-section" key={`${item}-${index}`}>
        <h1>{item} RESULTS</h1>
        <CryptoResultTable marketName={item} data={cryptoData} />
      </div>
    ));
  };

  return <div className="result-section-wrapper">{renderPlatforms()}</div>;
};
