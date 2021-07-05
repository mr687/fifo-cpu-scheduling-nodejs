const express = require('express')

const Process = require('./lib/process')
const Fifo = require('./lib/fifo')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.static(__dirname+'/../public'))

app.post('/calculate', (req, res) => {
  const processes = req.body
  const fifo = new Fifo()
  processes.forEach(p => {
    fifo.addProcess(new Process(p))
  })
  const output = fifo.sortProcess()
    .output()
  res.json({status: true, data: output})
})

const port = process.env.PORT || 5555
app.listen(port, () => {
  console.log(`Listening on port *:${port}`)
})