"use strict";

const bcrypt = require("bcrypt");
const {
  create,
  findAll,
  find,
  findOne,
  update,
  destroy,
} = require("../helpers/generic-function");
const SALT_ROUNDS = 10;
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const beforeSave = (user) => {
  if (!user.password) return Promise.resolve(user);

  // `password` will always be hashed before being saved.
  return hashPassword(user.password)
    .then((hash) => ({ ...user, password: hash }))
    .catch((err) => `Error hashing password: ${err}`);
};

const verifyUserName = async (props) => {
  // return await googleGuts.findOne(
  //   "users",
  //   selectablePropsGoogleFacebook,
  //   props
  // );
};
const createUser = (props) => {
  //   beforeSave(props).then((user) => guts.create(user));
};

const createGoogleFacbook = (props) => create("users", props);

const verifyUser = (username, password) => {
  //   const matchErrorMsg = "Username or password do not match";
  //   knex
  //     .select()
  //     .from(tableName)
  //     .where({ username })
  //     .timeout(guts.timeout)
  //     .then((user) => {
  //       if (!user) throw matchErrorMsg;
  //       return user;
  //     })
  //     .then((user) =>
  //       Promise.all([user, verifyPassword(password, user.password)])
  //     )
  //     .then(([user, isMatch]) => {
  //       if (!isMatch) throw matchErrorMsg;
  //       return user;
  //     });
};

const deleteUser = (props) => guts.destroy("users", props);

module.exports = () => {
  createGoogleFacbook, deleteUser, verifyUser, createUser,verifyUserName
};
