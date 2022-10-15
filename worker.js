/* globals addEventListener, Response, DATABASE */

const base64image = 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
const imageArray = Uint8Array.from(atob(base64image), c => c.charCodeAt(0))

async function getDocument (docUrl) {
  const data = await DATABASE.get(docUrl, { type: 'json' })
  if (!data) {
    return {}
  }
  return data
}

addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/r')) {
    event.respondWith(handleRequest(event, url))
  } else if (url.pathname.startsWith('/whitelist')) {
    event.respondWith(handleWhitelist(event, url))
  } else if (url.pathname.startsWith('/blacklist')) {
    event.respondWith(handleBlacklist(event, url))
  } else {
    console.error('unknown pathname: ' + url.pathname + ' (' + event.request.url + ')', JSON.stringify(event.request))
    event.respondWith(Response.redirect('https://github.com/cvzi/Metacritic-userscript/', 302))
  }
})

async function handleRequest (event, url) {
  let formData
  try {
    formData = await event.request.formData()
  } catch (e) {
    console.error(e)
    return new Response('Wrong request data', { status: 500 })
  }
  const params = {}
  for (const entry of formData.entries()) {
    params[entry[0]] = entry[1]
  }
  const docUrl = params.m
  const alternativeUrl = params.a

  const data = await getDocument(docUrl)
  if (Object.keys(data).length > 0) {
    const maxValue = Math.max(...Object.values(data))
    const maxMetaUrl = Object.keys(data).find(key => data[key] === maxValue)

    if (maxValue >= 0) {
      // It is whitelisted
      return new Response(`{"jsonRedirect":"/${maxMetaUrl}"}`)
    } else {
      // It is blacklisted
      const blackList = []
      for (const metaUrl in data) {
        if (data[metaUrl] < 0) {
          blackList.push({
            docurl: docUrl,
            metaurl: metaUrl
          })
        }
      }
      return new Response(JSON.stringify({
        jsonRedirect: alternativeUrl.substring(26),
        blacklist: blackList
      }))
    }
  }

  return new Response(`{"jsonRedirect":"/${alternativeUrl.substring(26)}"}`)
}

async function handleWhitelist (event, url) {
  const docUrl = url.searchParams.get('docurl')
  const metaUrl = url.searchParams.get('metaurl')

  if (docUrl && metaUrl) {
    const data = await getDocument(docUrl)

    if (metaUrl in data) {
      data[metaUrl]++
    } else {
      data[metaUrl] = 1
    }
    event.waitUntil(DATABASE.put(docUrl, JSON.stringify(data)))
  }

  const response = new Response(imageArray)
  response.headers.set('Content-Type', 'image/png')
  return response
}

async function handleBlacklist (event, url) {
  const docUrl = url.searchParams.get('docurl')
  const metaUrl = url.searchParams.get('metaurl')
  if (docUrl && metaUrl) {
    const data = await getDocument(docUrl)

    if (metaUrl in data) {
      data[metaUrl]--
    } else {
      data[metaUrl] = -1
    }
    event.waitUntil(DATABASE.put(docUrl, JSON.stringify(data)))
  }
  const response = new Response(imageArray)
  response.headers.set('Content-Type', 'image/png')
  return response
}
