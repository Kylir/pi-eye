/* jshint undef: true, node: true, eqeqeq: true, esnext: true, asi: true */
"use strict";

const express = require("express");
const serveIndex = require("serve-index");
const spawn = require("child_process").spawn;
const debug = require("debug")("pi-eye");

let app = express();
const PORT = 3000;
const FOLDER = "generated";
const ROTATION = "0";

//content directory as static.
app.use("/generated", express.static(FOLDER), serveIndex(FOLDER));

// The web interface at the root of the site
app.use(express.static("public"));

// Take a picture with a given name
app.get("/pic/:name", (req, res) => {
  let name = req.params.name;
  let noError = true;

  const cmd = "libcamera-still";
  let args = ["--rotation", `${ROTATION}`, "-o", FOLDER + "/" + name + ".jpg"];

  debug(`Taking picture with command: ${cmd} ` + args.join(" "));
  let childProcess = spawn(cmd, args);

  childProcess.on("error", (err) => {
    noError = false;
    res.status(500).json({ status: "error", err: err });
    debug("Error received.");
    console.error(err);
  });

  childProcess.on("close", (code) => {
    if (noError) {
      debug(`${cmd} exited with code ${code}. Sending ok to client.`);
      let imagePath = `/generated/${name}.jpg`;
      res.json({ status: "ok", type: "image", path: imagePath });
    }
  });
});

// Take several pictures to make a timelapse
app.get("/timelapse/:name/:duration/:interval", (req, res) => {
  let prefix = req.params.name,
    duration = req.params.duration * 1000, //TODO: add validation for integer
    interval = req.params.interval * 1000; //TODO: add validation for integer

  const cmd = "libcamera-still";
  const options = { detached: true };
  let args = [
    "--rotation",
    `${ROTATION}`,
    "-o",
    FOLDER + "/" + prefix + "%06d.jpg",
    "-t",
    duration,
    "--timelapse",
    interval,
  ];

  debug(`Starting timelapse: ${cmd} ` + args.join(" "));
  let childProcess = spawn(cmd, args, options);

  childProcess.on("close", (code) => {
    debug(`${cmd} exited with code ${code}`);
  });

  childProcess.on("error", (err) => {
    console.error(err);
  });

  res.json({
    status: "pending",
    type: "timelapse",
    duration: duration,
    interval: interval,
  }); //no way to check if it worked
});

// convert to mp4: https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspivid.md
// Start recording a video name :name for :time seconds
app.get("/video/:name/:time", (req, res) => {
  const VIDEO_FRAME_RATE = 30;
  const cmd = "libcamera-vid";
  const convCmd = "ffmpeg"; //conversion to MP4

  let name = req.params.name;
  let time = req.params.time * 1000; //TODO: add validation for integer

  const args = [
    "--rotation",
    `${ROTATION}`,
    "-o",
    FOLDER + "/" + name + ".h264",
    "-t",
    time,
    "--framerate",
    VIDEO_FRAME_RATE,
  ];
  const options = { detached: true };
  // ffmpeg -framerate 24 -i input.264 -c copy output.mp4
  const convArgs = [
    "-framerate",
    VIDEO_FRAME_RATE,
    "-i",
    FOLDER + "/" + name + ".h264",
    "-c",
    "copy",
    FOLDER + "/" + name + ".mp4",
  ];

  debug(`Recording video with command: ${cmd} ` + args.join(" "));
  let childProcess = spawn(cmd, args, options);

  childProcess.on("close", (code) => {
    debug(`${cmd} exited with code ${code}.`);
    debug(
      `Starting conversion to MP4 with command: ${convCmd} ` +
        convArgs.join(" ")
    );
    let conversionProcess = spawn(convCmd, convArgs);

    conversionProcess.on("close", (code) => {
      debug(`${convCmd} exited with code ${code}.`);
    });

    conversionProcess.on("error", (err) => {
      console.error(err);
    });
  });

  childProcess.on("error", (err) => {
    console.error(err);
  });

  res.json({
    status: "pending",
    type: "video",
    path: `/generated/${name}.mp4`,
  });
});

app.get("/stream/start", (req, res) => {
  // Command to use:
  // libcamera-vid -t 0 --inline --listen -o tcp://0.0.0.0:5000
  const cmd = "libcamera-vid";
  const args = [
    "--rotation",
    `${ROTATION}`,
    "-t",
    "0",
    "--inline",
    "--listen",
    "-o",
    "tcp://0.0.0.0:5000",
  ];
  const options = { detached: true };

  const child = app.get("streamChildProcess");

  if (child) {
    res.status(500).json({
      status: "error",
      type: "Stream",
      err: "Stream is already started.",
    });
    return;
  }

  debug(`Start streaming: ${cmd} ` + args.join(" "));
  let streamChildProcess = spawn(cmd, args, options);

  streamChildProcess.on("error", (err) => {
    console.error(err);
    app.set("streamChildProcess", null);
  });

  app.set("streamChildProcess", streamChildProcess);

  res.json({
    status: "pending",
    type: "Stream",
  });
});

app.get("/stream/stop", (req, res) => {
  const child = app.get("streamChildProcess");

  if (child) {
    child.kill(); // Sends the default signal (SIGTERM)
    app.set("streamChildProcess", null); // Clear the stored process

    res.json({
      status: "success",
      type: "Stream",
    });
  } else {
    res.json({
      status: "error",
      type: "Stream",
      err: "No stream process found.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Starting Pi-Eye Camera server on port ${PORT}!`);
  debug("Debug mode is ON!");
});
