const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    admissions: {
        type: String,
        default: "0.0"
    },
    city: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    degree: {
        type: String,
        required: true
    },
    discipline: {
        type: String,
        required: true
    },
    fee: {
        type: Number
    },
    id: {
        type: String,
        required: true
    },
    info: {
        type: String
    },
    key: {
        type: Number
    },
    logo: {
        type: String
    },
    merit: {
        type: Number
    },
    province: {
        type: String,
        required: true
    },
    ranking: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    web: {
        type: String
    },
    deadline: {
        type: String
    },
    admission: {
        type: String
    },
    map: {
        address: String,
        lat: Number,
        location: String,
        long: Number
    }
}, {
    timestamps: true
});

// Indexes for better performance
UniversitySchema.index({ city: 1 });
UniversitySchema.index({ province: 1 });
UniversitySchema.index({ discipline: 1 });
UniversitySchema.index({ degree: 1 });
UniversitySchema.index({ title: "text" });
UniversitySchema.index({ ranking: 1 });
UniversitySchema.index({ merit: -1 });
// Compound index for common queries
UniversitySchema.index({ ranking: 1, merit: -1 });
// Compound index for discipline queries
UniversitySchema.index({ discipline: 1, ranking: 1 });

module.exports = mongoose.model('University', UniversitySchema);
