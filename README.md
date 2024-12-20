# Pi-Eye

A simple web page to take pictures, create time lapse and record videos with your raspberry pi.

## Summary

Pi-Eye is a web interface to trigger `libcamera-still` and `libcamera-vid` on your Raspberry Pi.
Behind the scene it is using NodeJS (ExpressJS to be more specific) to run linnux programs.

## Installation

### Prerequisites

#### `libcamera-still` and `libcamera-vid`

I assume your Raspberry is already able to take pictures and record videos using `libcamera-still` and `libcamera-vid`.
If you're not sure, have a look at [the official documentation](https://www.raspberrypi.com/documentation/computers/camera_software.html).

#### NodeJS (and npm)

I also assume you already have NodeJS and npm installed on your Pi. If not, have a [look at this post tutorial](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp).

As an example, for the Pi Zero W you need NodeJS for ARM 6:

```
wget https://unofficial-builds.nodejs.org/download/release/v20.14.0/node-v20.14.0-linux-armv6l.tar.gz
tar -xvf node-v20.14.0-linux-armv6l.tar.gz
sudo cp -r node-v20.14.0-linux-armv6l/* /usr/local/
```

#### Git

You will need Git to clone the repository. The following command should install it on your Pi:

```
sudo apt install git
```

#### FFMpeg

Last assumption, to create an MP4 video from the raw H264 format `raspivid` generates, you need `FFMpeg` to be installed.
`sudo apt install ffmpeg` will do the trick.

### Clone the repository and install the dependencies

You are now ready to download the code. Clone the repository with : `git clone https://github.com/Kylir/pi-eye.git`
This will create the directory `pi-eye` with the code. Go in that directory with `cd pi-eye`.
The next step is to download the NodeJS dependencies by running the following command in the project folder:

```
npm install
```

### Start the the server

Last step, start the back-end server that will listen to your request and talk to the Pi and take some pictures and videos. To do that you have to run the following command:

```
sudo npm start
```

## Web Interface

While the server is running, the web interface is accessible on the port 3000.
Find the IP address of your Pi (for instance using `ifconfig`) and use this address to open a browser.

For instance my IP address is `192.168.1.174`. I can then point a browser to `http://192.168.1.174:3000/` and I will see the web interface.

## API

The web interface is using the API to do its job. If needed the interface can be skipped and the API can be contacted directly. For instance you can reuse the API and write your own interface to interact with it.

There are three routes so far:

### Take a picture

To take a picture you need to call the `/pic` route and provide the correct `name` parameter.

```
GET /pic/:name
```

If the process is successfull, this will create a _name.jpg_ picture in the `public` folder and return a JSON object:

```json
{ "status": "OK", "type": "image", "path": "/content/name.jpg" }
```

### Create a timelapse

You can create a series of images using the `/timelapse` route. You need to provide a `name prefix`, a `duration` (in seconds) and an `interval` (in seconds).

```
GET /timelapse/:name/:duration/:interval
```

Here is a bit more details:

- name prefix: your images will start with this prefix and have a number from 000000 to 999999. For instance `picture0001.jpg`.
- duration: how many seconds the camera will stay active.
- interval: how many seconds between capturing two images.

For instance to take a picture every 10 seconds for one hour (3600 seconds) and name the file pic000\*\*\*.jpg you will have to call:

```
GET /timelapse/pic/3600/10
```

For more info about timelapse with the raspberry pi you can read [this page.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/timelapse.md)

### Record a video

A video recording can be triggered using the route:

```
GET /video/:name/:time_sec
```

- `:name` is obviously the name of the video with no extension.
- `:time_sec` is the duration in seconds of the video.

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

- Q: What is the default format of the video?
- A: It is 1920 x 1080 pixels at 25 frames per second.

- Q: How big is a video?
- A: A one minute video was around 127 MB.

- Q: What is the default format of a picture?
- A: It is a JPG file at 2592 x 1944 pixels.

- Q: How big is a picture?
- A: With the default option used in the application a picture is around 2.5 MB

- Q: Why yet another module about the pi camera?
- A: I reviewed the existing ones and they were not exactly doing what I wanted. So, I decided to re-invent the wheel.

- Q: When are you going to make a nice web interface to the application?
- A: UPDATE! There is one now! OK, it is not the prettiest one... but it works! isn't it?...
  gi
