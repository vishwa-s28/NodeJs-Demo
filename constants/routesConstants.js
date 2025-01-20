export const BASE_URL = {
  URL: "/",
};

export const ADMIN_API_PREFIX = {
  ADMIN_API: "/admin",
};

export const ADMIN_ROUTES = {
  ADD_PRODUCT: "/add-product",
  PRODUCTS: "/products",
  EDIT_PRODUCT_ID: "/edit-product/:productId",
  EDIT_PRODUCT: "/edit-product",
  DELETE_PRODUCT: "/delete-product",
};

export const AUTH_ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  SIGNUP: "/signUp",
  RESET: "/reset",
  RESET_PASSWORD: "/reset/:token",
  NEW_PASSWORD: "/new-password",
};

export const SHOP_ROUTES = {
  PRODUCTS: "/products",
  PRODUCTS_ID: "/products/:productId",
  BASE_URL: "/",
  CART: "/cart",
  DELETE_CART: "/cart-delete-item",
  ORDERS: "/orders",
  ORDER: "/orders/:orderId",
  CREATE_ORDER: "/create-order",
  CHECKOUT: "/checkout",
  SUCCESS: "/checkout/success",
  CANCEL: "/checkout/cancel",
};
