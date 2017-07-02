const Router = require('express').Router;
const router = Router();
const User = require('../models/user');
const List = require('../models/list');

router
  .get('/', (req, res, next) => {
    User.find()
      .select('-__v')
      .then(users => res.send(users))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new User(req.body)
      .save()
      .then(user => res.send(user))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Promise.all([
      User.findById(id),
      List.find({ user: id })
    ])
    .then(results => {
      const user = results[0];
      const lists = results[1];
      user.lists = lists;
      res.send(user);
    })
    .catch(next);
  });

module.exports = router;