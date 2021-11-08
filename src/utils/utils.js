export const openWebSocketForCryptoPair = (
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
