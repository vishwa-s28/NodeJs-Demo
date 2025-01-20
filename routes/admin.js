const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const { ADMIN_ROUTES } = require("../constants/routesConstants");
const isAuth = require("../middleware/isAuth");
const IsImage = require("../middleware/IsImage");

const router = express.Router();

router.get(ADMIN_ROUTES.ADD_PRODUCT, isAuth, adminController.getAddProduct);

router.get(ADMIN_ROUTES.PRODUCTS, isAuth, adminController.getProducts);

router.post(
  ADMIN_ROUTES.ADD_PRODUCT,
  isAuth,
  //   IsImage,
  adminController.postAddProduct
);

router.get(
  ADMIN_ROUTES.EDIT_PRODUCT_ID,
  isAuth,
  adminController.getEditProduct
);

router.post(ADMIN_ROUTES.EDIT_PRODUCT, isAuth, adminController.postEditProduct);

router.post(
  ADMIN_ROUTES.DELETE_PRODUCT,
  isAuth,
  adminController.postDeleteProduct
);

module.exports = router;
