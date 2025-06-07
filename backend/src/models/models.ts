import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    leetcode_uname: {
        type: String,
        unique: true
    },
    codeforces_uname: {
        type: String,
        unique: true
    },
    codechef_uname: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    bookmarked: [{type: mongoose.Schema.Types.ObjectId, ref: "Contests"}]
})
const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    platform : {
        type: String,
        enum: ["leetcode", "codeforces","codechef"],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    }
},{toJSON:{virtuals: true},toObject:{virtuals:true}});
contestSchema.virtual("expired").get(function(){
    return Date.now()>=this.start_date.getTime()+this.duration;
});
contestSchema.virtual("time_left").get(function () {
    const remainingTime = this.start_date.getTime() + this.duration - Date.now();
    return remainingTime > 0 ? remainingTime : 0;
});
const leetcodeSchema = new mongoose.Schema({
    uname: {
        type: String,
        ref: "Users",
        required: true
    },
    contests_attended : [{
        attended: { type: Boolean, required: true },
        problemsSolved: { type: Number, required: true },
        totalProblems: { type: Number, required: true },
        finishTimeInSeconds: { type: Number, required: true },
        rating: { type: Number, required: true },
        ranking: { type: Number, required: true },
        contest: {
            title: { type: String, required: true },
            startTime: { type: Number, required: true } // UNIX timestamp
        }
    }],
    upcoming_contests : [{type: mongoose.Schema.Types.ObjectId, ref:"Contests"}],
    rating: {
        type: Number,
        trim: true
    }
})
const codechefSchema = new mongoose.Schema({
    uname: {
        type: String,
        ref: "Users",
        required: true
    },
    contests_attended : [{type: mongoose.Schema.Types.ObjectId, ref:"Contests"}],
    upcoming_contests : [{type: mongoose.Schema.Types.ObjectId, ref:"Contests"}],
    rating: {
        type: Number,
        trim: true
    }
})
const codeforcesSchema = new mongoose.Schema({
    uname: {
        type: String,
        ref: "Users",
        required: true
    },
    contests_attended : [{type: mongoose.Schema.Types.ObjectId, ref:"Contests"}],
    upcoming_contests : [{type: mongoose.Schema.Types.ObjectId, ref:"Contests"}],
    rating: {
        type: Number,
        trim: true
    }
});

const userModel = mongoose.model("Users",userSchema,"Users");
const leetcodeModel = mongoose.model("Leetcode",leetcodeSchema,"Leetcode");
const contestModel = mongoose.model("Contests",contestSchema,"Contests");
const codeforcesModel = mongoose.model("Codeforces",codeforcesSchema,"Codeforces");
const codechefModel = mongoose.model("Codechef",codechefSchema,"Codechef");

export {
    userModel,
    leetcodeModel,
    contestModel,
    codechefModel,
    codeforcesModel
};