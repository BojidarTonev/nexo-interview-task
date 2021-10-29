import { BINANCE, HUOBI } from "../constants";
import { getBinanceData } from "./binance-requester";
import { getHuobiData } from "./huobi-service";

const aggregateData = (data) => {
  return data.reduce((acc, item) => {
    acc[Object.keys(item)[0]] = Object.values(item)[0];
    return acc;
  }, {});
};

export const getData = async (market, from, to, data) => {
  switch (market) {
    case BINANCE:
      return await singleRequest(market, from, to, data, getBinanceData);
    case HUOBI:
      return await singleRequest(market, from, to, data, getHuobiData);
    default:
  }
};

const singleRequest = async (market, from, to, data, service) => {
  // when manually added crypto pair
  if (from) {
    return await service(from, to);
  }
  // auto quering for data
  const multipleResults = await Promise.all(
    Object.keys(data[market]).map(async (key) => {
      const pairs = key.split("/");
      from = pairs[0];
      to = pairs[1];
      return await service(from, to);
    })
  );

  return aggregateData(multipleResults, data, market);
};
