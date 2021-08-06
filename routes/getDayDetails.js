const express = require('express');
const router = express.Router();

// const path = require('path');

// require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// const axios = require('axios').default;
const dayjs = require('dayjs');
const objectSupport = require('dayjs/plugin/objectSupport');
dayjs.extend(objectSupport);
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: process.env.TZ,
});

const checkDate = require('../helpers/checkDate');

const getDayDetailsFromDatabase = ({ day, month, year }) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM \`${process.env.DB_TABLE_DETAILED_DATA}\` WHERE YEAR( \`timestamp\` ) = ${year} AND MONTH(\`timestamp\`)=${month} AND DAY(\`timestamp\`)=${day}`;
    // console.log(query);

    pool.query(query, (error, results, fields) => {
      if (error) throw error;
      return resolve(results);
    });
  });
};

router.get('/', async (req, res, next) => {
  try {
    if (
      checkDate({
        day: req.query.day,
        month: req.query.month,
        year: req.query.year,
      })
    ) {
      res.status(404).json({ message: 'Provide wrong date.' });
      return;
    }
    const details = await getDayDetailsFromDatabase({
      day: req.query.day,
      month: req.query.month,
      year: req.query.year,
    });

    res.status(200).json(details); // send a json response
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.sendStatus(500);
  }
});

module.exports = router;
