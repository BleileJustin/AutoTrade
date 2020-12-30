//Period/Time Parameters
const time = {
  period: 24,
  t0: moment()
    .subtract(2, "days")
    .toDate(),
  t1: moment()
    .subtract(1, "days")
    .toDate(),
  t2: moment().toDate()
  /*moment()
    .subtract(1, "days")
    .add(6, "hours")
    .toDate()*/
};

const range = await Price.getRangeOfPrices({
  start: time.t0,
  end: time.t2
});
const bol = await Price.getBollinger({
  range: range,
  start: time.t0,
  period: time.period,
  end: time.t2
});
const highLine = bol[0].upper;
const getHighRange = await Analytics.getHighRange({ bol, range });
const getMidLine = bol[0].middle;
const getLowRange = await Analytics.getLowRange({ bol, range });
const getLowLine = bol[0].lower;

console.log(`
highLine: ${highLine}
highRange: ${getHighRange.length}
midLine: ${getMidLine}
lowRange: ${getLowRange.length}
lowLine: ${getLowLine}

  `);
