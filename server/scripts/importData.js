require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Insight = require("../models/Insight");

async function importData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        const filePath = path.join(
            __dirname,
            "../data/jsondata.json"
        );

        const data = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        await Insight.deleteMany({});
        await Insight.insertMany(data);

        console.log(`${data.length} documents imported successfully`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

importData();