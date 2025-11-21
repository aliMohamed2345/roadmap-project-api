import Roadmap from './../models/roadmap.model.js'
import Section from '../models/section.model.js'
import Resource from '../models/resource.model.js'
import User from '../models/user.model.js'
import { validateResourceData, validateRoadmapData, validateSectionData } from '../utils/validateRoadmapData.js'
import mongoose from 'mongoose'

export const getAllRoadmapData = async (req, res) => {
    try {
        const roadmap = await Roadmap.find().select('-section')
        if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" })
        if (roadmap.length === 0) return res.status(200).json({ success: false, message: "No roadmap available. Please add a new one." })

        return res.status(200).json({ success: true, roadmap });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserRoadmapProgress = async (req, res) => {
    try {
        const { id: userId } = req.user
        const { id: roadmapId } = req.params

        // Fetch roadmap with all sections
        const roadmap = await Roadmap.findById(roadmapId).populate('sections');
        if (!roadmap) {
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get user's progress for this roadmap
        let progress = user.progressData.roadmap.find(e =>
            e.roadmap.toString() === roadmapId
        );

        // If no progress, initialize
        if (!progress) {
            progress = {
                roadmap: roadmap._id,
                completedSections: [],
                numberOfAllSections: roadmap.sections.length
            };
        }

        // Prepare detailed completed sections
        const completedSections = roadmap.sections.map(section => ({
            _id: section._id,
            title: section.title,
            description: section.description,
            completed: progress.completedSections.some(
                id => id.toString() === section._id.toString()
            )
        }));

        // Calculate total and completed
        const total = roadmap.sections.length;
        const completed = completedSections.filter(s => s.completed).length;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return res.status(200).json({
            success: true,
            roadmap: {
                _id: roadmap._id,
                title: roadmap.title,
                description: roadmap.description
            },
            sections: completedSections,
            total,
            completed,
            progressPercentage
        });

    } catch (error) {
        console.error("Get User Roadmap Progress Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAllRoadmapSections = async (req, res) => {
    try {
        const { id: roadmapId } = req.params;

        const sections = await Section.find({ roadmapId }).populate('resources');
        if (!sections) return res.status(404).json({ success: false, message: "Sections not found" })

        if (sections.length === 0) return res.status(200).json({ success: false, message: "No sections available. Please add a new one." })

        return res.status(200).json({ success: true, sections })
    } catch (error) {
        console.error("Get User Roadmap Progress Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getSpecificRoadmap = async (req, res) => {
    try {
        const { id } = req.params

        const roadmap = await Roadmap.findById(id).populate('sections', 'title');
        if (!roadmap) return res.status(400).json({ success: false, message: "Roadmap not found" })

        return res.status(200).json({ success: true, roadmap });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const createRoadmap = async (req, res) => {
    try {
        const { title, description } = req.body

        const { isValid, message } = validateRoadmapData(title, description)
        if (!isValid) return res.status(400).json({ success: false, message })

        const roadmap = await Roadmap.create({ title, description })

        return res.status(201).json({ success: true, message: "Roadmap created successfully", roadmap });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateRoadmap = async (req, res) => {
    try {
        const { id } = req.params

        const { title, description } = req.body;

        const { isValid, message } = validateRoadmapData(title, description)
        if (!isValid) return res.status(400).json({ success: false, message })

        const roadmap = await Roadmap.findByIdAndUpdate(id, { title, description }, { new: true });

        if (!roadmap) return res.status(404).json({ success: false, message: "Roadmap not found" })

        return res.status(200).json({ success: true, message: "Roadmap updated successfully", roadmap });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the roadmap
        const roadmap = await Roadmap.findByIdAndDelete(id);
        if (!roadmap) {
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }

        // Find all sections of this roadmap
        const sections = await Section.find({ roadmapId: id });

        // Extract section IDs
        const sectionIds = sections.map(sec => sec._id);

        // Delete all resources related to these sections
        const resources = await Resource.deleteMany({ sectionId: { $in: sectionIds } });

        //checking the existence of the resources
        if (!resources) return res.status(404).json({ success: false, message: "Resources not found" });

        // Delete all sections related to the roadmap
        const section = await Section.deleteMany({ roadmapId: id });

        //checking the existence of the sections
        if (!section) return res.status(404).json({ success: false, message: "Sections not found" });

        // Remove roadmap from all users' progress data
        await User.updateMany(
            {},
            { $pull: { "progressData.roadmap": id } }
        );

        return res.status(200).json({
            success: true,
            message: "Roadmap, related sections, and resources deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export const createSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, difficulty } = req.body

        //validate the user input 
        const { isValid, message } = validateSectionData(title, description, difficulty)
        if (!isValid) return res.status(400).json({ success: false, message })

        //checking if the roadmap exist 
        const isRoadmapExist = await Roadmap.findById(id).lean()
        if (!isRoadmapExist) return res.status(404).json({ success: false, message: `Roadmap not found` })

        //checking if the section exist
        const isSectionExist = await Section.findOne({ title, roadmapId: id }).lean()
        if (isSectionExist) return res.status(400).json({ success: false, message: `Section already exist` })

        const section = await Section.create({ title, description, difficulty, roadmapId: id })
        await Roadmap.findByIdAndUpdate(id, { $push: { sections: section._id } }, { new: true });

        return res.status(201).json({ success: true, message: "Section created successfully", section });


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getSectionData = async (req, res) => {
    try {
        const { sectionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sectionId))
            return res.status(400).json({ success: false, message: "Invalid sectionId" });

        const section = await Section.findById(sectionId).populate('resources', 'title url type').lean();
        if (!section)
            return res.status(404).json({ success: false, message: "Section not found" });

        return res.status(200).json({ success: true, section });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { title, description, difficulty } = req.body

        if (!mongoose.Types.ObjectId.isValid(sectionId)) return res.status(400).json({ success: false, message: 'Invalid sectionId' });

        //validate the user input 
        const { isValid, message } = validateSectionData(title, description, difficulty)
        if (!isValid) return res.status(400).json({ success: false, message })


        const updatedSection = await Section.findByIdAndUpdate(sectionId, { title, description, difficulty }, { new: true })
        return res.status(200).json({ success: true, message: "Section updated successfully", updatedSection });


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({ success: false, message: 'Invalid sectionId' });
        }

        // Check if section exists
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        // Delete all resources related to this section
        const resources = await Resource.deleteMany({ sectionId });

        //checking the existence of the resources
        if (!resources) return res.status(404).json({ success: false, message: "Resources not found" });

        // Delete the section
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: "Section and related resources deleted successfully"
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleCompletionSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const userId = req.user.id;

        //  Validate section exists
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        //  Validate roadmap exists
        const roadmap = await Roadmap.findById(section.roadmapId).populate('sections');
        if (!roadmap) {
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }

        const user = await User.findById(userId);

        // Find user's progress for this roadmap
        let progress = user.progressData.roadmap.find(e =>
            e.roadmap.toString() === roadmap._id.toString()
        );

        // If user has no progress entry, create it
        if (!progress) {
            progress = {
                roadmap: roadmap._id,
                completedSections: [],
                numberOfAllSections: roadmap.sections.length
            };
            user.progressData.roadmap.push(progress);
        }

        // Toggle completion
        const isAlreadyCompleted = progress.completedSections.some(
            id => id.toString() === sectionId.toString()
        );

        if (isAlreadyCompleted) {
            // Remove section from completed list
            progress.completedSections = progress.completedSections.filter(
                id => id.toString() !== sectionId.toString()
            );
        } else {
            // Add section to completed list
            progress.completedSections.push(sectionId);
        }

        // 7. Save user progress
        await user.save();

        return res.status(200).json({
            success: true,
            message: isAlreadyCompleted
                ? "Section marked as incomplete"
                : "Section marked as complete",
            progress: {
                completed: progress.completedSections.length,
                total: progress.numberOfAllSections,
                roadmapId: roadmap._id
            }
        });

    } catch (error) {
        console.error("Toggle Section Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const createResource = async (req, res) => {
    try {
        const { sectionId } = req.params
        const { url, title, type } = req.body

        const { isValid, message } = validateResourceData(url, title, type)
        if (!isValid) return res.status(400).json({ success: false, message })

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ success: false, message: `Section not found` })


        const resource = await Resource.create({ url, title, type, sectionId });

        await Section.findByIdAndUpdate(sectionId, { $push : { resources: resource._id } }, { new: true });
        return res.status(201).json({ success: true, message: "Resource created successfully", resource });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllSectionResources = async (req, res) => {
    try {
        const { sectionId } = req.params;

        const resources = await Resource.find({ sectionId });
        if (!resources) return res.status(404).json({ success: false, message: `Resources not found` })

        if (resources.length === 0) return res.status(200).json({ success: false, message: `No resources available.Please add a new one` })

        return res.status(200).json({ success: true, resources });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateResource = async (req, res) => {
    try {
        const { url, title, type } = req.body
        const { resourceId } = req.params

        // validate the resourceId
        if (!mongoose.Types.ObjectId.isValid(resourceId)) return res.status(400).json({ success: false, message: 'Invalid resourceId' });

        //validate the user input
        const { isValid, message } = validateResourceData(url, title, type)
        if (!isValid) return res.status(400).json({ success: false, message })

        const updatedResource = await Resource.findByIdAndUpdate(resourceId, { url, title, type }, { new: true })

        if (!updatedResource) return res.status(404).json({ success: false, message: "Resource not found" })

        return res.status(200).json({ success: true, message: "Resource updated successfully", updatedResource });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export const getSpecificResource = async (req, res) => {
    try {
        const { resourceId } = req.params

        // validate the resourceId
        if (!mongoose.Types.ObjectId.isValid(resourceId)) return res.status(400).json({ success: false, message: 'Invalid resourceId' });

        //get the resource by id
        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ success: false, message: "Resource not found" })

        return res.status(200).json({ success: true, resource });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteResource = async (req, res) => {
    try {
        const { resourceId } = req.params

        // validate the resourceId
        if (!mongoose.Types.ObjectId.isValid(resourceId)) return res.status(400).json({ success: false, message: 'Invalid resourceId' });

        const resource = await Resource.findByIdAndDelete(resourceId);
        if (!resource) return res.status(404).json({ success: false, message: "Resource not found" })

        return res.status(200).json({ success: true, message: "Resource deleted successfully" })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}