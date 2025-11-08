export const validateLogInCredentials = (email, password) => {
    if (!email) return { isValid: false, message: "Email is required." };
    if (!password) return { isValid: false, message: "Password is required." };

    email = email.trim().toLowerCase();
    password = password.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
        return { isValid: false, message: "Please provide a valid email address." };

    if (password.length < 6)
        return { isValid: false, message: "Password must be at least 6 characters long." };
    if (password.length > 64)
        return { isValid: false, message: "Password too long. Max 64 characters allowed." };

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(password))
        return {
            isValid: false,
            message:
                "Password must include uppercase, lowercase, number, and special character.",
        };

    return { isValid: true, message: "" };
};

export const validateSignUpCredentials = (email, password, username) => {
    // 🔹 Check required fields first
    if (!username) return { isValid: false, message: "Username is required." };
    if (!email) return { isValid: false, message: "Email is required." };
    if (!password) return { isValid: false, message: "Password is required." };

    // 🔹 Trim and normalize
    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // 🔹 Validate username
    if (username.length < 3 || username.length > 50) {
        return {
            isValid: false,
            message: "Username must be between 3 and 50 characters long.",
        };
    }

    // Optional: Only allow letters, numbers, and underscores in usernames
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return {
            isValid: false,
            message: "Username can only contain letters, numbers, and underscores.",
        };
    }

    // 🔹 Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: "Please provide a valid email address." };
    }

    // 🔹 Validate password length
    if (password.length < 6) {
        return {
            isValid: false,
            message: "Password must be at least 6 characters long.",
        };
    }
    if (password.length > 64) {
        return {
            isValid: false,
            message: "Password too long. Max 64 characters allowed.",
        };
    }

    // 🔹 Strong password rules
    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
        return {
            isValid: false,
            message:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        };
    }

    // ✅ If all checks passed
    return { isValid: true, message: "" };
};
export const validateChangeProfileCredentials = (email, username, imageURL, bio) => {
    // 🔹 Defensive normalization
    if (username) username = username.trim();
    if (email) email = email.trim().toLowerCase();
    if (imageURL) imageURL = imageURL.trim();
    if (bio) bio = bio.trim();

    // 🔹 Validate username 
    if (username) {
        if (username.length < 3 || username.length > 50) {
            return {
                isValid: false,
                message: "Username must be between 3 and 50 characters long.",
            };
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return {
                isValid: false,
                message: "Username can only contain letters, numbers, and underscores.",
            };
        }
    }

    // 🔹 Validate email 
    if (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Please provide a valid email address." };
        }
    }

    // 🔹 Validate image URL 
    if (imageURL) {
        const imageRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;
        if (!imageRegex.test(imageURL)) {
            return {
                isValid: false,
                message: "Please provide a valid image URL (jpg, jpeg, png, gif, or webp).",
            };
        }
    }
    if (bio) {
        if (bio.split(" ").length > 100) {
            return {
                isValid: false,
                message: "Please the maximum is 100 word",
            };
        }
    }
    return { isValid: true, message: "" };
};
