import React, { useState, useEffect } from "react";
import { SearchInput } from "../search-input/search-input";
import { CustomButton } from "../custom-button/custom-button";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { getData } from "../../services/api-service";
import "./search-field.scss";

const FROM_FIELD = "from";
const TO_FIELD = "to";

export const SearchField = (props) => {
  const { setData, cryptoMarkets, cryptoData } = props;
  // based on the content of this array, will render input fields and store their value in current state as KVPs
  const fieldsArr = [FROM_FIELD, TO_FIELD];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ [FROM_FIELD]: "", [TO_FIELD]: "" });

  const requestAndSetCryptoData = async (from, to) => {
    setIsLoading(true);
    setError("");

    const data = await Promise.all(
      cryptoMarkets.map(async (key) => {
        return {
          [key]: await getData(key, from, to, cryptoData),
        };
      })
    );

    const result = data.reduce((acc, item) => {
      const platformName = Object.keys(item)[0]; //BINANCE or HUABI
      const existingData = cryptoData[platformName];
      const currentData = Object.values(item)[0];
      if (currentData.error) {
        // keep already present data in state and display error message
        setError(currentData.error);
        acc[platformName] = {
          ...existingData,
        };
      } else {
        // set the new incoming data and keep the already present one
        acc[platformName] = {
          ...existingData,
          ...currentData,
        };
      }
      return acc;
    }, {});

    setIsLoading(false);
    setData(result);
  };

  // make automatic request every 5 seconds to keep the displayed data up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      requestAndSetCryptoData();
    }, 5000);
    return () => clearInterval(interval);
  }, [cryptoData]);

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
