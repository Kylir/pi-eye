/* jshint undef: true, node: true, eqeqeq: true, esnext: true, asi: true */
'use strict'

const express = require('express')
const spawn = require('child_process').spawn

var app = express()
const PORT = 3000

app.get('/pic/:name', (req, res) => {
    let name = req.params.name

    const cmd = 'raspistill'
    let args = ['-o', name]

    console.log(`Taking picture: ${cmd} ${args}`)
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

app.get('/vid/:name/:time', (req, res) => {
    let name = req.params.name
    let time = req.params.time //TODO: add validation for integer

    const cmd = 'raspivid'
    let args = ['-o', name, '-t', time]

    console.log(`Taking picture: ${cmd} ${args}`)
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

app.listen(PORT, () => {
    console.log(`Starting Pi-Eye server on port ${PORT}!`)
})
