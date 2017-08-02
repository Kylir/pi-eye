# Pi-Eye

A simple web page to take pictures, create time lapse and record videos with your raspberry pi.

## Summary

Pi-Eye is a web interface to trigger `raspistill` and `raspivid` on your Raspberry Pi.
Behind the scene it is using NodeJS (ExpressJS to be more specific.)

## Installation

### Prerequisites

I assume your Raspberry is already able to take pictures and record videos using `raspistill` and `raspivid`.
If you're not sure, have a look at the official documentation:

+ [Enable the camera.](https://www.raspberrypi.org/documentation/usage/camera/README.md)
+ [Take pictures.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspistill.md)
+ [Record videos.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspivid.md)

I also assume you already have NodeJS and npm installed on your Pi. If not have a [look at this post on Stackoverflow](https://raspberrypi.stackexchange.com/a/48313/20530).

Last assumption, to create an MP4 video from the raw H264 you need `MP4Box` to be installed.


## Web Interface

TODO: for the moment the project has no web interface. But it would be nice to be able to take some pictures and record some videos remotely using a web page.


## API

The web interface is using the API to do its job. If needed the interface can be skipped and the API can be contacted directly. For instance you can reuse the API and write your own interface to interact with it.

There are three routes so far:

### Take a picture

To take a picture you need to call the `/pic` route and provide the correct `name` parameter.

```
GET /pic/:name
```

If the process is successfull, this will create a *name.jpg* picture in the `public` folder and return a JSON object:

```json
{"status":"OK", "type": "image", "path": "/content/name.jpg"}
```


### Create a timelapse

You can create a series of images using the `/timelapse` route. You need to provide a `name prefix`, a `duration` (in seconds) and an `interval` (in seconds).

```
GET /timelapse/:name/:duration/:interval
```

Here is a bit more details:

+ name prefix: your images will start with this prefix and have a number from 000000 to 999999. For instance `picture0001.jpg`.
+ duration: how many seconds the camera will stay active.
+ interval: how many seconds between capturing two images.

For instance to take a picture every 10 seconds for one hour and name the file pic000***.jpg you will have to call:

```
GET /timelapse/pic/3600/10
```

For more info about timelapse with the raspberry pi you can read [this page.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/timelapse.md)

### Record a video

TODO

### Questions

+ Q: Why yet another module about the pi camera?

+ A: I reviewed the existing ones and they were not exactly doing what I wanted. So, I decided to re-invent the wheel. 
