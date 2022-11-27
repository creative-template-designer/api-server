"use strict";

const {
  createGoogleFacbook,
  deleteUser,
  verifyUser,
  createUser,
  verifyUserName
} = require("../models/auth");
const {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../helpers/error_helper");

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

  console.log("google");
  console.log(req);
  if (props) {
    const foundUser = await getUserData(props);

    if (foundUser) {
      res.json({ userData: foundUser });
    } else {
      await createGoogleFacbook(props)
        .then(async (data) => {
          console.log(data);
          const value = await getUserData(props);
          res.json({ userData: value }).status(200);
        })
        .catch((err) => res.send(err));
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
  await verifyUser(`"username" = '${props?.username}'`);

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
};
