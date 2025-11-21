import mongoose from "mongoose";


const roadmapSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }]

}, { timestamps: true })




const Roadmap = mongoose.model('Roadmap', roadmapSchema)

export default Roadmap;