require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Insight = require("./models/Insight");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error(error));

app.get("/", (req, res) => {
    res.json({
        message: "BlackCoffer Dashboard API is running",
    });
});

app.get("/api/insights", async (req, res) => {
    try {
        const allowedFilters = [
            "end_year",
            "topic",
            "sector",
            "region",
            "pestle",
            "source",
            "country",
            "city",
            "swot",
        ];

        const query = {};

        allowedFilters.forEach((field) => {
            if (req.query[field]) {
                query[field] = req.query[field];
            }
        });

        const insights = await Insight.find(query);

        res.json({
            success: true,
            count: insights.length,
            data: insights,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.get("/api/filters", async (req, res) => {
    try {
        const fields = [
            "end_year",
            "topic",
            "sector",
            "region",
            "pestle",
            "source",
            "country",
            "city",
            "swot",
        ];

        const results = await Promise.all(
            fields.map((field) => Insight.distinct(field))
        );

        const filters = {};

        fields.forEach((field, index) => {
            filters[field] = results[index]
                .filter((value) => value !== "" && value != null)
                .sort();
        });

        res.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});