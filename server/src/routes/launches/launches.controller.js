const {
  getAllLaunches,
  launchExistsWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const launchExists = await launchExistsWithId(launchId);
  if (!launchExists) {
    return res.status(404).json({
      error: "launch doesn't exist with id",
    });
  } else {
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: "launch not aborted",
      });
    }
    return res.status(200).json({ ok: aborted });
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
