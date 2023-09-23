const mongoose = require('mongoose');

// const MONGO_URL = "mongodb+srv://nasa-api:WWCxnJabwLZ1hGxW@nasacluster.pfmeoya.mongodb.net/nasa?retryWrites=true&w=majority&ssl=true";
const MONGO_URL = "mongodb://nasa-api:WWCxnJabwLZ1hGxW@ac-v8nvduv-shard-00-00.pfmeoya.mongodb.net:27017,ac-v8nvduv-shard-00-01.pfmeoya.mongodb.net:27017,ac-v8nvduv-shard-00-02.pfmeoya.mongodb.net:27017/nasa?ssl=true&replicaSet=atlas-sfmhif-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};