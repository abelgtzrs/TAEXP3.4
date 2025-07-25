const fetch = require("http").request;

// Create a test token by copying from your browser's localStorage
// or by logging in and checking the Network tab in DevTools
const testToken = "your-token-here"; // You'll need to replace this

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/users/me/dashboard-stats",
  method: "GET",
  headers: {
    Authorization: `Bearer ${testToken}`,
    "Content-Type": "application/json",
  },
};

const req = require("http").request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data);
  });
});

req.on("error", (error) => {
  console.error("Error:", error);
});

req.end();
