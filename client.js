import https from 'https'

export async function httpsGet(url, formatJson = false) {
  return new Promise((res, rej) => {
    https.get(url, r => {
      let body = ''
  
      r.on('data', chunk => {
        body += chunk
      })
  
      r.on('end', () => {
        try {
          if (formatJson) {
            try {
              res(JSON.parse(body))
            } catch (err) {
              rej(err)
            }
          } else {
            res(body)
          }
        } catch (err) {
          rej(err)
        }
      })
    }).on('error', rej)
  })
}
