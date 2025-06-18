import "dotenv/config";

export default {
  expo: {
    name: "calai_vegan",
    slug: "calai_vegan",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    extra: {
      OPENAI_API_KEY: process.env.AI_KEY,
    },
  },
};
