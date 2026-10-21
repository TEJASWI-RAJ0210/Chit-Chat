const allowedOrigins = new Set((process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean));

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests, which do not send an Origin header.
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};
