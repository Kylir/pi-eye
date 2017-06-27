/* jshint undef: true, node: true, eqeqeq: true, esnext: true, asi: true */
'use strict'

const express = require('express')
const spawn = require('child_process').spawn
const path = require('path')

var app = express()
const PORT = 3000
const FOLDER = 'public'

app.get('/pic/:name', (req, res) => {
    let name = req.params.name

    const cmd = 'raspistill'
    let args = ['-o', FOLDER + '/' + name + '.jpg']

    console.log(`Taking picture with command: ${cmd} ` + args.join(' '))
    var childProcess = spawn(cmd, args)

    childProcess.on('close', (code) => {
        console.log(`${cmd} exited with code ${code}`)
        res.json({status: 'OK'})
    })

    childProcess.on('error', (err) => {
        res.json({status:'ERROR', err: err})
        console.error(err)
    })
})

app.get('/timelapse/:name/:duration/:interval', (req, res) => {
    let prefix = req.params.name,
        duration = req.params.duration, //TODO: add validation for integer
        interval = req.params.interval //TODO: add validation for integer

    const cmd = 'raspistill'
    let args = ['-o', FOLDER + '/' + prefix + '%04d.jpg', '-t', duration, '-tl', interval]

    console.log(`Starting timelapse: ${cmd} ` + args.join(' '))
    var childProcess = spawn(cmd, args)

    childProcess.on('close', (code) => {
        console.log(`${cmd} exited with code ${code}`)
    })

    childProcess.on('error', (err) => {
        console.error(err)
    })

    res.json({status: 'OK'}) //no way to check it worked
})

// convert to mp4: https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspivid.md

app.get('/vid/:name/:time', (req, res) => {
    const cmd = 'raspivid'
    const convCmd = 'MP4Box' //conversion to MP4
    
    let name = req.params.name
    let time = req.params.time //TODO: add validation for integer

    const args = ['-o', FOLDER + '/' + name + '.h264', '-t', time]
    const convArgs = ['-add', FOLDER + '/' + name + '.h264', FOLDER + '/' + name + '.mp4']

    console.log(`Recording video with command: ${cmd} ` + args.join(' '))
    var childProcess = spawn(cmd, args)

    childProcess.on('close', (code) => {
        console.log(`${cmd} exited with code ${code}.`)
        console.log(`Starting conversion to MP4 with command: ${convCmd} ` + convArgs.join(' '))
        var conversionProcess = spawn(convCmd, convArgs)
        conversionProcess.on('close', (code) => {
            console.log(`${convCmd} exited with code ${code}.`)
        })
    })

    childProcess.on('error', (err) => {
        console.error(err)            
    })

    res.json({status: 'OK'}) //  Return early as there is no way to check if it worked.
})

app.listen(PORT, () => {
    console.log(`Starting Pi-Eye server on port ${PORT}!`)
})
