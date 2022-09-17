import { httpsGet } from './client.js'

function onResponse(json) {
  console.log('we have json data', Object.keys(json))
}

function onError(err) {
  console.error('error')
  console.error(err)
}

export async function packageLookup(packagePath) {
  const p = `https://registry.npmjs.org/${packagePath}`
  let json
  try {
    json = await httpsGet(p, true)
    onResponse(json)
  } catch (err) {
    onError(err)
  }

  // https.get(p, res => {
  //   let body = ''

  //   res.on('data', chunk => {
  //     body += chunk
  //   })

  //   res.on('end', () => {
  //     try {
  //       const json = JSON.parse(body)
  //       onResponse(json)
  //     } catch (err) {
  //       onError(err)
  //     }
  //   })
  // }).on('error', onError)
}
