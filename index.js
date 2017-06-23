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

app.get('/timelapse/:namePrefix/:duration/:interval', (req, res) => {
    let prefix = req.params.namePrefix,
        duration = req.params.duration, //TODO: add validation for integer
        interval = req.params.interval

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

app.get('/vid/:name/:time', (req, res) => {
    let name = req.params.name
    let time = req.params.time //TODO: add validation for integer

    const cmd = 'raspivid'
    let args = ['-o', FOLDER + '/' + name + '.h264', '-t', time]

    console.log(`Recording video with command: ${cmd} ` + args.join(' '))
    var childProcess = spawn(cmd, args)

    childProcess.on('close', (code) => {
        console.log(`${cmd} exited with code ${code}`)
    })

    childProcess.on('error', (err) => {
        console.error(err)            
    })

    res.json({status: 'OK'}) //no way to check it worked
})

app.listen(PORT, () => {
    console.log(`Starting Pi-Eye server on port ${PORT}!`)
})
