import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve your html/js

// Path to JSON file
const FILE_PATH = "./submissions.json";

// Ensure file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]");
}

// Handle submissions
app.post("/api/submit", (req, res) => {
  const newData = req.body;

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");

    const submissions = JSON.parse(data);
    submissions.push(newData);

    fs.writeFile(FILE_PATH, JSON.stringify(submissions, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.status(200).send("OK");
    });
  });
});

// For viz page
app.get("/api/data", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");
    res.json(JSON.parse(data));
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
