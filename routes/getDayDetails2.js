const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const objectSupport = require('dayjs/plugin/objectSupport');
dayjs.extend(objectSupport);
const mysql = require('mysql');

const connection = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: process.env.TZ,
  // debug: true,
});
let connectionResult;

const checkDate = require('../helpers/checkDate');

const getDayDetailsFromDatabase = ({ day, month, year }) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM \`${process.env.DB_TABLE_DETAILED_DATA}\` WHERE YEAR( \`timestamp\` ) = ${year} AND MONTH(\`timestamp\`)=${month} AND DAY(\`timestamp\`)=${day}`;

    connection.connect();

    connection.query(query, function (error, results, fields) {
      if (error) throw error;

      connectionResult = results;
      connection.end();
      return resolve();
    });

    // return conn;
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
    await getDayDetailsFromDatabase({
      day: req.query.day,
      month: req.query.month,
      year: req.query.year,
    });

    res.status(200).json(connectionResult);
    // res.status(200).json({ test: 'test' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
