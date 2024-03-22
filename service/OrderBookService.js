class OrderBookHandler {
  constructor() {
    this.orderBooks = {};
  }

  handleOrderRequest(rid, key, order, handler) {
    console.log("Received order:", order);
    const matchedOrder = this.findMatchingOrder(order);

    if (matchedOrder) {
      console.log("Matched order:", matchedOrder);
      this.processTrade(order, matchedOrder);
      handler.reply(null, this.orderBooks);
    } else {
      this.addToOrderBook(order);
      handler.reply(null, this.orderBooks);
    }
  }

  findMatchingOrder(order) {
    for (const clientId in this.orderBooks) {
      if (clientId !== order.clientId) {
        const orders = this.orderBooks[clientId];
        for (const existingOrder of orders) {
          if (this.isMatchingOrder(existingOrder, order)) {
            return existingOrder;
          }
        }
      }
    }
    return null;
  }

  isMatchingOrder(order1, order2) {
    return (
      order1.type !== order2.type &&
      order1.asset === order2.asset &&
      order1.price === order2.price
    );
  }

  processTrade(order1, order2) {
    console.log("Processing trade between:", order1, "and", order2);
    // Implement trade logic here
  }

  addToOrderBook(order) {
    if (!this.orderBooks[order.clientId]) {
      this.orderBooks[order.clientId] = [];
    }
    this.orderBooks[order.clientId].push(order);
  }
}

module.exports = OrderBookHandler;
