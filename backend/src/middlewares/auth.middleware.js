import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Try verifying with primary secret first, then fallback to ACCESS_TOKEN_SECRET
    const secretsToTry = [process.env.JWT_SECRET, process.env.ACCESS_TOKEN_SECRET];
    let decoded = null;
    let lastErr = null;

    for (const s of secretsToTry) {
        if (!s) continue;
        try {
            decoded = jwt.verify(token, s);
            break;
        } catch (err) {
            lastErr = err;
        }
    }

    if (!decoded) {
        return res.status(401).json({ message: "Invalid token", error: lastErr?.message });
    }

    req.userId = decoded.userId || decoded._id || decoded.id;
    next();
};