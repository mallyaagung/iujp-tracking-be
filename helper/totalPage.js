const totalPage = (totalData, dataPerPage = 10) => {
  if (!totalData) return 0;
  return Math.ceil(totalData / dataPerPage);
};

module.exports = totalPage;
