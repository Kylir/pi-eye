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

For instance to take a picture every 10 seconds for one hour (3600 seconds) and name the file pic000***.jpg you will have to call:

```
GET /timelapse/pic/3600/10
```

For more info about timelapse with the raspberry pi you can read [this page.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/timelapse.md)


### Record a video

A video recording can be triggered using the route:

```
GET /video/:name/:time_sec
```

+ `:name` is obviously the name of the video with no extension.
+ `:time_sec` is the duration in seconds of the video.

Behind the scene the application is calling the program `raspivid`.
By default the camera is recording using the format (encoding?) h264.
As soon as raspivid is finished the application starts a conversion to mp4 using `MP4Box`.

For instance to record a one minute video named `myVid01.mp4` use the following:

```
GET /video/myVid01/60
```

As a video recording can be long the application is not waiting for the video to be recorded and sends the following response:

```
{"status":"pending","type":"video","path":"/content/myVid01.mp4"}
```

At the moment there is no way to retrieve an error message using the API if something went wrong.
But it is possible to turn on the debug messages and see on the application logs if an error has been raised.

For info about the size of a video file: I made a one minute video and it was 126 927 324 bytes 

### Questions

+ Q: What is the default format of the video?
+ A: It is 1920 x 1080 pixels at 25 frames per second.

+ Q: How big is a video?
+ A: A one minute video I made was around 127 MB.

+ Q: What is the default format of a picture?
+ A: It is a JPG file at 2592 x 1944 pixels.

+ Q: How big is a picture?
+ A: With the default option used in the application a picture is around 2.5 MB

+ Q: Why yet another module about the pi camera?
+ A: I reviewed the existing ones and they were not exactly doing what I wanted. So, I decided to re-invent the wheel. 

+ Q: When are you going to make a nice web interface to the application?
+ A: When I will have the time... :'(
