

const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();


app.get("/api", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


