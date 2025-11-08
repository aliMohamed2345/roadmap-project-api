import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    roadmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap'
    },
    resources: [{
        url: {
            type: String,
            require: true
        },
        type: {
            type: String,
            enum: ["video", "article", "course"]
        }
    }],
    isCompleted: { type: Boolean, default: false },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
    }
}, { timestamps: true })


const Section = mongoose.model('Section', sectionSchema);

export default Section