import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes any leading/trailing whitespace
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username cannot be longer than 50 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    imageURL: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    bio: {
        type: String,
        default: "No Bio Yet "
    },
    progressData: {
        roadmap: [{
            roadmap: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Roadmap",
            }
        }],
        quiz: [{
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
            }
        }]
    }
}, { timestamps: true })
const User = mongoose.model("User", userSchema);


export default User;