import ccxt from "ccxt";

const aggregateData = (data) => {
  return data.reduce((acc, item) => {
    acc[Object.keys(item)[0]] = Object.values(item)[0];
    return acc;
  }, {});
};

const queryCcxtData = async (market, cryptoPair) => {
  const exchangeClass = new ccxt[market.toLowerCase()]();
  try {
    const { last } = await exchangeClass.fetchTicker(cryptoPair);
    return last;
  } catch (e) {
    return `${market} market does not contain ${cryptoPair}`;
  }
};

export const getCcxtData = async (market, from, to, cryptoData) => {
  // manually add crypto pair
  if (from && to) {
    const cryptoPair = `${from}/${to}`;
    const price = await queryCcxtData(market, cryptoPair);
    // register the error to display it on the UI and not add it to the state
    if (isNaN(price)) {
      return { error: price };
    }
    return {
      [cryptoPair]: price,
    };
  }

  // auto update data
  const autoQueryResults = await Promise.all(
    Object.keys(cryptoData[market]).map(async (cryptoPair) => {
      const price = await queryCcxtData(market, cryptoPair);
      return {
        [cryptoPair]: price,
      };
    })
  );

  return aggregateData(autoQueryResults);
};
