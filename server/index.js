const app = require('./app');

const PORT = 4321;

app.listen(PORT, () => {
  console.log("I'm listening on ", PORT);
})