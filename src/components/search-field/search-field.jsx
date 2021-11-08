import React, { useState, useEffect } from "react";
import { SearchInput } from "../search-input/search-input";
import { CustomButton } from "../custom-button/custom-button";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { getCcxtData } from "../../services/api-service";
import "./search-field.scss";

const FROM_FIELD = "from";
const TO_FIELD = "to";

const openWebSocketForCryptoPair = (
  cryptoPair,
  cryptoData,
  marketName,
  receiveNewCryptoPrice
) => {
  // check not to open web socket to already existing crypto pair
  if (
    Object.keys(cryptoData[marketName]).filter((cp) => cp == cryptoPair)
      .length > 0
  ) {
    return;
  }
  const normalizedCryptoPair = cryptoPair.toLowerCase().replace("/", "");
  const socket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${normalizedCryptoPair}@miniTicker`
  );
  socket.onmessage = function (event) {
    const parsedDataPrice = JSON.parse(event.data).c;
    receiveNewCryptoPrice(parsedDataPrice, marketName, cryptoPair, cryptoData);
  };
};

export const SearchField = (props) => {
  const { setData, cryptoMarkets, cryptoData } = props;
  // based on the content of this array, will render input fields and store their value in current state as KVPs
  const fieldsArr = [FROM_FIELD, TO_FIELD];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ [FROM_FIELD]: "", [TO_FIELD]: "" });

  const receiveNewCryptoPrice = (
    cryptoPrice,
    marketName,
    cryptoPair,
    cryptoData
  ) => {
    cryptoData[marketName][cryptoPair] = cryptoPrice;
    setData({ ...cryptoData });
  };

  const requestAndSetCryptoData = async (from, to) => {
    setIsLoading(true);
    setError("");

    const data = await Promise.all(
      cryptoMarkets.map(async (market) => {
        return {
          [market]: await getCcxtData(market, from, to, cryptoData),
        };
      })
    );

    const result = data.reduce((acc, item) => {
      const platformName = Object.keys(item)[0]; //BINANCE or HUABI
      const existingData = cryptoData[platformName];
      const recievedData = Object.values(item)[0];
      openWebSocketForCryptoPair(
        Object.keys(recievedData)[0],
        cryptoData,
        platformName,
        receiveNewCryptoPrice
      );
      if (recievedData.error) {
        // keep already present data in state and display error message
        setError(recievedData.error);
        acc[platformName] = {
          ...existingData,
        };
      } else {
        // set the new incoming data and keep the already present one
        acc[platformName] = {
          ...existingData,
          ...recievedData,
        };
      }
      return acc;
    }, {});

    setIsLoading(false);
    setData(result);
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    await requestAndSetCryptoData(values[FROM_FIELD], values[TO_FIELD]);
  };

  const onChangeCb = (fieldName, value) => {
    setValues({ ...values, [fieldName]: value });
  };

  const fields = fieldsArr.map((field) => (
    <SearchInput
      id={`${field}-id`}
      key={`${field}-key`}
      labelName={field}
      value={values[field]}
      onChangeCb={onChangeCb}
    />
  ));

  return (
    <div className="search-field-wrapper">
      {error && <p className="search-error">{error}</p>}
      <form>
        {isLoading && <LoadingSpinner />}
        <div className="input-container">{fields}</div>
        <CustomButton buttonText="SUBMIT" onClickEvent={submitRequest} />
      </form>
    </div>
  );
};
