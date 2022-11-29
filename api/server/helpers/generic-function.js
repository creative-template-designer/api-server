const { createPool } = require("../../index");
var _ = require("lodash");
const create = async (tableName, props, username) => {
  const owner = username || "admin";

  const keys = `${_.map(props, (v, keys) => {
    return `${keys}`;
  }).join(", ")}`;

  const keyWithDate = `${keys}, modifiedby, createdby`;

  const values = `${_.map(props, (v, key) => {
    return `'${v}'`;
  }).join(", ")}`;
  const valueWithDate = `${values}, '${owner}', '${owner}'`;

  const query = `INSERT INTO ${tableName}(${keyWithDate}) VALUES (${valueWithDate})`;

  console.log("qery in create", query);
  // const client = await createPool();
  let conn = null;
  return await createPool()
    .then(async (pool) => {
      console.log("pool>>>>>>", pool);
      conn = pool;
      const res = await pool?.query(query);
      console.log("find res", res);
      return res?.rows;
    })
    .catch((err) => {
      console.log("find error", err);
      return err.stack;
    })
    .finally(() => {
      if (conn) {
        conn.end();
      }
    });
};

const findAll = async (tableName, selectableProps, filters = "") =>
  await find(tableName, selectableProps, filters);

const find = async (tableName, selectableProps, filters = "") => {
  const colummns =
    selectableProps?.length > 0 ? `"${selectableProps?.join('", "')}"` : "*";
  const query = `select ${colummns} from ${tableName} ${
    filters && filters?.length > 0 ? `where ${filters}` : ""
  }`;
  let conn = null;
  return await createPool()
    .then(async (pool) => {
      conn = pool;
      console.log(query);
      const value = await pool.query(query);
      console.log("find res", value);
      return value;
    })
    .catch((err) => {
      console.log("find error", err);
      return err.stack;
    })
    .finally(() => {
      if (conn) {
        conn.end();
      }
    });
};

// Same as `find` but only returns the first match if >1 are found.
const findOne = async (tableName, selectableProps, filters) => {
  return await find(tableName, selectableProps, filters).then((results) => {
    console.log("findone", results);
    if (!Array.isArray(results)) return results;
    return results[0];
  });
};

const update = async (tableName, props, id) => {
  const updateQuery = `${_.map(props, (v, keys) => {
    return `"${keys}"='${v}'`;
  }).join(", ")}`;
  const query = `UPDATE  ${tableName} SET ${updateQuery} where "psqlguid"=${id}`;
  let err = "";
  let res = "";
  const client = await createPool();
  res = await client.query(query);
  console.log(res);
  console.log("res?.rows", res?.rows[0]);

  return await client
    .query(query)
    .then((res) => {
      console.log(res);
      console.log("res?.rows", res?.rows[0]);
      return res;
    })
    .catch((err) => {
      console.log("update error", err);
      return err;
    });
};

const destroy = async (tableName, whereCondition) => {
  const query = ` DELETE FROM ${tableName} where ${whereCondition}`;
  const client = await createPool();
  return await client
    .query(query)
    .then((res) => {
      console.log("destroy res", res);
      return res;
    })
    .catch((err) => {
      console.log("destroy error", err);
      return err;
    });
};

module.exports = {
  create,
  findAll,
  find,
  findOne,
  update,
  destroy,
};
