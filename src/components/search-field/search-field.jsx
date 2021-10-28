import React, { useState } from "react";
import { SearchInput } from "../search-input/search-input";
import { CustomButton } from "../custom-button/custom-button";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { BINANCE, HUOBI } from "../../constants";
import axios from "axios";
import "./search-field.scss";

const FROM_FIELD = "from";
const TO_FIELD = "to";

const ERROR_MESSAGE =
  "The crypto pair you entered is either invalid or not supported";

const binanceEndpoint = "https://api2.binance.com/api/v3/ticker/price";
const huobiEndpoint = "https://api.huobi.pro/market/detail/merged";

const componseResultObject = (binanceResult, huobiResult) => {
  let result = {};
  if (binanceResult.err && huobiResult.err) {
    result = null;
  }
  if (!binanceResult.err) {
    result[BINANCE] = binanceResult;
  }
  if (!huobiResult.err) {
    result[HUOBI] = huobiResult;
  }
  return result;
};

const getProperErrorMessage = (binanceResult, huobiResult) => {
  if (binanceResult.err && huobiResult.err) {
    return "The crypto pair you entered is either invalid or not supported in both markets!";
  } else if (binanceResult.err && !huobiResult.err) {
    return "The crypto pair you entered is either invalid or not supported in BINANCE's market!";
  } else if (!binanceResult.err && huobiResult.err) {
    return "The crypto pair you entered is either invalid or not supported in HUOBI's market!";
  }
  return "";
};

const makeEndpointRequest = async (api, endpoint, from, to) => {
  let hasError = false;
  const errorObject = {
    err: `${ERROR_MESSAGE} in ${api}`,
  };
  const paramsObject = { params: { symbol: `${from}${to}` } };
  const result = await axios
    .get(endpoint, paramsObject)
    .catch(() => (hasError = true));

  if (hasError) return errorObject;
  else if (api == BINANCE) {
    return { ...result.data, symbol: `${from}/${to}` };
  } else if (api == HUOBI) {
    const price = result.data?.tick?.close;
    if (!price) return errorObject;
    return {
      price,
      symbol: `${from.toUpperCase()}/${to.toUpperCase()}`,
    };
  }
};

const createStateObject = (array) => {
  let object = {};
  array.forEach((item) => {
    object[item] = "";
  });
  return object;
};

export const SearchField = (props) => {
  const { getResultCb } = props;
  // based on the content of this array, will render input fields and store their value in current state as KVPs
  const fieldsArr = [FROM_FIELD, TO_FIELD];
  const [values, setValues] = useState(createStateObject(fieldsArr));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submitRequest = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const fromValue = values[FROM_FIELD];
    const toValue = values[TO_FIELD];

    const binanceResult = await makeEndpointRequest(
      BINANCE,
      binanceEndpoint,
      fromValue.toUpperCase(),
      toValue.toUpperCase()
    );
    const huobiResult = await makeEndpointRequest(
      HUOBI,
      huobiEndpoint,
      fromValue.toLowerCase(),
      toValue.toLowerCase()
    );

    const errorMessage = getProperErrorMessage(binanceResult, huobiResult);
    setError(errorMessage);
    setIsLoading(false);
    const resultObject = componseResultObject(binanceResult, huobiResult);
    if (resultObject) getResultCb(resultObject);
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
