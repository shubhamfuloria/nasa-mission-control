const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();

// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found!");
  }
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  console.log("&&&&&& " + newFlightNumber + " &&&&&&");

  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ["Zero to Mastery", "NASA"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
}

async function launchExistsWithId(launchId) {
  return launches.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
  // return Array.from(launches.values());
  return await launches.find({}, { _id: false, __v: false });
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    { upcomin: false, success: false }
  );

  return aborted.acknowledged && aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  launchExistsWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
