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
    const { data, error } = await supabase.functions.invoke("data-analysis", {
      body: {
        weight,
        height,
        age,
        targetWeight,
        gender,
        goal,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in dataAnalysis:", error);
    throw error;
  }
};
