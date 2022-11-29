"use strict";

const {
  createGoogleFacbook,
  deleteUser,
  verifyUser,
  createUser,
  verifyUserName,
} = require("../models/auth");
const {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
  GENERIC_ERROR,
} = require("../helpers/error_helper");
var _ = require("lodash");

const postLogin = (req, res, next) => {
  const username = String(req.body.username);
  const password = String(req.body.password);

  if (!username || !password)
    next(
      createError({
        status: BAD_REQUEST,
        message: "`username` + `password` are required fields",
      })
    );

  verifyUser(username, password)
    .then((user) =>
      res.json({
        ok: true,
        message: "Login successful",
        user,
      })
    )
    .catch((err) =>
      next(
        createError({
          status: UNAUTHORIZED,
          message: err,
        })
      )
    );
};

const postRegister = (req, res, next) => {
  const props = req.body.user;

  verifyUserName({ username: props.username })
    .then((user) => {
      if (user)
        return next(
          createError({
            status: CONFLICT,
            message: "Username already exists",
          })
        );

      return createUser(props);
    })
    .then((user) =>
      res.json({
        ok: true,
        message: "Registration successful",
        user,
      })
    )
    .catch(next);
};

const postLoginViaGoogle = async (req, res, next) => {
  const props = req.body.user;

  if (props) {
    const foundUser = await getUserData(props);
    console.log(foundUser);

    if (typeof foundUser === "object") {
      res.json({ userData: foundUser });
    } else {
      const updatedProps = {
        ...props,
        logintype: "Google",
      };
      return await createGoogleFacbook(updatedProps)
        .then(async (data) => {
          console.log(data);
          const value = await getUserData(props);
          res.json({ userData: value }).status(200);
        })
        .catch((err) =>
          createError({
            status: GENERIC_ERROR,
            message: `Error occured ${err}`,
          })
        );
    }
  } else {
    next(
      createError({
        status: BAD_REQUEST,
        message: "Body is empty",
      })
    );
  }
};

const postLoginViaFacebook = async (req, res, next) => {
  const props = req.body.user;

  if (props) {
    const foundUser = await getUserData(props);
    if (typeof foundUser === "object") {
      res.json({ userData: foundUser });
    } else {
      const updatedProps = {
        ...props,
        logintype: "Facebook",
      };
      return await createGoogleFacbook(updatedProps)
        .then(async (data) => {
          console.log(data);
          const value = await getUserData(props);
          res.json({ userData: value }).status(200);
        })
        .catch((err) =>
          createError({
            status: GENERIC_ERROR,
            message: `Error occured ${err}`,
          })
        );
    }
  } else {
    next(
      createError({
        status: BAD_REQUEST,
        message: "Body is empty",
      })
    );
  }
};


const getUserData = async (props) =>
  await verifyUserName(`username='${props?.username}'`);

const postdeleteUser = async (req, res, next) => {
  const props = req.body;

  await deleteUser(`username = '${props.username}'`)
    .then((result) =>
      res.send({ message: "Delete success", rowCount: result?.rowCount })
    )
    .catch((err) => res.send(err));
};

module.exports = {
  postLogin,
  postRegister,
  postLoginViaGoogle,
  postdeleteUser,
  postLoginViaFacebook
};
