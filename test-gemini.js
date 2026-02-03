// Test script to verify Gemini API key is working
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Read API key from .env.local
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

if (!apiKey) {
  console.error("❌ No API key found in .env.local");
  process.exit(1);
}

console.log("🔑 API Key found:", apiKey.substring(0, 20) + "...");
console.log("🧪 Testing Gemini API connection...\n");

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];

  for (const modelName of modelsToTry) {
    try {
      console.log(`🧪 Testing with ${modelName} model...\n`);
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent("Say 'Hello, Soul Sync!' in a friendly way.");
      const response = await result.response;
      const text = response.text();

      console.log(`✅ Success! Model ${modelName} is working!`);
      console.log("\n📝 Test Response:");
      console.log(text);
      console.log("\n✨ The API key is valid and working correctly!");
      console.log(`\n💡 Use model: "${modelName}" in your app`);
      return; // Success, exit
    } catch (error) {
      console.log(`❌ Model ${modelName} failed: ${error.message}\n`);
    }
  }

  console.error("❌ All model attempts failed.");
  console.error("\n💡 Possible issues:");
  console.error("  1. API key may be invalid");
  console.error("  2. API key may not have access to Gemini models");
  console.error("  3. Billing may not be enabled for this API key");
  console.error("\n🔗 Check your Google AI Studio: https://makersuite.google.com/app/apikey");
  process.exit(1);
}

testGemini();
