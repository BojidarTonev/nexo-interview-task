import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

const ASCENDING = "ASCENDING";
const DESCENDING = "DESCENDING";

export const CryptoResultTable = observer((props) => {
  const { data, marketName } = props;
  const [sortingOrder, setSortingOrder] = useState(ASCENDING);
  const [internalData, setInternalData] = useState();

  useEffect(() => {
    setInternalData(data[marketName]);
  }, [data, marketName]);

  const changeOrder = () => {
    const currentOrder = sortingOrder === ASCENDING ? DESCENDING : ASCENDING;
    const list = [];
    Object.keys(internalData).forEach((key) => {
      list.push({ [key]: internalData[key] });
    });

    let orederedList = [];
    orederedList = list.sort((a, b) => {
      const aValue = Object.values(a)[0];
      const bValue = Object.values(b)[0];
      if (sortingOrder === ASCENDING) {
        return bValue - aValue;
      }
      return aValue - bValue;
    });

    const orderedResult = orederedList.reduce((acc, item) => {
      const keys = Object.keys(item);
      if (!acc[keys[0]]) {
        acc[keys[0]] = item[keys[0]];
      }
      return acc;
    }, {});
    setInternalData(orderedResult);
    setSortingOrder(currentOrder);
  };

  return (
    <table>
      <thead>
        <tr>
          <td>CRYPTO PAIR</td>
          <td onClick={changeOrder}>
            PRICE{" "}
            {sortingOrder === DESCENDING ? (
              <i className="fas fa-arrow-up"></i>
            ) : (
              <i className="fas fa-arrow-down"></i>
            )}
          </td>
        </tr>
      </thead>
      <tbody>
        {internalData &&
          Object.entries(internalData)?.map((item, index) => {
            return (
              <tr key={`${item[0]}-${index}`}>
                <td>{item[0]}</td>
                <td>{Number(item[1]).toFixed(2)}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
});
