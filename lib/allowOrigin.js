const dynamicCors = (origin, callback) => {
    // Requests without origin (Postman / Mobile apps)
    if (!origin) return callback(null, true);

    // Block localhost & private IPs only
    const blocked = [
        "localhost",
        "127.0.0.1",
        "192.168.",
        "10.0.",
        "172.16.",
    ];

    if (blocked.some(block => origin.includes(block))) {
        return callback(new Error("CORS: Local/private origins are not allowed"));
    }

    // Allow ALL other public websites
    return callback(null, true);
};
