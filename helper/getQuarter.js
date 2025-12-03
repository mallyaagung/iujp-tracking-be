const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1; // 1-12
  const year = new Date().getFullYear();

  const quarter = Math.ceil(month / 3);
  let romanQuarter = "";
  if (quarter === 1) {
    romanQuarter = "I";
  } else if (quarter === 2) {
    romanQuarter = "II";
  } else if (quarter === 3) {
    romanQuarter = "III";
  } else if (quarter === 4) {
    romanQuarter = "IV";
  }

  return { year, quarter: romanQuarter };
};

module.exports = getCurrentQuarter;
