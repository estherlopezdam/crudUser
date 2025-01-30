const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const User = require('../models/user.model');

module.exports.list = (req, res, next) => {
  const { olderThan } = req.query;

  const filter = {};
  if(olderThan) {
    const date = dayjs(`${olderThan}-01-01`).startOf('year').toDate();
    filter.birthDate = {$lt: date};
  }

  User.find(filter)
    .then((user) => res.json(user))
    .catch((error) => next(error));
}

module.exports.create = (req, res, next) => {
  const { body } = req;
  User.create(body)
    .then((user) => res.status(201).json(user))
    .catch((error) => next(error));
}


module.exports.detail = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) next(createError(404, 'User not found'))
      else res.json(user);
    })
    .catch((error) => next(error));
}

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) next(createError(404, 'User not found'))
      else res.status(204).send();
    })
    .catch((error) => next(error))
}

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const { password } = req.body;

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10); 
      body.password = await bcrypt.hash(password, salt); 
    }

    
    User.findByIdAndUpdate(id, body, { runValidators: true, new: true })
      .then((user) => {
        if (!user) return next(createError(404, 'User not found'));
        else res.status(201).json(user); 
      })
      .catch((error) => next(error)); 
  } catch (error) {
    next(error); 
  }
};