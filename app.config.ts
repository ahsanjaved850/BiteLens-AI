import "dotenv/config";

export default {
  expo: {
    name: "calai_vegan",
    slug: "calai_vegan",
    scheme: "calaivegan",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    extra: {
      OPENAI_API_KEY: process.env.AI_KEY,
      DATABASE_URL: process.env.SUPABASE_URL,
      DATABAE_KEY: process.env.SUPABASE_KEY,
    },
  },
};
