import express from "express";
import {
    getAllRoadmapData,
    getSpecificRoadmap,
    createRoadmap,
    deleteRoadmap,
    updateRoadmap,
    createSection,
    getSectionData,
    updateSection,
    deleteSection,
    createResource,
    updateResource,
    getSpecificResource,
    deleteResource,
    toggleCompletionSection,
    getUserRoadmapProgress,
    getAllRoadmapSections,
    getAllSectionResources
} from "../controllers/roadmap.controllers.js";
import { isAdmin, isIdValid, verifyToken } from "../middleware/middlewares.js";

const router = express.Router()

//Roadmap
router.get("/", getAllRoadmapData)

router.post('/', verifyToken, isAdmin, createRoadmap)

router.route("/:id")
    .get(isIdValid, getSpecificRoadmap)
    .delete(isIdValid, verifyToken, isAdmin, deleteRoadmap)
    .put(isIdValid, verifyToken, isAdmin, updateRoadmap)

router.get('/:id/progress', isIdValid, verifyToken, getUserRoadmapProgress)

//Sections 
router.route('/:id/sections')
    .get(isIdValid, getAllRoadmapSections)
    .post(isIdValid, verifyToken, isAdmin, createSection)

router.route('/:id/sections/:sectionId')
    .get(isIdValid, getSectionData)
    .put(isIdValid, verifyToken, isAdmin, updateSection)
    .delete(isIdValid, verifyToken, isAdmin, deleteSection)

router.post('/:id/sections/:sectionId/complete', isIdValid, verifyToken, toggleCompletionSection)

//Resources
router.route('/:id/sections/:sectionId/resources')
    .post(isIdValid, verifyToken, isAdmin, createResource)
    .get(isIdValid, getAllSectionResources)

router.route('/:id/sections/:sectionId/resources/:resourceId')
    .put(isIdValid, verifyToken, isAdmin, updateResource)
    .delete(isIdValid, verifyToken, isAdmin, deleteResource)
    .get(isIdValid, getSpecificResource)

export default router
