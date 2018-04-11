const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL);

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    oAuth: String,
    role: String,
    location: {
        address: String,
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location"
        }
    }
});

const JobSchema = mongoose.Schema({
    title: String,
    description: String,
    locations: [{
        address: String,
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location"
        }
    }]
});

const LocationSchema = mongoose.Schema({
    category: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    details: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [{
            type: Number,
            required: "You must supply coordinates!"
        }],
        address: {
            type: String,
            required: "You must supply an address!"
        }
    }
})

LocationSchema.index({ loc: "2dsphere" })


const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Location = mongoose.model('Location', LocationSchema)

exports.User = User;
exports.Job = Job;
exports.Location = Location