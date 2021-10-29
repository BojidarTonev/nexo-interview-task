import React from "react";
import { CryptoResultTable } from "../result-section/crypto-result-table";
import "./result.section.scss";

export const ResultSection = (props) => {
  const { data } = props;
  const renderPlatforms = () => {
    return Object.keys(data).map((item, index) => (
      <div className="result-section" key={`${item}-${index}`}>
        <h1>{item} RESULTS</h1>
        <CryptoResultTable marketName={item} data={data} />
      </div>
    ));
  };

  return <div className="result-section-wrapper">{renderPlatforms()}</div>;
};
