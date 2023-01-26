const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 100, //flight_number
//   mission: "Kepler Exploration X", //name
//   rocket: "Explorer IS1", //rocket.name
//   launchDate: new Date("December 27, 2030"), //date_local
//   target: "Kepler-442 b", //not aplicable
//   customers: ["ZTM", "NASA"], //payload.customers for each customer
//   upcoming: true, //upcoming
//   success: true, //success
// };

// saveLaunch(launch);

async function saveLaunch(launch) {
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
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found!");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ["Zero to Mastery", "NASA"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}
async function launchExistsWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launches
    .find({}, { _id: false, __v: false })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.acknowledged && aborted.modifiedCount === 1;
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Failed downloading launch data");
    throw new Error("Something went wrong with SpaceX API");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  console.log("Downloading data from spaceX");

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    misssion: "FalconSat",
  });

  if (firstLaunch) {
    console.log("launch data was already loaded");
    return;
  } else {
    await populateLaunches();
  }
}

module.exports = {
  getAllLaunches,
  launchExistsWithId,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchData,
};
