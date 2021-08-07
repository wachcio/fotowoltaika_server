const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  res.status(200).json({ host: process.env.DB_HOST }); // send a json response
});

module.exports = router;
