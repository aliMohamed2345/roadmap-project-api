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
