
module.exports = (req, res) => {
  const ipinfo = {
    addr: req.headers['x-real-ip'],
    ua: req.headers['user-agent'],
    ts: Date.now()
  }

  console.log('request headers : %j', req.headers)

  console.log('request details were - %j', ipinfo)

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(ipinfo))
}
