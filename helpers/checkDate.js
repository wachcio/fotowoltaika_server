const dayjs = require('dayjs');
const objectSupport = require('dayjs/plugin/objectSupport');
dayjs.extend(objectSupport);

const checkDate = ({ year, month, day }) => {
  month--;

  return (
    !dayjs({ year, month, day }).isValid() ||
    !day ||
    !month ||
    !year ||
    day <= 0 ||
    month <= 0 ||
    year < 2021 ||
    dayjs(new Date()).diff({
      year,
      month,
      day,
    }) < 0
  );
};
module.exports = checkDate;
