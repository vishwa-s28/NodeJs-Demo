const path = require("path");
const express = require("express");

const shopController = require("../controllers/shop");
const { SHOP_ROUTES, BASE_URL } = require("../constants/routesConstants");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get(BASE_URL.URL, shopController.getIndex);

router.get(SHOP_ROUTES.PRODUCTS, shopController.getProducts);

router.get(SHOP_ROUTES.PRODUCTS_ID, shopController.getProduct);

router.get(SHOP_ROUTES.CART, isAuth, shopController.getCart);

router.post(SHOP_ROUTES.CART, isAuth, shopController.postCart);

router.post(
  SHOP_ROUTES.DELETE_CART,
  isAuth,
  shopController.postCartDeleteProduct
);

router.get(SHOP_ROUTES.CHECKOUT, isAuth, shopController.getCheckout);

router.get(SHOP_ROUTES.SUCCESS, shopController.getCheckoutSuccess);

router.get(SHOP_ROUTES.CANCEL, shopController.getCheckout);

router.post(SHOP_ROUTES.CREATE_ORDER, isAuth, shopController.postOrder);

router.get(SHOP_ROUTES.ORDERS, isAuth, shopController.getOrders);

router.get(SHOP_ROUTES.ORDER, isAuth, shopController.getInvoice);

module.exports = router;
