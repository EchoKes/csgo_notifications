import Audic from "audic";
import { createServer } from "http";
const port = 3337;
const host = "localhost";

// audio cues
const bomb_planted = new Audic("/audio/bomb_planted.mp3");
const bomb_defused = new Audic("/audio/bomb_defused.mp3");
const bomb_exploded = new Audic("/audio/bomb_exploded.mp3");
const buy_time = new Audic("/audio/buy_time.mp3");
const round_started = new Audic("/audio/round_started.mp3");
const round_ended = new Audic("/audio/round_ended.mp3");

const server = createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  req.on("data", (data) => {
    try {
      processPayload(JSON.parse(data.toString()));
    } catch (e) {
      console.error(`Error retrieving data from API`);
    }
  });

  req.on("end", () => {
    res.end("");
  });
});

/**
 * Processes payloads to parse game events
 *
 * @param {object} data - Payload as JSON object
 */

function processPayload(data) {
  var bomb_status = data.round.bomb;
  var round_status = data.round.phase;

  console.log("| Map Round: %d |", data.map.round);
  switch (round_status) {
    case "freezetime":
      console.log("- Buy Time");
      buy_time.play();
      break;
    case "live":
      if (typeof bomb_status == "undefined") {
        console.log("- Round Started");
        round_started.play();
      } else {
        console.log("- Bomb Planted");
        bomb_planted.play();
      }
      break;
    case "over":
      console.log("- Round Ended");
      round_ended.play();
      break;
  }
}

server.listen(port, host);

console.log("Monitoring CS:GO rounds");
