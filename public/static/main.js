(function (window) {
  var LS_KEY = 'ip-history'
  var MAX_STORE_SIZE = 100

  // https://stackoverflow.com/questions/7015962/detect-an-app-on-home-screen-of-iphone
  if ('standalone' in navigator && navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion)) {
    document.body.style.background = '#9b4dca'
  }

  renderIpHistory()
  doFetch()

  function doFetch () {
    window.fetch('/api/ip')
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
    var history = window.store.get(LS_KEY)

    if (!history) {
      return []
    } else {
      if (history.length > MAX_STORE_SIZE) {
        // Remove an item if we store over 100 entries
        history.shift()
        window.store.set(LS_KEY, history)
      }

      return history
    }
  }

  function addResultToHistory (result) {
    var history = getResultsHistory()

    history.push(result)

    window.store.set(LS_KEY, history)
  }

  function renderIpHistory () {
    var resultsHistory = getResultsHistory().sort(function (a, b) {
      return a.ts < b.ts ? 1 : -1
    })

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
    var ipEl = document.getElementById('ip-result')
    var jsonEl = document.getElementById('json-response')

    ipEl.innerHTML = result.addr
    jsonEl.innerHTML = JSON.stringify(result, null, 2)
  }
})(window)
