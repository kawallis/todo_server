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

    User.find({ email })
    .count()
    .then(count => {
      if (count > 0) { throw { code: 400, error: 'This email is already in use' }; }
      const user = new User({ email, name });        user.generateHash(password);
      return user.save();
    })
    .then(user => tokenService.sign(user))
    .then(token => {
      if (token) {
        res.send('Success Log In Now');
      } else {
        res.send('Fails');
      }
    })
    .catch(next);  
  })

  .post('/signin', hasEmailAndPassword, (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    delete req.body.password;
    let loggedUser;

    User.findOne({ email })
      .then(user => {
        if (!user || !user.comparePassword(password)) {
          throw { code: 401, error: 'Invalid Login' };
        }
        return user;
      })
      .then(user => {
        loggedUser = user;
        return tokenService.sign(user);
      })
      .then(token => {
        res.send({loggedUser, token});
      })
      .catch(next);
  });


module.exports = router;