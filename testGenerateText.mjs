import { generatePersonalizedText } from "./utils/huggingface.ts";

generatePersonalizedText("Test prompt")
  .then((response) => console.log("Response:", response))
  .catch((error) => console.error("Error:", error));
