export const validateRoadmapData = (title, description) => {
    if (!title || !description) return { isValid: false, message: "Title and description are required." }

    if (typeof title !== "string") return { isValid: false, message: "Title must be a string." }
    if (title.trim().length > 100) return { isValid, message: "Title must be less than 100 characters." }
    if (title.trim().length < 3) return { isValid, message: "Title must be more than 3 characters." }


    if (typeof description !== "string") return { isValid: false, message: "Description must be a string." }
    if (description.trim().length < 10) { return { isValid: false, message: "Description must be at least 10 characters long." }; }
    if (description.trim().length > 1000) { return { isValid: false, message: "Description cannot exceed 1000 characters." }; }

    return { isValid: true, message: "" }
}
export const validateSectionData = (title, description, difficulty) => {
    const allDifficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();
    const trimmedDifficulty = difficulty?.trim();

    if (!trimmedTitle) return { isValid: false, message: "title is required." };

    if (trimmedTitle.length < 3)
        return { isValid: false, message: "Title must be at least 3 characters long." };

    if (trimmedTitle.length > 100)
        return { isValid: false, message: "Title cannot exceed 100 characters." };

    if (/^\d+$/.test(trimmedTitle))
        return { isValid: false, message: "Title cannot contain numbers only." };

    if (!trimmedDescription)
        return { isValid: false, message: "description is required." };

    if (trimmedDescription.length < 10)
        return {
            isValid: false,
            message: "Description must be at least 10 characters long."
        };

    if (trimmedDescription.length > 1000)
        return {
            isValid: false,
            message: "Description cannot exceed 1000 characters."
        };


    if (!trimmedDifficulty)
        return { isValid: false, message: "difficulty is required." };

    const difficultyNormalized = trimmedDifficulty.charAt(0).toUpperCase() + trimmedDifficulty.slice(1).toLowerCase();

    if (!allDifficulties.includes(difficultyNormalized))
        return {
            isValid: false,
            message: `Difficulty must be one of: ${allDifficulties.join(", ")}`
        };

    return { isValid: true, message: "" };
};

export const validateResourceData = (url, title, type) => {

    // Trim values to avoid accidental spaces
    url = url?.trim();
    title = title?.trim();
    type = type?.trim();

    // Required fields
    if (!url) return { isValid: false, message: "URL is required" };
    if (!title) return { isValid: false, message: "Title is required" };
    if (!type) return { isValid: false, message: "Type is required" };

    // Validate type
    const validTypes = ["video", "article", "course"];
    if (!validTypes.includes(type)) {
        return { 
            isValid: false, 
            message: `Type must be one of: ${validTypes.join(", ")}` 
        };
    }

    // Validate URL format (simple regex)
    const urlRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;
    if (!urlRegex.test(url)) {
        return { isValid: false, message: "Invalid URL format" };
    }

    //Title length check
    if (title.length < 3) {
        return { isValid: false, message: "Title must be at least 3 characters long" };
    }
    if (title.length > 150) {
        return { isValid: false, message: "Title cannot exceed 150 characters" };
    }

    //Optional special check for video type
    if (type === "video") {
        const isYouTubeLink = url.includes("youtube.com") || url.includes("youtu.be");
        if (!isYouTubeLink) {
            return { 
                isValid: false, 
                message: "Video resources must be valid YouTube links" 
            };
        }
    }

    return { isValid: true, message: "" };
};