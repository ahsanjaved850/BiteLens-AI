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
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Estimate the calories and macronutrients (carbs, protein, fats) of the vegan food shown in this image.
                      Return ONLY a valid JSON object in the following format:
                      {
                        "calories": "123 kcal",
                        "protein": "10 g",
                        "carbs": "20 g",
                        "fats": "5 g"
                      }
                      Do not include any explanation, heading, or surrounding text.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  try {
    const parsed: NutritionData = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.log(error);
    console.error("Failed to parse JSON:", content);
    throw new Error("Invalid JSON response from AI.");
  }
};
