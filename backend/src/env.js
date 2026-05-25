import dotenv from "dotenv";

// Load .env.local first (overrides .env if it existed and we were using override:true, 
// but standard dotenv behavior is "first one set wins" -- wait, usually subsequent configs don't override unless debug/override options used.
// However, the issue here is mostly just making sure IT IS LOADED before other imports use it.)

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env' });

console.log("Environment variables loaded. GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
