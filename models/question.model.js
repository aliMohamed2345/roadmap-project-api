import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
    question: { type: String, require: true },
    answer: { type: String, require: true },
    options: {
        type: [String],
        required: true,
    },
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
}, { timestamps: true })


const Question = mongoose.model('Question', questionSchema);

export default Question