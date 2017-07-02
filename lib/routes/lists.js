const Router = require('express').Router;
const router = Router();
const List = require('../models/list');


router
  .get('/', (req, res, next) => {
    List.find()
      .lean()
      .select('-__v')
      .then(lists => res.send(lists))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    new List(req.body)
      .save()
      .then(list => res.send(list))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    List.findById(id)
      .then(list => {
        res.send(list);
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    List.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(list => res.send(list))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    List.findByIdAndRemove(req.params.id)
      .then(response => {
        res.send({ removed: response ? true : false });
      })
      .catch(next);
  });

module.exports = router;