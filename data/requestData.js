const orderRequest1 = {
  clientId: "client1",
  type: "buy",
  asset: "BTC",
  price: 50000,
};

const orderRequest2 = {
  clientId: "client2",
  type: "buy",
  asset: "BTC",
  price: 50000,
};

const orderRequest3 = {
  clientId: "client1",
  type: "sell",
  asset: "BTC",
  price: 50000,
};

const requestData = [orderRequest1, orderRequest2, orderRequest3];
module.exports = { requestData };
