'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const knex = appRequire('init/knex').knex;
const crypto = require('crypto');

const checkExist = (() => {
  var _ref = _asyncToGenerator(function* (obj) {
    const user = yield knex('user').select().where(obj);
    if (user.length === 0) {
      return;
    } else {
      return Promise.reject();
    }
  });

  return function checkExist(_x) {
    return _ref.apply(this, arguments);
  };
})();

const md5 = function (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

const createPassword = function (password, username) {
  return md5(password + username);
};

const addUser = (() => {
  var _ref2 = _asyncToGenerator(function* (options) {
    try {
      const insert = {};
      if (options.username) {
        yield checkExist({ username: options.username });
        Object.assign(insert, { username: options.username });
      }
      if (options.email) {
        yield checkExist({ email: options.email });
        Object.assign(insert, { email: options.email });
      }
      if (options.telegram) {
        yield checkExist({ telegram: options.telegram });
        Object.assign(insert, { telegram: options.telegram });
      }
      Object.assign(insert, {
        type: options.type,
        createTime: Date.now()
      });
      if (options.username && options.password) {
        Object.assign(insert, {
          password: createPassword(options.password, options.username)
        });
      }
      return knex('user').insert(insert);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  });

  return function addUser(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const checkPassword = (() => {
  var _ref3 = _asyncToGenerator(function* (username, password) {
    try {
      const user = yield knex('user').select(['id', 'type', 'username', 'password']).where({
        username
      });
      if (user.length === 0) {
        return Promise.reject('user not exists');
      }
      if (createPassword(password, username) === user[0].password) {
        yield knex('user').update({
          lastLogin: Date.now()
        }).where({
          username
        });
        return user[0];
      } else {
        return Promise.reject('invalid password');
      }
    } catch (err) {
      return Promise.reject(err);
    }
  });

  return function checkPassword(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

const editUser = (() => {
  var _ref4 = _asyncToGenerator(function* (userInfo, edit) {
    try {
      const username = (yield knex('user').select().where(userInfo))[0].username;
      if (!username) {
        throw new Error('user not found');
      }
      if (edit.password) {
        edit.password = createPassword(edit.password, username);
      }
      const user = yield knex('user').update(edit).where(userInfo);
      return;
    } catch (err) {
      return Promise.reject(err);
    }
  });

  return function editUser(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
})();

const getUsers = (() => {
  var _ref5 = _asyncToGenerator(function* () {
    const users = yield knex('user').select().where({
      type: 'normal'
    });
    return users;
  });

  return function getUsers() {
    return _ref5.apply(this, arguments);
  };
})();

const getOneUser = (() => {
  var _ref6 = _asyncToGenerator(function* (id) {
    const user = yield knex('user').select().where({
      type: 'normal',
      id
    });
    if (!user.length) {
      return Promise.reject('User not found');
    }
    return user[0];
  });

  return function getOneUser(_x7) {
    return _ref6.apply(this, arguments);
  };
})();

exports.add = addUser;
exports.edit = editUser;
exports.checkPassword = checkPassword;
exports.get = getUsers;
exports.getOne = getOneUser;