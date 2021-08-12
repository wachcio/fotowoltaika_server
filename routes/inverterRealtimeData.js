const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/CommonInverterData', async (req, res, next) => {
  axios
    .get(
      // `${process.env.API_HOST}inverterRealtimeData/CommonInverterData`,
      `${process.env.PV_HOST}${process.env.INVERTER_REALTIME_DATA_CID}`,
    )
    .then(async ({ data }) => {
      // handle success
      // console.log(data.Body.Data.DAY_ENERGY);

      return res.send(data);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

// router.get('/3PInverterData', async (req, res, next) => {
//   res.json({
//     Body: {
//       Data: {
//         IAC_L1: {
//           Unit: 'A',
//           Value: 2.23,
//         },
//         IAC_L2: {
//           Unit: 'A',
//           Value: 2.3300000000000001,
//         },
//         IAC_L3: {
//           Unit: 'A',
//           Value: 2.3399999999999999,
//         },
//         UAC_L1: {
//           Unit: 'V',
//           Value: 238.40000000000001,
//         },
//         UAC_L2: {
//           Unit: 'V',
//           Value: 235.40000000000001,
//         },
//         UAC_L3: {
//           Unit: 'V',
//           Value: 237,
//         },
//       },
//     },
//     Head: {
//       RequestArguments: {
//         DataCollection: '3PInverterData',
//         DeviceClass: 'Inverter',
//         DeviceId: '1',
//         Scope: 'Device',
//       },
//       Status: {
//         Code: 0,
//         Reason: '',
//         UserMessage: '',
//       },
//       Timestamp: '2021-08-08T10:36:02+02:00',
//     },
//   });
// });
router.get('/3PInverterData', async (req, res, next) => {
  axios
    .get(`${process.env.PV_HOST}${process.env.INVERTER_REALTIME_DATA_3PID}`)
    .then(async ({ data }) => {
      // handle success

      return res.send(data);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

router.get('/MinMaxInverterData', async (req, res, next) => {
  // console.log(`${process.env.PV_HOST}${process.env.INVERTER_REALTIME_DATA_3PID}`);

  axios
    .get(
      `${process.env.PV_HOST}${process.env.INVERTER_REALTIME_DATA_MMID}`,
      // `http://192.168.2.10/${process.env.INVERTER_REALTIME_DATA_3PID}`,
    )
    .then(async ({ data }) => {
      // handle success
      // console.log(data.Body.Data.DAY_ENERGY);

      return res.send(data);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = router;
