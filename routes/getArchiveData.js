const express = require('express');
const router = express.Router();
const axios = require('axios');
const dayjs = require('dayjs');
const _ = require('lodash');
// const path = require('path');

//   require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

router.get('/StringsCurrentData', async (req, res, next) => {
  const correctDate = dayjs().format('DD.MM.YYYY');

  function lastData(items) {
    let last = 0;

    for (const i in items) {
      if (i > last) last = items[i];
    }

    return last;
  }

  axios
    .get(
      `${process.env.PV_HOST}${process.env.INVERTER_ARCHIVE_DATA_STRINGS_DATA}&StartDate=${correctDate}&EndDate=${correctDate}`,
    )
    .then(async ({ data }) => {
      // handle success

      const responseKeys = [
        'Current_DC_String_1',
        'Current_DC_String_2',
        'Voltage_DC_String_1',
        'Voltage_DC_String_2',
        'Temperature_Powerstage',
      ];
      let response = {};

      responseKeys.map(el => {
        response[el] = lastData(data?.Body?.Data['inverter/1']?.Data[el]?.Values);
      });

      return res.send(response);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

router.get('/PowerRealSum', async (req, res, next) => {
  const channels = [
    // 'Current_DC_String_1',
    // 'Current_DC_String_2',
    // 'Voltage_DC_String_1',
    // 'Voltage_DC_String_2',
    // 'Temperature_Powerstage',
    // 'Voltage_AC_Phase_1',
    // 'Voltage_AC_Phase_2',
    // 'Voltage_AC_Phase_3',
    // 'Current_AC_Phase_1',
    // 'Current_AC_Phase_2',
    // 'Current_AC_Phase_3',
    'PowerReal_PAC_Sum',
    'EnergyReal_WAC_Sum_Produced',
  ];

  const detailedData = {};

  // const dateToFetch = '2021-08-17';
  const dateToFetch = dayjs().format('YYYY-MM-DD');

  // const compressData = [];

  const getAPIURL = () => {
    const correctDate = dayjs(dateToFetch).format('DD.MM.YYYY');
    let result = `${process.env.PV_HOST}solar_api/v1/GetArchiveData.cgi?Scope=System&Channel=PowerReal_PAC_Sum&Channel=EnergyReal_WAC_Sum_Produced&StartDate=${correctDate}&EndDate=${correctDate}`;
    channels.map(e => {
      // console.log(e);

      result += `&Channel=${e}`;
    });
    // console.log(result);

    return result;
  };

  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    // const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs === 0) {
      ret += `00:${mins < 10 ? '0' : ''}`;
    }

    if (hrs > 0) {
      if (hrs < 10) {
        ret += `0${hrs}:${mins < 10 ? '0' : ''}`;
      } else {
        ret += `${hrs}:${mins < 10 ? '0' : ''}`;
      }
    }

    ret += `${mins}`;

    ret = `${dayjs(dateToFetch).format('YYYY-MM-DD ') + ret}:00`;
    return ret;
  }
  class ArchiveReading {
    constructor(date) {
      this.dateString = date;
      // this.Current_DC_String_1 = '';
      // this.Current_DC_String_2 = '';
      // this.Voltage_DC_String_1 = '';
      // this.Voltage_DC_String_2 = '';
      // this.Temperature_Powerstage = '';
      // this.Voltage_AC_Phase_1 = '';
      // this.Voltage_AC_Phase_2 = '';
      // this.Voltage_AC_Phase_3 = '';
      // this.Current_AC_Phase_1 = '';
      // this.Current_AC_Phase_2 = '';
      // this.Current_AC_Phase_3 = '';
      this.PowerReal_PAC_Sum = 0;
      this.EnergyReal_WAC_Sum_Produced = 0;
      // this.Power_String_1 = '';
      // this.Power_String_2 = '';
    }

    createResponseObject() {
      // return `(${
      //   this.PowerReal_PAC_Sum
      // },${this.EnergyReal_WAC_Sum_Produced},'${this.dateString}')`;
      return {
        PowerReal_PAC_Sum: Number(this.PowerReal_PAC_Sum).toFixed(),
        EnergyReal_WAC_Sum_Produced: Number(this.EnergyReal_WAC_Sum_Produced).toFixed(),
        Timestamp: this.dateString,
      };
    }
  }

  axios
    .get(`${getAPIURL()}`)
    .then(async ({ data }) => {
      // console.log(data);

      // handle success
      // console.log(data.Body.Data['inverter/1']);
      // console.log('length', data.length);

      // if (data.length > 0) {

      channels.map((el, i) => {
        detailedData[el] = {
          ...data.Body.Data['inverter/1'].Data[el].Values,
        };

        detailedData[el] = _.mapKeys(detailedData[el], (v, key) =>
          // console.log(key);
          fancyTimeFormat(key),
        );
      });
      // console.log(detailedData);

      // }
    })
    .then(() => {
      const archiveReadingsArray = [];

      // console.log('detailed data', detailedData);

      for (const date in detailedData.PowerReal_PAC_Sum) {
        const reading = new ArchiveReading(date);

        reading.PowerReal_PAC_Sum =
          detailedData.PowerReal_PAC_Sum[date] === undefined
            ? 0
            : detailedData.PowerReal_PAC_Sum[date];
        reading.EnergyReal_WAC_Sum_Produced =
          detailedData.EnergyReal_WAC_Sum_Produced[date] === undefined
            ? 0
            : detailedData.EnergyReal_WAC_Sum_Produced[date];

        archiveReadingsArray.push(reading);
      }

      // const queryParamsList = archiveReadingsArray.map(reading => reading.createResponseObject());
      // // console.log(queryParamsList);
      // writeToDatabase(queryParamsList.join(','));
      res.json(archiveReadingsArray.map(reading => reading.createResponseObject()));
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

module.exports = router;
