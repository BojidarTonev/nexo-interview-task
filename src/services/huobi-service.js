import axios from "axios";

const huobiEndpoint = "https://api.huobi.pro/market/detail/merged";

export const getHuobiData = async (from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  const paramsObject = { params: { symbol: `${from}${to}` } };

  const response = await axios.get(huobiEndpoint, paramsObject);
  const price = response.data?.tick?.close;
  if (!price) {
    return {
      error: `Crypto pair ${from.toUpperCase()}/${to.toUpperCase()} is not available in Houbi market`,
    };
  }
  return {
    [`${from.toUpperCase()}/${to.toUpperCase()}`]: price,
  }; 
};
