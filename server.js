const express = require(`express`);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(require(`morgan`));

app.get(`/`, (req, res) => {
  res.send(`Welcome to Duo-Doodle API`);
});

app.listen(PORT, () => {
  console.log(`Duo-Doodle is now listening on port ${PORT}`);
});