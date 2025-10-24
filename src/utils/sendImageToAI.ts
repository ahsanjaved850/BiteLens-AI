import Constants from "expo-constants";

export type NutritionData = {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
};

const openaiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;

export const sendImageToAI = async (
  base64Image: string
): Promise<NutritionData> => {
  if (!openaiKey) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  if (!base64Image) {
    throw new Error("Image data is empty");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a nutrition expert. Analyze this vegan food image and estimate the calories and macronutrients.
                
                Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
                {
                  "calories": "150",
                  "protein": "8",
                  "carbs": "20",
                  "fats": "5"
                }

                Important: Use only numbers in the JSON values, no units.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API Error Response:", error);
      throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    // Clean the response - remove markdown code blocks if present
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanedContent);

    // Validate the response has required fields
    if (!parsed.calories || !parsed.protein || !parsed.carbs || !parsed.fats) {
      throw new Error("Missing required nutrition fields in response");
    }

    // Ensure values are strings and properly formatted
    const nutritionData: NutritionData = {
      calories: `${parsed.calories}`,
      protein: `${parsed.protein}`,
      carbs: `${parsed.carbs}`,
      fats: `${parsed.fats}`,
    };

    console.log("Nutrition data received:", nutritionData);
    return nutritionData;
  } catch (error: any) {
    console.error("Error in sendImageToAI:", error.message);
    throw error;
  }
};
