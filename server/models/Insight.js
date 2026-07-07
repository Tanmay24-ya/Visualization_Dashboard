const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
    {
        end_year: mongoose.Schema.Types.Mixed,
        intensity: Number,
        sector: String,
        topic: String,
        insight: String,
        url: String,
        region: String,
        start_year: mongoose.Schema.Types.Mixed,
        impact: mongoose.Schema.Types.Mixed,
        added: String,
        published: String,
        country: String,
        relevance: Number,
        pestle: String,
        source: String,
        title: String,
        likelihood: Number,
        city: String,
        swot: String,
    },
    {
        strict: false,
    }
);

module.exports = mongoose.model("Insight", insightSchema);