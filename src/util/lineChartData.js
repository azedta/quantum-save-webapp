// src/util/lineChartData.js

const parseYMD = (dateString) => {
  const [ymd] = String(dateString).split('T');
  const [yearStr, monthStr, dayStr] = ymd.split('-');
  return { year: Number(yearStr), month: Number(monthStr), day: Number(dayStr) };
};

const getOrdinal = (n) => {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const prepareIncomeLineChartData = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  const withDate = transactions.filter((tx) => tx && tx.date);
  if (withDate.length === 0) return [];

  // ✅ pick most recent month in the data (stable even if array is unsorted)
  const mostRecent = withDate.reduce((latest, tx) => {
    const d = parseYMD(tx.date);
    const key = d.year * 10000 + d.month * 100 + d.day;
    if (!latest) return { ...d, key };
    return key > latest.key ? { ...d, key } : latest;
  }, null);

  const targetYear = mostRecent.year;
  const targetMonth = mostRecent.month;

  const grouped = {};

  for (const tx of withDate) {
    const { year, month, day } = parseYMD(tx.date);
    if (year !== targetYear || month !== targetMonth) continue;

    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const amount = Number(tx.amount) || 0;

    if (!grouped[key]) {
      grouped[key] = { date: key, totalAmount: 0, items: [], _day: day, _month: month };
    }

    grouped[key].totalAmount += amount;
    grouped[key].items.push(tx);
  }

  return Object.values(grouped)
    .map((entry) => {
      const day = entry._day;
      const monthIdx = entry._month - 1;
      const monthName = MONTH_SHORT[monthIdx] || '';

      // optional: sort tooltip items by amount desc (or by time if you have it)
      const itemsSorted = [...entry.items].sort(
        (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0),
      );

      return {
        date: entry.date,
        totalAmount: entry.totalAmount,
        items: itemsSorted,
        month: `${day}${getOrdinal(day)} ${monthName}`,
      };
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
};
