import { supabase } from "@/src/utils/supabase";

export const dataAnalysis = async (
  weight: number,
  height: number,
  age: number,
  targetWeight: number,
  gender: string,
  goal: string
) => {
  try {
    console.log("Calling dataAnalysis with:", {
      weight,
      height,
      age,
      targetWeight,
      gender,
      goal,
    });

    const { data, error } = await supabase.functions.invoke(
      "analyze-user-data",
      {
        body: {
          weight,
          height,
          age,
          targetWeight,
          gender,
          goal,
        },
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(
        error.message || "Failed to analyze data. Please try again."
      );
    }

    console.log("dataAnalysis success:", data);
    return data;
  } catch (error: any) {
    console.error("Error in dataAnalysis:", error);
    // Re-throw with user-friendly message
    throw new Error(
      error.message || "Failed to calculate nutrition data. Please try again."
    );
  }
};
