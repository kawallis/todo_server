const Router = require('express').Router;
const router = Router();
const User = require('../models/user');


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
    User.findById(id)
      .then(user => {
        res.send(user);
      })
      .catch(next);
  });

module.exports = router;