/* jshint undef: true, node: true, eqeqeq: true, esnext: true, asi: true */
'use strict'

const express = require('express')
const spawn = require('child_process').spawn
const path = require('path')
const debug = require('debug')('pi-eye')

let app = express()
const PORT = 3000
const FOLDER = 'public'

//content directory as static.
app.use('/content', express.static(FOLDER))

app.get('/pic/:name', (req, res) => {
    let name = req.params.name
    let noError = true

    const cmd = 'raspistill'
    let args = ['-o', FOLDER + '/' + name + '.jpg']

    debug(`Taking picture with command: ${cmd} ` + args.join(' '))
    let childProcess = spawn(cmd, args)

    childProcess.on('error', (err) => {
        noError = false
        res.json({status:'ERROR', err: err})
        console.error(err)
    })

    childProcess.on('close', (code) => {
        if (noError) {
            debug(`${cmd} exited with code ${code}`)
            let imagePath = `/content/${name}.jpg`
            res.json({status:'OK', type: 'image', path: imagePath})
        }
    })

})

app.get('/timelapse/:name/:duration/:interval', (req, res) => {
    let prefix = req.params.name,
        duration = req.params.duration * 1000, //TODO: add validation for integer
        interval = req.params.interval * 1000 //TODO: add validation for integer

    const cmd = 'raspistill'
    const options = {detached: true}
    let args = ['-o', FOLDER + '/' + prefix + '%06d.jpg', '-t', duration, '-tl', interval]
    
    debug(`Starting timelapse: ${cmd} ` + args.join(' '))
    let childProcess = spawn(cmd, args, options)

    childProcess.on('close', (code) => {
        debug(`${cmd} exited with code ${code}`)
    })

    childProcess.on('error', (err) => {
        console.error(err)
    })

    res.json({status: 'pending', type: 'timelapse', duration: duration, interval:interval}) //no way to check it worked
})

// convert to mp4: https://www.raspberrypi.org/documentation/usage/camera/raspicam/raspivid.md

app.get('/video/:name/:time', (req, res) => {
    const cmd = 'raspivid'
    const convCmd = 'MP4Box' //conversion to MP4
    
    let name = req.params.name
    let time = req.params.time * 1000 //TODO: add validation for integer

    const args = ['-o', FOLDER + '/' + name + '.h264', '-t', time]
    const options = {detached: true}
    const convArgs = ['-add', FOLDER + '/' + name + '.h264', FOLDER + '/' + name + '.mp4']

    debug(`Recording video with command: ${cmd} ` + args.join(' '))
    let childProcess = spawn(cmd, args, options)

    childProcess.on('close', (code) => {
        debug(`${cmd} exited with code ${code}.`)
        debug(`Starting conversion to MP4 with command: ${convCmd} ` + convArgs.join(' '))
        let conversionProcess = spawn(convCmd, convArgs)
        
        conversionProcess.on('close', (code) => {
            debug(`${convCmd} exited with code ${code}.`)
        })

        conversionProcess.on('error', (err) => {
            console.error(err)
        })
    })

    childProcess.on('error', (err) => {
        console.error(err)            
    })

    res.json({status: 'pending', type: 'video', path: `/content/${name}.mp4`})
})

app.listen(PORT, () => {
    console.log(`Starting Pi-Eye server on port ${PORT}!`)
})
