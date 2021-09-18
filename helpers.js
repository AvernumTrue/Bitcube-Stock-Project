const helpers = {
    findAveragePrice: (newPrice, newQty, oldPrice, oldQty) => {
        let oldPriceTotal = oldPrice * oldQty;
        let newPriceTotal = newPrice * newQty;
        let totalPrice = oldPriceTotal + newPriceTotal;
        let totalQuantity = oldQty + newQty;
        return totalPrice / totalQuantity;
    },
    findTotalProducts: (newProducts, oldProducts) => {
        return newProducts + oldProducts
    },
};

module.exports = helpers;