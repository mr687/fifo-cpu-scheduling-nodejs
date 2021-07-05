const Process = require('./process')

class Fifo {
  constructor() {
    this.processes = []
    this.numberOfProcess = 0
    this.averageWaitingTime = 0
    this.averageResponseTime = 0
  }
  addProcess(process) {
    if (!(process instanceof Process))
      throw new Error('Invalid Process definition.')
    this.processes.push(process)
    this.numberOfProcess = this.processes.length
    return this
  }
  checkEmptyProcess(index = 0, time = 0, process = null) {
    if (!process) return
    if(process.arrivalTime <= time){
      time += process.burstTime
      index++
      process = this.processes[index] || null
    }else{
      this.processes.splice(index, 0, new Process({arrivalTime: time, burstTime: process.arrivalTime}))
      time += process.arrivalTime
    }
    this.checkEmptyProcess(index, time, process)
  }
  calculateTime() {
    let wt = 0
    let rt = 0
    this.processes.forEach(
      (p, pi) => {
        p.calculate(this.processes[pi-1] || null)
        wt += p.waitingTime
        rt += p.responseTime
      }
    )
    this.averageWaitingTime = Number((wt/this.numberOfProcess).toFixed(1))
    this.averageResponseTime = Number((rt/this.numberOfProcess).toFixed(1))
    return this
  }
  sortProcess() {
    this.processes.sort((a,b) => a.arrivalTime - b.arrivalTime)
    this.checkEmptyProcess(0,0,(this.processes[0] || null))
    this.calculateTime()
    return this
  }
  output() {
    return {
      processes: this.processes,
      numOfProcess: this.numberOfProcess,
      averageResponseTime: this.averageResponseTime,
      averageWaitingTime: this.averageWaitingTime
    }
  }
}

module.exports = Fifo
