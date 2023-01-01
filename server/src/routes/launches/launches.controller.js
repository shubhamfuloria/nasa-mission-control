const {
  getAllLaunches,
  addNewLaunch,
  launchExistsWithId,
  abortLaunchById,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res
      .status(400)
      .json({ error: "Missing Required Properties of mission" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid Launch Date" });
  }
  addNewLaunch(launch);

  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  console.log(launchId);
  if (!launchExistsWithId(launchId)) {
    return res.status(400).json({
      error: "launch doesn't exist with id",
    });
  } else {
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
