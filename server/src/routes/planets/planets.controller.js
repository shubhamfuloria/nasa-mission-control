const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  //express sets status code automatically
  // so no need to set status code explicitely here

  //return : to make sure function stops executing when we set status
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
