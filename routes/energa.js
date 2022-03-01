const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  let response = await axios
    // .get(
    //   'https://mojlicznik.energa-operator.pl/dp/resources/chart?mainChartDate=1635721200000&type=DAY&meterPoint=12870754&mo=A%2B',
    // )
    .post('https://mojlicznik.energa-operator.pl/dp/UserLogin.do', {
      selectedForm: 1,
      save: 'save',
      _antixsrf: 'd491f96f-8705-4028-9e10-e951f2bc0488',
      clientOS: 'web',
      j_username: '',
      j_password: '',
      rememberMe: 'on',
      loginNow: 'zaloguj się',
    });
  console.log(response);

  res.send(response);
});

module.exports = router;
