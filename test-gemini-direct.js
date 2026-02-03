// Direct HTTP test for Gemini API
const https = require("https");
const fs = require("fs");
const path = require("path");

// Read API key from .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

console.log("🔑 Testing API Key:", apiKey.substring(0, 20) + "...\n");

// Test with v1 API (not v1beta)
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: "Say hello"
    }]
  }]
});

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

console.log("🧪 Testing Gemini API with direct HTTP request...\n");

const req = https.request(url, options, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log(`📡 Status Code: ${res.statusCode}\n`);

    if (res.statusCode === 200) {
      const response = JSON.parse(body);
      console.log("✅ API Key is VALID and WORKING!");
      console.log("\n📝 Response:");
      console.log(JSON.stringify(response, null, 2));
    } else {
      console.log("❌ API Key test FAILED\n");
      console.log("Response body:");
      console.log(body);
      console.log("\n💡 Common issues:");
      console.log("  1. API key not enabled - Visit: https://makersuite.google.com/app/apikey");
      console.log("  2. Gemini API not enabled in Google Cloud Console");
      console.log("  3. Billing not set up (required for Gemini API)");
      console.log("  4. API key restrictions (IP, referrer, etc.)");
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request error:", error.message);
});

req.write(data);
req.end();
