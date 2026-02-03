// List available models for the API key
const https = require("https");
const fs = require("fs");
const path = require("path");

// Read API key from .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

console.log("🔑 API Key:", apiKey.substring(0, 20) + "...\n");
console.log("📋 Fetching list of available models...\n");

// Try both v1 and v1beta endpoints
const endpoints = [
  `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
  `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
];

async function testEndpoint(url, version) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        console.log(`\n📡 ${version} API - Status: ${res.statusCode}`);

        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            console.log(`✅ Found ${data.models?.length || 0} models:\n`);

            if (data.models && data.models.length > 0) {
              data.models.forEach((model) => {
                console.log(`  📦 ${model.name}`);
                console.log(`     Display: ${model.displayName || 'N/A'}`);
                console.log(`     Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log();
              });
            } else {
              console.log("  ⚠️ No models available");
            }
          } catch (e) {
            console.log("❌ Error parsing response:", e.message);
          }
        } else {
          console.log(`❌ Error: ${body}`);
        }
        resolve();
      });
    }).on("error", (err) => {
      console.log(`❌ Request error: ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  for (let i = 0; i < endpoints.length; i++) {
    await testEndpoint(endpoints[i], i === 0 ? 'v1' : 'v1beta');
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 If no models are shown, the API key may need:");
  console.log("   1. Generative AI API enabled in Google Cloud Console");
  console.log("   2. Billing enabled (required for Gemini API)");
  console.log("   3. Or use Google AI Studio API key instead");
  console.log("\n🔗 Google AI Studio: https://makersuite.google.com/app/apikey");
  console.log("🔗 Google Cloud Console: https://console.cloud.google.com/");
})();
