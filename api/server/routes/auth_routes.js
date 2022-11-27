"use strict";

const router = require("express").Router();
const {
  postLogin,
  postRegister,
  postLoginViaFacebook,
  postLoginViaGoogle,
  postdeleteUser,
} = require("../controllers/auth_controller");

router.route("/login").post(postLogin);
router.route("/loginviagoogle").post(postLoginViaGoogle);
router.route("/logindeleteuser").post(postdeleteUser);

router.route("/register").post(postRegister);

module.exports = router;
