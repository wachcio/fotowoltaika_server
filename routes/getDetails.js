const express = require('express');
const router = express.Router();

const path = require('path');

// require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const axios = require('axios').default;
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const getDetailsFromDatabase = (day, month, year) => {
  return new Promise((resolve, reject) => {
    //   let res = null;
    //   connection.connect();
    const query = `SELECT * FROM \`${process.env.DB_TABLE_TOTAL_PRODUCTION}\` WHERE YEAR( \`timestamp\` ) = ${year} AND MONTH(\`timestamp\`)=${month} AND DAY(\`timestamp\`)=${day}`;

    pool.query(
      query,
      (error, results, fields) => {
        if (error) throw error;
        // console.log('results', results);
        return resolve(results);
        // res = results;
      },
      // });

      //   res = connection.query(query);

      //   connection.end();
      //   return res;
      // })
    );
  });
};

/* GET home page. */
// router.get(
//   '/',
//     //   console.log(await getDetailsFromDatabase(05, 08, 2021));
//     const details = await getDetailsFromDatabase(05, 08, 2021);

//     res.json(details);
//     //   res.send(await getDetailsFromDatabase(05, 08, 2021));
//   }),
// );

router.get('/', async (req, res, next) => {
  try {
    const details = await getDetailsFromDatabase(05, 08, 2021);
    res.status(200).json(details); // send a json response
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.sendStatus(500);
  }
});

module.exports = router;
