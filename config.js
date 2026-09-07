// Load .env locally; on Render/Vercel env vars are injected automatically
try { process.loadEnvFile(); } catch {}

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    throw new Error("a connection url must be present at .env");
}

export const configAPI = {
    dbUrl: dbUrl
};