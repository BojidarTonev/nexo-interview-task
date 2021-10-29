import axios from "axios";

const binanceEndpoint = "https://api2.binance.com/api/v3/ticker/price";

export const getBinanceData = async (from, to) => {
  from = from.toUpperCase();
  to = to.toUpperCase();
  const paramsObject = { params: { symbol: `${from}${to}` } };

  try {
    const response = await axios.get(binanceEndpoint, paramsObject);
    return {
      [`${from}/${to}`]: response.data.price,
    };
  } catch (err) {
    return {
      error: `Crypto pair ${from.toUpperCase()}/${to.toUpperCase()} is not available in Binance market`,
    };
  }
};
