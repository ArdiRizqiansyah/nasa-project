const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

// let latestFlightNumber = 100;

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function existsLaunchWithId(launchId){
    return await launchesDatabase.findOne({
      flightNumber: launchId,
    });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
        .findOne({})
        .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(){
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error("No matching planet found");
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["Zero to Mastery", "NASA"],
      flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', 'NASA'],
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    scheduleNewLaunch,
    abortLaunchById,
};