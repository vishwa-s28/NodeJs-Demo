const express = require("express");
const { check } = require("express-validator/lib/middlewares/check");
const authController = require("../controllers/auth");
const { AUTH_ROUTES } = require("../constants/routesConstants");

const router = express.Router();

router.get(AUTH_ROUTES.LOGIN, authController.getLogin);
router.get(AUTH_ROUTES.SIGNUP, authController.getSignUp);
router.get(AUTH_ROUTES.RESET, authController.getReset);
router.get(AUTH_ROUTES.RESET_PASSWORD, authController.getNewPassword);

router.post(AUTH_ROUTES.LOGIN, authController.postLogin);
router.post(AUTH_ROUTES.LOGOUT, authController.postLogout);
router.post(
  AUTH_ROUTES.SIGNUP,
  check("email").isEmail().withMessage("please enter a valid email"),
  authController.postSignUp
);
router.post(AUTH_ROUTES.RESET, authController.postReset);
router.post(AUTH_ROUTES.NEW_PASSWORD, authController.postNewPassword);

module.exports = router;
