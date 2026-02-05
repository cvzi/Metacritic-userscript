// ==UserScript==
// @name             Show Metacritic.com ratings
// @description      Show metacritic metascore and user ratings on: Bandcamp, Apple Itunes (Music), Amazon (Music,Movies,TV Shows), IMDb (Movies), Google Play (Music, Movies), Steam, Gamespot (PS4, XONE, PC), Rotten Tomatoes, Serienjunkies, BoxOfficeMojo, allmovie.com, fandango.com, Wikipedia (en), themoviedb.org, letterboxd, TVmaze, TVGuide, followshows.com, TheTVDB.com, ConsequenceOfSound, Pitchfork, Last.fm, TVnfo, rateyourmusic.com, GOG, Epic Games Store, save.tv
// @namespace        cuzi
// @icon             https://www.metacritic.com/a/img/favicon.svg
// @supportURL       https://github.com/cvzi/Metacritic-userscript/issues
// @contributionURL  https://buymeacoff.ee/cuzi
// @contributionURL  https://ko-fi.com/cuzicvzi
// @grant            unsafeWindow
// @grant            GM.xmlHttpRequest
// @grant            GM.setValue
// @grant            GM.getValue
// @grant            GM.registerMenuCommand
// @require          https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license          GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @antifeature      tracking When a metacritic rating is displayed, we may store the url of the current website and the metacritic url in our database. Log files are temporarily retained by our database hoster Cloudflare Workers® and contain your IP address and browser configuration.
// @version          110
// @connect          metacritic.com
// @connect          backend.metacritic.com
// @connect          met.acritic.workers.dev
// @connect          imdb.com
// @match            https://*.bandcamp.com/*
// @match            https://play.google.com/store/music/album/*
// @match            https://play.google.com/store/movies/details/*
// @match            https://music.amazon.com/*
// @match            https://www.amazon.ca/*
// @match            https://www.amazon.co.jp/*
// @match            https://www.amazon.co.uk/*
// @match            https://smile.amazon.co.uk/*
// @match            https://www.amazon.com.au/*
// @match            https://www.amazon.com.mx/*
// @match            https://www.amazon.com/*
// @match            https://smile.amazon.com/*
// @match            https://www.amazon.de/*
// @match            https://smile.amazon.de/*
// @match            https://www.amazon.es/*
// @match            https://www.amazon.fr/*
// @match            https://www.amazon.in/*
// @match            https://www.amazon.it/*
// @match            https://www.imdb.com/title/*
// @match            https://store.steampowered.com/app/*
// @match            https://www.gamespot.com/*
// @match            http://www.serienjunkies.de/*
// @match            https://www.serienjunkies.de/*
// @match            https://www.rottentomatoes.com/m/*
// @match            https://rottentomatoes.com/m/*
// @match            https://www.rottentomatoes.com/tv/*
// @match            https://rottentomatoes.com/tv/*
// @match            https://www.rottentomatoes.com/tv/*
// @match            https://rottentomatoes.com/tv/*
// @match            https://www.boxofficemojo.com/movies/*
// @match            https://www.boxofficemojo.com/release/*
// @match            https://www.allmovie.com/movie/*
// @match            https://en.wikipedia.org/*
// @match            https://www.fandango.com/*
// @match            https://flixster.com/movie/*
// @match            https://www.themoviedb.org/movie/*
// @match            https://www.themoviedb.org/tv/*
// @match            https://letterboxd.com/film/*
// @match            https://www.tvmaze.com/shows/*
// @match            https://www.tvguide.com/tvshows/*
// @match            https://followshows.com/show/*
// @match            https://thetvdb.com/series/*
// @match            https://thetvdb.com/movies/*
// @match            https://consequenceofsound.net/*
// @match            https://consequence.net/*
// @match            https://pitchfork.com/*
// @match            https://www.last.fm/*
// @match            https://tvnfo.com/tv/*
// @match            https://rateyourmusic.com/release/album/*
// @match            https://open.spotify.com/*
// @match            https://play.spotify.com/album/*
// @match            https://www.nme.com/reviews/*
// @match            https://www.albumoftheyear.org/album/*
// @match            https://itunes.apple.com/*
// @match            https://music.apple.com/*
// @match            https://epguides.com/*
// @match            https://www.epguides.com/*
// @match            https://www.netflix.com/*
// @match            https://www.cc.com/*
// @match            https://www.amc.com/*
// @match            https://www.amcplus.com/*
// @match            https://rlsbb.ru/*/
// @match            https://newalbumreleases.net/*
// @match            https://www.sho.com/*
// @match            https://www.epicgames.com/store/*
// @match            https://store.epicgames.com/*
// @match            https://www.gog.com/*
// @match            https://www.allmusic.com/album/*
// @match            https://www.steamgifts.com/giveaway/*
// @match            https://psa.wf/*
// @match            https://www.save.tv/*
// @match            https://www.wikiwand.com/*
// @match            https://trakt.tv/*
// @match            http://localhost:7878/*
// ==/UserScript==

/* globals alert, confirm, GM, DOMParser, $, Image, unsafeWindow, parent, Blob, failedImages */
/* jshint asi: true, esversion: 8 */

const scriptName = 'Show Metacritic.com ratings'

const baseURL = 'https://www.metacritic.com/'

const baseURLmusic = 'https://www.metacritic.com/music/'
const baseURLmovie = 'https://www.metacritic.com/movie/'
const baseURLpcgame = 'https://www.metacritic.com/game/'
const baseURLps4 = 'https://www.metacritic.com/game/'
const baseURLxone = 'https://www.metacritic.com/game/'
const baseURLtv = 'https://www.metacritic.com/tv/'

// const baseURLsearch = 'https://backend.metacritic.com/finder/metacritic/search/{query}/web?apiKey={apiKey}&componentName=search-tabs&componentDisplayName=Search+Page+Tab+Filters&componentType=FilterConfig&mcoTypeId={type}&offset=0&limit=30'
const baseURLsearch = 'https://backend.metacritic.com/finder/metacritic/search/{query}/web?componentName=search-tabs&componentDisplayName=Search+Page+Tab+Filters&componentType=FilterConfig&mcoTypeId={type}&offset=0&limit=30'

const baseURLdatabase = 'https://met.acritic.workers.dev/r.php'
const baseURLwhitelist = 'https://met.acritic.workers.dev/whitelist.php'
const baseURLblacklist = 'https://met.acritic.workers.dev/blacklist.php'

const TEMPORARY_BLACKLIST_TIMEOUT = 5 * 60

const windowPositions = [
  {
    bottom: 0,
    left: 0
  },
  {
    bottom: 0,
    right: 0
  },
  {
    top: 0,
    right: 0
  },
  {
    top: 0,
    left: 0
  }
]

// Detect dark theme of darkreader.org extension
const darkTheme = 'darkreaderScheme' in document.documentElement.dataset && document.documentElement.dataset.darkreaderScheme

let myDOMParser = null
function domParser () {
  if (myDOMParser === null) {
    myDOMParser = new DOMParser()
  }
  return myDOMParser
}

async function versionUpdate () {
  const version = parseInt(await GM.getValue('version', 0))
  if (version <= 105) {
    // Reset database
    await GM.setValue('map', '{}')
    await GM.setValue('black', '[]')
    await GM.setValue('hovercache', '{}')
    await GM.setValue('requestcache', '{}')
    await GM.setValue('temporaryblack', '{}')
    await GM.setValue('searchcache', false) // Unused
    await GM.setValue('autosearchcache', false) // Unused
  }
  if (version < 106) {
    await GM.setValue('version', 106)
  }
}

const BOX_CSS_DARK_THEME = `
#mcdiv123 {
  position: fixed;
  background-color: #262626;
  border: 2px solid #313131;
  color: white;
}

#mcisearchquery {
  background: #262626;
  color: white;
}

#mcisearchbutton {
  background: rgb(56, 56, 56);
  color: white;
  border: 2px solid white;
}
#mcdiv123 .grespinner {
  border-left: 6px solid rgba(0,174,239,.15);
  border-right: 6px solid rgba(0,174,239,.15);
  border-bottom: 6px solid rgba(0,174,239,.15);
  border-top: 6px solid rgba(0,174,239,.8);
}

#mcdiv123searchresults .result {
  border-top-color: #525252;
}


#mcdiv123searchresults .result .mcdiv123_score_badge {
  color: white;
}


#mcdiv123searchresults .result .mcdiv_release_date {
  color: silver
}

.mcdiv123_image_placeholder {
  background: rgb(64, 64, 64);
}

#mcdiv123searchresults .result a {
  color: #09f;
}

#mcdiv123searchresults .mcdiv_desc {
  scrollbar-color: #003c09 #00ce7a;
}
#mcdiv123searchresults .mcdiv_desc::-webkit-scrollbar-thumb {
  background-color: #003c09;
}
`

const BOX_CSS = `
  #mcdiv123 {
    position: fixed;
    background-color: #fff;
    border: 2px solid #bbb;
    border-radius: 6px;
    box-shadow: 0 0 3px 3px rgba(100, 100, 100, 0.2);
    color: #000;
    min-width: 150;
    max-height: 80%;
    max-width: 640;
    overflow: auto;
    padding: 3px;
    z-index: 2147483601;
  }

  #mcisearchquery {
    background: white;
    color: black;
    width: 450px;
    display: inline;
  }

  #mcisearchbutton {
    background: silver;
    color: black;
    border: 2px solid black;
    padding: 3px;
    display: inline;
    margin: 0px 5px;
    cursor: pointer;
  }

  /* http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/ */
  #mcdiv123 .grespinner {
    display: inline-block;
    height: 20px;
    width: 20px;
    margin: 0 auto;
    position: relative;
    animation: rotation .6s infinite linear;
    border-left: 6px solid rgba(0,174,239,.15);
    border-right: 6px solid rgba(0,174,239,.15);
    border-bottom: 6px solid rgba(0,174,239,.15);
    border-top: 6px solid rgba(0,174,239,.8);
    border-radius: 100%
  }

  @keyframes rotation {
    from {
      transform: rotate(0)
    }

    to {
      transform: rotate(359deg)
    }
  }

  #mcdiv123searchresults {
    font-size: 12px;
    max-width: 95%
  }

  .mcdiv123_correct_entry {
    cursor: pointer;
    color: green;
    font-size: 25px;
    margin-top: 10px;
  }
  .mcdiv123_correct_entry:hover {
    color: #41fd41;
  }

  .mcdiv123_incorrect {
    cursor: pointer;
    float: right;
    color: crimson;
    font-size: 11px;
  }
  .mcdiv123_incorrect {
    cursor: pointer;
    float: right;
    color: crimson;
    font-size: 15px;
    margin-right: 10px;
  }
  .mcdiv123_incorrect:hover {
    cursor: pointer;
    float: right;
    color: crimson;
    font-size: 15px;
    margin-right: 10px;
    border:2px solid white;
  }
  .mcdiv123_incorrect:hover {
    border-color: crimson;
  }

  #mcdiv123searchresults .result {
    font: 12px arial,helvetica,serif;
    border-top-width: 1px;
    border-top-color: #ccc;
    border-top-style: solid;
    padding: 5px
  }

  .mcdiv123_cover {
    max-width: 200px;
    max-height: 140px;
  }

  #mcdiv123searchresults .result .mcdiv123_score_badge {
    display: inline-block;
    margin: 3px;
    font-weight: 600;
    border-radius: 6px;
    color: black;
    padding: 5px;
  }

  #mcdiv123searchresults .result .floatleft {
    float: left;
  }

  #mcdiv123searchresults .result .clearleft {
    clear: left;
  }

  #mcdiv123searchresults .result .resultcontent {
    max-width: 360px;
    margin-left: 10px;
  }

  #mcdiv123searchresults .result .mcdiv_release_date {
    color: silver
  }

  .mcdiv123_image_placeholder {
    width: 82px;
    height: 82px;
    background: rgb(64, 64, 64);
    border-radius: 8px;
  }

  #mcdiv123searchresults .result a {
    color: #09f;
    font-weight: 700;
    text-decoration: none
  }

  #mcdiv123searchresults .mcdiv_desc {
    max-height:120px;
    overflow-y: auto;
    scrollbar-color: #d9d9d9 #eee;
    scrollbar-width: thin;
  }

  @media (prefers-color-scheme: dark) {
    ${BOX_CSS_DARK_THEME}
  }

  ${
    darkTheme ? BOX_CSS_DARK_THEME : ''
  }
`

async function acceptGDPR (showDialog) {
  if (showDialog === true) {
    await GM.setValue('gdpr', null)
    return acceptGDPR()
  }
  return new Promise(function (resolve) {
    GM.getValue('gdpr', null).then(function (value) {
      if (value === true) {
        return resolve(true)
      }
      if (value === false) {
        return resolve(false)
      }
      const html = '<h1>Privacy Policy for &quot;Show Metacritic.com ratings&quot;</h1><h2>General Data Protection Regulation (GDPR)</h2><p>We are a Data Controller of your information.</p> <p>&quot;Show Metacritic.com ratings&quot; legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:</p><ul> <li>&quot;Show Metacritic.com ratings&quot; needs to perform a contract with you</li> <li>You have given &quot;Show Metacritic.com ratings&quot; permission to do so</li> <li>Processing your personal information is in &quot;Show Metacritic.com ratings&quot; legitimate interests</li> <li>&quot;Show Metacritic.com ratings&quot; needs to comply with the law</li></ul> <p>&quot;Show Metacritic.com ratings&quot; will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p> <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us. Our Privacy Policy was generated with the help of <a href="https://www.gdprprivacypolicy.net/">GDPR Privacy Policy Generator</a> and the <a href="https://www.app-privacy-policy.com">App Privacy Policy Generator</a>.</p><p>In certain circumstances, you have the following data protection rights:</p><ul> <li>The right to access, update or to delete the information we have on you.</li> <li>The right of rectification.</li> <li>The right to object.</li> <li>The right of restriction.</li> <li>The right to data portability</li> <li>The right to withdraw consent</li></ul><h2>Log Files</h2><p>&quot;Show Metacritic.com ratings&quot; follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services\' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users\' movement on the website, and gathering demographic information.</p><h2>Privacy Policies</h2><P>You may consult this list to find the Privacy Policy for each of the advertising partners of &quot;Show Metacritic.com ratings&quot;.</p><p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on &quot;Show Metacritic.com ratings&quot;, which are sent directly to users\' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p><p>Note that &quot;Show Metacritic.com ratings&quot; has no access to or control over these cookies that are used by third-party advertisers.</p><h2>Third Party Privacy Policies</h2><p>&quot;Show Metacritic.com ratings&quot;\'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.List of these Privacy Policies and their links: <ul> <li>Cloudflare Workers®: <a href="https://www.cloudflare.com/privacypolicy/">https://www.cloudflare.com/privacypolicy/</a></li> <li>www.metacritic.com: <a href="https://privacy.cbs/">https://privacy.cbs/</a></li></ul></p><p>You can choose to disable cookies through your individual browser options.</p><h2>Children\'s Information</h2><p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p><p>&quot;Show Metacritic.com ratings&quot; does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p><h2>Online Privacy Policy Only</h2><p>Our Privacy Policy created at GDPRPrivacyPolicy.net) applies only to our online activities and is valid for users of our program with regards to the information that they shared and/or collect in &quot;Show Metacritic.com ratings&quot;. This policy is not applicable to any information collected offline or via channels other than this program. <a href="https://gdprprivacypolicy.net">Our GDPR Privacy Policy</a> was generated from the GDPR Privacy Policy Generator.</p><h2>Contact</h2><p>Contact us via github <a href="https://github.com/cvzi/Metacritic-userscript">https://github.com/cvzi/Metacritic-userscript</a> or email cuzi@openmail.cc</p><h2>Consent</h2><p>By using our program ("userscript"), you hereby consent to our Privacy Policy and agree to its terms.</p>'
      const div = document.body.appendChild(document.createElement('div'))
      div.innerHTML = html
      div.style = 'z-index:9999;position:absolute;min-height:100%;top:0px; left:0px; right:0px; padding:10px; background:white; color:black; font-family:serif; font-size:16px'
      div.appendChild(document.createElement('br'))
      const acceptButton = div.appendChild(document.createElement('button'))
      acceptButton.setAttribute('style', 'color:black;background:#e5e4e4;border:2px #bbb outset;margin:5px;padding:2px 10px;font-size:16px;font-family:sans-serif;cursor:pointer')
      acceptButton.appendChild(document.createTextNode('Accept'))
      acceptButton.addEventListener('click', function () {
        div.remove()
        resolve(true)
        GM.setValue('gdpr', true)
      })
      const declineButton = div.appendChild(document.createElement('button'))
      declineButton.setAttribute('style', 'color:black;background:#e5e4e4;border:2px #bbb outset;margin:5px;padding:2px 10px;font-size:16px;font-family:sans-serif;cursor:pointer')
      declineButton.appendChild(document.createTextNode('Decline'))
      declineButton.addEventListener('click', function () {
        alert('You may uninstall the userscript now.')
        div.remove()
        resolve(false)
        GM.setValue('gdpr', false)
      })
      const space = div.appendChild(document.createElement('div'))
      space.style = 'height:2000px;'
      div.scrollIntoView()
      window.setTimeout(function () {
        alert('ShowMetacriticRatings:\n\nWhen you use this script, data will be sent to our database and to metacritic.com. This data includes the url of the website that you are browsing, the metacritic page url, your IP adress, browser configuration and language preferences. We only store the url of the website and the metacritic url and no personal information. Log files are temporarily retained and contain your IP address. We have no control over which data is stored by metacritic.com and our hoster heroku.com, see their respective privacy policies for more information (see "Third Party Privacy Policies").\n\nPlease read and accept our privacy policy now or uninstall this userscript.')
      }, 20)
    })
  })
}

function delay (ms) {
  return new Promise(function (resolve) {
    window.setTimeout(() => resolve(), ms)
  })
}

function absoluteMetaURL (url) {
  if (url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('http://')) {
    return 'https' + url.substr(4)
  }
  if (url.startsWith('//')) {
    return baseURL + url.substr(2)
  }
  if (url.startsWith('/')) {
    return baseURL + url.substr(1)
  }
  url = url.replace('/game/pc/', '/game/').replace(/\/game\/playstation-\d\//, '/game/').replace('/game/xbox-one/', '/game/')
  return baseURL + url
}

const parseLDJSONCache = {}
function parseLDJSON (keys, condition) {
  if (document.querySelector('script[type="application/ld+json"]')) {
    const xmlEntitiesElement = document.createElement('div')
    const xmlEntitiesPattern = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig
    const xmlEntities = function (s) {
      s = s.replace(xmlEntitiesPattern, (m) => {
        xmlEntitiesElement.innerHTML = m
        return xmlEntitiesElement.textContent
      })
      return s
    }
    const decodeXmlEntities = function (jsonObj) {
      // Traverse through object, decoding all strings
      if (jsonObj !== null && typeof jsonObj === 'object') {
        Object.entries(jsonObj).forEach(([key, value]) => {
          // key is either an array index or object key
          jsonObj[key] = decodeXmlEntities(value)
        })
      } else if (typeof jsonObj === 'string') {
        return xmlEntities(jsonObj)
      }
      return jsonObj
    }

    const data = []
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    for (let i = 0; i < scripts.length; i++) {
      let jsonld
      if (scripts[i].innerText in parseLDJSONCache) {
        jsonld = parseLDJSONCache[scripts[i].innerText]
      } else {
        let text
        try {
          text = scripts[i].innerText
          text = text.replace(/^\/\*.*\*\//gm, '') // Replace comment lines
          jsonld = JSON.parse(text)
          parseLDJSONCache[scripts[i].innerText] = jsonld
        } catch (e) {
          parseLDJSONCache[scripts[i].innerText] = null
          console.warn(e, text)
          continue
        }
      }
      if (jsonld) {
        if (Array.isArray(jsonld)) {
          data.push(...jsonld)
        } else {
          data.push(jsonld)
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      try {
        if (data[i] && data[i] && (typeof condition !== 'function' || condition(data[i]))) {
          if (Array.isArray(keys)) {
            const r = []
            for (let j = 0; j < keys.length; j++) {
              r.push(data[i][keys[j]])
            }
            return decodeXmlEntities(r)
          } else if (keys) {
            return decodeXmlEntities(data[i][keys])
          } else if (typeof condition === 'function') {
            return decodeXmlEntities(data[i]) // Return whole object
          }
        }
      } catch (e) {
        continue
      }
    }
    return decodeXmlEntities(data)
  }
  return null
}

function name2metacritic (s) {
  const mc = s.normalize('NFKD').replace(/\//g, '').replace(/[\u0300-\u036F]/g, '').replace(/&/g, 'and').replace(/\W+/g, ' ').toLowerCase().trim().replace(/\W+/g, '-')
  if (!mc) {
    throw new Error("name2metacritic converted '" + s + "' to empty string")
  }
  return mc
}
function minutesSince (time) {
  const seconds = ((new Date()).getTime() - time.getTime()) / 1000
  return seconds > 60 ? parseInt(seconds / 60) + ' min ago' : 'now'
}
function randomStringId () {
  const id10 = () => Math.floor((1 + Math.random()) * 0x10000000000).toString(16).substring(1)
  return id10() + id10() + id10() + id10() + id10() + id10()
}
function fixMetacriticURLs (html) {
  return html.replace(/<a /g, '<a target="_blank" ').replace(/href="\//g, 'href="' + baseURL).replace(/src="\//g, 'src="' + baseURL)
}
function searchType2fandomProdApigee (type) {
  return ({
    tv: '1',
    movie: '2',
    pcgame: '13',
    xonegame: '13',
    ps4game: '13',
    music: '4' // TODO this is probably wrong, music seems to be unsupported at the moment
  })[type]
}
function fandomProdApigee2metacriticUrl (type) {
  return ({
    1: 'tv',
    2: 'movie',
    13: 'game',
    4: 'music' // TODO this is probably wrong, music seems to be unsupported at the moment
  })[type]
}

function badgeColor (score, type = '') {
  const colors = {
    universalAcclaim: '#6c3',
    generallyFavorable: '#00ce7a',
    mixedOrAverage: '#ffbd3f',
    generallyUnfavorable: '#ff6874',
    overwhelmingDislike: '#f00',
    tbd: '#fff'
  }

  if (type.indexOf('game') !== -1) {
    if (score > 89) {
      return colors.universalAcclaim
    }
    if (score > 74) {
      return colors.generallyFavorable
    }
    if (score > 49) {
      return colors.mixedOrAverage
    }
    if (score > 19) {
      return colors.generallyUnfavorable
    }
    if (score > 0) {
      return colors.overwhelmingDislike
    }
    return colors.tbd
  } else {
    if (score > 80) {
      return colors.universalAcclaim
    }
    if (score > 60) {
      return colors.generallyFavorable
    }
    if (score > 39) {
      return colors.mixedOrAverage
    }
    if (score > 19) {
      return colors.generallyUnfavorable
    }
    if (score > 0) {
      return colors.overwhelmingDislike
    }
    return colors.tbd
  }
}

function replaceBrackets (str) {
  str = str.replace(/\([^(]*\)/g, '')
  str = str.replace(/\[[^\]]*\]/g, '')
  return str.trim()
}
function removeSymbols (str) {
  str = str.replace(/[^\s0-9A-Za-zÀ-ÖØ-öø-ÿ]*/gi, '').trim()
  return str.trim()
}
const dashRegExp = /[-\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D]/
function removeAnythingAfterDash (str) {
  str = str.split(dashRegExp)[0]
  return str.trim()
}

function broadenSearch (data, step, type) {
  if (type === 'pcgame') {
    if (step > 0) {
      data[0] = replaceBrackets(data[0])
    } else if (step > 1) {
      data[0] = removeSymbols(data[0])
    } else if (step > 2) {
      data[0] = removeAnythingAfterDash(data[0])
    }
  } else {
    data = data.map(removeSymbols)
  }
  return data
}

function balloonAlert (message, timeout, title, css, click) {
  let header
  if (title) {
    header = '<div style="background:rgb(220,230,150); padding: 2px 12px;">' + title + '</div>'
  } else if (title === false) {
    header = ''
  } else {
    header = '<div style="background:rgb(220,230,150); padding: 2px 12px;">Userscript alert</div>'
  }
  const div = $('<div>' + header + '<div style="padding:5px">' + message.split('\n').join('<br>') + '</div></div>')
  div.css({
    position: 'fixed',
    top: 10,
    left: 10,
    maxWidth: 200,
    zIndex: '2147483601',
    background: 'rgb(240,240,240)',
    border: '2px solid yellow',
    borderRadius: '6px',
    boxShadow: '0 0 3px 3px rgba(100, 100, 100, 0.2)',
    fontFamily: 'sans-serif',
    color: 'black'
  })
  if (css) {
    div.css(css)
  }
  div.appendTo(document.body)

  if (click) {
    div.click(function (ev) {
      $(this).hide(500)
      click.call(this, ev)
    })
  }

  if (!click) {
    const close = $('<div title="Close" style="cursor:pointer; position:absolute; top:0px; right:3px;">&#10062;</div>').appendTo(div)
    close.click(function () {
      $(this.parentNode).hide(1000)
    })
  }

  if (timeout && timeout > 0) {
    window.setTimeout(function () {
      div.hide(3000)
    }, timeout)
  }
  return div
}

function filterUniversalUrl (url) {
  try {
    url = url.match(/http.+/)[0]
  } catch (e) { }

  try {
    url = url.replace(/https?:\/\/(www.)?/, '')
  } catch (e) { }

  if (url.indexOf('#') !== -1) {
    url = url.split('#')[0]
  }

  if (url.startsWith('imdb.com/') && url.match(/(imdb\.com\/\w+\/\w+\/)/)) {
    // Remove movie subpage from imdb url
    return url.match(/(imdb\.com\/\w+\/\w+\/)/)[1]
  } else if (url.startsWith('boxofficemojo.com/') && url.indexOf('id=') !== -1) {
    // Keep the important id= on
    try {
      const parts = url.split('?')
      const page = parts[0] + '?'
      const idparam = parts[1].match(/(id=.+?)(\.|&)/)[1]
      return page + idparam
    } catch (e) {
      return url
    }
  } else {
    // Default: Remove parameters
    return url.split('?')[0].split('&')[0]
  }
}

async function addToMap (url, metaurl) {
  const data = JSON.parse(await GM.getValue('map', '{}'))

  url = filterUniversalUrl(url)
  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')

  data[url] = metaurl

  await GM.setValue('map', JSON.stringify(data));

  (new Image()).src = baseURLwhitelist + '?docurl=' + encodeURIComponent(url) + '&metaurl=' + encodeURIComponent(metaurl) + '&ref=' + encodeURIComponent(randomStringId())
  return [url, metaurl]
}

async function addToTemporaryBlacklist (metaurl) {
  const data = JSON.parse(await GM.getValue('temporaryblack', '{}'))

  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')
  metaurl = metaurl.replace(/\/\//g, '/').replace(/\/\//g, '/')
  metaurl = metaurl.replace(/^\/+/, '')

  data[metaurl] = (new Date()).toJSON()

  // Remove old entries
  const now = (new Date()).getTime()
  const timeout = TEMPORARY_BLACKLIST_TIMEOUT * 1000
  for (const prop in data) {
    if (now - (new Date(data[prop].time)).getTime() > timeout) {
      delete data[prop]
    }
  }

  await GM.setValue('temporaryblack', JSON.stringify(data))

  return true
}

async function removeFromTemporaryBlacklist (metaurl) {
  const data = JSON.parse(await GM.getValue('temporaryblack', '{}'))

  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')
  metaurl = metaurl.replace(/\/\//g, '/').replace(/\/\//g, '/')
  metaurl = metaurl.replace(/^\/+/, '')

  if (metaurl in data) {
    delete data[metaurl]
    await GM.setValue('temporaryblack', JSON.stringify(data))
  }
}

async function isTemporaryBlacklisted (metaurl) {
  const data = JSON.parse(await GM.getValue('temporaryblack', '{}'))

  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')
  metaurl = metaurl.replace(/\/\//g, '/').replace(/\/\//g, '/')
  metaurl = metaurl.replace(/^\/+/, '')

  if (metaurl in data) {
    const now = (new Date()).getTime()
    const timeout = TEMPORARY_BLACKLIST_TIMEOUT * 1000
    if (now - (new Date(data[metaurl])).getTime() < timeout) {
      return true
    }
  }
  return false
}

async function addToBlacklist (url, metaurl) {
  const data = JSON.parse(await GM.getValue('black', '[]'))

  url = filterUniversalUrl(url)
  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')

  data.push([url, metaurl])

  await GM.setValue('black', JSON.stringify(data));

  (new Image()).src = baseURLblacklist + '?docurl=' + encodeURIComponent(url) + '&metaurl=' + encodeURIComponent(metaurl) + '&ref=' + encodeURIComponent(randomStringId())
  return [url, metaurl]
}

async function removeFromBlacklist (docurl, metaurl) {
  docurl = filterUniversalUrl(docurl)
  docurl = docurl.replace(/https?:\/\/(www.)?/, '')

  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')
  metaurl = metaurl.replace(/\/\//g, '/').replace(/\/\//g, '/') // remove double slash
  metaurl = metaurl.replace(/^\/+/, '') // remove starting slash

  const data = JSON.parse(await GM.getValue('black', '[]')) // [ [docurl0, metaurl0] , [docurl1, metaurl1] , ... ]
  const found = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === docurl && data[i][1] === metaurl) {
      found.push(i)
    }
  }
  for (let i = found.length - 1; i >= 0; i--) {
    data.pop(i)
  }

  await GM.setValue('black', JSON.stringify(data))
}

async function isBlacklistedUrl (docurl, metaurl) {
  docurl = filterUniversalUrl(docurl)
  docurl = docurl.replace(/https?:\/\/(www.)?/, '')

  metaurl = metaurl.replace(/^https?:\/\/(www.)?metacritic\.com\//, '')
  metaurl = metaurl.replace(/\/\//g, '/').replace(/\/\//g, '/') // remove double slash
  metaurl = metaurl.replace(/^\/+/, '') // remove starting slash

  const data = JSON.parse(await GM.getValue('black', '[]')) // [ [docurl0, metaurl0] , [docurl1, metaurl1] , ... ]
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === docurl && data[i][1] === metaurl) {
      return true
    }
  }
  return false
}

let listenForHotkeysActive = false
function listenForHotkeys (code, cb) {
  // Call cb() as soon as the code sequence was typed
  if (listenForHotkeysActive) {
    return
  }
  listenForHotkeysActive = true
  let i = 0
  $(document).bind('keydown.listenForHotkeys', function (ev) {
    if (document.activeElement === document.body) {
      if (ev.key !== code[i]) {
        i = 0
      } else {
        i++
        if (i === code.length) {
          ev.preventDefault()
          $(document).unbind('keydown.listenForHotkeys')
          cb()
        }
      }
    }
  })
}

function waitForHotkeysMETA () {
  listenForHotkeys('meta', (ev) => openSearchBox())
}

async function handleJSONredirect (response) {
  let blacklistedredirect = false
  const j = JSON.parse(response.responseText)

  // Blacklist items from database received?
  if ('blacklist' in j && j.blacklist && j.blacklist.length) {
    // Save new blacklist items
    const data = JSON.parse(await GM.getValue('black', '[]'))
    for (let i = 0; i < j.blacklist.length; i++) {
      const saveDocurl = j.blacklist[i].docurl
      const saveMetaurl = j.blacklist[i].metaurl

      data.push([saveDocurl, saveMetaurl])
      if (j.jsonRedirect === '/' + saveMetaurl) {
        // Redirect is blacklisted!
        blacklistedredirect = true
      }
    }
    await GM.setValue('black', JSON.stringify(data))
  }
  if (blacklistedredirect) {
    // Redirect was blacklisted, show nothing
    console.debug('ShowMetacriticRatings: Redirect was blacklisted -> show nothing')
    return null
  } else {
    // Load redirect
    current.metaurl = absoluteMetaURL(j.jsonRedirect)
    response = await asyncRequest({
      url: current.metaurl
    }).catch(function (response) {
      console.error('ShowMetacriticRatings: Error 01')
    })
    return response
  }
}

function extractHoverFromFullPage (response) {
  let html = 'ShowMetacriticRatings:<br>Error occured in extractHoverFromFullPage()'
  try {
    // Try parsing HTML
    const doc = domParser().parseFromString(response.responseText, 'text/html')

    let content = null
    // Try to get the review containers from the bottom of the page below the actors
    const carouselItems = doc.querySelectorAll('.c-reviewsSection_carouselContainer .c-reviewsOverview_overviewDetails')
    if (carouselItems.length > 0) {
      content = Array.from(carouselItems).map(e => e.outerHTML).join('\n\n')
    } else {
      // Fallback: Try to get the review containers from the right side of the page next to the poster/screenshot
      content = doc.querySelector('.c-productHero_scoreInfo').innerHTML
    }

    // Get the current platform title:
    if (doc.querySelector('.c-ProductHeroGamePlatformInfo title')) {
      content = `<div class="mci_current_platform_title">Platform: ${doc.querySelector('.c-ProductHeroGamePlatformInfo title').textContent}</div>\n\n${content}`
    }

    // Get the game row with the other platform scores
    const gameRow = doc.querySelector('.c-PageProductGame_row')
    if (gameRow) {
      // Get the currently selected platform
      const latestCriticReviewsLink = doc.querySelector('a.c-sectionHeader_urlLink[href*="platform="]')
      let platform = null
      if (latestCriticReviewsLink) {
        platform = latestCriticReviewsLink.href.match(/platform=([^&]+)/)[1]
        content += `\n\n<input type="hidden" id="mci_current_platform" value="${platform}"/>`
      }

      // Remove platforms that don't have a score
      gameRow.querySelectorAll('.c-gamePlatformTile[to]').forEach(e => e.remove())
      // Remove the currently selected platform
      if (platform) {
        gameRow.querySelectorAll(`a.c-gamePlatformTile[href*="platform=${platform}"]`).forEach(e => e.remove())
      }
      // Replace the platform icon with the platform name
      gameRow.querySelectorAll('.c-gamePlatformTile-description').forEach(e => {
        if (e.querySelector('svg title')) {
          e.textContent = e.querySelector('svg title').textContent
        }
      })
      content += `\n\n<div class="game_row_5456d45" style="display:none">${gameRow.innerHTML}</div>`
    }

    if (!content) {
      throw new Error('No content found')
    }

    html = `
<div id="hover_div_a20230915">

${content}

</div>
  `
  } catch (e) {
    console.warn('ShowMetacriticRatings: Error parsing HTML: ' + e)
    // fallback to cutting out the relevant parts
    const parts = response.responseText.split('c-productHero_score-container')

    html = '<div class="' + parts[1].split('c-ratingReviewWrapper')[0] + '"></div></div>'
    if (html.length > 5000) {
      // Probably something went wrong, let's cut the response to prevent too long content
      console.warn('ShowMetacriticRatings: Cutting response to 5000 chars')
      html = html.substring(0, 5000)
    }
  }
  return html
}

function asyncRequest (data) {
  return new Promise(function (resolve, reject) {
    isInRequestCache(data).then(function (cachedValue) {
      if (cachedValue) {
        console.debug(`${scriptName}: asyncRequest() Cache hit for`, data)
        return window.setTimeout(() => resolve(cachedValue), 10)
      }
      const defaultHeaders = {
        Referer: data.url,
        'User-Agent': navigator.userAgent
      }
      const defaultData = {
        method: 'GET',
        onload: function (response) {
          storeInRequestCache(data, response)
          resolve(response)
        },
        onerror: (response) => reject(response)
      }
      if ('headers' in data) {
        data.headers = Object.assign(defaultHeaders, data.headers)
      } else {
        data.headers = defaultHeaders
      }
      data = Object.assign(defaultData, data)
      console.debug(`${scriptName}: asyncRequest() GM.xmlHttpRequest`, data)
      GM.xmlHttpRequest(data)
    })
  })
}

async function storeInRequestCache (requestData, response) {
  const newkey = JSON.stringify({
    url: requestData.url,
    method: requestData.method || 'GET',
    data: requestData.data || null
  })
  const cache = JSON.parse(await GM.getValue('requestcache', '{}'))
  const now = (new Date()).getTime()
  const timeout = 15 * 60 * 1000
  for (const prop in cache) {
    // Delete cached values, that are older than 15 minutes
    if (now - (new Date(cache[prop].time)).getTime() > timeout) {
      delete cache[prop]
    }
  }

  const newobj = {}
  for (const key in response) {
    newobj[key] = response[key]
  }
  newobj.responseText = '' + response.responseText
  newobj.cached = true
  if (!('time' in newobj)) {
    newobj.time = (new Date()).toJSON()
  }

  cache[newkey] = newobj

  await GM.setValue('requestcache', JSON.stringify(cache))
}

async function isInRequestCache (requestData) {
  const key = JSON.stringify({
    url: requestData.url,
    method: requestData.method || 'GET',
    data: requestData.data || null
  })

  const cache = JSON.parse(await GM.getValue('requestcache', '{}'))
  const now = (new Date()).getTime()
  const timeout = 15 * 60 * 1000
  for (const prop in cache) {
    // Delete cached values, that are older than 15 minutes
    if (now - (new Date(cache[prop].time)).getTime() > timeout) {
      delete cache[prop]
    }
  }

  if (key in cache) {
    return cache[key]
  } else {
    return false
  }
}

async function storeInHoverCache (metaurl, response, orgMetaUrl) {
  const cache = JSON.parse(await GM.getValue('hovercache', '{}'))
  const now = (new Date()).getTime()
  const timeout = 2 * 60 * 60 * 1000
  for (const prop in cache) {
    // Delete cached values, that are older than 2 hours
    if (now - (new Date(cache[prop].time)).getTime() > timeout) {
      delete cache[prop]
    }
  }

  const newobj = {}
  for (const key in response) {
    newobj[key] = response[key]
  }
  newobj.responseText = '' + response.responseText
  newobj.cached = true
  if (!('time' in newobj)) {
    newobj.time = (new Date()).toJSON()
  }

  cache[metaurl] = newobj
  if (orgMetaUrl && orgMetaUrl !== metaurl) { // Store redirect
    cache[orgMetaUrl] = { time: (new Date()).toJSON(), redirect: metaurl }
  }

  await GM.setValue('hovercache', JSON.stringify(cache))
}

async function isInHoverCache (metaurl) {
  const cache = JSON.parse(await GM.getValue('hovercache', '{}'))
  const now = (new Date()).getTime()
  const timeout = 2 * 60 * 60 * 1000
  for (const prop in cache) {
    // Delete cached values, that are older than 2 hours
    if (now - (new Date(cache[prop].time)).getTime() > timeout) {
      delete cache[prop]
    }
  }

  function resolveRedirects (cacheEntry) {
    if (cacheEntry.redirect) {
      const newkey = cacheEntry.redirect
      if (newkey in cache) {
        const value = cache[newkey]
        delete cache[newkey]
        return resolveRedirects(value)
      }
    } else {
      return cacheEntry
    }
    return false
  }

  if (metaurl in cache) {
    const value = cache[metaurl]
    delete cache[metaurl]
    return resolveRedirects(value)
  } else {
    return false
  }
}

async function loadHoverInfo () {
  const cacheResponse = await isInHoverCache(current.metaurl)
  if (cacheResponse !== false) {
    console.debug(`ShowMetacriticRatings: loadHoverInfo () ${current.metaurl} found in hover cache`)
    if (cacheResponse.responseText.indexOf('"jsonRedirect"') !== -1) {
      return await handleJSONredirect(cacheResponse)
    }
    return cacheResponse
  }
  const requestURL = baseURLdatabase
  const requestParams = 'm=' + encodeURIComponent(current.docurl) + '&a=' + encodeURIComponent(current.metaurl)

  let response = await asyncRequest({
    method: 'POST',
    url: requestURL,
    data: requestParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).catch(function (response) {
    console.warn('ShowMetacriticRatings: Error 02\nurl=' + requestURL + '\nparams=' + requestParams + '\nstatus=' + response.status)
  })

  if (response.responseText && response.responseText.indexOf('"jsonRedirect"') !== -1) {
    response = await handleJSONredirect(response)
  }

  if (response.status >= 500) {
    // Metacritic server error, try again after 2 seconds
    console.warn('ShowMetacriticRatings: Metacritic server error\nwait 2s for retry\nurl=' + current.metaurl + '\nstatus=' + response.status)
    await delay(2000)
    response = await asyncRequest({ url: current.metaurl }).catch(function (response) {
      console.warn('ShowMetacriticRatings: Error 06\nurl=' + current.metaurl + '\nstatus=' + response.status)
    })
    if (response.status > 300) {
      console.warn('ShowMetacriticRatings: Metacritic server error. Error 07. Retry failed as well.\nurl=' + current.metaurl + '\nstatus=' + response.status)
    } else {
      const newobj = {}
      for (const key in response) {
        newobj[key] = response[key]
      }
      newobj.responseText = extractHoverFromFullPage(response)
      response = newobj
    }
  }

  // Extract relevant data from HTML
  if (!('time' in response)) {
    response.time = (new Date()).toJSON()
  }
  if (response.status === 200 && response.responseText) {
    const newobj = {}
    for (const key in response) {
      newobj[key] = response[key]
    }
    newobj.responseText = extractHoverFromFullPage(response)
    response = newobj
    return response
  } else {
    const error = new Error('ShowMetacriticRatings: loadHoverInfo()\nUrl: ' + response.finalUrl + '\nStatus: ' + response.status)
    error.status = response.status
    error.responseText = response.responseText
    throw error
  }
}

function changePosition () {
  // Cycle through positions
  GM.getValue('position', JSON.stringify(windowPositions[0])).then(function (s) {
    let index
    for (index = 0; index < windowPositions.length; index++) {
      if (JSON.stringify(windowPositions[index]) === s) {
        break
      }
    }
    const nextIndex = (index + 1) % windowPositions.length
    GM.setValue('position', JSON.stringify(windowPositions[nextIndex])).then(function () {
      document.location.reload()
    })
  })
}

function onSizeChanged () {
  GM.getValue('size', 100).then(function (size) {
    if (size && size !== 100) {
      size = parseInt(size)
      $('#mcdiv123').css('transform', `scale(${size}%)`)
    }
  })
}

function changeSizeEnlarge () {
  GM.getValue('size', 100).then((size) => {
    GM.setValue('size', parseInt(size) + 5).then(onSizeChanged)
  })
}

function changeSizeShrink () {
  GM.getValue('size', 100).then((size) => {
    GM.setValue('size', parseInt(size) - 5).then(onSizeChanged)
  })
}

const current = {
  metaurl: false,
  docurl: false,
  type: false,
  data: [], // Array of raw search keys
  searchTerm: false,
  product: null,
  broadenCounter: 0
}

async function onBlacklistedPage () {
  GM.registerMenuCommand('Show Metacritic.com ratings - Remove from Blacklist', () => removeFromBlacklistAndReload())
}

async function removeFromBlacklistAndReload () {
  await removeFromBlacklist(current.docurl, current.metaurl)
  await removeFromTemporaryBlacklist(current.metaurl)
  main()
}

async function loadMetacriticUrl (fromSearch) {
  if (!current.metaurl) {
    alert('ShowMetacriticRatings: Error 04')
    return
  }
  const orgMetaUrl = current.metaurl
  if (await isBlacklistedUrl(document.location.href, current.metaurl)) {
    waitForHotkeysMETA()
    onBlacklistedPage()
    return
  }

  if (await isTemporaryBlacklisted(current.metaurl)) {
    console.debug(`ShowMetacriticRatings: loadMetacriticUrl(fromSearch=${fromSearch}) ${current.metaurl} is temporary blacklisted`)
    waitForHotkeysMETA()
    onBlacklistedPage()
    return
  }

  const response = await loadHoverInfo().catch(async function (response) {
    if (response instanceof Error || (response && response.stack && response.message)) {
      if (!fromSearch && ('status' in response && response.status === 404)) {
        console.debug('ShowMetacriticRatings: loadMetacriticUrl(): status=404', response)
        // No results
        let broadenFct = broadenSearch // global broadenSearch function is the default
        if ('broaden' in current.product) {
          // try product 'broaden'-function if it is defined
          broadenFct = current.product.broaden
        }
        const newData = await broadenFct(current.data.slice(0), ++current.broadenCounter, current.type)
        if (JSON.stringify(newData) !== JSON.stringify(current.data)) {
          current.data = newData
          metacritic[current.type](current.docurl, current.product, ...newData)
        } else if (JSON.stringify(newData) === JSON.stringify(current.data)) {
          // Same data as before, try once again to broaden
          const newData2 = await broadenFct(current.data.slice(0), ++current.broadenCounter, current.type)
          if (JSON.stringify(newData2) !== JSON.stringify(current.data)) {
            current.data = newData2
            metacritic[current.type](current.docurl, current.product, ...newData2)
          } else {
            console.debug('ShowMetacriticRatings: loadMetacriticUrl(): ' + ('broaden' in current.product ? 'product specific' : 'global') + " 'broaden search' did not change after " + current.broadenCounter + ' steps')
          }
        } else {
          console.debug("ShowMetacriticRatings: loadMetacriticUrl(): Unexpected result from 'broaden'-function: ", newData)
        }
      } else {
        console.error(`ShowMetacriticRatings: loadMetacriticUrl(fromSearch=${fromSearch}) current.metaurl = ${current.metaurl}. Error in loadHoverInfo():\n`, response)
      }
    }

    if (!fromSearch) {
      startSearch()
    }
  })

  if (await isBlacklistedUrl(document.location.href, current.metaurl)) {
    waitForHotkeysMETA()
    onBlacklistedPage()
    return
  }

  if (typeof response !== 'undefined') {
    showHoverInfo(response, orgMetaUrl)
  } else {
    waitForHotkeysMETA()
  }
}

async function startSearch () {
  waitForHotkeysMETA()

  if (current.type === 'music') {
    current.searchTerm = current.data[0]
  } else {
    current.searchTerm = current.data.join(' ')
  }
  const items = await fandomProdApigeeSearch(current.searchTerm, current.type)

  if (!items) {
    alert('ShowMetacriticRatings: Error 05 item=', items)
  }

  let multiple = false
  if (items.length === 0) {
    // No results
    console.debug('ShowMetacriticRatings: No results for searchTerm=' + current.searchTerm)
  } else if (items.length === 1) {
    // One result, let's show it
    const itemURL = absoluteMetaURL(items[0].metacriticUrl)
    if (!await isBlacklistedUrl(document.location.href, itemURL)) {
      current.metaurl = itemURL
      loadMetacriticUrl(true)
      return
    } else {
      onBlacklistedPage()
      return
    }
  } else {
    // More than one result
    multiple = true
    console.debug('ShowMetacriticRatings: Multiple results for searchTerm=' + current.searchTerm)
    const exactMatches = []
    items.forEach(function (result, i) { // Try to find the correct result by matching the search term to exactly one movie title
      if (current.searchTerm.toLowerCase() === result.title.toLowerCase()) {
        exactMatches.push(result)
      }
    })
    if (exactMatches.length === 0) {
      // Try to be a bit more fuzzy
      items.forEach(function (result, i) {
        if (removeSymbols(current.searchTerm.toLowerCase()) === removeSymbols(result.title.toLowerCase())) {
          exactMatches.push(result)
        }
      })
    }
    if (exactMatches.length === 1) {
      // Only one exact match, let's show it
      console.debug('ShowMetacriticRatings: Only one exact match for searchTerm=' + current.searchTerm)
      const itemURL = absoluteMetaURL(exactMatches[0].metacriticUrl)
      if (!await isBlacklistedUrl(document.location.href, itemURL)) {
        current.metaurl = itemURL
        loadMetacriticUrl(true)
        return
      } else {
        onBlacklistedPage()
        return
      }
    }
  }

  // HERE: multiple results or no result. The user may type "meta" now
  if (multiple) {
    balloonAlert('Multiple metacritic results. Type &#34;meta&#34; for manual search.', 10000, false, { bottom: 5, top: 'auto', maxWidth: 400, paddingRight: 5, cursor: 'pointer' }, () => openSearchBox(true))
  }
}

function openSearchBox (search) {
  let query
  if (current.type === 'music') {
    query = current.data[0]
  } else {
    query = current.data.join(' ')
  }
  $('#mcdiv123').remove()

  const div = $('<div id="mcdiv123"></div>').appendTo(document.body)
  div.css({
    minWidth: 300,
    bottom: 0,
    left: 0
  })

  GM.getValue('position', false).then(function (s) {
    if (s) {
      div.css({
        top: '',
        left: '',
        bottom: '',
        right: ''
      })
      div.css(JSON.parse(s))
    }
  })

  $('<input type="text" id="mcisearchquery">').appendTo(div).focus().val(query).on('keypress', function (e) {
    const code = e.keyCode || e.which
    if (code === 13) { // Enter key
      searchBoxSearch(e, $('#mcisearchquery').val())
    }
  })
  $('<button id="mcisearchbutton">').text('Search').appendTo(div).click((ev) => searchBoxSearch(ev, $('#mcisearchquery').val()))
}

/*
async function getFandomProdApigeeApiKey () {
  let apiKey = await GM.getValue('fandomProdApigeeKey', false)
  if (!apiKey) {
    apiKey = await findFandomProdApigeeApiKey()
  }

  const lastUpdate = await GM.getValue('fandomProdApigeeTime', false)
  if (!lastUpdate || (new Date()).getTime() - (new Date(lastUpdate)).getTime() > 7 * 24 * 60 * 60 * 1000) {
    // Update api key once a week
    const newApiKey = await findFandomProdApigeeApiKey()
    if (newApiKey) {
      apiKey = newApiKey
    }
  }

  if (!apiKey) {
    console.debug('ShowMetacriticRatings: Fallback to hard-coded api key')
    apiKey = '1MOZgmNFxvmljaQR1X9KAij9Mo4xAY3u'
  }
  return apiKey
}

async function findFandomProdApigeeApiKey () {
  // Get a new Api key from the metacritic website search results page
  const url = 'https://www.metacritic.com/search/Fly/'
  try {
    const response = await asyncRequest({ url })
    const m = response.responseText.match(/\?apiKey=(\w{20,})/)
    if (m) {
      const apiKey = m[1]
      console.debug('ShowMetacriticRatings: Api key updated', apiKey)
      await GM.setValue('fandomProdApigeeKey', apiKey)
      await GM.setValue('fandomProdApigeeTime', (new Date()).toJSON())
      return apiKey
    }
  } catch (e) {
    console.error('ShowMetacriticRatings: findFandomProdApigeeApiKey() Error:', e)
  }
  console.error('ShowMetacriticRatings: Could not find fandomProdApigee api key')
  return false
}
  */

async function fandomProdApigeeSearch (query, searchType) {
  // const apiKey = await getFandomProdApigeeApiKey()

  const type = searchType2fandomProdApigee(searchType)
  // const url = baseURLsearch.replace('{type}', encodeURIComponent(type)).replace('{query}', encodeURIComponent(query)).replace('{apiKey}', encodeURIComponent(apiKey))
  const url = baseURLsearch.replace('{type}', encodeURIComponent(type)).replace('{query}', encodeURIComponent(query))

  const response = await asyncRequest({ url })

  if (response.status !== 200) {
    console.error('ShowMetacriticRatings: fandomProdApigeeSearch() response != 200: ', response)
  }

  const obj = JSON.parse(response.responseText)
  return obj.data.items.map(item => {
    // Improve results by adding the metacritic url
    let itemUrl = 'criticScoreSummary' in item && 'url' in item.criticScoreSummary ? item.criticScoreSummary.url : null
    if (!itemUrl) {
      itemUrl = `${baseURL}${fandomProdApigee2metacriticUrl(item.typeId)}/${item.slug}/`
    }
    item.metacriticUrl = itemUrl.replace('/critic-reviews/', '/')
    return item
  })
}

async function searchBoxSearch (ev, query) {
  if (!query) { // Use values from search form
    query = current.searchTerm
  }

  const div = $('#mcdiv123')
  div.css({
    minWidth: '550px'
  })
  const loader = $('<div class="grespinner"></div>').appendTo($('#mcisearchbutton'))

  const resultItems = await fandomProdApigeeSearch(query, current.type).catch(function (response) {
    alert('Search failed!\n' + response.finalUrl + '\nStatus: ' + response.status + '\n' + response.responseText ? response.responseText.substring(0, 500) : 'Empty response')
  })

  const results = []
  resultItems.forEach(item => {
    let img = `<svg class="mcdiv123_image_placeholder" viewBox="0 0 176 40"">
      <path d="M17.2088 32.937L20.6188 29.527L14.0522 22.9604C13.7757 22.6839 13.4762 22.3383 13.3149 21.9466C12.9462 21.1632 12.7849 19.942 13.6835 19.0434C14.7895 17.9375 16.2641 18.3983 17.6926 19.8268L24.0058 26.14L27.4159 22.73L20.8262 16.1403C20.5497 15.8638 20.2271 15.4491 20.0659 15.1034C19.6281 14.2049 19.6511 13.0758 20.4576 12.2694C21.5866 11.1404 23.0612 11.5551 24.6971 13.191L30.8259 19.3199L34.236 15.9099L27.6002 9.27409C24.2362 5.91013 21.0796 6.02534 18.9138 8.19118C18.0843 9.02065 17.5774 9.8962 17.324 10.887C17.1166 11.7395 17.0475 12.6841 17.2318 13.6979L17.1857 13.744C15.5268 13.0528 13.6374 13.4675 12.1859 14.9191C10.2504 16.8545 10.3196 18.9052 10.55 20.1033L10.4809 20.1724L8.79888 18.813L5.84965 21.7622C6.88648 22.7069 8.1307 23.859 9.53619 25.2645L17.2088 32.937V32.937Z"></path> <path d="M19.9822 8.05032e-06C14.6789 0.00472041 9.59462 2.11554 5.84741 5.86828C2.10021 9.62102 -0.00310998 14.7084 3.45157e-06 20.0117C0.00307557 25.315 2.11239 30.4 5.86407 34.1484C9.61575 37.8968 14.7026 40.0016 20.006 40C25.3093 39.9984 30.3949 37.8906 34.1443 34.14C37.8938 30.3893 40.0001 25.3031 40 19.9998V19.9764C39.9938 14.6731 37.8814 9.58935 34.1275 5.8432C30.3736 2.09705 25.2855 -0.00474688 19.9822 8.05032e-06ZM19.8908 4.27438C24.0447 4.27063 28.0301 5.91689 30.9704 8.85113C33.9107 11.7854 35.5652 15.7673 35.57 19.9212V19.9393C35.57 24.0932 33.9201 28.0769 30.9833 31.0145C28.0465 33.9522 24.0632 35.6031 19.9093 35.6043C15.7555 35.6055 11.7712 33.9569 8.83271 31.0209C5.89421 28.085 4.24207 24.1022 4.23964 19.9484C4.23727 15.7946 5.88474 11.8099 8.81975 8.87064C11.7548 5.93134 15.737 4.27808 19.8908 4.27438Z"></path> <path d="M46.5464 27.9426H51.1377V19.1013C51.1377 18.7291 51.1687 18.2948 51.3238 17.9225C51.603 17.147 52.3165 16.2163 53.5264 16.2163C55.0154 16.2163 55.6979 17.5192 55.6979 19.4426V27.9426H60.2891V19.0703C60.2891 18.6981 60.3512 18.2017 60.4753 17.8605C60.7855 16.9608 61.561 16.2163 62.6468 16.2163C64.1669 16.2163 64.8804 17.4882 64.8804 19.6908V27.9426H69.4716V19.0083C69.4716 14.4791 67.2691 12.4316 64.353 12.4316C63.2362 12.4316 62.3056 12.6798 61.468 13.1762C60.7545 13.6105 60.072 14.1999 59.5136 15.0065H59.4516C58.8001 13.4243 57.249 12.4316 55.2946 12.4316C52.6888 12.4316 51.3548 13.8587 50.7034 14.8203H50.6103L50.3932 12.7729H46.4224C46.4844 14.1068 46.5464 15.72 46.5464 17.6123V27.9426V27.9426Z"></path> <path d="M85.8077 21.8623C85.8697 21.5211 85.9628 20.8075 85.9628 20.001C85.9628 16.2473 84.1015 12.4316 79.2 12.4316C73.9263 12.4316 71.5376 16.6816 71.5376 20.5284C71.5376 25.2747 74.4847 28.2838 79.6343 28.2838C81.6817 28.2838 83.5741 27.9426 85.1252 27.3221L84.5047 24.1269C83.2328 24.5302 81.9299 24.7473 80.3168 24.7473C78.1142 24.7473 76.1909 23.8167 76.0358 21.8623H85.8077ZM76.0047 18.636C76.1288 17.3641 76.9354 15.5649 78.9208 15.5649C81.0923 15.5649 81.5887 17.4882 81.5887 18.636H76.0047Z"></path> <path d="M88.617 9.48442V12.7727H86.6006V16.2472H88.617V22.4516C88.617 24.5921 89.0513 26.0501 89.9199 26.9498C90.6645 27.7253 91.9363 28.2837 93.4564 28.2837C94.7904 28.2837 95.9071 28.0976 96.5276 27.8494L96.4966 24.2819C96.1553 24.3439 95.69 24.4059 95.1006 24.4059C93.6736 24.4059 93.2393 23.5684 93.2393 21.7381V16.2472H96.6207V12.7727H93.2393V8.42969L88.617 9.48442V9.48442Z"></path> <path d="M111.213 18.9773C111.213 15.4097 109.6 12.4316 104.543 12.4316C101.782 12.4316 99.704 13.1762 98.6492 13.7656L99.5179 16.8057C100.511 16.1853 102.155 15.6579 103.706 15.6579C106.032 15.6579 106.467 16.8057 106.467 17.6123V17.8294C101.1 17.7984 97.5635 19.6908 97.5635 23.6305C97.5635 26.0502 99.3938 28.2838 102.465 28.2838C104.264 28.2838 105.815 27.6324 106.808 26.4225H106.901L107.18 27.9426H111.43C111.275 27.105 111.213 25.709 111.213 24.251V18.9773V18.9773ZM106.622 22.4207C106.622 22.6999 106.591 22.9791 106.529 23.2273C106.219 24.1889 105.257 24.9645 104.078 24.9645C103.023 24.9645 102.217 24.3751 102.217 23.1652C102.217 21.3349 104.14 20.7455 106.622 20.7765V22.4207V22.4207Z"></path> <path d="M125.003 24.0648C124.289 24.3751 123.421 24.5612 122.304 24.5612C120.008 24.5612 118.147 23.1032 118.147 20.3112C118.116 17.8294 119.729 16.0612 122.211 16.0612C123.452 16.0612 124.289 16.2784 124.848 16.5265L125.592 13.0211C124.6 12.6488 123.235 12.4316 121.994 12.4316C116.348 12.4316 113.308 16.0612 113.308 20.4973C113.308 25.2747 116.441 28.2838 121.342 28.2838C123.142 28.2838 124.724 27.9426 125.561 27.5703L125.003 24.0648Z"></path> <path d="M127.373 27.9426H132.088V20.2492C132.088 19.8769 132.119 19.5046 132.181 19.1944C132.491 17.7364 133.67 16.8057 135.407 16.8057C135.935 16.8057 136.338 16.8678 136.679 16.9608V12.4937C136.338 12.4316 136.121 12.4316 135.686 12.4316C134.228 12.4316 132.367 13.3623 131.592 15.5649H131.468L131.312 12.7729H127.249C127.311 14.0758 127.373 15.5338 127.373 17.7674V27.9426V27.9426Z"></path> <path d="M143.042 27.9424V12.7727H138.327V27.9424H143.042ZM140.685 6.16504C139.165 6.16504 138.172 7.18877 138.203 8.55373C138.172 9.85665 139.165 10.9114 140.654 10.9114C142.205 10.9114 143.197 9.85665 143.197 8.55373C143.166 7.18877 142.205 6.16504 140.685 6.16504Z"></path> <path d="M146.661 9.48442V12.7727H144.645V16.2472H146.661V22.4516C146.661 24.5921 147.095 26.0501 147.964 26.9498C148.708 27.7253 149.98 28.2837 151.5 28.2837C152.834 28.2837 153.951 28.0976 154.572 27.8494L154.541 24.2819C154.199 24.3439 153.734 24.4059 153.145 24.4059C151.718 24.4059 151.283 23.5684 151.283 21.7381V16.2472H154.665V12.7727H151.283V8.42969L146.661 9.48442Z"></path> <path d="M161.316 27.9424V12.7727H156.6V27.9424H161.316ZM158.958 6.16504C157.438 6.16504 156.445 7.18877 156.476 8.55373C156.445 9.85665 157.438 10.9114 158.927 10.9114C160.478 10.9114 161.471 9.85665 161.471 8.55373C161.44 7.18877 160.478 6.16504 158.958 6.16504V6.16504Z"></path> <path d="M175.11 24.0648C174.396 24.3751 173.528 24.5612 172.411 24.5612C170.115 24.5612 168.254 23.1032 168.254 20.3112C168.223 17.8294 169.836 16.0612 172.318 16.0612C173.559 16.0612 174.396 16.2784 174.955 16.5265L175.699 13.0211C174.707 12.6488 173.342 12.4316 172.101 12.4316C166.455 12.4316 163.415 16.0612 163.415 20.4973C163.415 25.2747 166.548 28.2838 171.449 28.2838C173.248 28.2838 174.831 27.9426 175.668 27.5703L175.11 24.0648Z"></path>
    </svg>`
    if (item.images.length > 0) {
      img = `<img class="mcdiv123_cover" src="https://www.metacritic.com/a/img/${item.images[0].bucketType}${item.images[0].bucketPath}">`
    }

    let score = ''
    if ('criticScoreSummary' in item && 'score' in item.criticScoreSummary && item.criticScoreSummary.score > 0) {
      const bgColor = badgeColor(item.criticScoreSummary.score, item.type)
      score = `<div class="mcdiv123_score_badge" style="background: ${bgColor}">${item.criticScoreSummary.score}</div>`
    }

    results.push(`
    <div>
      <div class="floatleft">
        ${img}
      </div>
      <div class="floatleft resultcontent">
        <a style="font-size:17px" href="${item.metacriticUrl}">
          ${item.title}
        </a>
        <span style="font-weight:800;">${item.premiereYear ? item.premiereYear : (item.releaseDate ? item.releaseDate.substring(0, 4) : '')}</span>
        ${score}
        <div>
          ${item.genres.map(g => g.name).join(' • ')}
          <br>
          <span class="mcdiv_release_date">${item.releaseDate ? item.releaseDate : ''}</span>
          <div class="mcdiv_desc">
            ${item.description}
          </div>
        </div>
      </div>
      <div class="floatleft mcdiv123_correct_entry" title="Assist us: This is the correct entry!">&check;</div>
      <div class="clear:left"></div>
    </div>
    `
    )
  })

  const websiteSearchUrl = `${baseURL}search/${encodeURIComponent(query)}/`

  if (results && results.length > 0) {
    // Show results
    loader.remove()

    const accept = function (ev) {
      const parentDiv = $(this).closest('.result')
      const a = parentDiv.find("a[href*='metacritic.com']")
      const metaurl = a.attr('href')
      const docurl = document.location.href

      const resultDivParent = parentDiv.parent()
      resultDivParent.html('')
      resultDivParent.append(loader)

      removeFromBlacklist(docurl, metaurl).then(function () {
        addToMap(docurl, metaurl).then(function () {
          current.metaurl = metaurl
          loadMetacriticUrl().then(() => loader.remove())
        })
      })
    }
    const denyAll = function (ev) {
      const docurl = document.location.href
      $('#mcdiv123searchresults').find("div.result a[href*='metacritic.com']").each(function () {
        addToBlacklist(docurl, this.href)
      })
    }

    const resultdiv = $('#mcdiv123searchresults').length
      ? $('#mcdiv123searchresults').html('')
      : $('<div id="mcdiv123searchresults"></div>').appendTo(div)
    results.forEach(function (html) {
      const singleresult = $('<div class="result"></div>').html(fixMetacriticURLs(html) + '<div style="clear:left"></div>').appendTo(resultdiv)
      singleresult.find('.mcdiv123_correct_entry').click(accept)
    })
    resultdiv.find('.metascore_w.album').removeClass('album') // Remove some classes
    resultdiv.find('.must-see').remove() // Remove some elements

    const sub = $('#mcdiv123 .sub').length ? $('#mcdiv123 .sub').html('') : $('<div class="sub"></div>').appendTo(div)
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + websiteSearchUrl + '" title="Open Metacritic">' + decodeURI(websiteSearchUrl.replace('https://www.', '')) + '</a>').appendTo(sub)
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#10062;</span>').appendTo(sub).click(function () {
      document.body.removeChild(this.parentNode.parentNode)
    })
    $('<span class="mcdiv123_incorrect" title="Assist us: None of the above is the correct item!">&cross;</span>').appendTo(sub).click(function () { if (confirm('None of the above is the correct item\nConfirm?')) denyAll() })
  } else {
    // No results
    loader.remove()
    const resultdiv = $('#mcdiv123searchresults').length ? $('#mcdiv123searchresults').html('') : $('<div id="mcdiv123searchresults"></div>').appendTo(div)
    resultdiv.html('No search results.')

    const sub = $('#mcdiv123 .sub').length ? $('#mcdiv123 .sub').html('') : $('<div class="sub"></div>').appendTo(div)
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + websiteSearchUrl + '" title="Open Metacritic">' + decodeURI(websiteSearchUrl.replace('https://www.', '')) + '</a>').appendTo(sub)
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#10062;</span>').appendTo(sub).click(function () {
      document.body.removeChild(this.parentNode.parentNode)
    })
  }
}

function showHoverInfo (response, orgMetaUrl) {
  const html = fixMetacriticURLs(response.responseText)
  const time = new Date(response.time)
  const url = response.finalUrl

  $('#mcdiv123').remove()
  const div = $('<div id="mcdiv123"></div>').appendTo(document.body)
  div.css({
    bottom: 0,
    left: 0
  })

  div.css('transform-origin', 'bottom left')
  GM.getValue('position', false).then(function (s) {
    if (s) {
      div.css({
        top: '',
        left: '',
        bottom: '',
        right: ''
      })
      const parsedPosition = JSON.parse(s)
      div.css(parsedPosition)
      div.css('transform-origin', Object.keys(parsedPosition).join(' '))
    }
  })
  onSizeChanged()

  // Functions for communication between page and iframe
  // Mozilla can access parent.document
  // Chrome can use postMessage()
  let frameStatus = false // if this remains false, loading the frame content failed. A reason could be "Content Security Policy"
  async function tryToLoadMoreMetacriticDetails (myframe, myelement, platforms) {
    console.log('ShowMetacriticRatings: tryToLoadMoreMetacriticDetails current', current)
    if (!current.metaurl) {
      return
    }

    let url = current.metaurl
    if (url.endsWith('/')) {
      url = url + 'details/'
    } else {
      url = url + '/details/'
    }
    url = url.replace('/game/pc/', '/game/').replace('/game/playstation-4/', '/game/').replace('/game/xbox-one/', '/game/')

    const response = await asyncRequest({ url })
    const doc = domParser().parseFromString(response.responseText, 'text/html')

    const titleA = doc.querySelector('.c-productSubpageHeader_back')
    if (titleA) {
      titleA.querySelectorAll('.c-productSubpageHeader_backIcon').forEach(e => e.remove())
    }
    const titleHTML = titleA ? titleA.outerHTML : ''

    let image = doc.querySelector('picture img')
    if (!image) {
      image = doc.createElement('img')
    }

    if (!image.getAttribute('src') && doc.querySelector('meta[name="twitter:image"]')) {
      console.log('Using fallback image', doc.querySelector('meta[name="twitter:image"]').content)
      image.src = doc.querySelector('meta[name="twitter:image"]').content
      image.style.maxHeight = `${image.height}px`
      image.removeAttribute('height')
      image.removeAttribute('width')
    } else if (!image.getAttribute('src') && response.responseText.match(/"image":"https:\/\/www.metacritic.com\/[^""]+/)) {
      const m = response.responseText.match(/"image":"(https:\/\/www.metacritic.com\/[^""]+)/)
      if (m) {
        image.src = m[1]
        image.style.maxHeight = `${image.height}px`
        image.removeAttribute('height')
        image.removeAttribute('width')
      }
    }
    image.style.display = ''
    const imageHTML = image.outerHTML

    let detailsTable = Array.from(doc.querySelectorAll('.c-movieDetails_sectionContainer,.c-productionDetailsTv_sectionContainer,.c-gameDetails_sectionContainer'))
      .map(e => Array.from(e.children).map(e => e.textContent.trim()))

    detailsTable = detailsTable.filter(columns => {
      if (columns[0].search(/release date/i) !== -1) {
        return true
      }
      if (columns[0].search(/genres/i) !== -1) {
        return true
      }
      if (columns[0].search(/developer/i) !== -1) {
        return true
      }
      if (columns[0].search(/publisher/i) !== -1) {
        return true
      }
      if (columns[0].search(/seasons/i) !== -1) {
        return true
      }
      if (columns[0].search(/production/i) !== -1) {
        return true
      }
      if (columns[0].search(/platforms/i) !== -1) {
        return true
      }

      return false
    }).map(columns => columns.join(': ').replace(/:\s*:\s*/, ': '))

    const html = imageHTML + '<br>' + titleHTML + '<br>' + detailsTable.join('<br>')

    if (myframe) {
      myframe.contentWindow.postMessage({
        mcimessage_addhtml: true,
        mcimessage_element_id: 'metacritic_extra_data',
        mcimessage_element_style: 'display:none;',
        mcimessage_html: html
      }, '*')

      // Wait to show the extra data to avoid making the frame to big
      window.setTimeout(function () {
        myframe.contentWindow.postMessage({
          mcimessage_showelement: true,
          mcimessage_selector: '#metacritic_extra_data'
        }, '*')
        myframe.contentWindow.postMessage({
          mcimessage_showelement: true,
          mcimessage_selector: '.game_row_5456d45'
        }, '*')
      }, 1000)
    } else {
      const extraDiv = myelement.appendChild(document.createElement('div'))
      extraDiv.setAttribute('id', 'metacritic_extra_data')
      extraDiv.setAttribute('style', 'display:none;')
      extraDiv.innerHTML = html
      window.setTimeout(() => { extraDiv.style.display = '' }, 500)

      // For gamesshow the other platforms (Wait to show the extra data to avoid making the frame to big)
      window.setTimeout(() => {
        myelement.querySelectorAll('.game_row_5456d45').forEach(e => { e.style.display = '' })
        myelement.scrollTo(0, 0)
      }, 500)
    }

    // For games, try to load user score for other platforms
    platforms.forEach(async function (platformCriticsUrl) {
      const url = platformCriticsUrl.replace('/critic-reviews', '/user-reviews')
      const response = await asyncRequest({ url })
      const doc = domParser().parseFromString(response.responseText, 'text/html')

      const userScoreNode = doc.querySelector('.c-ScoreCardLeft_scoreContent_number')

      if (myframe) {
        myframe.contentWindow.postMessage({
          mcimessage_appendchild: true,
          mcimessage_selector: `.game_row_5456d45 a[href*="${platformCriticsUrl}"]`,
          mcimessage_html: userScoreNode.outerHTML
        }, '*')
      } else {
        myelement.querySelector(`.game_row_5456d45 a[href*="${platformCriticsUrl}"]`).appendChild(userScoreNode)
        myelement.scrollTo(0, 0)
      }
    })
  }

  function loadExternalImage (url, myframe) {
    // Load external image, bypass CSP
    GM.xmlHttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      onload: function (response) {
        myframe.contentWindow.postMessage({
          mcimessage_imgLoaded: true,
          mcimessage_imgData: response.response,
          mcimessage_imgOrgSrc: url
        }, '*')
      }
    })
  }
  const functions = {
    parent: function () {
      const f = parent.document.getElementById('mciframe123')
      let lastdiff = -200000
      window.addEventListener('message', function (e) {
        if (typeof e.data !== 'object') {
          return
        } else if ('mcimessage0' in e.data) {
          frameStatus = true // Frame content was loaded successfully
          let platforms = []
          if ('mcimessage_platforms' in e.data) {
            platforms = e.data.mcimessage_platforms
          }
          tryToLoadMoreMetacriticDetails(f, null, platforms)
        } else if ('mcimessage1' in e.data) {
          f.style.width = parseInt(f.style.width) + 5 + 'px'
          if (e.data.heightdiff === lastdiff) {
            f.style.height = parseInt(f.style.height) + 10 + 'px'
          }
          lastdiff = e.data.heightdiff
        } else if ('mcimessage2' in e.data) {
          f.style.height = parseInt(f.style.height) + 10 + 'px'
        } else if ('mcimessage_loadImg' in e.data && e.data.mcimessage_imgUrl) {
          loadExternalImage(e.data.mcimessage_imgUrl, f)
        } else {
          return
        }
        if (f.contentWindow != null) {
          f.contentWindow.postMessage({
            mcimessage3: true,
            mciframe123_clientHeight: f.clientHeight,
            mciframe123_clientWidth: f.clientWidth
          }, '*')
        }
      })
    },
    frame: function () {
      let currentPlatform = 'playstation'
      if (document.getElementById('mci_current_platform')) {
        currentPlatform = document.getElementById('mci_current_platform').value
      }

      const platforms = Array.from(document.querySelectorAll('.game_row_5456d45 a[href^="https://www.metacritic.com/game/"][href*="critic-reviews"]'))
        .filter(a => !a.href.includes(`platform=${currentPlatform}`)).map(a => a.href.toString())

      parent.postMessage({ mcimessage0: true, mcimessage_platforms: platforms }, '*') // Loading frame content was successfull

      let i = 0
      window.addEventListener('message', function (e) {
        if (typeof e.data === 'object' && 'mcimessage_imgLoaded' in e.data) {
          // Load external image
          const arrayBufferView = new Uint8Array(e.data.mcimessage_imgData)
          const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
          const urlCreator = window.URL || window.webkitURL
          const imageUrl = urlCreator.createObjectURL(blob)
          const img = failedImages[e.data.mcimessage_imgOrgSrc]
          img.src = imageUrl
        }
        if (typeof e.data === 'object' && 'mcimessage_addhtml' in e.data) {
          const div = document.body.appendChild(document.createElement('div'))
          div.setAttribute('id', e.data.mcimessage_element_id)
          div.setAttribute('style', e.data.mcimessage_element_style)
          div.innerHTML = e.data.mcimessage_html
        }
        if (typeof e.data === 'object' && 'mcimessage_showelement' in e.data) {
          document.querySelectorAll(e.data.mcimessage_selector).forEach(node => { node.style.display = '' })
        }
        if (typeof e.data === 'object' && 'mcimessage_appendchild' in e.data) {
          const node = document.body.querySelector(e.data.mcimessage_selector).appendChild(document.createElement('div'))
          node.outerHTML = e.data.mcimessage_html
        }

        if (!('mcimessage3' in e.data)) return

        if (e.data.mciframe123_clientHeight < document.body.scrollHeight && i < 100) {
          parent.postMessage({ mcimessage2: 1 }, '*')
          i++
        }
        if (i >= 100) {
          parent.postMessage({ mcimessage1: 1, heightdiff: document.body.scrollHeight - e.data.mciframe123_clientHeight }, '*')
          i = 0
        }
      })
      parent.postMessage({ mcimessage1: 1, heightdiff: -100000 }, '*')
    }

  }

  const css = `
    #hover_div_a20230915{font-family:sans-serif;color:#262626;font-size:1rem;line-height:1.625rem}#hover_div_a202309:hover15 a,#hover_div_a20230915 a:hover{text-decoration:none}#hover_div_a20230915 a:hover{color:#09f}#hover_div_a20230915 a{color:#000;text-decoration:none;}#hover_div_a20230915 a:focus{color:grey}#hover_div_a20230915 .g-border-black,#hover_div_a20230915 .g-border-gray100{border-color:#000}#hover_div_a20230915 .g-color-black,#hover_div_a20230915 .g-color-gray100{color:#000}#hover_div_a20230915 .g-border-gray98{border-color:#191919}#hover_div_a20230915 .g-color-gray98{color:#191919}#hover_div_a20230915 .g-border-gray90{border-color:#262626}#hover_div_a20230915 .g-color-gray90{color:#262626}#hover_div_a20230915 .g-border-gray80{border-color:#404040}#hover_div_a20230915 .g-color-gray80{color:#404040}#hover_div_a20230915 .g-border-gray70{border-color:#666}#hover_div_a20230915 .g-color-gray70{color:#666}#hover_div_a20230915 .g-border-gray60{border-color:grey}#hover_div_a20230915 .g-color-gray60{color:grey}#hover_div_a20230915 .g-border-gray50{border-color:#999}#hover_div_a20230915 .g-color-gray50{color:#999}#hover_div_a20230915 .g-border-gray40{border-color:#bfbfbf}#hover_div_a20230915 .g-color-gray40{color:#bfbfbf}#hover_div_a20230915 .g-border-gray30{border-color:#d8d8d8}#hover_div_a20230915 .g-color-gray30{color:#d8d8d8}#hover_div_a20230915 .g-border-gray20{border-color:#e6e6e6}#hover_div_a20230915 .g-color-gray20{color:#e6e6e6}#hover_div_a20230915 .g-border-gray10{border-color:#f2f2f2}#hover_div_a20230915 .g-color-gray10{color:#f2f2f2}#hover_div_a20230915 .g-border-gray0,#hover_div_a20230915 .g-border-white{border-color:#fff}#hover_div_a20230915 .g-color-gray0,#hover_div_a20230915 .g-color-white{color:#fff}#hover_div_a20230915 .g-border-red{border-color:#eb0036}#hover_div_a20230915 .g-color-red{color:#eb0036}#hover_div_a20230915 .g-border-green{border-color:#01b44f}#hover_div_a20230915 .g-color-green{color:#01b44f}#hover_div_a20230915 .g-width-large{width:1.5rem}#hover_div_a20230915 .g-height-large{height:1.5rem}#hover_div_a20230915 .g-width-100{width:100%}#hover_div_a20230915 .g-height-100{height:100%}#hover_div_a20230915 .g-text-large{font-size:1.5rem;line-height:2rem}#hover_div_a20230915 .g-text-xxsmall{font-size:xx-small}#hover_div_a20230915 .g-text-bold{font-weight:700}#hover_div_a20230915 .g-text-link{text-decoration:underline}#hover_div_a20230915 .u-block{display:block}#hover_div_a20230915 .u-flexbox{display:flex}#hover_div_a20230915 .u-flexbox-column{display:flex;flex-direction:column}#hover_div_a20230915 .u-flexbox-justifyCenter{justify-content:center}#hover_div_a20230915 .u-flexbox-alignCenter{align-items:center}#hover_div_a20230915 .u-grid{display:grid;grid-gap:0;grid-gap:var(--grid-gap,0)}#hover_div_a20230915 .u-grid-2column{-ms-grid-columns:50% 50%;display:grid;grid-template:auto/repeat(2,1fr)}#hover_div_a20230915 .u-grid-3column{-ms-grid-columns:33.3% 33.3% 33.3%;display:grid;grid-template:auto/repeat(3,1fr)}#hover_div_a20230915 .u-grid-4column{-ms-grid-columns:25% 25% 25% 25%;display:grid;grid-template:auto/repeat(4,1fr)}#hover_div_a20230915 .u-grid-5column{-ms-grid-columns:20% 20% 20% 20% 20%;display:grid;grid-template:auto/repeat(5,1fr)}#hover_div_a20230915 .u-grid-7column{-ms-grid-columns:14.2857% 14.2857% 14.2857% 14.2857% 14.2857% 14.2857% 14.2857%;display:grid;grid-template:auto/repeat(7,1fr)}#hover_div_a20230915 .u-grid-column-span2{grid-column-end:span 2}#hover_div_a20230915 .u-grid-column-span3{grid-column-end:span 3}#hover_div_a20230915 .u-grid-column-span4{grid-column-end:span 4}#hover_div_a20230915 .u-text-center{text-align:center}#hover_div_a20230915 .c-siteReviewScore_large{border-radius:0.5rem;height:4rem;width:4rem;font-size:2rem}#hover_div_a20230915 .c-siteReviewScore_user{border-radius:50%}#hover_div_a20230915 .c-reviewsStats{padding:1rem 0;grid-template-columns:1fr 1fr 1fr;justify-content:space-evenly;font-size:0.75rem;line-height:1.25rem}#hover_div_a20230915 div[class^=c-reviewsStats_]:first-child,#hover_div_a20230915 div[class^=c-reviewsStats_]:nth-child(2){border-right:0.0625rem solid #d8d8d8}#hover_div_a20230915 .c-ScoreCardGraph{overflow:hidden;white-space:nowrap}#hover_div_a20230915 .c-ScoreCardGraph > div{margin-left:0.25rem;padding:0 0.25rem;text-align:right;height:0.5rem;min-width:2rem;line-height:1rem}#hover_div_a20230915 .c-ScoreCardGraph > div:first-child{margin-left:0}#hover_div_a20230915 .c-ScoreCardGraph_scoreTitle{letter-spacing:0.25rem}#hover_div_a20230915 .c-ScoreCardGraph_scoreSentiment{color:#00ce7a}#hover_div_a20230915 .c-ScoreCardGraph_scoreGraphPositive{background:#00ce7a;border-radius:0.25rem 0 0 0.25rem}#hover_div_a20230915 .c-ScoreCardGraph_scoreGraphNeutral{background:#ffbd3f}#hover_div_a20230915 .c-ScoreCardGraph_scoreGraphNegative{background:#ff6874;border-radius:0 0.25rem 0.25rem 0}#hover_div_a20230915 .gray{background:#bfbfbf;height:1rem;display:inline-block}#hover_div_a20230915 .c-ScoreCard_scoreContent{display:flex;align-content:flex-start;flex-wrap:nowrap;grid-gap:10px;gap:10px;width:100%;justify-content:space-between;align-items:stretch}#hover_div_a20230915 .c-ScoreCard_scoreContent_text{line-height:normal;display:flex;flex-direction:column;justify-content:space-between}#hover_div_a20230915 .c-ScoreCard_scoreContent_number > .c-siteReviewScore_background-critic_large,#hover_div_a20230915 .c-ScoreCard_scoreContent_number > .c-siteReviewScore_background-critic_large .c-siteReviewScore_large{width:4rem;height:4rem}#hover_div_a20230915 .c-ScoreCard_scoreSentiment{font-size:1rem;line-height:1.25rem;text-transform:capitalize}#hover_div_a20230915 .c-ScoreCard_scoreTitle{letter-spacing:0.25rem}#hover_div_a20230915 .c-reviewsOverview_overviewDetails{grid-template-columns:1fr 1fr;grid-gap:1.25rem;border-top:1px solid #262626;margin-top:auto;padding:2px}#hover_div_a20230915 .c-reviewsOverview_overviewDetails:first-child{border-top:0 solid #262626}#hover_div_a20230915 .c-siteReviewScore_green{background:#00ce7a}#hover_div_a20230915 .c-siteReviewScore_yellow{background:#ffbd3f}#hover_div_a20230915 .c-siteReviewScore_red{background:#ff6874}#hover_div_a20230915 .c-siteReviewScore_grey{background:#404040}#hover_div_a20230915 .c-siteReviewScore_tbdCritic,#hover_div_a20230915 .c-siteReviewScore_tbdUser{border-width:0.125rem;border-style:solid}#hover_div_a20230915 .o-inlineScore{border-radius:0.25rem;font-size:1.25rem;font-weight:700;color:#404040;width:2.5rem;height:2.5rem;display:inline-flex;justify-content:center;align-items:center;text-decoration:none!important}#hover_div_a20230915 .o-inlineScore-green{background:#00ce7a}#hover_div_a20230915 .o-inlineScore-yellow{background:#ffbd3f}#hover_div_a20230915 .o-inlineScore-red{background:#ff6874}#hover_div_a20230915 .o-inlineScore-tbd{border:1px solid grey}#hover_div_a20230915 .u-pointer{cursor:pointer}#hover_div_a20230915 .c-siteReviewScore_green{background:#00ce7a}#hover_div_a20230915 .c-siteReviewScore_yellow{background:#ffbd3f}#hover_div_a20230915 .c-siteReviewScore_red{background:#ff6874}#hover_div_a20230915 .c-siteReviewScore_grey{background:#404040}#hover_div_a20230915 .c-siteReviewScore_tbdCritic,#hover_div_a20230915 .c-siteReviewScore_tbdUser{border-width:0.125rem;border-style:solid}#hover_div_a20230915{max-width:440px}

    .mci_current_platform_title {
      padding:0px;
      margin: -8px 0px -5px 0px;
      font-size: 12px;
    }

    .game_row_5456d45 .c-gamePlatformTile {
      border-radius: .game_row_5456d45 .375rem;
      box-shadow: 0 .1875rem .625rem rgba(0,0,0,.16);
      gap: .game_row_5456d45 .75rem;
      grid-template-columns: 1fr 70px 70px;
      padding: 1rem;
    }

    .game_row_5456d45 .c-gamePlatformTile-description {
      gap: .game_row_5456d45.75rem;
      grid-template-rows: 1fr;
    }

    .game_row_5456d45 .g-outer-spacing-right-xsmall {
      margin-right: .25rem;
    }

    .game_row_5456d45 .c-siteReviewScore_medium {
      border-radius: 6px;
      font-size: 2.25rem;
      height: 4rem;
      line-height: 2.5rem;
      width: 4rem;
    }

    .game_row_5456d45 .c-siteReviewScore_yellow {
      background: #ffbd3f;
    }

    .game_row_5456d45 .u-flexbox-alignCenter {
      align-items: center;
    }

    .game_row_5456d45 .u-flexbox-justifyCenter {
      justify-content: center;
    }

    .game_row_5456d45 .u-flexbox-column {
      display: flex;
      flex-direction: column;
    }

    .game_row_5456d45 .g-text-bold {
      font-weight: 700;
    }

    .game_row_5456d45 .g-color-gray90 {
      color: #262626;
    }

    .game_row_5456d45 .c-siteReviewScore_medium {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    `

  const cssDark = `
  html {
    scrollbar-color: #003c09 #00ce7a;
  }
  *::-webkit-scrollbar-thumb {
    background-color: #003c09;
  }
  body {
    background:#262626;
    color:white;
  }

  #metacritic_extra_data {
    color:white;
  }
  #metacritic_extra_data a:hover {
    color: white;
  }
  #metacritic_extra_data a {
      color: #5799ef;
      text-decoration: none;
  }

  #hover_div_a20230915 {
    color: #d1d1d1;
  }
  #hover_div_a20230915 a:hover {
      color: #09f;
  }
  #hover_div_a20230915 a {
      color: #ffffff;
      text-decoration: none;
  }
  #hover_div_a20230915 a:focus {
      color: rgb(184, 184, 184);
  }
  #hover_div_a20230915 .g-border-black,
  #hover_div_a20230915 .g-border-gray100 {
      border-color: #ffffff;
  }
  #hover_div_a20230915 .g-color-black,
  #hover_div_a20230915 .g-color-gray100 {
      color: #ffffff;
  }
  #hover_div_a20230915 .g-border-gray98 {
      border-color: #d6d6d6;
  }
  #hover_div_a20230915 .g-color-gray98 {
      color: #d6d6d6;
  }
  #hover_div_a20230915 .g-border-gray90 {
      border-color: #d3d3d3;
  }
  #hover_div_a20230915 .g-color-gray90 {
      color: #d3d3d3;
  }
  #hover_div_a20230915 .g-border-gray80 {
      border-color: #404040;
  }
  #hover_div_a20230915 .g-color-gray80 {
      color: #404040;
  }
  #hover_div_a20230915 .g-border-gray70 {
      border-color: #666;
  }
  #hover_div_a20230915 .g-color-gray70 {
      color: #666;
  }
  #hover_div_a20230915 .g-border-gray60 {
      border-color: grey;
  }
  #hover_div_a20230915 .g-color-gray60 {
      color: grey;
  }
  #hover_div_a20230915 .c-reviewsOverview_overviewDetails {
      border-top: 1px solid #d1d1d1;
  }
  #hover_div_a20230915 .c-reviewsOverview_overviewDetails:first-child {
      border-top: 0 solid #d1d1d1;
  }
  #hover_div_a20230915 .c-siteReviewScore_grey {
      background: #404040;
  }
  #hover_div_a20230915 .o-inlineScore {
      color: #404040;
  }
  #hover_div_a20230915 .o-inlineScore-tbd {
      border: 1px solid grey;
  }
  #hover_div_a20230915 .u-pointer {
      cursor: pointer;
  }
  #hover_div_a20230915 .c-siteReviewScore_grey {
      background: #404040;
  }
  `

  let framesrc = 'data:text/html,'
  framesrc += encodeURIComponent(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Metacritic info</title>
        <style>
        html {
          scrollbar-width: thin;
          scrollbar-color: #dfdfdf white;
        }
        /* Chrome, Edge, and Safari */
        *::-webkit-scrollbar {
          width: 10px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #dfdfdf;
          border-radius: 10px;
          border: 0px none transparent;
        }

        body {
          margin:0px;
          padding:0px;
          background:white;
        }

        ${css}

        #metacritic_extra_data {
          font-family: sans-serif;
          color:black;
        }

        #metacritic_extra_data a:hover {
            color: #054585;
        }
        #metacritic_extra_data a {
            color: #06c;
            text-decoration: none;
        }

        @media (prefers-color-scheme: dark) {
          ${cssDark}
        }

        ${
          darkTheme ? cssDark : ''
        }

        </style>
        <script>
        const failedImages = {};
        function detectCSP(img) {
          if(img.complete && (!img.naturalWidth || !img.naturalHeight)) {
            return true;
          }
          return false;
        }
        function findCSPerrors() {
          const imgs = document.querySelectorAll("img");
          for(let i = 0; i < imgs.length; i++) {
            if(imgs[i].complete && detectCSP(imgs[i])) {
              fixCSP(imgs[i]);
            }
          }
        }
        function fixCSP(img) {
          console.debug("ShowMetacriticRatings(iFrame): Loading image failed. Bypassing CSP...", img);
          if (img.getAttribute('src')) {
            failedImages[img.src] = img;
            parent.postMessage({"mcimessage_loadImg":true, "mcimessage_imgUrl": img.src},"*");
          }
        }
        function on_load() {
          (${functions.frame.toString()})();
          window.setTimeout(findCSPerrors, 500);
        }
        </script>
      </head>
      <body onload="on_load();">
        <div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">
          <div class="hover_content">${html}</div>
        </div>
      </body>
    </html>`)

  const frame = $('<iframe></iframe>')
  frame.attr('id', 'mciframe123')
  frame.attr('src', framesrc)
  frame.attr('scrolling', 'auto')
  frame.css({
    width: 440,
    height: 110,
    border: 'none',
    opacity: '0.1',
    transition: 'opacity 1s'
  })
  frame.appendTo(div)
  window.setTimeout(function () {
    frame.css('opacity', '1.0')
  }, 1000)

  window.setTimeout(function () {
    if (!frameStatus) { // Loading frame content failed.
      //  Directly inject the html without an iframe (this may break the site or the metacritic)
      console.debug('ShowMetacriticRatings: Loading iframe content failed. Injecting directly.')
      $('head').append(`<style>${css}\n\n@media (prefers-color-scheme: dark) {\n${cssDark}\n}\n</style>`)
      const noframe = $(`<div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">
          <div class="hover_content">${html}</div>
          </div>`)
      frame.replaceWith(noframe)

      const frameElement = noframe[0]

      let currentPlatform = 'playstation'
      if (frameElement.querySelector('#mci_current_platform')) {
        currentPlatform = frameElement.querySelector('#mci_current_platform').value
      }
      const platforms = Array.from(frameElement.querySelectorAll('.game_row_5456d45 a[href^="https://www.metacritic.com/game/"][href*="critic-reviews"]'))
        .filter(a => !a.href.includes(`platform=${currentPlatform}`)).map(a => a.href.toString())

      document.querySelector('#mcdiv123').style.maxHeight = '230px'

      tryToLoadMoreMetacriticDetails(null, frameElement, platforms)
    }
  }, 2000)

  functions.parent()

  const sub = $('<div></div>').appendTo(div)
  $('<time style="color:#b6b6b6; font-size: 11px;" datetime="' + time + '" title="' + time.toLocaleTimeString() + ' ' + time.toLocaleDateString() + '">' + minutesSince(time) + '</time>').appendTo(sub)
  $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + url + '" title="Open Metacritic">' + decodeURI(url.replace('https://www.', '@')) + '</a>').appendTo(sub)
  $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px; padding-left:5px;">&#10062;</span>').data('url', current.metaurl).appendTo(sub).click(function () {
    const metaurl = $(this).data('url')
    addToTemporaryBlacklist(metaurl)
    document.body.removeChild(this.parentNode.parentNode)
  })

  $('<span title="Assist us: This is the correct entry!" style="cursor:pointer; float:right; color:green; font-size: 11px;">&check;</span>').data('url', current.metaurl).appendTo(sub).click(function () {
    const docurl = document.location.href
    const metaurl = $(this).data('url')
    addToMap(docurl, metaurl).then(function (r) {
      balloonAlert('Thanks for your submission!\n\nSaved as a correct entry.\n\n' + r[0] + '\n' + r[1], 6000, 'Success')
    })
  })
  $('<span title="Assist us: This is NOT the correct entry!" style="cursor:pointer; float:right; color:crimson; font-size: 11px;">&cross;</span>').data('url', current.metaurl).appendTo(sub).click(function () {
    if (!confirm('This is NOT the correct entry!\n\nAdd to blacklist?')) return
    const docurl = document.location.href
    const metaurl = $(this).data('url')
    addToBlacklist(docurl, metaurl).then(function (r) {
      balloonAlert('Thanks for your submission!\n\nSaved to blacklist.\n\n' + r[0] + '\n' + r[1], 6000, 'Success')
    })

    openSearchBox(true)
  })

  // Store response in cache:
  if (!('cached' in response)) {
    storeInHoverCache(current.metaurl, response, orgMetaUrl)
  }
}

function metacriticGeneralProductSetup () {
  current.broadenCounter = 0
}

const metacritic = {
  mapped: function metacriticMapped (docurl, product, metaurl, type, searchTerm) {
    // url was in the map/whitelist
    current.data = searchTerm ? [searchTerm] : []
    current.docurl = docurl
    current.product = product
    current.metaurl = metaurl
    current.type = type
    current.searchTerm = searchTerm || null
    loadMetacriticUrl()
  },
  music: function metacriticMusic (docurl, product, artistname, albumname) {
    current.data = [albumname.trim(), artistname.trim()]
    artistname = name2metacritic(artistname)
    albumname = albumname.replace('&', ' ')
    albumname = name2metacritic(albumname)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLmusic + albumname + '/' + artistname
    current.type = 'music'
    current.searchTerm = albumname + '/' + artistname
    loadMetacriticUrl()
  },
  movie: function metacriticMovie (docurl, product, moviename) {
    current.data = [moviename.trim()]
    moviename = name2metacritic(moviename)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLmovie + moviename
    current.type = 'movie'
    current.searchTerm = moviename
    loadMetacriticUrl()
  },
  tv: function metacriticTv (docurl, product, seriesname) {
    current.data = [seriesname.trim()]
    seriesname = name2metacritic(seriesname)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLtv + seriesname
    current.type = 'tv'
    current.searchTerm = seriesname
    loadMetacriticUrl()
  },
  pcgame: function metacriticPcgame (docurl, product, gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLpcgame + gamename
    current.type = 'pcgame'
    current.searchTerm = gamename
    loadMetacriticUrl()
  },
  ps4game: function metacriticPs4game (docurl, product, gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLps4 + gamename
    current.type = 'ps4game'
    current.searchTerm = gamename
    loadMetacriticUrl()
  },
  xonegame: function metacriticXonegame (docurl, product, gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename)
    current.docurl = docurl
    current.product = product
    current.metaurl = baseURLxone + gamename
    current.type = 'xonegame'
    current.searchTerm = gamename
    loadMetacriticUrl()
  }
}

const Always = () => true
const sites = {
  bandcamp: {
    host: ['bandcamp.com'],
    condition: () => unsafeWindow && unsafeWindow.TralbumData && unsafeWindow.TralbumData.current,
    products: [{
      condition: Always,
      type: 'music',
      data: () => [unsafeWindow.TralbumData.artist, unsafeWindow.TralbumData.current.title]
    }]
  },
  itunes: {
    host: ['itunes.apple.com'],
    condition: Always,
    products: [{
      condition: () => ~document.location.href.indexOf('/movie/'),
      type: 'movie',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
    },
    {
      condition: () => ~document.location.href.indexOf('/tv-season/'),
      type: 'tv',
      data: function () {
        let name = parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
        if (~name.indexOf(', Season')) {
          name = name.split(', Season')[0]
        }
        return name
      }
    },
    {
      condition: () => ~document.location.href.indexOf('/album/'),
      type: 'music',
      data: function () {
        const ld = parseLDJSON(['name', 'byArtist'], (j) => (j['@type'] === 'MusicAlbum'))
        const album = ld[0]
        const artist = 'name' in ld[1] ? ld[1].name : ld[1].map(x => x.name).join(' ')
        return [artist, album]
      }
    }]
  },
  'music.apple': {
    host: ['music.apple.com'],
    condition: Always,
    products: [{
      condition: () => ~document.location.href.indexOf('/album/') && parseLDJSON(['name', 'byArtist'], (j) => (j['@type'] === 'MusicAlbum')).length > 1,
      type: 'music',
      data: function () {
        const ld = parseLDJSON(['name', 'byArtist'], (j) => (j['@type'] === 'MusicAlbum'))
        const album = ld[0]
        const artist = 'name' in ld[1] ? ld[1].name : ld[1].map(x => x.name).join(' ')
        return [artist, album]
      }
    }]
  },
  googleplay: {
    host: ['play.google.com'],
    condition: Always,
    products: [
      {
        condition: () => ~document.location.href.indexOf('/album/'),
        type: 'music',
        data: () => [document.querySelector('[itemprop="byArtist"] meta[itemprop="name"]').content, document.querySelector('[itemtype="https://schema.org/MusicAlbum"] meta[itemprop="name"]').content]
      },
      {
        condition: () => ~document.location.href.indexOf('/movies/details/'),
        type: 'movie',
        data: () => document.querySelector('*[itemprop=name]').textContent
      }
    ]
  },
  imdb: {
    host: ['imdb.com'],
    condition: () => !~document.location.pathname.indexOf('/mediaviewer') && !~document.location.pathname.indexOf('/mediaindex') && !~document.location.pathname.indexOf('/videoplayer'),
    products: [
      {
        condition: () => document.querySelector('a[href*="/criticreviews/"'),
        type: 'mapped',
        data: async function () {
          // This is used if there is a metacritic link on the imdb page
          const criticsUrl = document.querySelector('a[href*="/criticreviews/"').href.toString()
          const response = await asyncRequest({ url: criticsUrl }).catch(function (response) {
            console.warn('ShowMetacriticRatings: Error imdb01\nurl=' + criticsUrl + '\nstatus=' + response.status)
          })
          const m = response.responseText.match(/(https:\/\/www\.metacritic\.com\/(\w+)\/[^?&"']+)/)
          console.debug('ShowMetacriticRatings: Metacritic link found on imdb:', m[2], m[1])
          const query = document.querySelector('[data-testid="hero__pageTitle"]') ? document.querySelector('[data-testid="hero__pageTitle"]').textContent : null
          return [m[1], m[2], query]
        }
      },
      {
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.movie') {
            return true
          } else if (document.querySelector('[data-testid="hero__pageTitle"]') && !document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            return true
          }
          return false
        },
        type: 'movie',
        data: async function () {
          // If the page is not in English or the browser is not in English, request page in English.
          // Then the title in <h1> will be the English title and Metacritic always uses the English title.
          if (document.querySelector('[for="nav-language-selector"]').textContent.toLowerCase() !== 'en' || !navigator.language.startsWith('en')) {
            const imdbID = document.location.pathname.match(/\/title\/(\w+)/)[1]
            const homePageUrl = 'https://www.imdb.com/title/' + imdbID + '/?ref_=nv_sr_1'
            // Set language cookie to English, request current page in English, then restore language cookie or expire it if it didn't exist before
            const langM = document.cookie.match(/lc-main=([^;]+)/)
            const langBefore = langM ? langM[0] : ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'lc-main=en-US'
            const response = await asyncRequest({
              url: homePageUrl,
              headers: {
                'Accept-Language': 'en-US,en'
              }
            }).catch(function (response) {
              console.warn('ShowMetacriticRatings: Error imdb02\nurl=' + homePageUrl + '\nstatus=' + response.status)
            })
            document.cookie = 'lc-main=' + langBefore
            // Extract <h1> title
            const parts = response.responseText.split('</span></h1>')[0].split('>')
            console.debug('ShowMetacriticRatings: Movie title from English page:', parts[parts.length - 1])
            return parts[parts.length - 1]
          } else if (document.querySelector('script[type="application/ld+json"]')) {
            const ld = parseLDJSON(['name', 'alternateName'])
            if (ld.length > 1 && ld[1]) {
              console.debug('ShowMetacriticRatings: Movie ld+json alternateName', ld[1])
              return ld[1]
            }
            console.debug('ShowMetacriticRatings: Movie ld+json name', ld[0])
            return ld[0]
          } else {
            const m = document.title.match(/(.+?)\s+(\((\d+)\))? - /)
            console.debug('ShowMetacriticRatings: Movie <title>', m[1])
            return m[1]
          }
        }
      },
      {
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.tv_show') {
            return true
          } else if (document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            return true
          }
          return false
        },
        type: 'tv',
        data: async function () {
          if (document.querySelector('[for="nav-language-selector"]').textContent.toLowerCase() !== 'en' || !navigator.language.startsWith('en')) {
            const imdbID = document.location.pathname.match(/\/title\/(\w+)/)[1]
            const homePageUrl = 'https://www.imdb.com/title/' + imdbID + '/?ref_=nv_sr_1'
            // Set language cookie to English, request current page in English, then restore language cookie or expire it if it didn't exist before
            const langM = document.cookie.match(/lc-main=([^;]+)/)
            const langBefore = langM ? langM[0] : ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
            document.cookie = 'lc-main=en-US'
            const response = await asyncRequest({
              url: homePageUrl,
              headers: {
                'Accept-Language': 'en-US,en'
              }
            }).catch(function (response) {
              console.warn('ShowMetacriticRatings: Error imdb03\nurl=' + homePageUrl + '\nstatus=' + response.status)
            })
            document.cookie = 'lc-main=' + langBefore
            // Extract <h1> title
            const parts = response.responseText.split('</span></h1>')[0].split('>')
            console.debug('ShowMetacriticRatings: TV title from English page:', parts[parts.length - 1])
            return parts[parts.length - 1]
          } else if (document.querySelector('script[type="application/ld+json"]')) {
            const ld = parseLDJSON(['name', 'alternateName'])
            if (ld.length > 1 && ld[1]) {
              console.debug('ShowMetacriticRatings: TV ld+json alternateName', ld[1])
              return ld[1]
            }
            console.debug('ShowMetacriticRatings: TV ld+json name', ld[0])
            return ld[0]
          } else {
            const m = document.title.match(/(.+?)\s+\(.+(\d{4}).+/)
            console.debug('ShowMetacriticRatings: TV <title>', m[1])
            return m[1]
          }
        }
      }
    ]
  },
  steam: {
    host: ['store.steampowered.com'],
    condition: () => document.querySelector('*[itemprop=name]'),
    products: [{
      condition: Always,
      type: 'pcgame',
      data: () => document.querySelector('*[itemprop=name]').textContent
    }]
  },
  rottentomatoes: {
    host: ['rottentomatoes.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/m/'),
      type: 'movie',
      data: () => document.querySelector('h1').firstChild.textContent
    },
    {
      condition: () => document.location.pathname.startsWith('/tv/'),
      type: 'tv',
      data: () => unsafeWindow.BK.TvSeriesTitle
    }
    ]
  },
  serienjunkies: {
    host: ['www.serienjunkies.de'],
    condition: Always,
    products: [{
      condition: () => document.getElementById('serienlinksbreit2aktuell'),
      type: 'tv',
      data: () => document.querySelector('h1').textContent.trim()
    },
    {
      condition: () => document.location.pathname.search(/vod\/film\/.{3,}/) !== -1,
      type: 'movie',
      data: () => document.querySelector('h1').textContent.trim()
    }]
  },
  gamespot: {
    host: ['gamespot.com'],
    condition: () => document.querySelector('[itemprop=device]') || document.location.pathname.startsWith('/reviews/'),
    products: [
      {
        condition: () => ~$('[itemprop=device]').text().indexOf('PC'),
        type: 'pcgame',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'VideoGame'))
      },
      {
        condition: () => ~$('[itemprop=device]').text().indexOf('PS4'),
        type: 'ps4game',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'VideoGame'))
      },
      {
        condition: () => ~$('[itemprop=device]').text().indexOf('XONE'),
        type: 'xonegame',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'VideoGame'))
      },
      {
        condition: () => document.querySelector('.system.system--simple.system--pc'),
        type: 'pcgame',
        data: () => document.querySelector('h1').textContent.trim().split('Review')[0].trim()
      },
      {
        condition: () => document.querySelector('.system.system--simple.system--ps5'),
        type: 'ps4game',
        data: () => document.querySelector('h1').textContent.trim().split('Review')[0].trim()
      },
      {
        condition: () => document.querySelector('.system.system--simple.system--xbsx'),
        type: 'xonegame',
        data: () => document.querySelector('h1').textContent.trim().split('Review')[0].trim()
      }
    ]
  },
  amazon: {
    host: ['amazon.'],
    condition: Always,
    products: [
      {
        condition: () => document.location.hostname === 'music.amazon.com' && document.location.pathname.startsWith('/albums/') && document.querySelector('.viewTitle'), // "Amazon Music Unlimited" page
        type: 'music',
        data: function () {
          const artist = document.querySelector('.artistLink').textContent.trim()
          let title = document.querySelector('.viewTitle').textContent.trim()
          title = title.replace(/\[([^\]]*)\]/g, '').trim() // Remove [brackets] and their content
          if (artist && title) {
            return [artist, title]
          }
          return false
        }
      },
      {
        condition: function () { // "Normal amazon" page
          try {
            if (document.querySelector('.nav-categ-image').alt.toLowerCase().indexOf('musi') !== -1) {
              return true
            }
          } catch (e) {}
          const music = ['Music', 'Musique', 'Musik', 'Música', 'Musica', '音楽']
          return music.some(function (s) {
            if (~document.title.indexOf(s)) {
              return true
            } else {
              return false
            }
          })
        },
        type: 'music',
        data: function () {
          let artist = false
          let title = false
          if (document.querySelector('#ProductInfoArtistLink')) {
            artist = document.querySelector('#ProductInfoArtistLink').textContent.trim()
          } else if (document.querySelector('#bylineInfo .author>*')) {
            artist = document.querySelector('#bylineInfo .author>*').textContent.trim()
          }

          if (document.querySelector('#dmusicProductTitle_feature_div')) {
            title = document.querySelector('#dmusicProductTitle_feature_div').textContent.trim()
            title = title.replace(/\[([^\]]*)\]/g, '').trim() // Remove [brackets] and their content
          } else if (document.querySelector('#productTitle')) {
            title = document.querySelector('#productTitle').textContent.trim()
            title = title.replace(/\[([^\]]*)\]/g, '').trim() // Remove [brackets] and their content
          }
          return [artist, title]
        }
      },
      {
        condition: () => (document.querySelector('[data-automation-id=title]') && (
          document.getElementsByClassName('av-season-single').length ||
          document.querySelector('[data-automation-id="num-of-seasons-badge"]') ||
          document.getElementById('tab-selector-episodes') ||
          document.getElementById('av-droplist-av-atf-season-selector')
        )),
        type: 'tv',
        data: () => document.querySelector('[data-automation-id=title]').textContent.trim()
      },
      {
        condition: () => ((
          document.getElementsByClassName('av-season-single').length ||
          document.querySelector('[data-automation-id="num-of-seasons-badge"]') ||
          document.getElementById('tab-selector-episodes') ||
          document.getElementById('av-droplist-av-atf-season-selector')
        ) && Array.from(document.querySelectorAll('script[type="text/template"]')).map(e => e.innerHTML.match(/parentTitle"\s*:\s*"(.+?)"/)).some((x) => x != null)),
        type: 'tv',
        data: () => Array.from(document.querySelectorAll('script[type="text/template"]')).map(e => e.innerHTML.match(/parentTitle"\s*:\s*"(.+?)"/)).filter((x) => x != null)[0][1]
      },
      {
        condition: () => document.querySelector('[data-automation-id=title]'),
        type: 'movie',
        data: () => document.querySelector('[data-automation-id=title]').textContent.trim().replace(/\[.{1,8}\]/, '')
      },
      {
        condition: () => document.querySelector('#watchNowContainer a[href*="/gp/video/"]'),
        type: 'movie',
        data: () => document.getElementById('productTitle').textContent.trim()
      }
    ]
  },
  BoxOfficeMojo: {
    host: ['boxofficemojo.com'],
    condition: () => Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/release/'),
        type: 'movie',
        data: () => document.querySelector('meta[name=title]').content
      },
      {
      // Old page design
        condition: () => ~document.location.search.indexOf('id=') && document.querySelector('#body table:nth-child(2) tr:first-child b'),
        type: 'movie',
        data: () => document.querySelector('#body table:nth-child(2) tr:first-child b').firstChild.textContent
      }]
  },
  AllMovie: {
    host: ['allmovie.com'],
    condition: () => document.querySelector('h2.movie-title'),
    products: [{
      condition: () => document.querySelector('h2.movie-title'),
      type: 'movie',
      data: () => document.querySelector('h2.movie-title').firstChild.textContent.trim()
    }]
  },
  'en.wikipedia': {
    host: ['en.wikipedia.org'],
    condition: Always,
    products: [{
      condition: function () {
        if (!document.querySelector('.infobox .summary')) {
          return false
        }
        const r = /\d\d\d\d films/
        return $('#catlinks a').filter((i, e) => e.firstChild.textContent.match(r)).length
      },
      type: 'movie',
      data: () => document.querySelector('.infobox .summary').firstChild.textContent
    },
    {
      condition: function () {
        if (!document.querySelector('.infobox .summary')) {
          return false
        }
        const r = /television series/
        return $('#catlinks a').filter((i, e) => e.firstChild.textContent.match(r)).length
      },
      type: 'tv',
      data: () => document.querySelector('.infobox .summary').firstChild.textContent
    }]
  },
  fandango: {
    host: ['fandango.com'],
    condition: () => document.querySelector("meta[property='og:title']"),
    products: [{
      condition: Always,
      type: 'movie',
      data: () => document.querySelector("meta[property='og:title']").content.match(/(.+?)\s+\(\d{4}\)/)[1].trim()
    }]
  },
  flixster: {
    host: ['flixster.com'],
    condition: () => Always,
    products: [{
      condition: () => parseLDJSON('@type') === 'Movie',
      type: 'movie',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
    }]
  },
  themoviedb: {
    host: ['themoviedb.org'],
    condition: () => document.querySelector("meta[property='og:type']"),
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'movie' ||
        document.querySelector("meta[property='og:type']").content === 'video.movie',
      type: 'movie',
      data: () => document.querySelector("meta[property='og:title']").content
    },
    {
      condition: () => document.querySelector("meta[property='og:type']").content === 'tv' ||
        document.querySelector("meta[property='og:type']").content === 'tv_series' ||
        document.querySelector("meta[property='og:type']").content.indexOf('tv_show') !== -1,
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content
    }]
  },
  letterboxd: {
    host: ['letterboxd.com'],
    condition: () => parseLDJSON('@type') === 'Movie',
    products: [{
      condition: Always,
      type: 'movie',
      data: () => {
        const ld = parseLDJSON(['name', 'releasedEvent'], (j) => (j['@type'] === 'Movie'))
        let year = null
        try {
          year = parseInt(ld[1][0].startDate.substring(0, 4))
        } catch (e) {}
        return [ld[0], year]
      }
    }]
  },
  TVmaze: {
    host: ['tvmaze.com'],
    condition: () => document.querySelector('h1'),
    products: [{
      condition: Always,
      type: 'tv',
      data: () => document.querySelector('h1').firstChild.textContent
    }]
  },
  TVGuide: {
    host: ['tvguide.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/tvshows/'),
      type: 'tv',
      data: function () {
        if (document.querySelector('meta[itemprop=name]')) {
          return document.querySelector('meta[itemprop=name]').content
        } else {
          return document.querySelector("meta[property='og:title']").content.split('|')[0]
        }
      }
    }]
  },
  followshows: {
    host: ['followshows.com'],
    condition: Always,
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'video.tv_show',
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content.replace(/\(\d{4}\)$/, '')
    }]
  },
  TheTVDB: {
    host: ['thetvdb.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/series/'),
      type: 'tv',
      data: () => document.getElementById('series_title').firstChild.textContent.trim()
    },
    {
      condition: () => document.location.pathname.startsWith('/movies/'),
      type: 'movie',
      data: () => document.getElementById('series_title').firstChild.textContent.trim()
    }]
  },
  ConsequenceOfSound: {
    host: ['consequence.net', 'consequenceofsound.net'],
    condition: () => document.querySelector('#main-content .review-summary'),
    products: [
      {
        condition: () => document.querySelector('meta[name="cXenseParse:cns-artist-names"]') && document.querySelector('em'),
        type: 'music',
        data: function () {
          window.setInterval(function () {
            if (document.getElementById('ot-sdk-btn-floating')) {
              document.getElementById('ot-sdk-btn-floating').remove()
            }
          }, 5000)
          const artist = document.querySelector('meta[name="cXenseParse:cns-artist-names"]').content
          const arr = Array.from(document.querySelectorAll('em')).map((em) => em.textContent.trim())
          const counts = {}
          for (const num of arr) {
            counts[num] = counts[num] ? counts[num] + 1 : 1
          }
          const max = Math.max(...Object.values(counts))
          const maxIndex = Object.values(counts).indexOf(max)
          const title = Object.keys(counts)[maxIndex]
          return [artist, title]
        }
      },
      {
        condition: () => document.title.match(/'(.*?)'\s*Album/i) && document.querySelector('meta[name="cXenseParse:cns-artist-names"]'),
        type: 'music',
        data: function () {
          window.setInterval(function () {
            if (document.getElementById('ot-sdk-btn-floating')) {
              document.getElementById('ot-sdk-btn-floating').remove()
            }
          }, 5000)
          const title = document.title.match(/'(.*?)'\s*Album/i)[1]
          const artist = document.querySelector('meta[name="cXenseParse:cns-artist-names"]').content
          return [artist, title]
        }
      },
      {
        condition: () => document.title.match(/(.+?)\s+\u2013\s+(.+?) \| Album Review/),
        type: 'music',
        data: function () {
          window.setInterval(function () {
            if (document.getElementById('ot-sdk-btn-floating')) {
              document.getElementById('ot-sdk-btn-floating').remove()
            }
          }, 5000)
          const m = document.title.match(/(.+?)\s+\u2013\s+(.+?) \| Album Review/)
          return [m[1], m[2]]
        }
      },
      {
        condition: () => document.location.pathname.indexOf('/album-review') !== -1 && document.querySelector('a.tag[href*="/artist/"'),
        type: 'music',
        data: function () {
          window.setInterval(function () {
            if (document.getElementById('ot-sdk-btn-floating')) {
              document.getElementById('ot-sdk-btn-floating').remove()
            }
          }, 5000)
          const artistAndTitleWithDash = document.location.pathname.match(/album-review-([\w-]+)/)[1]
          const artistWithDash = document.querySelector('a.tag[href*="/artist/"').pathname.match(/artist\/([\w-]+)/)[1]
          const titleWithDash = artistAndTitleWithDash.replace(artistWithDash, '')
          const title = titleWithDash.replace('-', ' ').trim()
          const artist = artistWithDash.replace('-', ' ').trim()
          return [artist, title]
        }
      }]
  },
  Pitchfork: {
    host: ['pitchfork.com'],
    condition: () => ~document.location.href.indexOf('/reviews/albums/'),
    products: [{
      condition: () => document.querySelector('.single-album-tombstone'),
      type: 'music',
      data: function () {
        let artist
        let album
        if (document.querySelector('.single-album-tombstone .artists')) {
          artist = document.querySelector('.single-album-tombstone .artists').innerText.trim()
        } else if (document.querySelector('.single-album-tombstone .artist-list')) {
          artist = document.querySelector('.single-album-tombstone .artist-list').innerText.trim()
        }
        if (document.querySelector('.single-album-tombstone h1.review-title')) {
          album = document.querySelector('.single-album-tombstone h1.review-title').innerText.trim()
        } else if (document.querySelector('.single-album-tombstone h1')) {
          album = document.querySelector('.single-album-tombstone h1').innerText.trim()
        }

        return [artist, album]
      }
    }]
  },
  'Last.fm': {
    host: ['last.fm'],
    condition: () => document.querySelector('*[data-page-resource-type]') && document.querySelector('*[data-page-resource-type]').dataset.pageResourceType === 'album',
    products: [{
      condition: () => document.querySelector('*[data-page-resource-type]').dataset.pageResourceName,
      type: 'music',
      data: function () {
        const artist = document.querySelector('*[data-page-resource-type]').dataset.pageResourceArtistName
        const album = document.querySelector('*[data-page-resource-type]').dataset.pageResourceName
        return [artist, album]
      }
    }]
  },
  TVNfo: {
    host: ['tvnfo.com'],
    condition: () => document.querySelector('#title #name'),
    products: [{
      condition: Always,
      type: 'tv',
      data: function () {
        const years = document.querySelector('#title #years').textContent.trim()
        const title = document.querySelector('#title #name').textContent.replace(years, '').trim()
        return title
      }
    }]
  },
  rateyourmusic: {
    host: ['rateyourmusic.com'],
    condition: () => document.querySelector("meta[property='og:type']"),
    products: [{
      condition: () => document.querySelector("meta[property='og:type']").content === 'music.album',
      type: 'music',
      data: function () {
        const artist = document.querySelector('.section_main_info .artist').innerText.trim()
        const album = document.querySelector('.section_main_info .album_title').innerText.trim()
        return [artist, album]
      }
    }]
  },
  spotify: {
    host: ['open.spotify.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/album/') && document.querySelector('.Root__main-view h1'),
      type: 'music',
      data: function () {
        const album = document.querySelector('.Root__main-view h1').textContent.trim()
        let artist = []
        document.querySelector('.Root__main-view h1').parentNode.parentNode.parentNode.querySelectorAll('a[href*="/artist/"]').forEach(function (a) {
          artist.push(a.textContent.trim())
        })
        artist = artist.join(' ')
        return [artist, album]
      }
    }]
  },
  nme: {
    host: ['nme.com'],
    condition: () => document.location.pathname.startsWith('/reviews/'),
    products: [
      {
        condition: () => document.querySelector('.tdb-breadcrumbs a[href*="/reviews/film-reviews"]'),
        type: 'movie',
        data: function () {
          try {
            return document.title.match(/[‘'](.+?)[’']/)[1]
          } catch (e) {
            try {
              return document.querySelector('h1.tdb-title-text').textContent.match(/[‘'](.+?)[’']/)[1]
            } catch (e) {
              return document.querySelector('h1').textContent.match(/:\s*(.+)/)[1].trim()
            }
          }
        }
      },
      {
        condition: () => document.querySelector('#nme-music-header'),
        type: 'music',
        data: () => document.querySelector('h1.tdb-title-text').textContent.match(/\s*(.+?)\s*.\s*[‘'](.+?)[’']/).slice(1)
      },
      {
        condition: () => document.querySelector('.tdb-breadcrumbs a[href*="/reviews/tv-reviews"]'),
        type: 'tv',
        data: () => document.querySelector('h1.tdb-title-text').textContent.match(/[‘'](.+?)[’']/)[1]
      }]
  },
  albumoftheyear: {
    host: ['albumoftheyear.org'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.startsWith('/album/'),
      type: 'music',
      data: function () {
        const artist = document.querySelector('*[itemprop=byArtist] *[itemprop=name]').textContent
        const album = document.querySelector('.albumTitle *[itemprop=name]').textContent
        return [artist, album]
      }
    }]
  },
  epguides: {
    host: ['epguides.com'],
    condition: () => document.getElementById('eplist'),
    products: [{
      condition: () => document.getElementById('eplist') && document.querySelector('.center.titleblock h2'),
      type: 'tv',
      data: () => document.querySelector('.center.titleblock h2').textContent.trim()
    }]
  },
  /*
  netflix: {
    host: ['netflix.com'],
    condition: !(document.querySelector('.button-nfplayerPlay') || document.querySelector('.nf-big-play-pause') || document.querySelector('.AkiraPlayer video')),

    //  TODO
    //  https://www.netflix.com/de/title/70264888
    //  https://www.netflix.com/de/title/70178217
    //  https://www.netflix.com/de/title/70305892    ## Movie
    //  https://www.netflix.com/de-en/title/80108495  ## No meta

    products: [{
      condition: () => parseLDJSON('@type') === 'Movie',
      type: 'movie',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
    },
    {
      condition: () => parseLDJSON('@type') === 'TVSeries',
      type: 'tv',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
    }]
  },
  */
  ComedyCentral: {
    host: ['cc.com'],
    condition: () => document.location.pathname.startsWith('/shows/'),
    products: [{
      condition: () => document.location.pathname.split('/').length === 3 && document.querySelector("meta[property='og:title']"),
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content.replace('| Comedy Central', '').trim()
    },
    {
      condition: () => document.location.pathname.split('/').length === 3 && document.title.match(/(.+?)\s+-\s+Series/),
      type: 'tv',
      data: () => document.title.match(/(.+?)\s+-\s+Series/)[1]
    }]
  },
  AMC: {
    host: ['amc.com'],
    condition: () => document.location.pathname.startsWith('/shows/'),
    products: [
      {
        condition: () => document.querySelector('.feeds[itemtype="http://schema.org/TVSeries"] h1'),
        type: 'tv',
        data: () => document.querySelector('.feeds[itemtype="http://schema.org/TVSeries"] h1').textContent
      },
      {
        condition: () => document.location.pathname.split('/').length === 3 && document.querySelector("meta[property='og:type']") && document.querySelector("meta[property='og:type']").content.indexOf('tv_show') !== -1,
        type: 'tv',
        data: () => document.querySelector('.video-card-description h1').textContent.trim()
      }]
  },
  AMCplus: {
    host: ['amcplus.com'],
    condition: () => Always,
    products: [
      {
        condition: () => document.title.match(/Watch .+? |/),
        type: 'tv',
        data: () => document.title.match(/Watch (.+?) |/)[1].trim()
      }]
  },
  RlsBB: {
    host: ['rlsbb.ru'],
    condition: () => document.querySelectorAll('.post').length === 1,
    products: [
      {
        condition: () => document.querySelector('#post-wrapper .entry-meta a[href*="/category/movies/"]'),
        type: 'movie',
        data: () => document.querySelector('h1.entry-title').textContent.match(/(.+?)\s+\d{4}/)[1].trim()
      },
      {
        condition: () => document.querySelector('#post-wrapper .entry-meta a[href*="/category/tv-shows/"]'),
        type: 'tv',
        data: () => document.querySelector('h1.entry-title').textContent.match(/(.+?)\s+S\d{2}/)[1].trim()
      }]
  },
  newalbumreleases: {
    host: ['newalbumreleases.net'],
    condition: () => document.querySelectorAll('#content .single').length === 1,
    products: [
      {
        condition: () => document.querySelector('#content .single .cover .entry'),
        type: 'music',
        data: function () {
          const mArtist = document.querySelector('#content .single .cover .entry').textContent.match(/Artist.\s*(.+)\s+/i)
          if (mArtist) {
            const mAlbum = document.querySelector('#content .single .cover .entry').textContent.match(/Album.\s*(.+)\s+/i)
            if (mAlbum) {
              return [mArtist[1], mAlbum[1]]
            }
          }
        }
      }]
  },
  showtime: {
    host: ['sho.com'],
    condition: Always,
    products: [
      {
        condition: () => parseLDJSON('@type') === 'Movie',
        type: 'movie',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'Movie'))
      },
      {
        condition: () => parseLDJSON('@type') === 'TVSeries',
        type: 'tv',
        data: () => parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
      }]
  },
  epicgames: {
    host: ['www.epicgames.com', 'store.epicgames.com'],
    condition: () => document.location.pathname.includes('/p/'),
    products: [{
      condition: () => parseLDJSON('@type') === 'Product',
      type: 'pcgame',
      data: async function () {
        let title = parseLDJSON("name", (j) => (j['@type'] === 'Product'))
        let foreignTitle = false
        const langM = document.location.search.match(/lang=([a-z]{2})/)
        if (langM && langM[1] !== 'en') {
          foreignTitle = true
        } else {
          try {
            name2metacritic(title)
          } catch (e) {
            // Could not convert name -> name probably does not contain ascii letters
            foreignTitle = true
          }
        }
        if (foreignTitle) {
          const a = document.createElement('a')
          a.href = document.location.href
          a.search = '?lang=en'
          const englishUrl = a.href

          const response = await asyncRequest({ url: englishUrl }).catch(function (response) {
            console.warn('ShowMetacriticRatings: Error epicstore\nenglishUrl=' + englishUrl + '\nstatus=' + response.status)
          })
          title = response.responseText.split('<title ')[1].split('>')[1].split('|')[0].trim()
        }
        return title
      }
    }]
  },
  gog: {
    host: ['www.gog.com'],
    condition: () => document.querySelector('.productcard-basics__title'),
    products: [
      {
        condition: () => document.location.pathname.split('/').length > 2 && (
          document.location.pathname.split('/')[1] === 'game' ||
          document.location.pathname.split('/')[2] === 'game'),
        type: 'pcgame',
        data: () => document.querySelector('.productcard-basics__title').textContent
      },
      {
        condition: () => document.location.pathname.split('/').length > 2 && (
          document.location.pathname.split('/')[1] === 'movie' ||
          document.location.pathname.split('/')[2] === 'movie'),
        type: 'movie',
        data: () => document.querySelector('.productcard-basics__title').textContent
      }
    ]
  },
  steamgifts: {
    host: ['www.steamgifts.com'],
    condition: () => document.querySelector('.featured__heading__medium'),
    products: [{
      condition: Always,
      type: 'pcgame',
      data: () => document.querySelector('.featured__heading__medium').innerText
    }]
  },
  allmusic: {
    host: ['allmusic.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.indexOf('/album/') !== -1,
      type: 'music',
      data: function () {
        const ld = parseLDJSON(['name', 'byArtist'], (j) => (j['@type'] === 'MusicAlbum'))
        const album = ld[0]
        const artist = 'name' in ld[1] ? ld[1].name : ld[1].map(x => x.name).join(' ')
        return [artist, album]
      }
    }]
  },
  psapm: {
    host: ['psa.wf'],
    condition: Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/movie/'),
        type: 'movie',
        data: function () {
          const title = document.querySelector('h1').textContent.trim()
          const m = title.match(/(.+)\((\d+)\)$/)
          if (m) {
            return m[1].trim()
          } else {
            return title
          }
        }
      },
      {
        condition: () => document.location.pathname.startsWith('/tv-show/'),
        type: 'tv',
        data: () => document.querySelector('h1').textContent.trim()
      }
    ]
  },
  'save.tv': {
    host: ['save.tv'],
    condition: () => document.location.pathname.startsWith('/STV/M/obj/archive/'),
    products: [
      {
        condition: () => document.location.pathname.startsWith('/STV/M/obj/archive/'),
        type: 'movie',
        data: function () {
          let title = null
          if (document.querySelector("span[data-bind='text:OrigTitle']")) {
            title = document.querySelector("span[data-bind='text:OrigTitle']").textContent
          } else {
            title = document.querySelector("h2[data-bind='text:Title']").textContent
          }
          let year = null
          if (document.querySelector("span[data-bind='text:ProductionYear']")) {
            year = parseInt(document.querySelector("span[data-bind='text:ProductionYear']").textContent)
          }
          return [title, year]
        }
      }
    ]
  },
  wikiwand: {
    host: ['www.wikiwand.com'],
    condition: Always,
    products: [{
      condition: function () {
        const title = document.querySelector('h1').textContent.toLowerCase()
        const subtitle = document.querySelector('h2[class*="subtitle"]') ? document.querySelector('h2[class*="subtitle"]').textContent.toLowerCase() : ''
        if (title.indexOf('film') === -1 && !subtitle) {
          return false
        }
        return title.indexOf('film') !== -1 ||
          subtitle.indexOf('film') !== -1 ||
          subtitle.indexOf('movie') !== -1
      },
      type: 'movie',
      data: () => document.querySelector('h1').textContent.replace(/\((\d{4} )?film\)/i, '').trim()
    },
    {
      condition: function () {
        const title = document.querySelector('h1').textContent.toLowerCase()
        const subtitle = document.querySelector('h2[class*="subtitle"]') ? document.querySelector('h2[class*="subtitle"]').textContent.toLowerCase() : ''
        if (title.indexOf('tv series') === -1 && !subtitle) {
          return false
        }
        return title.indexOf('tv series') !== -1 ||
          subtitle.indexOf('television') !== -1 ||
          subtitle.indexOf('tv series') !== -1
      },
      type: 'tv',
      data: () => document.querySelector('h1').textContent.replace(/\(tv series\)/i, '').trim()
    }]
  },
  radarr: {
    host: ['*'],
    condition: () => document.location.pathname.startsWith('/movie/'),
    products: [{
      condition: () => document.querySelector('[class*="MovieDetails-title"] span'),
      type: 'movie',
      data: () => document.querySelector('[class*="MovieDetails-title"] span').textContent.trim()
    }]
  },
  trakt: {
    host: ['trakt.tv'],
    condition: Always,
    products: [
      {
        condition: () => document.location.pathname.startsWith('/movies/'),
        type: 'movie',
        data: () => Array.from(document.querySelector('.summary h1').childNodes).filter(node => node.nodeType === node.TEXT_NODE).map(node => node.textContent).join(' ').trim()
      },
      {
        condition: () => document.location.pathname.startsWith('/shows/'),
        type: 'tv',
        data: () => Array.from(document.querySelector('.summary h1').childNodes).filter(node => node.nodeType === node.TEXT_NODE).map(node => node.textContent).join(' ').trim()
      }
    ]
  }

}

async function main () {
  let dataFound = false

  let map = false

  for (const name in sites) {
    const site = sites[name]
    if (site.host.some(function (e) { return ~this.indexOf(e) || e === '*' }, document.location.hostname) && site.condition()) {
      for (let i = 0; i < site.products.length; i++) {
        if (site.products[i].condition()) {
          // Check map for a match
          if (map === false) {
            map = JSON.parse(await GM.getValue('map', '{}'))
          }
          const docurl = filterUniversalUrl(document.location.href)
          if (docurl in map) {
            // Found in map, show result
            const metaurl = map[docurl]
            metacriticGeneralProductSetup()
            metacritic.mapped.apply(undefined, [docurl, site.products[i], absoluteMetaURL(metaurl), site.products[i].type])
            dataFound = true
            break
          }
          // Try to retrieve item name from page
          let data
          try {
            data = await site.products[i].data()
          } catch (e) {
            data = false
            console.error(`ShowMetacriticRatings: Error in data() of site='${name}', type='${site.products[i].type}'`)
            console.error(e)
          }
          if (data) {
            const params = [docurl, site.products[i]]
            if (Array.isArray(data)) {
              params.push(...data)
            } else {
              params.push(data)
            }
            metacriticGeneralProductSetup()
            metacritic[site.products[i].type].apply(undefined, params)
            dataFound = true
          }
          break
        }
      }
      break
    }
  }
  return dataFound
}

(async function () {
  const gdpr = await acceptGDPR()
  if (!gdpr) {
    GM.registerMenuCommand('Show Metacritic.com ratings - Accept terms of service', () => acceptGDPR(true).then((yes) => yes && document.location.reload()))
    return
  }
  await versionUpdate()

  if (!document.getElementById('mcdiv123_box_css')) {
    const style = document.createElement('style')
    style.setAttribute('id', 'mcdiv123_box_css')
    style.innerHTML = BOX_CSS
    document.head.appendChild(style)
  }

  const firstRunResult = await main()

  GM.registerMenuCommand('Show Metacritic.com ratings - Search now', () => openSearchBox())
  GM.registerMenuCommand('Show Metacritic.com ratings - Change corner', () => changePosition())
  GM.registerMenuCommand('Show Metacritic.com ratings - Enlarge', () => changeSizeEnlarge())
  GM.registerMenuCommand('Show Metacritic.com ratings - Shrink', () => changeSizeShrink())

  let lastLoc = document.location.href
  let lastContent = document.body.innerText
  let lastCounter = 0
  async function newpage () {
    if (lastContent === document.body.innerText && lastCounter < 15) {
      window.setTimeout(newpage, 500)
      lastCounter++
    } else {
      lastContent = document.body.innerText
      lastCounter = 0
      const re = await main()
      if (!re) { // No page matched or no data found
        window.setTimeout(newpage, 1000)
      }
    }
  }
  window.setInterval(function () {
    if (document.location.href !== lastLoc) {
      lastLoc = document.location.href
      $('#mcdiv123').remove()

      window.setTimeout(newpage, 1000)
    }
  }, 500)

  if (!firstRunResult) {
    // Initial run had no match, let's try again there may be new content
    window.setTimeout(main, 2000)
  }
})()
