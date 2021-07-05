class Process{
  constructor(o) {
    this.pid = o.pid
    this.arrivalTime = o.arrivalTime || 0
    this.burstTime = o.burstTime || 0
    this.finishTime = 0
    this.turnAroundTime = 0
    this.waitingTime = 0
    this.responseTime = 0
  }

  calculate(previousProcess = null){
    this.finishTime = (previousProcess?
      previousProcess.finishTime:
      this.arrivalTime) + this.burstTime
    this.turnAroundTime = this.finishTime - this.arrivalTime
    this.waitingTime = this.turnAroundTime - this.burstTime
    this.responseTime = this.waitingTime
  }
}

module.exports = Process