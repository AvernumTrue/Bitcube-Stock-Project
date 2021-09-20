const helpers = {
    addStockToProduct: (oldProduct, addPrice, addQuantity) => {
        const oldPriceTotal = oldProduct.price * oldProduct.quantity;
        const newPriceTotal = addPrice * addQuantity;
        const totalPrice = oldPriceTotal + newPriceTotal;
        const totalQuantity = oldProduct.quantity + addQuantity;
        return {
            _id: oldProduct._id,
            name: oldProduct.name,
            price: totalPrice / totalQuantity,
            quantity: totalQuantity,
        };
    },
    findTotalProducts: (newProducts, oldProducts) => {
        return newProducts + oldProducts
    },
};

module.exports = helpers;