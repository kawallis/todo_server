const Router = require('express').Router;
const router = Router();
const User = require('../models/user');
const ensureAuth = require('../auth/ensure-auth')();
const tokenService = require('../auth/token-service');

function hasEmailAndPassword(req, res, next) {
  const user = req.body;
  if (!user.email || !user.password) {
    return next({
      code: 400,
      error: 'Email and password must be entered.'
    });
  }
  next();
}

router

  .get('/verify', ensureAuth, (req, res) => {
    res.send({ valid: true });
  })

  .post('/signup', (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    delete req.body.password;

    User.exists({ email: email })
      .then(thing => {
        if (thing) {
          throw { code: 400, error: 'theres another fool using ur shizzz try again' };
        }
        const user = new User({ email, name });
        user.generateHash(password);
        return user.save();
      })
      .then(user => tokenService.sign(user))
      .then(token => res.send({ token }))
      .catch(next);
  })

  .post('/signin', hasEmailAndPassword, (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    delete req.body.password;

    User.findOne({ email })
      .then(user => {
        if (!user || !user.comparePassword(password)) {
          throw { code: 401, error: 'Invalid Login' };
        }
        return user;
      })
      .then(user => tokenService.sign(user))
      .then(token => {
        res.send(token);
      })
      .catch(next);
  });


module.exports = router;