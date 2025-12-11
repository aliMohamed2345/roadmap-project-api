export const allowedOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);

    try {
        const url = new URL(origin);
        const hostname = url.hostname;

        //allow all the public domain
        const publicTLDs = [
            '.com', '.net', '.org', '.io', '.dev', '.app', '.co',
            '.me', '.ai', '.tech', '.xyz', '.site', '.online'
        ];

        const isPublic = publicTLDs.some(tld => hostname.endsWith(tld));

        if (isPublic) {
            return callback(null, true);
        }

        //block all the private domain 
        return callback(new Error('CORS Blocked: private origin not allowed'));
    } catch {
        return callback(new Error('CORS Blocked: Invalid origin'));
    }
};
