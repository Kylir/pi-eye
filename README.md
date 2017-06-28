# Pi-Eye

A simple web page to take pictures, create time lapse and record videos with your raspberry pi.

## Summary

Pi-Eye is a web interface to trigger `raspistill` and `raspivid` on your Raspberry Pi.
Behind the scene it is using NodeJS (ExpressJS to be more specific.)

## Installation

### Prerequisites

I assume your Raspberry is already able to take pictures and record videos using `raspistill` and `raspivid`.
If you're not sure have a look at the official documentation:

+ [Enable the camera.](https://www.raspberrypi.org/documentation/usage/camera/README.md)
+ [Take pictures.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspistill.md)
+ [Record videos.](https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspivid.md)

I also assume you already have NodeJS and npm installed on your Pi. If not have a [look at this post on Stackoverflow](https://raspberrypi.stackexchange.com/a/48313/20530).

## Web Interface

TODO


## API

The web interface is using the API to do its job. If needed the interface can be skipped and the API can be contacted directly.

There are three routes so far:

### Take a picture

Do a 

```
GET /pic/:name
```



### Create a timelapse

TODO

### Record a video

TODO

### Questions

+ Q: Why yet another module about the pi camera?

+ A: I reviewed the existing ones and they were not exactly doing what I wanted. So, I decided to re-invent the wheel. 
