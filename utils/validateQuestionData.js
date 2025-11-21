export const validateQuestionData = (question, answer, options) => {
    if (question) {
        if (!question || typeof question !== "string" || question.trim().length < 5)
            return { isValid: false, message: "Question must be a valid text with at least 5 characters." };
    }

    if (answer) {
        if (!answer || typeof answer !== "string" || !answer.trim())
            return { isValid: false, message: "Answer is required and must be a valid string." };
    }
    if (options) {
        if (!options || !Array.isArray(options))
            return { isValid: false, message: "Options must be an array." };

        if (options.length !== 4) return { isValid: false, message: "Each question must have 4 options with the answer" };

        // Check for duplicate options
        const uniqueOptions = new Set(options.map(o => o.trim().toLowerCase()));
        if (uniqueOptions.size !== options.length)
            return { isValid: false, message: "Options must be unique." };
    }



    return { isValid: true, message: "Valid question data." };
};

export const validateQuizData = (title, description, rank) => {
    const allRanks = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"]

    if (!title || !description)
        return { isValid: false, message: 'Title and description are required.' };

    if (!rank) return { isValid: false, message: "Ranks is required." }

    if (!allRanks.includes(rank))
        return { isValid: false, message: `Rank must be one of following: ${allRanks.join(', ')}` }

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 5 || wordCount > 50)
        return { isValid: false, message: 'Description must be between 5 and 50 words.' };

    return { isValid: true, message: "" };
}