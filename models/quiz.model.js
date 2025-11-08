import mongoose from "mongoose";



const quizSchema = mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]

}, { timestamps: true })



const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz