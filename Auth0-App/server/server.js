const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/server.routes");
const config = require("./config/config");
const mongoose = require("mongoose");
const app = express();
const path = require("path")
//const cors = require("cors");
//connect to the database
mongoose.set('useFindAndModify', false);

mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;
app.use('/', express.static(path.join(__dirname, "..", 'client/build')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.use((req, res, next) => {
  //res.send("TEST");
  next();
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build", "index.html"));
 });
// Use env port or default
const port = process.env.PORT || 5000;

console.log(path.join(path.join(__dirname, "..", "client/build")));

//console.log(__dirname);
app.listen(port, () => console.log(`Server now running on port ${port}!`));
