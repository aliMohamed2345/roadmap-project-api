const allowOrigin = (origin, callback) => {
    // No origin (mobile apps, Postman) → allow
    if (!origin) return callback(null, { origin: true });

    const blocked = [
        "localhost",
        "127.0.0.1",
        "192.168.",
        "10.0.",
        "172.16.",
    ];

    // Deny private/local origins WITHOUT throwing an Error
    if (blocked.some(block => origin.includes(block))) {
        return callback(null, { origin: false }); // NOT an error
    }

    // Allow everything else
    return callback(null, { origin: true });
};
export default allowOrigin