//if pass 0 as limit mongo will return all
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

  const skip = limit * (page - 1);

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
