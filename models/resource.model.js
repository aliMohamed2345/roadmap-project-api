import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["video", "article", "course"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource;
