const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/CommonInverterData', async (req, res, next) => {
  // console.log(process.env.PV_HOST + process.env.INVERTER_REALTIME_DATA_CID);
  // res.status(200).json(async () => {
  //   console.log(await axios.get(process.env.PV_HOST + process.env.INVERTER_REALTIME_DATA_CID));

  //   return await axios.get(process.env.PV_HOST + process.env.INVERTER_REALTIME_DATA_CID);

  //   return res.json(res2);
  // }); // send a json response

  axios
    .get(
      // `${process.env.API_HOST}inverterRealtimeData/CommonInverterData`,
      `${process.env.PV_HOST}/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DeviceId=1&DataCollection=CommonInverterData`,
    )
    .then(async ({ data }) => {
      // handle success
      console.log(data.Body.Data.DAY_ENERGY);

      return res.send(data);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = router;
