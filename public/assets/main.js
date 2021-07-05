const addProcess = document.getElementById('addProcess')
const delProcess = document.getElementById('delProcess')
const calculate = document.getElementById('calculate')
const processes = document.getElementById('wrapper')

let ganttChartData = []

const processForm = (i) => `
<div class="card card-body my-3 process-item">
  <div class="row">
    <div class="col"><label>Process ID</label><input type="number" value="${i}" class="form-control pid" placeholder="Process ID" required></div>
    <div class="col"><label>Arrival Time</label><input type="number" value="0" class="form-control arrivalTimes" placeholder="Arrival Time" required></div>
    <div class="col"><label>Burst Time</label><input type="number" value="0" class="form-control burstTimes" placeholder="Burst Time" required></div>
  </div>
</div>
`
let numOfProcess = 1

delProcess.addEventListener('click', () => {
  if (processes.children.length > 1){
    processes.removeChild(processes.lastElementChild)
    numOfProcess--
  }
})
addProcess.addEventListener('click', () => {
  numOfProcess++
  processes.innerHTML += processForm(numOfProcess)
})

const fetchTable = (data) => {
  const tableReturn = document.getElementById('return')
  let content = ''
  let i = 1
  data.processes.sort((a,b) => a.pid - b.pid)
  data.processes.forEach((item) => {
    if (!item.pid) return
    content += `
      <tr>
        <td>${i}.</td>
        <td>P${item.pid}</td>
        <td>${item.arrivalTime}</td>
        <td>${item.burstTime}</td>
        <td>${item.finishTime}</td>
        <td>${item.turnAroundTime}</td>
        <td>${item.waitingTime}</td>
        <td>${item.responseTime}</td>
      </tr>
    `
    i++
  })
  const tbody = tableReturn.querySelector('tbody')
  tbody.innerHTML = content

  document.getElementById('avgWT').innerText = data.averageWaitingTime || 0
  document.getElementById('avgRT').innerText = data.averageResponseTime || 0
}

const setGanttChart = (data) => {
  if (ganttChartData) ganttChartData = []

  let startTime = 0
  data.processes.forEach((item, i) => {
    if (item.pid) {
      ganttChartData.push(['Time',`P${item.pid}`, '', getDate(startTime), getDate(startTime + item.burstTime)])
    }else{
      ganttChartData.push(['Time',`Empty`, 'black', getDate(startTime), getDate(startTime + item.burstTime)])
    }
    startTime += item.burstTime
  })

  console.log(ganttChartData)

  google.charts.load("current", {packages: ["timeline"]})
  google.charts.setOnLoadCallback(drawGanttChart)
}

calculate.addEventListener('click', async () => {
  const pids = document.querySelectorAll('.pid')
  const arrivalTimes = document.querySelectorAll('.arrivalTimes')
  const burstTimes = document.querySelectorAll('.burstTimes')

  let req = []
  pids.forEach((e, ei) => {
    req.push({
      pid: parseInt(e.value),
      arrivalTime: parseInt(arrivalTimes[ei].value),
      burstTime: parseInt(burstTimes[ei].value)
    })
  })

  const res = await fetch('/calculate', {
    method: 'post',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(req)
  })
  if (res.ok) {
    const response = await res.json()
    setGanttChart(response.data)
    fetchTable(response.data)
  }else{
    console.log('Request Error.')
  }
})

const getDate = (sec) => {
  return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
}

const drawGanttChart = () => {
  var container = document.getElementById('ganttChart');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: "string", id: "Gantt Chart" });
  dataTable.addColumn({ type: "string", id: "Process" });
  dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
  dataTable.addColumn({ type: "date", id: "Start" });
  dataTable.addColumn({ type: "date", id: "End" });
  dataTable.addRows(ganttChartData);
  let ganttWidth = '100%';
  var options = {
      width: ganttWidth,
      timeline: {
          showRowLabels: false,
          avoidOverlappingGridLines: false
      }
  };
  chart.draw(dataTable, options);
}
