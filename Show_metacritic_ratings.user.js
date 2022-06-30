// ==UserScript==
// @name             Show Metacritic.com ratings
// @description      Show metacritic metascore and user ratings on: Bandcamp, Apple Itunes (Music), Amazon (Music,Movies,TV Shows), IMDb (Movies), Google Play (Music, Movies), Steam, Gamespot (PS4, XONE, PC), Rotten Tomatoes, Serienjunkies, BoxOfficeMojo, allmovie.com, fandango.com, Wikipedia (en), themoviedb.org, letterboxd, TVmaze, TVGuide, followshows.com, TheTVDB.com, ConsequenceOfSound, Pitchfork, Last.fm, TVnfo, rateyourmusic.com, GOG, Epic Games Store
// @namespace        cuzi
// @icon             https://www.metacritic.com/images/icons/metacritic-icon.svg
// @supportURL       https://github.com/cvzi/Metacritic-userscript/issues
// @updateURL        https://openuserjs.org/meta/cuzi/Show_Metacritic.com_ratings.meta.js
// @contributionURL  https://buymeacoff.ee/cuzi
// @contributionURL  https://ko-fi.com/cuzicvzi
// @grant            unsafeWindow
// @grant            GM.xmlHttpRequest
// @grant            GM.setValue
// @grant            GM.getValue
// @grant            GM.registerMenuCommand
// @require          https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license          GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @antifeature      tracking When a metacritic rating is displayed, we may store the url of the current website and the metacritic url in our database. Log files are temporarily retained by our database hoster heroku.com and contain your IP address and browser configuration.
// @version          79
// @connect          metacritic.com
// @connect          php-cuzi.herokuapp.com
// @include          https://*.bandcamp.com/*
// @include          https://play.google.com/store/music/album/*
// @include          https://play.google.com/store/movies/details/*
// @include          https://music.amazon.com/*
// @include          https://www.amazon.ca/*
// @include          https://www.amazon.co.jp/*
// @include          https://www.amazon.co.uk/*
// @include          https://smile.amazon.co.uk/*
// @include          https://www.amazon.com.au/*
// @include          https://www.amazon.com.mx/*
// @include          https://www.amazon.com/*
// @include          https://smile.amazon.com/*
// @include          https://www.amazon.de/*
// @include          https://smile.amazon.de/*
// @include          https://www.amazon.es/*
// @include          https://www.amazon.fr/*
// @include          https://www.amazon.in/*
// @include          https://www.amazon.it/*
// @include          https://www.imdb.com/title/*
// @include          https://store.steampowered.com/app/*
// @include          https://www.gamespot.com/*
// @include          https://www.serienjunkies.de/*
// @include          https://www.rottentomatoes.com/m/*
// @include          https://rottentomatoes.com/m/*
// @include          https://www.rottentomatoes.com/tv/*
// @include          https://rottentomatoes.com/tv/*
// @include          https://www.rottentomatoes.com/tv/*/s*/
// @include          https://rottentomatoes.com/tv/*/s*/
// @include          https://www.boxofficemojo.com/movies/*
// @include          https://www.boxofficemojo.com/release/*
// @include          https://www.allmovie.com/movie/*
// @include          https://en.wikipedia.org/*
// @include          https://www.fandango.com/*
// @include          https://www.flixster.com/movie/*
// @include          https://www.themoviedb.org/movie/*
// @include          https://www.themoviedb.org/tv/*
// @include          https://letterboxd.com/film/*
// @exclude          https://letterboxd.com/film/*/image*
// @include          https://www.tvmaze.com/shows/*
// @include          https://www.tvguide.com/tvshows/*
// @include          https://followshows.com/show/*
// @include          https://thetvdb.com/series/*
// @include          https://thetvdb.com/movies/*
// @include          https://consequenceofsound.net/*
// @include          https://consequence.net/*
// @include          https://pitchfork.com/*
// @include          https://www.last.fm/*
// @include          https://tvnfo.com/s/*
// @include          https://rateyourmusic.com/release/album/*
// @include          https://open.spotify.com/*
// @include          https://play.spotify.com/album/*
// @include          https://www.nme.com/reviews/*
// @include          https://www.albumoftheyear.org/album/*
// @include          https://itunes.apple.com/*/movie/*
// @include          https://itunes.apple.com/*/album/*
// @include          https://music.apple.com/*/album/*
// @include          https://itunes.apple.com/*/tv-season/*
// @include          https://epguides.com/*
// @include          https://www.epguides.com/*
// @include          https://sharetv.com/shows/*
// @include          https://www.netflix.com/*
// @include          https://www.cc.com/*
// @include          https://www.tvhoard.com/*
// @include          https://www.amc.com/*
// @include          https://www.amcplus.com/*
// @include          https://rlsbb.ru/*/
// @include          https://newalbumreleases.net/*
// @include          https://www.sho.com/*
// @include          https://www.epicgames.com/store/*
// @include          https://www.gog.com/*
// @include          https://www.allmusic.com/album/*
// @include          https://store.epicgames.com/*
// @include          https://www.steamgifts.com/giveaway/*
// ==/UserScript==

/* globals alert, confirm, GM, DOMParser, $, Image, unsafeWindow, parent, Blob */

const baseURL = 'https://www.metacritic.com/'

const baseURLmusic = 'https://www.metacritic.com/music/'
const baseURLmovie = 'https://www.metacritic.com/movie/'
const baseURLpcgame = 'https://www.metacritic.com/game/pc/'
const baseURLps4 = 'https://www.metacritic.com/game/playstation-4/'
const baseURLxone = 'https://www.metacritic.com/game/xbox-one/'
const baseURLtv = 'https://www.metacritic.com/tv/'

const baseURLsearch = 'https://www.metacritic.com/search/{type}/{query}/results'
const baseURLautosearch = 'https://www.metacritic.com/autosearch'

const baseURLdatabase = 'https://php-cuzi.herokuapp.com/r.php'
const baseURLwhitelist = 'https://php-cuzi.herokuapp.com/whitelist.php'
const baseURLblacklist = 'https://php-cuzi.herokuapp.com/blacklist.php'

const TEMPORARY_BLACKLIST_TIMEOUT = 5 * 60

// http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/
const CSS = '#mcdiv123 .grespinner{height:16px;width:16px;margin:0 auto;position:relative;animation:rotation .6s infinite linear;border-left:6px solid rgba(0,174,239,.15);border-right:6px solid rgba(0,174,239,.15);border-bottom:6px solid rgba(0,174,239,.15);border-top:6px solid rgba(0,174,239,.8);border-radius:100%}@keyframes rotation{from{transform:rotate(0)}to{transform:rotate(359deg)}}#mcdiv123searchresults .result{font:12px arial,helvetica,serif;border-top-width:1px;border-top-color:#ccc;border-top-style:solid;padding:5px}#mcdiv123searchresults .result .result_type{display:inline}#mcdiv123searchresults .result .result_wrap{float:left;width:100%}#mcdiv123searchresults .result .has_score{padding-left:42px}#mcdiv123searchresults .result .basic_stats{height:1%;overflow:hidden}#mcdiv123searchresults .result h3{font-size:14px;font-weight:700}#mcdiv123searchresults .result a{color:#09f;font-weight:700;text-decoration:none}#mcdiv123searchresults .metascore_w.game.seventyfive,#mcdiv123searchresults .metascore_w.positive,#mcdiv123searchresults .metascore_w.score_favorable,#mcdiv123searchresults .metascore_w.score_outstanding,#mcdiv123searchresults .metascore_w.sixtyone{background-color:#6c3}#mcdiv123searchresults .metascore_w.forty,#mcdiv123searchresults .metascore_w.game.fifty,#mcdiv123searchresults .metascore_w.mixed,#mcdiv123searchresults .metascore_w.score_mixed{background-color:#fc3}#mcdiv123searchresults .metascore_w.negative,#mcdiv123searchresults .metascore_w.score_terrible,#mcdiv123searchresults .metascore_w.score_unfavorable{background-color:red}#mcdiv123searchresults a.metascore_w,#mcdiv123searchresults span.metascore_w{display:inline-block}#mcdiv123searchresults .result .metascore_w{color:#fff!important;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-style:normal!important;font-weight:700!important;height:2em;line-height:2em;text-align:center;vertical-align:middle;width:2em;float:left;margin:0 0 0 -42px}#mcdiv123searchresults .result .more_stats{font-size:10px;color:#444}#mcdiv123searchresults .result .release_date .data{font-weight:700;color:#000}#mcdiv123searchresults ol,#mcdiv123searchresults ul{list-style:none}#mcdiv123searchresults .result li.stat{background:0 0;display:inline;float:left;margin:0;padding:0 6px 0 0;white-space:nowrap}#mcdiv123searchresults .result .deck{margin:3px 0 0}#mcdiv123searchresults .result .basic_stat{display:inline;float:right;overflow:hidden;width:100%}'

let myDOMParser = null
function domParser () {
  if (myDOMParser === null) {
    myDOMParser = new DOMParser()
  }
  return myDOMParser
}

async function versionUpdate () {
  const version = parseInt(await GM.getValue('version', 0))
  if (version <= 51) {
    // Reset database
    await GM.setValue('map', '{}')
    await GM.setValue('black', '[]')
    await GM.setValue('hovercache', '{}')
    await GM.setValue('requestcache', '{}')
    await GM.setValue('searchcache', '{}')
    await GM.setValue('autosearchcache', '{}')
    await GM.setValue('temporaryblack', '{}')
  }
  if (version < 55) {
    await GM.setValue('version', 55)
  }
}

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
      const html = '<h1>Privacy Policy for &quot;Show Metacritic.com ratings&quot;</h1><h2>General Data Protection Regulation (GDPR)</h2><p>We are a Data Controller of your information.</p> <p>&quot;Show Metacritic.com ratings&quot; legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:</p><ul> <li>&quot;Show Metacritic.com ratings&quot; needs to perform a contract with you</li> <li>You have given &quot;Show Metacritic.com ratings&quot; permission to do so</li> <li>Processing your personal information is in &quot;Show Metacritic.com ratings&quot; legitimate interests</li> <li>&quot;Show Metacritic.com ratings&quot; needs to comply with the law</li></ul> <p>&quot;Show Metacritic.com ratings&quot; will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p> <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us. Our Privacy Policy was generated with the help of <a href="https://www.gdprprivacypolicy.net/">GDPR Privacy Policy Generator</a> and the <a href="https://www.app-privacy-policy.com">App Privacy Policy Generator</a>.</p><p>In certain circumstances, you have the following data protection rights:</p><ul> <li>The right to access, update or to delete the information we have on you.</li> <li>The right of rectification.</li> <li>The right to object.</li> <li>The right of restriction.</li> <li>The right to data portability</li> <li>The right to withdraw consent</li></ul><h2>Log Files</h2><p>&quot;Show Metacritic.com ratings&quot; follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services\' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users\' movement on the website, and gathering demographic information.</p><h2>Privacy Policies</h2><P>You may consult this list to find the Privacy Policy for each of the advertising partners of &quot;Show Metacritic.com ratings&quot;.</p><p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on &quot;Show Metacritic.com ratings&quot;, which are sent directly to users\' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p><p>Note that &quot;Show Metacritic.com ratings&quot; has no access to or control over these cookies that are used by third-party advertisers.</p><h2>Third Party Privacy Policies</h2><p>&quot;Show Metacritic.com ratings&quot;\'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.List of these Privacy Policies and their links: <ul> <li>Heroku: <a href="https://www.salesforce.com/company/privacy/">https://www.salesforce.com/company/privacy/</a></li> <li>www.metacritic.com: <a href="https://privacy.cbs/">https://privacy.cbs/</a></li></ul></p><p>You can choose to disable cookies through your individual browser options.</p><h2>Children\'s Information</h2><p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p><p>&quot;Show Metacritic.com ratings&quot; does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p><h2>Online Privacy Policy Only</h2><p>Our Privacy Policy created at GDPRPrivacyPolicy.net) applies only to our online activities and is valid for users of our program with regards to the information that they shared and/or collect in &quot;Show Metacritic.com ratings&quot;. This policy is not applicable to any information collected offline or via channels other than this program. <a href="https://gdprprivacypolicy.net">Our GDPR Privacy Policy</a> was generated from the GDPR Privacy Policy Generator.</p><h2>Contact</h2><p>Contact us via github <a href="https://github.com/cvzi/Metacritic-userscript">https://github.com/cvzi/Metacritic-userscript</a> or email cuzi@openmail.cc</p><h2>Consent</h2><p>By using our program ("userscript"), you hereby consent to our Privacy Policy and agree to its terms.</p>'
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

function getHostname (url) {
  const a = document.createElement('a')
  a.href = url
  return a.hostname
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
  return baseURL + url
}

const parseLDJSONCache = {}
function parseLDJSON (keys, condition) {
  if (document.querySelector('script[type="application/ld+json"]')) {
    const data = []
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    for (let i = 0; i < scripts.length; i++) {
      let jsonld
      if (scripts[i].innerText in parseLDJSONCache) {
        jsonld = parseLDJSONCache[scripts[i].innerText]
      } else {
        try {
          jsonld = JSON.parse(scripts[i].innerText)
          parseLDJSONCache[scripts[i].innerText] = jsonld
        } catch (e) {
          parseLDJSONCache[scripts[i].innerText] = null
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
            return r
          } else if (keys) {
            return data[i][keys]
          } else if (typeof condition === 'function') {
            return data[i] // Return whole object
          }
        }
      } catch (e) {
        continue
      }
    }
    return data
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
function searchType2metacritic (type) {
  return ({
    movie: 'movie',
    pcgame: 'game',
    xonegame: 'game',
    ps4game: 'game',
    music: 'album',
    tv: 'tv'
  })[type]
}
function metacritic2searchType (type) {
  return ({
    Album: 'music',
    TV: 'tv',
    Movie: 'movie',
    'PC Game': 'pcgame',
    'PS4 Game': 'ps4game',
    'XONE Game': 'onegame',
    'WIIU Game': 'xxxxx',
    '3DS Game': 'xxxx'
  })[type]
}

function replaceBrackets (str) {
  str = str.replace(/\([^\(]*\)/g, '')
  str = str.replace(/\[[^\]]*\]/g, '')
  return str.trim()
}
function removeSymbols (str) {
  str = str.replace(/[^\s0-9A-Za-zÀ-ÖØ-öø-ÿ]*/gi, '').trim()
  return str.trim()
}
const dashRegExp = new RegExp('[-\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D]')
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

async function removeFromMap (url) {
  const data = JSON.parse(await GM.getValue('map', '{}'))

  url = filterUniversalUrl(url)
  if (url in data) {
    delete data[url]
    await GM.setValue('map', JSON.stringify(data))
  }
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

function asyncRequest (data) {
  return new Promise(async function (resolve, reject) {
    const cachedValue = await isInRequestCache(data)
    if (cachedValue) {
      return resolve(cachedValue)
    }
    const defaultHeaders = {
      Referer: data.url,
      // Host: getHostname(data.url),
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
    GM.xmlHttpRequest(data)
  })
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
      method: 'POST',
      url: current.metaurl,
      data: 'hoverinfo=1',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      }
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
    doc.querySelector('.product_page_title h1')
    doc.querySelector('.summary_img')
    doc.querySelectorAll('.details_section')
    doc.querySelectorAll('#nav_to_metascore .distribution')

    let pageUrl = ''
    let imgSrc = ''
    let imgAlt = ''
    let title = ''
    let publisher = ''
    let releaseDate = ''
    let starring = ''
    let criticsScore = ''
    let criticsClass = ''
    let criticsNumber = ''
    let criticsCharts = ''
    let userScore = ''
    let userClass = ''
    let userNumber = ''
    let userCharts = ''

    pageUrl = response.finalUrl + (response.finalUrl.endsWith('/') ? '' : '/')
    imgSrc = doc.querySelector('.summary_img').src
    imgAlt = doc.querySelector('.summary_img').alt
    title = doc.querySelector('.product_page_title h1').textContent
    if (doc.querySelector('.details_section .distributor a')) { publisher = doc.querySelector('.details_section .distributor a').textContent }

    if (doc.querySelector('.details_section .release_date span:nth-child(2)')) {
      const date = doc.querySelector('.details_section .release_date span:nth-child(2)').textContent
      releaseDate = `
            <div class="summary_detail release_data">
                <span class="label">Release Date:</span>
                <span class="data">${date}</span>
            </div>`
    }

    if (doc.querySelector('.details_section.summary_cast span:nth-child(2)')) {
      const stars = doc.querySelector('.details_section.summary_cast span:nth-child(2)').innerHTML
      starring = `
        <div>
            <div class="summary_detail product_credits">
                <span class="label">Starring:</span>
                <span class="data">
                    ${stars}
                </span>
            </div>
        </div>`
    }

    criticsClass = 'metascore_w medium tbd'
    criticsScore = 'tbd'
    userClass = 'metascore_w medium user tbd'
    userScore = 'tbd'

    if (doc.querySelector('.score_details .based_on')) {
      criticsNumber = doc.querySelector('.score_details .based_on').textContent.match(/\d+/)
    } else {
      criticsNumber = 'By'
    }
    if (doc.querySelector('.user_score_summary .based_on')) {
      userNumber = doc.querySelector('.user_score_summary .based_on').textContent.match(/\d+/)
    } else {
      userNumber = 'User'
    }

    // Remove text from distribution charts:
    let label = doc.querySelector('#nav_to_metascore .charts .label.fl')
    while (label) {
      label.parentNode.title = label.textContent.trim() + ' ' + label.parentNode.querySelector('.count').textContent.trim()
      label.remove()
      label = doc.querySelector('#nav_to_metascore .charts .label.fl')
    }
    const scores = doc.querySelectorAll('#nav_to_metascore .distribution .metascore_w')
    if (scores.length === 2) {
      criticsScore = scores[0].innerText
      criticsClass = scores[0].className.replace('larger', 'medium')
      scores[0].parentNode.parentNode.querySelector('.charts').style.width = '40px'
      criticsCharts = '<td class="meta">' + scores[0].parentNode.parentNode.querySelector('.charts').outerHTML + '</td>'
      userScore = scores[1].innerText
      userClass = scores[1].className.replace('larger', 'medium')
      scores[1].parentNode.parentNode.querySelector('.charts').style.width = '40px'
      userCharts = '<td class="usr">' + scores[1].parentNode.parentNode.querySelector('.charts').outerHTML + '</td>'
    } else if (scores.length === 1) {
      if (scores[0].className.indexOf('user') === -1) {
        criticsScore = scores[0].innerText
        criticsClass = scores[0].className.replace('larger', 'medium')
        scores[0].parentNode.parentNode.querySelector('.charts').style.width = '40px'
        criticsCharts = '<td class="meta">' + scores[0].parentNode.parentNode.querySelector('.charts').outerHTML + '</td>'
      } else {
        userScore = scores[0].innerText
        userClass = scores[0].className.replace('larger', 'medium')
        scores[0].parentNode.parentNode.querySelector('.charts').style.width = '40px'
        userCharts = '<td class="usr">' + scores[0].parentNode.parentNode.querySelector('.charts').outerHTML + '</td>'
      }
    }

    html = `
  <div class="hoverinfo">
    <div class="hover_left">
        <div class="product_image_wrapper">
            <a target="_blank" href="${pageUrl}">
                <img class="product_image large_image" src="${imgSrc}" alt="${imgAlt}" />
            </a>
        </div>
    </div>
    <div class="hover_right">
        <h2 class="product_title">
            <a target="_blank" href="${pageUrl}">${title}</a>
        </h2>
        <div>
            <div class="summary_detail publisher">
                <span class="data">${publisher}</span>
                <span>&nbsp;|&nbsp;&nbsp;</span>
            </div>
            ${releaseDate}
            <div class="clr"></div>
        </div>
        ${starring}
        <div class="hr">
            &nbsp;
        </div>

        <table class="hover_scores ">
            <tr>
                <td class="meta num">
                    <a target="_blank" class="metascore_anchor" href="${pageUrl}#nav_to_metascore">
                        <span class="${criticsClass}">${criticsScore}</span>
                    </a>
                </td>
                <td class="meta txt">
                    <div class="metascore_label">Metascore</div>
                    <div class="metascore_review_count">
                        <a target="_blank" href="${pageUrl}#nav_to_metascore">
                            <span>${criticsNumber}</span> critics
                        </a>
                    </div>
                </td>
                ${criticsCharts}
                <td class="usr num">

                    <a target="_blank" class="metascore_anchor" href="${pageUrl}#nav_to_metascore">
                        <span class="${userClass}">${userScore}</span>
                    </a>

                </td>
                <td class="usr txt">
                    <div class="userscore_label">User Score</div>
                    <div class="userscore_review_count">
                        <a target="_blank" href="${pageUrl}#nav_to_metascore">
                            <span>${userNumber}</span> Ratings
                        </a>
                    </div>
                </td>
                ${userCharts}
            </tr>
        </table>

    </div>

    <div class="clr"></div>
  </div>
  `
  } catch (e) {
    console.warn('ShowMetacriticRatings: Error parsing HTML: ' + e)

    // fallback to cutting out the relevant parts

    let parts = response.responseText.split('class="score_details')
    const textPart = '<div class="' + parts[1].split('</div>')[0] + '</div>'

    let titleText = '<div class="product_page_title' + response.responseText.split('class="product_page_title')[1].split('</div>')[0]
    titleText = titleText.split('<h1>').join('<h1 style="padding:0px; margin:2px">') + '</div>'

    parts = response.responseText.split('id="nav_to_metascore"')
    let metaScorePart = '<div ' + parts[1].split('<div class="subsection_title"')[0] + '</div></div>'

    metaScorePart = metaScorePart.split('href="">').join('href="' + response.finalUrl + '">')
    metaScorePart = metaScorePart.split('section_title bold">').join('section_title bold">' + titleText)

    html = metaScorePart.split('<div class="distribution">').join(textPart + '<div class="distribution">')

    if (html.indexOf('products_module') !== -1) {
      // Critic reviews are not available for this Series yet -> Cut the preview for other series
      html = html.split('products_module')[0] + '"></div>'
    }

    if (html.length > 5000) {
      // Probably something went wrong, let's cut the response to prevent too long content
      console.warn('ShowMetacriticRatings: Cutting response to 5000 chars')
      html = html.substr(0, 5000)
    }
  }
  return html
}

async function storeInRequestCache (requestData, response) {
  if ('onload' in requestData) {
    delete requestData.onload
  }
  if ('onerror' in requestData) {
    delete requestData.onerror
  }
  const newkey = JSON.stringify(requestData)
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
  if ('onload' in requestData) {
    delete requestData.onload
  }
  if ('onerror' in requestData) {
    delete requestData.onerror
  }
  const key = JSON.stringify(requestData)

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

  if (response.responseText && response.responseText.indexOf('<title>500 Page') !== -1) {
    // Hover info not available for this url, try again with GET
    response = await asyncRequest({ url: current.metaurl }).catch(function (response) {
      console.warn('ShowMetacriticRatings: Error 03\nurl=' + current.metaurl + '\nstatus=' + response.status)
    })

    const newobj = {}
    for (const key in response) {
      newobj[key] = response[key]
    }
    newobj.responseText = extractHoverFromFullPage(response)
    response = newobj
  }

  if (!('time' in response)) {
    response.time = (new Date()).toJSON()
  }
  if (response.status === 200 && response.responseText) {
    return response
  } else {
    const error = new Error('ShowMetacriticRatings: loadHoverInfo()\nUrl: ' + response.finalUrl + '\nStatus: ' + response.status)
    error.status = response.status
    error.responseText = response.responseText
    throw error
  }
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

async function loadMetacriticUrl (fromSearch) {
  if (!current.metaurl) {
    alert('ShowMetacriticRatings: Error 04')
    return
  }
  const orgMetaUrl = current.metaurl
  if (await isBlacklistedUrl(document.location.href, current.metaurl)) {
    waitForHotkeysMETA()
    return
  }

  if (await isTemporaryBlacklisted(current.metaurl)) {
    console.debug(`ShowMetacriticRatings: loadMetacriticUrl(fromSearch=${fromSearch}) ${current.metaurl} is temporary blacklisted`)
    waitForHotkeysMETA()
    return
  }

  const response = await loadHoverInfo().catch(async function (response) {
    if (response instanceof Error || (response && response.stack && response.message)) {
      if (!fromSearch && ('status' in response && response.status === 404)) {
        // No results
        let broadenFct = broadenSearch // global broadenSearch function is the default
        if ('broaden' in current.product) {
          // try product 'broaden'-function if it is defined
          broadenFct = current.product.broaden
        }
        const newData = await broadenFct(current.data.slice(0), ++current.broadenCounter, current.type)
        if (newData !== current.data) {
          current.data = newData
          metacritic[current.type](current.docurl, current.product, ...newData)
        } else if (newData === current.data) {
          // Same data as before, try once again to broaden
          const newData2 = await broadenFct(current.data.slice(0), ++current.broadenCounter, current.type)
          if (newData2 !== current.data) {
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

    if (fromSearch) {
      startSearch()
    }
  })

  if (await isBlacklistedUrl(document.location.href, current.metaurl)) {
    waitForHotkeysMETA()
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

  const cache = JSON.parse(await GM.getValue('autosearchcache', '{}'))
  const now = (new Date()).getTime()
  const timeout = 2 * 60 * 60 * 1000
  for (const prop in cache) {
    // Delete cached values, that are older than 2 hours
    if (now - (new Date(cache[prop].time)).getTime() > timeout) {
      delete cache[prop]
    }
  }

  if (current.type === 'music') {
    current.searchTerm = current.data[0]
  } else {
    current.searchTerm = current.data.join(' ')
  }
  let response
  if (current.searchTerm in cache) {
    response = cache[current.searchTerm]
  } else {
    response = await asyncRequest({
      method: 'POST',
      url: baseURLautosearch,
      data: 'search_term=' + encodeURIComponent(current.searchTerm) + '&image_size=98&search_each=1&sort_type=popular',
      headers: {
        Referer: current.metaurl,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // Host: 'www.metacritic.com',
        'User-Agent': 'MetacriticUserscript Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    response = {
      time: (new Date()).toJSON(),
      json: JSON.parse(response.responseText)
    }
    cache[current.searchTerm] = response
    await GM.setValue('autosearchcache', JSON.stringify(cache))
  }

  if (!response || !('json' in response)) {
    alert('ShowMetacriticRatings: Error 05')
  }
  const data = response.json
  let multiple = false
  if (data && data.autoComplete && data.autoComplete.results && data.autoComplete.results.length) {
    // Remove data with wrong type
    data.autoComplete = data.autoComplete.results

    const newdata = []
    data.autoComplete.forEach(function (result) {
      if (metacritic2searchType(result.refType) === current.type) {
        newdata.push(result)
      }
    })
    data.autoComplete = newdata
    if (data.autoComplete.length === 0) {
      // No results
      console.debug('ShowMetacriticRatings: No results (after filtering by type) for searchTerm=' + current.searchTerm)
    } else if (data.autoComplete.length === 1) {
      // One result, let's show it
      if (!await isBlacklistedUrl(document.location.href, absoluteMetaURL(data.autoComplete[0].url))) {
        current.metaurl = absoluteMetaURL(data.autoComplete[0].url)
        loadMetacriticUrl(true)
        return
      }
    } else {
      // More than one result
      multiple = true
      console.debug('ShowMetacriticRatings: Multiple results for searchTerm=' + current.searchTerm)
      const exactMatches = []
      data.autoComplete.forEach(function (result, i) { // Try to find the correct result by matching the search term to exactly one movie title
        if (current.searchTerm === result.name) {
          exactMatches.push(result)
        }
      })
      if (exactMatches.length === 1) {
        // Only one exact match, let's show it
        console.debug('ShowMetacriticRatings: Only one exact match for searchTerm=' + current.searchTerm)
        if (!await isBlacklistedUrl(document.location.href, absoluteMetaURL(exactMatches[0].url))) {
          current.metaurl = absoluteMetaURL(exactMatches[0].url)
          loadMetacriticUrl(true)
          return
        }
      }
    }
  } else {
    console.debug('ShowMetacriticRatings: No results (at all) for searchTerm=' + current.searchTerm)
  }
  // HERE: multiple results or no result. The user may type "meta" now
  if (multiple) {
    balloonAlert('Multiple metacritic results. Type &#34;meta&#34; for manual search.', 10000, false, { bottom: 5, top: 'auto', maxWidth: 400, paddingRight: 5 }, () => openSearchBox(true))
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
    position: 'fixed',
    bottom: 0,
    left: 0,
    minWidth: 300,
    maxHeight: '80%',
    maxWidth: 640,
    overflow: 'auto',
    backgroundColor: '#fff',
    border: '2px solid #bbb',
    borderRadius: ' 6px',
    boxShadow: '0 0 3px 3px rgba(100, 100, 100, 0.2)',
    color: '#000',
    padding: ' 3px',
    zIndex: '2147483601'
  })
  $('<input type="text" size="60" id="mcisearchquery" style="background:white;color:black;">').appendTo(div).focus().val(query).on('keypress', function (e) {
    const code = e.keyCode || e.which
    if (code === 13) { // Enter key
      searchBoxSearch(e, $('#mcisearchquery').val())
    }
  })
  $('<button id="mcisearchbutton" style="background:silver;color:black;">').text('Search').appendTo(div).click((ev) => searchBoxSearch(ev, $('#mcisearchquery').val()))
}
async function searchBoxSearch (ev, query) {
  if (!query) { // Use values from search form
    query = current.searchTerm
  }

  const type = searchType2metacritic(current.type)

  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = CSS
  document.head.appendChild(style)

  const div = $('#mcdiv123')
  const loader = $('<div style="width:20px; height:20px;display:inline-block" class="grespinner"></div>').appendTo($('#mcisearchbutton'))

  const url = baseURLsearch.replace('{type}', encodeURIComponent(type)).replace('{query}', encodeURIComponent(query))

  const response = await asyncRequest({
    url: url,
    data: 'search_term=' + encodeURIComponent(current.searchTerm) + '&image_size=98&search_each=1&sort_type=popular',
    headers: {
      Referer: url,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Host: 'www.metacritic.com',
      'User-Agent': 'MetacriticUserscript ' + navigator.userAgent
    }
  }).catch(function (response) {
    alert('Search failed!\n' + response.finalUrl + '\nStatus: ' + response.status + '\n' + response.responseText ? response.responseText.substring(0, 500) : 'Empty response')
  })

  const results = []
  if (!~response.responseText.indexOf('No search results found.')) {
    const d = $('<html>').html(response.responseText)
    d.find('ul.search_results.module .result').each(function () {
      results.push(this.innerHTML)
    })
  }

  if (results && results.length > 0) {
    // Show results
    loader.remove()

    const accept = function (ev) {
      const parentDiv = $(this.parentNode)
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

    const resultdiv = $('#mcdiv123searchresults').length ? $('#mcdiv123searchresults').html('') : $('<div id="mcdiv123searchresults"></div>').css('max-width', '95%').appendTo(div)
    results.forEach(function (html) {
      const singleresult = $('<div class="result"></div>').html(fixMetacriticURLs(html) + '<div style="clear:left"></div>').appendTo(resultdiv)
      $('<span title="Assist us: This is the correct entry!" style="cursor:pointer; color:green; font-size: 13px;">&check;</span>').prependTo(singleresult).click(accept)
    })
    resultdiv.find('.metascore_w.album').removeClass('album') // Remove some classes
    resultdiv.find('.must-see').remove() // Remove some elements

    const sub = $('#mcdiv123 .sub').length ? $('#mcdiv123 .sub').html('') : $('<div class="sub"></div>').appendTo(div)
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + url + '" title="Open Metacritic">' + decodeURI(url.replace('https://www.', '@')) + '</a>').appendTo(sub)
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#10062;</span>').appendTo(sub).click(function () {
      document.body.removeChild(this.parentNode.parentNode)
    })
    $('<span title="Assist us: None of the above is the correct item!" style="cursor:pointer; float:right; color:crimson; font-size: 11px;">&cross;</span>').appendTo(sub).click(function () { if (confirm('None of the above is the correct item\nConfirm?')) denyAll() })
  } else {
    // No results
    loader.remove()
    const resultdiv = $('#mcdiv123searchresults').length ? $('#mcdiv123searchresults').html('') : $('<div id="mcdiv123searchresults"></div>').appendTo(div)
    resultdiv.html('No search results.')

    const sub = $('#mcdiv123 .sub').length ? $('#mcdiv123 .sub').html('') : $('<div class="sub"></div>').appendTo(div)
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="' + url + '" title="Open Metacritic">' + decodeURI(url.replace('https://www.', '@')) + '</a>').appendTo(sub)
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
    position: 'fixed',
    bottom: 0,
    left: 0,
    minWidth: 300,
    backgroundColor: '#fff',
    border: '2px solid #bbb',
    borderRadius: ' 6px',
    boxShadow: '0 0 3px 3px rgba(100, 100, 100, 0.2)',
    color: '#000',
    padding: ' 3px',
    zIndex: '2147483601'
  })

  // Functions for communication between page and iframe
  // Mozilla can access parent.document
  // Chrome can use postMessage()
  let frameStatus = false // if this remains false, loading the frame content failed. A reason could be "Content Security Policy"
  function loadExternalImage (url, myframe) {
    // Load external image, bypass CSP
    GM.xmlHttpRequest({
      method: 'GET',
      url: url,
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
        } else if ('mcimessage1' in e.data) {
          f.style.width = parseInt(f.style.width) + 10 + 'px'
          if (e.data.heightdiff === lastdiff) {
            f.style.height = parseInt(f.style.height) + 5 + 'px'
          }
          lastdiff = e.data.heightdiff
        } else if ('mcimessage2' in e.data) {
          f.style.height = parseInt(f.style.height) + 15 + 'px'
          f.style.width = '400px'
        } else if ('mcimessage_loadImg' in e.data) {
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
      parent.postMessage({ mcimessage0: true }, '*') // Loading frame content was successfull

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

        if (!('mcimessage3' in e.data)) return

        if (e.data.mciframe123_clientHeight < document.body.scrollHeight && i < 100) {
          parent.postMessage({ mcimessage1: 1, heightdiff: document.body.scrollHeight - e.data.mciframe123_clientHeight }, '*')
          i++
        }
        if (i >= 100) {
          parent.postMessage({ mcimessage2: 1 }, '*')
          i = 0
        }
      })
      parent.postMessage({ mcimessage1: 1, heightdiff: -100000 }, '*')
    }

  }

  const css = `#hover_div .clr { clear: both}
  #hover_div .fl{float: left}
  #hover_div { background-color: #fff; color: #666; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:400; font-style:normal;}
  #hover_div .hoverinfo .hover_left { float: left}
  #hover_div .hoverinfo .product_image_wrapper { color: #999; font-size: 6px; font-weight: normal; min-height: 98px; min-width: 98px;}
  #hover_div .hoverinfo .product_image_wrapper a { color: #999; font-size: 6px; font-weight: normal;}
  #hover_div a * { cursor: pointer}
  #hover_div a { color: #09f; font-weight: bold;}
  #hover_div a:link, #hover_div a:visited { text-decoration: none;}
  #hover_div a:hover { text-decoration: underline;}
  #hover_div .hoverinfo .hover_right { float: left; margin-left: 15px; max-width: 395px;}
  #hover_div .hoverinfo .product_title { color: #333; font-family: georgia,serif; font-size: 24px; line-height: 26px; margin-bottom: 10px;}
  #hover_div .hoverinfo .product_title a {  color:#333; font-family: georgia,serif; font-size: 24px;}
  #hover_div .hoverinfo .summary_detail.publisher, .hoverinfo .summary_detail.release_data { float: left}
  #hover_div .hoverinfo .summary_detail { font-size: 11px; margin-bottom: 10px;}
  #hover_div .hoverinfo .summary_detail.product_credits a { color: #999; font-weight: normal; }
  #hover_div .hoverinfo .hr { background-color: #ccc; height: 2px; margin: 15px 0 10px;}
  #hover_div .hoverinfo .hover_scores { width: 100%; border-collapse: collapse; border-spacing: 0;}
  #hover_div .hoverinfo .hover_scores td.num { width: 39px}
  #hover_div .hoverinfo .hover_scores td { vertical-align: middle}
  #hover_div caption, #hover_div th, #hover_div td { font-weight: normal; text-align: left;}
  #hover_div .metascore_anchor, #hover_div a.metascore_w { text-decoration: none !important}
  #hover_div span.metascore_w, #hover_div a.metascore_w { display: inline-block; padding:0px;}
  .metascore_w { background-color: transparent; color: #fff !important; font-family: Arial,Helvetica,sans-serif; font-size: 17px; font-style: normal !important; font-weight: bold !important; height: 2em; line-height: 2em; text-align: center; vertical-align: middle; width: 2em;}
  #hover_div .metascore, #hover_div .metascore a, #hover_div .avguserscore, #hover_div .avguserscore a { color: #fff}
  #hover_div .critscore, #hover_div .critscore a, #hover_div .userscore, #hover_div .userscore a { color: #333}
  .score_tbd { background: #eaeaea; color: #333; font-size: 14px;}
  #hover_div .score_tbd a { color: #333}
  #hover_div .negative,#hover_div .score_terrible,#hover_div .score_unfavorable,#hover_div .carousel_set a.product_terrible:hover,#hover_div .carousel_set a.product_unfavorable:hover { background-color: #f00}
  #hover_div.mixed, .neutral,#hover_div .score_mixed,#hover_div .carousel_set a.product_mixed:hover { background-color: #fc3; color: #333;}
  #hover_div .score_mixed a { color: #333}
  #hover_div .positive,#hover_div .score_favorable,#hover_div .score_outstanding,#hover_div .carousel_set a.product_favorable:hover,#hover_div .carousel_set a.product_outstanding:hover { background-color: #6c3}
  .critscore_terrible, .critscore_unfavorable { border-color: #f00}
  .critscore_mixed { border-color: #fc3}
  .critscore_favorable, .critscore_outstanding { border-color: #6c3}
  .metascore .score_total, .userscore .score_total { display: none; visibility: hidden;}
  .hoverinfo .metascore_label, .hoverinfo .userscore_label { font-size: 12px; font-weight: bold; line-height: 16px; margin-top: 2%;}
  .hoverinfo .metascore_review_count, .hoverinfo .userscore_review_count { font-size: 11px}
  .hoverinfo .hover_scores td { vertical-align: middle}
  .hoverinfo .hover_scores td.num { width: 39px}
  .hoverinfo .hover_scores td.usr.num { padding-left: 20px}
  .metascore_anchor, a.metascore_w { text-decoration: none !important}
  .metascore_w.album { padding-top:0px; !important}
  .metascore_w.user { border-radius: 55%; color: #fff;}
  .metascore_anchor, .metascore_w.album { padding: 0px;!important, padding-top: 0px;!important}
  a.metascore_w { text-decoration: none!important}
  .metascore_anchor:hover { text-decoration: none!important}
  .metascore_w:hover { text-decoration: none!important}
  span.metascore_w, a.metascore_w { display: inline-block}
  .metascore_w.xlarge, .metascore_w.xl { font-size: 42px}
  .metascore_w.large, .metascore_w.lrg { font-size: 25px}
  .m .metascore_w.medium, .m .metascore_w.med { font-size: 19px}
  .metascore_w.med_small { font-size: 14px}
  .metascore_w.small, .metascore_w.sm { font-size: 12px}
  .metascore_w.tiny { height: 1.9em; font-size: 11px; line-height: 1.9em;}
  .metascore_w.user { border-radius: 55%; color: #fff;}
  .metascore_w.user.small, .metascore_w.user.sm { font-size: 11px}
  .metascore_w.tbd, .metascore_w.score_tbd { color: #000!important; background-color: #ccc;}
  .metascore_w.tbd.hide_tbd, .metascore_w.score_tbd.hide_tbd { visibility: hidden}
  .metascore_w.tbd.no_tbd, .metascore_w.score_tbd.no_tbd { display: none}
  .metascore_w.noscore::before, .metascore_w.score_noscore::before { content: '\u2022\u2022\u2022'}
  .metascore_w.noscore, .metascore_w.score_noscore { color: #fff!important; background-color: #ccc;}
  .metascore_w.rip, .metascore_w.score_rip { border-radius: 4px; color: #fff!important; background-color: #999;}
  .metascore_w.negative, .metascore_w.score_terrible, .metascore_w.score_unfavorable { background-color: #f00}
  .metascore_w.mixed, .metascore_w.forty, .metascore_w.game.fifty, .metascore_w.score_mixed { background-color: #fc3}
  .metascore_w.positive, .metascore_w.sixtyone, .metascore_w.game.seventyfive, .metascore_w.score_favorable, .metascore_w.score_outstanding { background-color: #6c3}
  .metascore_w.indiv { height: 1.9em; width: 1.9em; font-size: 15px; line-height: 1.9em;}
  .metascore_w.indiv.large, .metascore_w.indiv.lrg { font-size: 24px}
  .m .metascore_w.indiv.medium, .m .metascore_w.indiv.med { font-size: 16px}
  .metascore_w.indiv.small, .metascore_w.indiv.sm { font-size: 11px}
  .metascore_w.indiv.perfect { padding-right: 1px}
  .hover_esite { display:none; }
  .promo_amazon .esite_btn { margin: 3px 0 0 7px;}
  .esite_amazon { background-color: #fdc354; border: 1px solid #aaa;}
  .esite_label_wrapper { display:none;}
  .esite_btn { border-radius: 4px; color: #222; font-size: 12px; height: 40px; line-height: 40px; width: 120px;}
  .chart{background-color:inherit!important;margin-top:-3px}
  .chart_bg{width:100%;border-top:3px solid rgba(150,150,150,0.3)}
  .chart .bar{width:100%;height:3px}
  .chart .count{font-size:10px}`

  let framesrc = 'data:text/html,'
  framesrc += encodeURIComponent('<!DOCTYPE html>\
    <html lang="en">\
      <head>\
        <meta charset="utf-8">\
        <title>Metacritic info</title>\
        <style>body { margin:0px; padding:0px; background:white; }' + css +
        '\
        </style>\
        <script>\
        const failedImages = {};\
        function detectCSP(img) {\
          if(img.complete && (!img.naturalWidth || !img.naturalHeight)) {\
            return true;\
          }\
          return false;\
        }\
        function findCSPerrors() {\
          const imgs = document.querySelectorAll("img");\
          for(let i = 0; i < imgs.length; i++) {\
            if(imgs[i].complete && detectCSP(imgs[i])) {\
              fixCSP(imgs[i]);\
            }\
          }\
        }\
        function fixCSP(img) {\
          console.debug("ShowMetacriticRatings(iFrame): Loading image failed. Bypassing CSP...");\
          failedImages[img.src] = img;\
          parent.postMessage({"mcimessage_loadImg":true, "mcimessage_imgUrl": img.src},"*"); \
        }\
        function on_load() {\
          (' + functions.frame.toString() + ')();\
          window.setTimeout(findCSPerrors, 500);\
          \
        }\
        </script>\
      </head>\
      <body onload="on_load();">\
        <div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">\
          <div class="hover_content">' + html + '</div>\
        </div>\
      </body>\
    </html>')

  const frame = $('<iframe></iframe>').appendTo(div)
  frame.attr('id', 'mciframe123')
  frame.attr('src', framesrc)
  frame.attr('scrolling', 'auto')
  frame.css({
    width: 380,
    height: 150,
    border: 'none'
  })

  window.setTimeout(function () {
    if (!frameStatus) { // Loading frame content failed.
      //  Directly inject the html without an iframe (this may break the site or the metacritic)
      console.debug('ShowMetacriticRatings: Loading iframe content failed. Injecting directly.')
      $('head').append('<style>' + css + '</style>')
      const noframe = $('<div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">\
          <div class="hover_content">' + html + '</div>\
          </div>')
      frame.replaceWith(noframe)
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

function metacritic_general_product_setup () {
  current.broadenCounter = 0
}

const metacritic = {
  mapped: function metacriticMapped (docurl, product, metaurl, type) {
    // url was in the map/whitelist
    current.data = []
    current.docurl = docurl
    current.product = product
    current.metaurl = metaurl
    current.type = type
    current.searchTerm = null
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
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.movie') {
            return true
          } else if (document.querySelector('[data-testid="hero-title-block__title"]') && !document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            // New design 2020-12
            return true
          }
          return false
        },
        type: 'movie',
        data: function () {
          if (document.querySelector('[data-testid="hero-title-block__title"]')) {
            // New design 2020-12
            return document.querySelector('[data-testid="hero-title-block__title"]').textContent
          } else if (document.querySelector("meta[property='og:title']") && document.querySelector("meta[property='og:title']").content) { // English/Worldwide title, this is the prefered title for search
            let name = document.querySelector("meta[property='og:title']").content.trim()
            if (name.indexOf('- IMDb') !== -1) {
              name = name.replace('- IMDb', '').trim()
            }
            name = name.replace(/\(\d{4}\)/, '').trim()
            return name
          } else if (document.querySelector('.originalTitle') && document.querySelector('.title_wrapper h1')) { // Use English title 2018
            return document.querySelector('.title_wrapper h1').firstChild.textContent.trim()
          } else if (document.querySelector('script[type="application/ld+json"]')) { // Use original language title
            return parseLDJSON('name')
          } else if (document.querySelector('h1[itemprop=name]')) { // Movie homepage (New design 2015-12)
            return document.querySelector('h1[itemprop=name]').firstChild.textContent.trim()
          } else if (document.querySelector('*[itemprop=name] a') && document.querySelector('*[itemprop=name] a').firstChild.textContent) { // Subpage of a move
            return document.querySelector('*[itemprop=name] a').firstChild.textContent.trim()
          } else if (document.querySelector('.title-extra[itemprop=name]')) { // Movie homepage: sub-/alternative-/original title
            return document.querySelector('.title-extra[itemprop=name]').firstChild.textContent.replace(/"/g, '').trim()
          } else if (document.querySelector('*[itemprop=name]')) { // Movie homepage (old design)
            return document.querySelector('*[itemprop=name]').firstChild.textContent.trim()
          } else {
            return document.title.match(/(.+?)\s+(\(\d+\))? - IMDb/)[1]
          }
        }
      },
      {
        condition: function () {
          const e = document.querySelector("meta[property='og:type']")
          if (e && e.content === 'video.tv_show') {
            return true
          } else if (document.querySelector('[data-testid="hero-subnav-bar-left-block"] a[href*="episodes/"]')) {
            // New design 2020-12
            return true
          }
          return false
        },
        type: 'tv',
        data: function () {
          if (document.querySelector('[data-testid="hero-title-block__title"]')) {
            // New design 2020-12
            return document.querySelector('[data-testid="hero-title-block__title"]').textContent
          } else if (document.querySelector('*[itemprop=name]')) {
            return document.querySelector('*[itemprop=name]').textContent
          } else if (document.querySelector('script[type="application/ld+json"]')) {
            const jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText)
            return jsonld.name
          } else {
            return document.title.match(/(.+?)\s+\(TV/)[1]
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
      condition: () => Always,
      type: 'tv',
      data: () => parseLDJSON('name', (j) => (j['@type'] === 'TVSeries'))
    }]
  },
  gamespot: {
    host: ['gamespot.com'],
    condition: () => document.querySelector('[itemprop=device]'),
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
    host: ['www.flixster.com'],
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
      condition: () => document.querySelector("meta[property='og:type']").content === 'movie',
      type: 'movie',
      data: () => document.querySelector("meta[property='og:title']").content
    },
    {
      condition: () => document.querySelector("meta[property='og:type']").content === 'tv' || document.querySelector("meta[property='og:type']").content === 'tv_series',
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content
    }]
  },
  letterboxd: {
    host: ['letterboxd.com'],
    condition: () => unsafeWindow.filmData && 'name' in unsafeWindow.filmData,
    products: [{
      condition: Always,
      type: 'movie',
      data: () => unsafeWindow.filmData.name
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
      data: () => document.querySelector("meta[property='og:title']").content
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
    condition: () => document.querySelector('.ui.breadcrumb a[href*="/series"]'),
    products: [{
      condition: Always,
      type: 'tv',
      data: function () {
        const years = document.querySelector('#title h1 .years').textContent.trim()
        const title = document.querySelector('#title h1').textContent.replace(years, '').trim()
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
  ShareTV: {
    host: ['sharetv.com'],
    condition: () => document.location.pathname.startsWith('/shows/'),
    products: [{
      condition: () => document.location.pathname.split('/').length === 3 && document.querySelector("meta[property='og:title']"),
      type: 'tv',
      data: () => document.querySelector("meta[property='og:title']").content
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
  TVHoard: {
    host: ['tvhoard.com'],
    condition: Always,
    products: [{
      condition: () => document.location.pathname.split('/').length === 3 && document.location.pathname.split('/')[1] === 'titles' && !document.querySelector('app-root title-secondary-details-panel .seasons') && document.querySelector('app-root title-page-container h1.title a'),
      type: 'movie',
      data: () => document.querySelector('app-root title-page-container h1.title a').textContent.trim()
    },
    {
      condition: () => document.location.pathname.split('/').length === 3 && document.location.pathname.split('/')[1] === 'titles' && document.querySelector('app-root title-secondary-details-panel .seasons') && document.querySelector('app-root title-page-container h1.title a'),
      type: 'tv',
      data: () => document.querySelector('app-root title-page-container h1.title a').textContent.trim()
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
		condition: () => document.querySelector('.meta-schema'),
		products: [{
			condition: Always,
			type: 'pcgame',
			data: () => document.querySelector('.meta-schema').nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.textContent
		}]
	},
  gog: {
    host: ['www.gog.com'],
    condition: () => document.querySelector('.productcard-basics__title'),
    products: [
      {
        condition: () => document.location.pathname.slice(1, 5) === 'game',
        type: 'pcgame',
        data: () => document.querySelector('.productcard-basics__title').textContent
      },
      {
        condition: () => document.location.pathname.slice(1, 6) === 'movie',
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
  }

}

async function main () {
  let dataFound = false

  let map = false

  for (const name in sites) {
    const site = sites[name]
    if (site.host.some(function (e) { return ~this.indexOf(e) }, document.location.hostname) && site.condition()) {
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
            metacritic_general_product_setup()
            metacritic.mapped.apply(undefined, [docurl, site.products[i], absoluteMetaURL(metaurl), site.products[i].type])
            dataFound = true
            break
          }
          // Try to retrieve item name from page
          let data
          try {
            data = site.products[i].data()
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
            metacritic_general_product_setup()
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
  const firstRunResult = await main()

  GM.registerMenuCommand('Show Metacritic.com ratings - Search now', () => openSearchBox())

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
