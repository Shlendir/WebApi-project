const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const port = 8080;

const app = express();
app.set("view engine", "ejs"); //define engine
app.set("views", "./"); //define views location
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //define public folder

// routes
router.get("/", async (req, res) => {
  let url = `https://planets-info.fly.dev/api`;
  let result = await fetch(url);
  let info = await result.json();
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let tmrw = new Date(today);
  tmrw.setUTCDate(tmrw.getUTCDate()+1)
  let retrograde = {};

  for (const planet in info) {
    let rstatus = "no";
    for (const change of info[planet]) {
      let start = new Date(change.start);
      let end = new Date(change.end);

      if (today.getTime() === start.getTime()){
        rstatus = "starting";
        break;
      }
      if (today.getTime() === end.getTime()){
        rstatus = "ending";
        break;
      }
      if (today.getTime() > start.getTime() && today.getTime() < end.getTime()){
        rstatus = "yes";
        break;
      }
      if (tmrw.getTime() === start.getTime()){
        rstatus = "starts tomorrow";
        break;
      }
    }
    retrograde[planet] = rstatus;
  }
  res.render("retrogradeSite", { info, retrograde });
});

app.use(router);

app.get("*", (req, res) => res.sendStatus(404));

app.listen(port);
console.log("app runnin'");
