var LS_KEY = 'ip-history';

setTimeout(function () {
  renderIpHistory()
  doFetch()
})

function doFetch() {
  fetch('/api/ip')
    .then(function (res) {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then(function (res) {
      if (res) {
        addResultToHistory(res)
        renderResult(res)
      }

      renderIpHistory()
    })
    .catch(function (err) {
      console.error(err)
    })
}

function getResultsHistory () {
  var history = localStorage.getItem(LS_KEY)

  if (!history) {
    return []
  } else {
    return JSON.parse(history)
  }
}

function addResultToHistory (result) {
  var history = getResultsHistory()

  history.push(result)

  localStorage.setItem(LS_KEY, JSON.stringify(history))
}

function renderIpHistory () {
  var resultsHistory = getResultsHistory()
  var rt = document.getElementById('results-table')

  // Remove previous entries in the event this is called twice
  rt.innerHTML = ''

  resultsHistory.forEach(function (result) {
    var trEl = document.createElement('tr')
    var tdTs = document.createElement('td')
    var tdAddr = document.createElement('td')

    tdTs.innerHTML = new Date(result.ts).toLocaleString()
    tdAddr.innerHTML = result.addr

    trEl.appendChild(tdTs)
    trEl.appendChild(tdAddr)

    rt.appendChild(trEl)
  })
}

function renderResult (result) {
  var el = document.getElementById('ip-result')
  el.innerHTML = result.addr
}

function getLocation (callback) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      callback(position)
    },
    function () {
      callback('Unknown')
    }
  )
}
