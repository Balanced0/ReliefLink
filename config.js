process.loadEnvFile();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    throw new Error("a connection url must be present at .env");
}

export const configAPI = {
    dbUrl: dbUrl
};