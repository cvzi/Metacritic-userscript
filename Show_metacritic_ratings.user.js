// ==UserScript==
// @name        Show Metacritic.com ratings
// @description Show metacritic metascore and user ratings on: Bandcamp, Apple Itunes (Music), Amazon (Music,Movies,TV Shows), IMDb (Movies), Google Play (Music, Movies), TV.com, Steam, Gamespot (PS4, XONE, PC), Rotten Tomatoes, Serienjunkies, BoxOfficeMojo, allmovie.com, movie.com, Wikipedia (en), themoviedb.org, letterboxd, TVmaze, TVGuide, followshows.com, TheTVDB.com, ConsequenceOfSound, Pitchfork, Last.fm, TVnfo, rateyourmusic.com
// @namespace   cuzi
// @updateURL   https://openuserjs.org/meta/cuzi/Show_Metacritic.com_ratings.meta.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license     GPL-3.0
// @version     27
// @connect     metacritic.com
// @connect     php-cuzi.herokuapp.com
// @include     https://*.bandcamp.com/*
// @include     https://itunes.apple.com/*/album/*
// @include     https://play.google.com/store/music/album/*
// @include     https://play.google.com/store/movies/details/*
// @include     http://www.amazon.com/*
// @include     https://www.amazon.com/*
// @include     http://www.amazon.co.uk/*
// @include     https://www.amazon.co.uk/*
// @include     http://www.amazon.fr/*
// @include     https://www.amazon.fr/*
// @include     http://www.amazon.de/*
// @include     https://www.amazon.de/*
// @include     http://www.amazon.es/*
// @include     https://www.amazon.es/*
// @include     http://www.amazon.ca/*
// @include     https://www.amazon.ca/*
// @include     http://www.amazon.in/*
// @include     https://www.amazon.in/*
// @include     http://www.amazon.it/*
// @include     https://www.amazon.it/*
// @include     http://www.amazon.co.jp/*
// @include     https://www.amazon.co.jp/*
// @include     http://www.amazon.com.mx/*
// @include     https://www.amazon.com.mx/*
// @include     http://www.amazon.com.au/*
// @include     https://www.amazon.com.au/*
// @include     http://www.imdb.com/title/*
// @include     https://www.imdb.com/title/*
// @include     http://store.steampowered.com/app/*
// @include     https://store.steampowered.com/app/*
// @include     http://www.gamespot.com/*
// @include     https://www.gamespot.com/*
// @include     http://www.serienjunkies.de/*
// @include     https://www.serienjunkies.de/*
// @include     http://www.tv.com/shows/*
// @include     http://www.rottentomatoes.com/m/*
// @include     https://www.rottentomatoes.com/m/*
// @include     http://www.rottentomatoes.com/tv/*
// @include     https://www.rottentomatoes.com/tv/*
// @include     http://www.rottentomatoes.com/tv/*/s*/
// @include     https://www.rottentomatoes.com/tv/*/s*/
// @include     http://www.boxofficemojo.com/movies/*
// @include     http://www.allmovie.com/movie/*
// @include     https://www.allmovie.com/movie/*
// @include     https://en.wikipedia.org/*
// @include     http://www.movies.com/*/m*
// @include     https://www.themoviedb.org/movie/*
// @include     https://www.themoviedb.org/tv/*
// @include     http://letterboxd.com/film/*
// @include     https://letterboxd.com/film/*
// @include     http://www.tvmaze.com/shows/*
// @include     http://www.tvguide.com/tvshows/*
// @include     https://www.tvguide.com/tvshows/*
// @include     http://followshows.com/show/*
// @include     https://followshows.com/show/*
// @include     http://thetvdb.com/*tab=series*
// @include     https://thetvdb.com/*tab=series*
// @include     http://www.thetvdb.com/*tab=series*
// @include     https://www.thetvdb.com/*tab=series*
// @include     http://consequenceofsound.net/*
// @include     https://consequenceofsound.net/*
// @include     http://pitchfork.com/*
// @include     https://pitchfork.com/*
// @include     http://www.last.fm/*
// @include     https://www.last.fm/*
// @include     http://tvnfo.com/s/*
// @include     http://rateyourmusic.com/release/album/*
// @include     https://rateyourmusic.com/release/album/*
// @include     https://open.spotify.com/*
// @include     https://play.spotify.com/album/*
// ==/UserScript==


var baseURL = "http://www.metacritic.com/";

var baseURL_music = "http://www.metacritic.com/music/";
var baseURL_movie = "http://www.metacritic.com/movie/";
var baseURL_pcgame = "http://www.metacritic.com/game/pc/";
var baseURL_ps4 = "http://www.metacritic.com/game/playstation-4/";
var baseURL_xone = "http://www.metacritic.com/game/xbox-one/";
var baseURL_tv = "http://www.metacritic.com/tv/";

var baseURL_search = "http://www.metacritic.com/search/{type}/{query}/results";
var baseURL_autosearch = "http://www.metacritic.com/autosearch";

var baseURL_database = "https://php-cuzi.herokuapp.com/r.php";
var baseURL_whitelist = "https://php-cuzi.herokuapp.com/whitelist.php";
var baseURL_blacklist = "https://php-cuzi.herokuapp.com/blacklist.php";

// http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/
var CSS = "#mcdiv123 .grespinner{height:16px;width:16px;margin:0 auto;position:relative;-webkit-animation:rotation .6s infinite linear;-moz-animation:rotation .6s infinite linear;-o-animation:rotation .6s infinite linear;animation:rotation .6s infinite linear;border-left:6px solid rgba(0,174,239,.15);border-right:6px solid rgba(0,174,239,.15);border-bottom:6px solid rgba(0,174,239,.15);border-top:6px solid rgba(0,174,239,.8);border-radius:100%}@-webkit-keyframes rotation{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(359deg)}}@-moz-keyframes rotation{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(359deg)}}@-o-keyframes rotation{from{-o-transform:rotate(0)}to{-o-transform:rotate(359deg)}}@keyframes rotation{from{transform:rotate(0)}to{transform:rotate(359deg)}}#mcdiv123searchresults .result{font:12px arial,helvetica,serif;border-top-width:1px;border-top-color:#ccc;border-top-style:solid;padding:5px}#mcdiv123searchresults .result .result_type{display:inline}#mcdiv123searchresults .result .result_wrap{float:left;width:100%}#mcdiv123searchresults .result .has_score{padding-left:42px}#mcdiv123searchresults .result .basic_stats{height:1%;overflow:hidden}#mcdiv123searchresults .result h3{font-size:14px;font-weight:700}#mcdiv123searchresults .result a{color:#09f;font-weight:700;text-decoration:none}#mcdiv123searchresults .metascore_w.game.seventyfive,#mcdiv123searchresults .metascore_w.positive,#mcdiv123searchresults .metascore_w.score_favorable,#mcdiv123searchresults .metascore_w.score_outstanding,#mcdiv123searchresults .metascore_w.sixtyone{background-color:#6c3}#mcdiv123searchresults .metascore_w.forty,#mcdiv123searchresults .metascore_w.game.fifty,#mcdiv123searchresults .metascore_w.mixed,#mcdiv123searchresults .metascore_w.score_mixed{background-color:#fc3}#mcdiv123searchresults .metascore_w.negative,#mcdiv123searchresults .metascore_w.score_terrible,#mcdiv123searchresults .metascore_w.score_unfavorable{background-color:red}#mcdiv123searchresults a.metascore_w,#mcdiv123searchresults span.metascore_w{display:inline-block}#mcdiv123searchresults .result .metascore_w{color:#fff!important;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-style:normal!important;font-weight:700!important;height:2em;line-height:2em;text-align:center;vertical-align:middle;width:2em;float:left;margin:0 0 0 -42px}#mcdiv123searchresults .result .more_stats{font-size:10px;color:#444}#mcdiv123searchresults .result .release_date .data{font-weight:700;color:#000}#mcdiv123searchresults ol,#mcdiv123searchresults ul{list-style:none}#mcdiv123searchresults .result li.stat{background:0 0;display:inline;float:left;margin:0;padding:0 6px 0 0;white-space:nowrap}#mcdiv123searchresults .result .deck{margin:3px 0 0}#mcdiv123searchresults .result .basic_stat{display:inline;float:right;overflow:hidden;width:100%}";

function getHostname(url) {
  with(document.createElement("a")) {
    href = url;
    return hostname;
  }
}
function name2metacritic(s) {
  return s.normalize('NFKD').replace(/\//g,"").replace(/[\u0300-\u036F]/g, '').replace(/&/g,"and").replace(/\W+/g, " ").toLowerCase().trim().replace(/\W+/g,"-");
}
function minutesSince(time) {
  var seconds = ((new Date()).getTime() - time.getTime()) / 1000;
  return seconds>60?parseInt(seconds/60)+" min ago":"now";
}
function randomStringId() {
  var id10 = () => Math.floor((1 + Math.random()) * 0x10000000000).toString(16).substring(1);
  return id10()+id10()+id10()+id10()+id10()+id10();
}
function fixMetacriticURLs(html) {
  return html.replace(/<a /g,'<a target="_blank" ').replace(/href="\//g,'href="'+baseURL).replace(/src="\//g,'src="'+baseURL);
}
function searchType2metacritic(type) {
  return ({
    'movie' : 'movie',
    'pcgame' : 'game',
    'xonegame' : 'game',
    'ps4game' : 'game',
    'music' : 'album',
    'tv' : 'tv'
  })[type];
}
function metacritic2searchType(type) {
  return ({
    "Album" : "music",
    "TV" : "tv",
    "Movie" : "movie",
    "PC Game" : "pcgame",
    "PS4 Game" : "ps4game",
    "XONE Game" : "onegame",
    "WIIU Game" : "xxxxx",
    "3DS Game" : "xxxx"
  })[type];
}


function metaScore(score, word) {
  var fg,bg,t;
  if(score == null) {
    fg = "black";
    bg = "#ccc";
    t = "tbd";
  } else if(score >= 75) {
    fg = "white";
    bg = "#6c3";
    t = parseInt(score);
  } else if(score < 40) {
    fg = "white";
    bg = "#f00";
    t = parseInt(score);
  } else {
    fg = "white";
    bg = "#fc3";
    t = parseInt(score);
  }
  
 return '<span title="'+(word?word:'')+'" style="display: inline-block; color: '+fg+';background:'+bg+';font-family: Arial,Helvetica,sans-serif;font-size: 17px;font-style: normal;font-weight: bold;height: 2em;width: 2em;line-height: 2em;text-align: center;vertical-align: middle;">'+t+'</span>';
}

function balloonAlert(message, timeout, title, css, click) {
  var header;
  if(title) {
    header = '<div style="background:rgb(220,230,150); padding: 2px 12px;">' + title +"</div>";
  } else if(title === false) {
    header = '';
  } else {
    header = '<div style="background:rgb(220,230,150); padding: 2px 12px;">Userscript alert</div>';
  }
  var div = $("<div>" + header + '<div style="padding:5px">' + message.split("\n").join("<br>") + "</div></div>");
  div.css({
    position : "fixed",
    top : 10,
    left : 10,
    maxWidth: 200,
    zIndex : "5010002",
    background : "rgb(240,240,240)",
    border : "2px solid yellow",
    borderRadius :"6px",
    boxShadow: "0 0 3px 3px rgba(100, 100, 100, 0.2)",
    fontFamily: "sans-serif",
    color: "black"
  });
  if(css) {
    div.css(css);
  }
  div.appendTo(document.body);
  
  if(click) {
    div.click(function(ev) { 
      $(this).hide(500); 
      click.call(this,ev); 
    });
  }
  
  if(!click) {
    var close = $('<div title="Close" style="cursor:pointer; position:absolute; top:0px; right:3px;">&#10062;</div>').appendTo(div);
    close.click(function(){
      $(this.parentNode).hide(1000);
    });
  }
  
  if(timeout && timeout > 0) {
    window.setTimeout(function() {
      div.hide(3000);
    }, timeout);
  }
  return div;
}


function filterUniversalUrl(url) {
  try {
    url = url.match(/http.+/)[0];
  } catch(e) { }
  
  try {
    url = url.replace(/https?:\/\/(www.)?/,"");
  } catch(e) { }
  
  if(url.startsWith("imdb.com/") && url.match(/(imdb\.com\/\w+\/\w+\/)/)) { 
     // Remove movie subpage from imdb url
     return url.match(/(imdb\.com\/\w+\/\w+\/)/)[1];
  } else if(url.startsWith("thetvdb.com/")) { 
     // Do nothing with thetvdb.com urls
     return url;
  } else if(url.startsWith("boxofficemojo.com/")) { 
     // Keep the important id= on 
     try {
       var parts = url.split("?");
       var page = url[0] + "?";
       var idparam = url[1].match(/(id=.+?)(\.|&)/)[1];
       return page+idparam;
     } catch(e) {
       return url;
     }
  } else {
    // Default: Remove parameters
    return url.split("?")[0].split("&")[0]; 
  }
}

async function addToMap(url, metaurl) {
  var data = JSON.parse(await GM.getValue("map","{}"));
  
  var url = filterUniversalUrl(url);
  var metaurl = metaurl.replace(/^http:\/\/(www.)?metacritic\.com\//,"");

  data[url] = metaurl;
  
  await GM.setValue("map", JSON.stringify(data));
  
  (new Image()).src = baseURL_whitelist + "?docurl="+encodeURIComponent(url)+"&metaurl="+encodeURIComponent(metaurl)+"&ref="+encodeURIComponent(randomStringId());
  return [url, metaurl];
}

async function addToBlacklist(url, metaurl) {
  var data = JSON.parse(await GM.getValue("black","[]"));
  
  var url = filterUniversalUrl(url);
  var metaurl = metaurl.replace(/^http:\/\/(www.)?metacritic\.com\//,"");

  data.push([url,metaurl]);
  
  await GM.setValue("black", JSON.stringify(data));
  
  (new Image()).src = baseURL_blacklist + "?docurl="+encodeURIComponent(url)+"&metaurl="+encodeURIComponent(metaurl)+"&ref="+encodeURIComponent(randomStringId());
  return [url, metaurl];
}




async function isBlacklistedUrl(docurl, metaurl) {

  docurl = filterUniversalUrl(docurl);  
  docurl = docurl.replace(/https?:\/\/(www.)?/,"");
  
  metaurl = metaurl.replace(/^http:\/\/(www.)?metacritic\.com\//,"");
  metaurl = metaurl.replace(/\/\//g,"/").replace(/\/\//g,"/");; // remove double slash
  metaurl = metaurl.replace(/^\/+/,""); // remove starting slash
  
  var data = JSON.parse(await GM.getValue("black","[]"));  // [ [docurl0, metaurl0] , [docurl1, metaurl1] , ... ]
  for(var i = 0; i < data.length; i++) {
    if(data[i][0] == docurl && data[i][1] == metaurl) {
      return true;
    }
  }
  return false;
}

async function isBlacklisted(metaurl) {
  return await isBlacklistedUrl("" + document.location.host.replace(/^www\./,"") + document.location.pathname + document.location.search, metaurl);
}



function listenForHotkeys(code, cb) {
  // Call cb() as soon as the code sequence was typed
  var i = 0;
  $(document).bind("keydown.listenForHotkeys",function(ev) {
    if(document.activeElement == document.body) {
      if(ev.key != code[i]) {
        i = 0;
      } else {
        i++;
        if(i == code.length) {
          ev.preventDefault();
          $(document).unbind("keydown.listenForHotkeys");
          cb();
        }
      }
    }
  });
}


async function metacritic_hoverInfo(url, docurl, cb, errorcb) {
  // Get the metacritic hover info. Requests are cached.
  var handleresponse = function(response, cached) {
    
    if(response.status == 200 && response.responseText && cb) {
      if(~response.responseText.indexOf('"jsonRedirect"')) { // {"viewer":{},"mixpanelToken":"6e219fd....","mixpanelDistinctId":"255.255.255.255","omnitureDebug":0,"jsonRedirect":"\/movie\/national-lampoons-vacation"}
        var blacklistedredirect = false;
        var j = JSON.parse(response.responseText);
        current.url = baseURL + j["jsonRedirect"];
        delete cache[url]; // Delete original url from cache. The redirect URL will then be saved in metacritic_hoverInfo(...)
        

        // Blacklist items from database received?
        if("blacklist" in j && j.blacklist && j.blacklist.length) {
          // Save new blacklist items

          GM.getValue("black","[]").then(function(json_data) {
            var data = JSON.parse(json_data);
              for(var i = 0; i < j.blacklist.length; i++) {
                var save_docurl = j.blacklist[i].docurl;
                var save_metaurl = j.blacklist[i].metaurl;
                
                data.push([save_docurl,save_metaurl]); 
                if(j["jsonRedirect"] == "/"+save_metaurl) {
                  // Redirect is blacklisted!
                  blacklistedredirect = true;
                }
              }
              GM.setValue("black", JSON.stringify(data));
          });
        
        }
        if(blacklistedredirect && errorcb) {
          // Redirect was blacklisted, show nothing
          errorcb(response.responseText, new Date(response.time));
        } else {
          // Load redirect
          metacritic_hoverInfo(baseURL + j["jsonRedirect"], false, cb, errorcb);
        }
      } else {
        cb(response.responseText, new Date(response.time));
      }
    } else if(response.status != 200 && errorcb) {
      errorcb(response.responseText, new Date(response.time));
      if(!cached)
        console.log("Show metacritic ratings: Error:"+response.status+"\n"+url);
    } else if(!response.responseText) {
      errorcb("", new Date(response.time));
      if(!cached)
        console.log("Show metacritic ratings: Error: response empty. Status:"+response.status+"\n"+url);
    }
  };
  
  var cache = JSON.parse(await GM.getValue("hovercache","{}"));
  for(var prop in cache) {
    // Delete cached values, that are older than 2 hours
    if((new Date()).getTime() - (new Date(cache[prop].time)).getTime() > 2*60*60*1000) { 
      delete cache[prop];
    }
  }
  
  if(url in cache) {
    handleresponse(cache[url], true);
  } else {
    var requestURL = url;
    var requestParams = "hoverinfo=1";
    
    if(docurl && docurl.indexOf("metacritic.com") == -1 && docurl.indexOf(baseURL_database) == -1) {
      // Ask database for correct metacritic entry:
      requestURL = baseURL_database;
      requestParams = "m=" + encodeURIComponent(docurl) + "&a=" + encodeURIComponent(url);
    }
      
    GM.xmlHttpRequest({
      method: "POST",
      url: requestURL,
      data: requestParams,
      headers: {
        "Referer" : url,
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
        "Host" : getHostname(requestURL),  // This is important, otherwise Metacritic refuses to answer!
        "User-Agent" : "MetacriticUserscript "+navigator.userAgent,
        "X-Requested-With" : "XMLHttpRequest"
      },
      onload: function(response) {
        response.time = (new Date()).toJSON();
        cache[url] = response;
        
        GM.setValue("hovercache",JSON.stringify(cache));
        handleresponse(response, false);
      },
      onerror: function(response) { 
        console.log("Show metacritic ratings: Hover info error: "+response.status+"\nURL: "+requestURL+"\nResponse:\n"+response.responseText);
      },
    });
  }
}
async function metacritic_searchResults(url, cb, errorcb) {
  // Get metacritic search results. Requests are cached.
  var handleresponse = function(response, cached) {
    if(response.results.length && cb) {
      cb(response.results, new Date(response.time));
    } else if(response.results.length == 0 && errorcb) {
      errorcb(response.results, new Date(response.time));
    }
  };
  
  var cache = JSON.parse(await GM.getValue("searchcache","{}"));
  for(var prop in cache) {
    // Delete cached values, that are older than 2 hours
    if((new Date()).getTime() - (new Date(cache[prop].time)).getTime() > 2*60*60*1000) { 
      delete cache[prop];
    }
  }
  
  if(url in cache) {
    handleresponse(cache[url], true);
  } else {
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      headers: {
        "Referer" : url,
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
        "Host" : "www.metacritic.com",
        "User-Agent" : "MetacriticUserscript "+navigator.userAgent,
      },
      onload: function(response) { 
        var results = [];
        if(!~response.responseText.indexOf("No search results found.")) {
          var d = $('<html>').html(response.responseText);
          d.find("ul.search_results.module .result").each(function() {
            results.push(this.innerHTML);
          });
        }

        response = {
          time : (new Date()).toJSON(),
          results : results,
        };
        cache[url] = response;
        GM.setValue("searchcache",JSON.stringify(cache));
        handleresponse(response, false);
      },
      onerror: function(response) {
        console.log("Show metacritic ratings: Search error: "+response.status+"\n"+url);
        handleresponse({
          time : (new Date()).toJSON(),
          results : [],
        }, false);
      }
    });
  }
}

function metacritic_showHoverInfo(url, docurl) {
  if(!url) {
    return;
  }
  metacritic_hoverInfo(url, docurl?docurl:false,
  // On Success
  function(html, time) {
    $("#mcdiv123").remove();
    var div = $('<div id="mcdiv123"></div>').appendTo(document.body);
    div.css({
      position:"fixed", 
      bottom :0, 
      left: 0,
      minWidth: 300,
      backgroundColor: "#fff",
      border: "2px solid #bbb",
      borderRadius:" 6px",
      boxShadow: "0 0 3px 3px rgba(100, 100, 100, 0.2)",
      color: "#000",
      padding:" 3px",
      zIndex: "5010001",
    });
    
    // Functions for communication between page and iframe
    // Mozilla can access parent.document
    // Chrome can use postMessage()
    var frame_status = false; // if this remains false, loading the frame content failed. A reason could be "Content Security Policy"
    function loadExternalImage(url, myframe) {  
      // Load external image, bypass CSP
      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        responseType : "arraybuffer",
        onload: function(response) {          
          myframe.contentWindow.postMessage({
              "mcimessage_imgLoaded" : true,
              "mcimessage_imgData" : response.response,
              "mcimessage_imgOrgSrc" : url
          },'*');
        }
      });
    }
    var functions = {
      "parent" : function() {
        var f = parent.document.getElementById('mciframe123');
        var lastdiff = -200000;
        window.addEventListener("message", function(e){
          if(typeof e.data != "object") {
            return;
          } else if("mcimessage0" in e.data) {
            frame_status = true;  // Frame content was loaded successfully
          } else if("mcimessage1" in e.data) {
            f.style.width = parseInt(f.style.width)+10+"px";
            if(e.data.heightdiff == lastdiff) {
              f.style.height = parseInt(f.style.height)+5+"px";
            }
            lastdiff = e.data.heightdiff;
            
          } else if("mcimessage2" in e.data) {
            f.style.height = parseInt(f.style.height)+15+"px";
            f.style.width = "400px";
          } else if("mcimessage_loadImg" in e.data) {
            loadExternalImage(e.data.mcimessage_imgUrl, f);
          } else {
            return;
          }
          f.contentWindow.postMessage({
            "mcimessage3" : true,
            "mciframe123_clientHeight" : f.clientHeight,
            "mciframe123_clientWidth" : f.clientWidth,
          },'*');
        });
      },
      "frame" : function() {
        parent.postMessage({"mcimessage0":true},'*'); // Loading frame content was successfull
        
        var i = 0;
        window.addEventListener("message", function(e){
          if(typeof e.data == "object" && "mcimessage_imgLoaded" in e.data) {
            // Load external image
            var arrayBufferView = new Uint8Array( e.data["mcimessage_imgData"] );
            var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );
            var img = failedImages[e.data["mcimessage_imgOrgSrc"]];
            img.src = imageUrl;
          } 
          
          if(!("mcimessage3" in e.data)) return; 
          
          if(e.data.mciframe123_clientHeight < document.body.scrollHeight && i < 100) {
            parent.postMessage({"mcimessage1":1, "heightdiff":document.body.scrollHeight - e.data.mciframe123_clientHeight},'*');
            i++;
          }
          if(i >= 100) {
            parent.postMessage({"mcimessage2":1},'*')
            i = 0;
          } 
        });
        parent.postMessage({"mcimessage1":1,"heightdiff":-100000},'*');
      }
    
    };
    

    
    var css = "#hover_div .clr { clear: both}#hover_div { background-color: #fff; color: #666; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:400; font-style:normal;} #hover_div .hoverinfo .hover_left { float: left} #hover_div .hoverinfo .product_image_wrapper { color: #999; font-size: 6px; font-weight: normal; min-height: 98px; min-width: 98px;} #hover_div .hoverinfo .product_image_wrapper a { color: #999; font-size: 6px; font-weight: normal;} #hover_div a * { cursor: pointer}a { color: #09f; font-weight: bold;} #hover_div a:link, #hover_div a:visited { text-decoration: none;} #hover_div a:hover { text-decoration: underline;} #hover_div .hoverinfo .hover_right { float: left; margin-left: 15px; max-width: 395px;} #hover_div .hoverinfo .product_title { color: #333; font-family: georgia,serif; font-size: 24px; line-height: 26px; margin-bottom: 10px;} #hover_div .hoverinfo .product_title a {  color:#333; font-family: georgia,serif; font-size: 24px;} #hover_div .hoverinfo .summary_detail.publisher, .hoverinfo .summary_detail.release_data { float: left} #hover_div .hoverinfo .summary_detail { font-size: 11px; margin-bottom: 10px;} #hover_div .hoverinfo .summary_detail.product_credits a { color: #999; font-weight: normal; } #hover_div .hoverinfo .hr { background-color: #ccc; height: 2px; margin: 15px 0 10px;} #hover_div .hoverinfo .hover_scores { width: 100%; border-collapse: collapse; border-spacing: 0;} #hover_div .hoverinfo .hover_scores td.num { width: 39px} #hover_div .hoverinfo .hover_scores td { vertical-align: middle} #hover_div caption, #hover_div th, #hover_div td { font-weight: normal; text-align: left;} #hover_div .metascore_anchor, #hover_div a.metascore_w { text-decoration: none !important} #hover_div span.metascore_w, #hover_div a.metascore_w { display: inline-block; padding:0px;}.metascore_w { background-color: transparent; color: #fff !important; font-family: Arial,Helvetica,sans-serif; font-size: 17px; font-style: normal !important; font-weight: bold !important; height: 2em; line-height: 2em; text-align: center; vertical-align: middle; width: 2em;} #hover_div .metascore, #hover_div .metascore a, #hover_div .avguserscore, #hover_div .avguserscore a { color: #fff} #hover_div .critscore, #hover_div .critscore a, #hover_div .userscore, #hover_div .userscore a { color: #333}.score_tbd { background: #eaeaea; color: #333; font-size: 14px;}.score_tbd a { color: #333}.negative, .score_terrible, .score_unfavorable, .carousel_set a.product_terrible:hover, .carousel_set a.product_unfavorable:hover { background-color: #f00}.mixed, .neutral, .score_mixed, .carousel_set a.product_mixed:hover { background-color: #fc3; color: #333;}.score_mixed a { color: #333}.positive, .score_favorable, .score_outstanding, .carousel_set a.product_favorable:hover, .carousel_set a.product_outstanding:hover { background-color: #6c3}.critscore_terrible, .critscore_unfavorable { border-color: #f00}.critscore_mixed { border-color: #fc3}.critscore_favorable, .critscore_outstanding { border-color: #6c3}.metascore .score_total, .userscore .score_total { display: none; visibility: hidden;}.hoverinfo .metascore_label, .hoverinfo .userscore_label { font-size: 12px; font-weight: bold; line-height: 16px; margin-top: 2%;}.hoverinfo .metascore_review_count, .hoverinfo .userscore_review_count { font-size: 11px}.hoverinfo .hover_scores td { vertical-align: middle}.hoverinfo .hover_scores td.num { width: 39px}.hoverinfo .hover_scores td.usr.num { padding-left: 20px}.metascore_anchor, a.metascore_w { text-decoration: none !important}.metascore_w.user { border-radius: 55%; color: #fff;}.metascore_anchor, a.metascore_w { text-decoration: none!important}.metascore_anchor:hover { text-decoration: none!important}.metascore_w:hover { text-decoration: none!important}span.metascore_w, a.metascore_w { display: inline-block}.metascore_w.xlarge, .metascore_w.xl { font-size: 42px}.metascore_w.large, .metascore_w.lrg { font-size: 25px}.m .metascore_w.medium, .m .metascore_w.med { font-size: 19px}.metascore_w.med_small { font-size: 14px}.metascore_w.small, .metascore_w.sm { font-size: 12px}.metascore_w.tiny { height: 1.9em; font-size: 11px; line-height: 1.9em;}.metascore_w.user { border-radius: 55%; color: #fff;}.metascore_w.user.small, .metascore_w.user.sm { font-size: 11px}.metascore_w.tbd, .metascore_w.score_tbd { color: #000!important; background-color: #ccc;}.metascore_w.tbd.hide_tbd, .metascore_w.score_tbd.hide_tbd { visibility: hidden}.metascore_w.tbd.no_tbd, .metascore_w.score_tbd.no_tbd { display: none}.metascore_w.noscore::before, .metascore_w.score_noscore::before { content: '\2022\2022\2022'}.metascore_w.noscore, .metascore_w.score_noscore { color: #fff!important; background-color: #ccc;}.metascore_w.rip, .metascore_w.score_rip { border-radius: 4px; color: #fff!important; background-color: #999;}.metascore_w.negative, .metascore_w.score_terrible, .metascore_w.score_unfavorable { background-color: #f00}.metascore_w.mixed, .metascore_w.forty, .metascore_w.game.fifty, .metascore_w.score_mixed { background-color: #fc3}.metascore_w.positive, .metascore_w.sixtyone, .metascore_w.game.seventyfive, .metascore_w.score_favorable, .metascore_w.score_outstanding { background-color: #6c3}.metascore_w.indiv { height: 1.9em; width: 1.9em; font-size: 15px; line-height: 1.9em;}.metascore_w.indiv.large, .metascore_w.indiv.lrg { font-size: 24px}.m .metascore_w.indiv.medium, .m .metascore_w.indiv.med { font-size: 16px}.metascore_w.indiv.small, .metascore_w.indiv.sm { font-size: 11px}.metascore_w.indiv.perfect { padding-right: 1px}.promo_amazon .esite_btn { margin: 3px 0 0 7px;}.esite_amazon { background-color: #fdc354; border: 1px solid #aaa;}.esite_label_wrapper { display:none;}.esite_btn { border-radius: 4px; color: #222; font-size: 12px; height: 40px; line-height: 40px; width: 120px;}";

    var framesrc = 'data:text/html,';
    framesrc += encodeURIComponent('<!DOCTYPE html>\
    <html lang="en">\
      <head>\
        <meta charset="utf-8">\
        <title>Metacritic info</title>\
        <style>body { margin:0px; padding:0px; background:white; }' + css
        +'\
        </style>\
        <script>\
        var failedImages = {};\
        function detectCSP(img) {\
          if(img.complete && (!img.naturalWidth || !img.naturalHeight)) {\
            return true;\
          }\
          return false;\
        }\
        function findCSPerrors() {\
          var imgs = document.querySelectorAll("img");\
          for(var i = 0; i < imgs.length; i++) {\
            if(imgs[i].complete && detectCSP(imgs[i])) {\
              fixCSP(imgs[i]);\
            }\
          }\
        }\
        function fixCSP(img) {\
          console.log("Loading image failed. Bypassing CSP...");\
          failedImages[img.src] = img;\
          parent.postMessage({"mcimessage_loadImg":true, "mcimessage_imgUrl": img.src},"*"); \
        }\
        function on_load() {\
          ('+functions.frame.toString()+')();\
          window.setTimeout(findCSPerrors, 500);\
          \
        }\
        </script>\
      </head>\
      <body onload="on_load();">\
        <div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">\
          <div class="hover_content">'+fixMetacriticURLs(html)+'</div>\
        </div>\
      </body>\
    </html>');    
    
    var frame = $("<iframe></iframe>").appendTo(div);
    frame.attr("id","mciframe123");
    frame.attr("src",framesrc);
    frame.attr("scrolling","auto");
    frame.css({
      width: 400,
      height: 170,
      border: "none"
    });
    
    window.setTimeout(function() {
      if(!frame_status) { // Loading frame content failed.
        //  Directly inject the html without an iframe (this may break the site or the metacritic)
        console.log("Loading iframe content failed. Injecting directly.");
        $("head").append("<style>"+css+"</style>");
        var noframe = $('<div style="border:0px solid; display:block; position:relative; border-radius:0px; padding:0px; margin:0px; box-shadow:none;" class="hover_div" id="hover_div">\
          <div class="hover_content">'+fixMetacriticURLs(html)+'</div>\
          </div>');
        frame.replaceWith(noframe);
      }
            
    },2000);
    
    functions.parent();
       
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleTimeString()+" "+time.toLocaleDateString()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px; padding-left:5px;">&#10062;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });
    
    $('<span title="Assist us: This is the correct entry!" style="cursor:pointer; float:right; color:green; font-size: 11px;">&check;</span>').data("url", url).appendTo(sub).click(function() {
      var docurl = document.location.href;
      var metaurl = $(this).data("url");
      addToMap(docurl, metaurl).then(function(r) {
        balloonAlert("Thanks for your submission!\n\nSaved as a correct entry.\n\n"+r[0]+"\n"+r[1], 6000, "Success");
      });
    });
    $('<span title="Assist us: This is NOT the correct entry!" style="cursor:pointer; float:right; color:crimson; font-size: 11px;">&cross;</span>').data("url", url).appendTo(sub).click(function() {
      if(!confirm("This is NOT the correct entry!\n\nAdd to blacklist?")) return;
      var docurl = document.location.href;
      var metaurl = $(this).data("url");
      addToBlacklist(docurl,metaurl).then(function(r) {
         balloonAlert("Thanks for your submission!\n\nSaved to blacklist.\n\n"+r[0]+"\n"+r[1], 6000, "Success");
      });

      
      // Open search
      metacritic_searchcontainer(null, current.searchTerm);
      metacritic_search(null, current.searchTerm);
    });
    
    

  },
  // On error i.e. no result on metacritic.com
  async function(html, time) {    
    // Make search available
    metacritic_waitForHotkeys();
    
    var handleresponse = await async function(response) {
      var data;
      var multiple = false;
      try {
        data = JSON.parse(response.responseText);
      } catch(e) {
        console.log("Error in JSON: search_term="+current.searchTerm);
        console.log(e);
      }
      if(data && data.autoComplete && data.autoComplete.results && data.autoComplete.results.length) {
        // Remove data with wrong type
        data.autoComplete = data.autoComplete.results;
        
        var newdata = [];
        data.autoComplete.forEach(function(result) {
          if(metacritic2searchType(result.refType) == current.type) {
            newdata.push(result);
          }
        });
        data.autoComplete = newdata;
        if(data.autoComplete.length == 0) {
          // No results
          console.log("No results (after filtering by type) for search_term="+current.searchTerm);
        } else if(data.autoComplete.length == 1) {
          // One result, let's show it
          if(! await isBlacklisted(baseURL + data.autoComplete[0].url)) {
            metacritic_showHoverInfo(baseURL + data.autoComplete[0].url);
            return;
          }
        } else {
          // More than one result
          multiple = true;
          console.log("Multiple results for search_term="+current.searchTerm);
          var exactMatches = [];
          data.autoComplete.forEach(function(result,i) { // Try to find the correct result by matching the search term to exactly one movie title
            if(current.searchTerm == result.name) {
              exactMatches.push(result);
            }
          });
          if(exactMatches.length == 1) {
            // Only one exact match, let's show it
            console.log("Only one exact match for search_term="+current.searchTerm);
            if(! await isBlacklisted(baseURL + exactMatches[0].url)) {
              metacritic_showHoverInfo(baseURL + exactMatches[0].url);
              return;
            }
          } 
        } 
      } else {
        console.log("No results (at all) for search_term="+current.searchTerm);
      }
      // HERE: multiple results or no result. The user may type "meta" now
      if(multiple) {
        balloonAlert("Multiple metacritic results. Type &#34;meta&#34; for manual search.", 10000, false, {bottom: 5, top:"auto", maxWidth: 400, paddingRight: 5}, metacritic_searchcontainer);
      }
    };
    var cache = JSON.parse(await GM.getValue("autosearchcache","{}"));
    for(var prop in cache) {
      // Delete cached values, that are older than 2 hours
      if((new Date()).getTime() - (new Date(cache[prop].time)).getTime() > 2*60*60*1000) { 
        delete cache[prop];
      }
    }
    
    if(current.type == "music") {
      current.searchTerm = current.data[0];
    } else {
      current.searchTerm = current.data.join(" ");
    }
    if(current.searchTerm in cache) {
      handleresponse(cache[current.searchTerm], true);
    } else {
      GM.xmlHttpRequest({
        method: "POST",
        url: baseURL_autosearch,
        data: "search_term="+encodeURIComponent(current.searchTerm)+"&image_size=98&search_each=1&sort_type=popular",
        headers: {
          "Referer" : url,
          "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
          "Host" : "www.metacritic.com",
          "User-Agent" : "MetacriticUserscript Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
          "X-Requested-With" : "XMLHttpRequest"
        },
        onload: function(response) {
          response = {
            time : (new Date()).toJSON(),
            responseText : response.responseText,
          };
          cache[current.searchTerm] = response;
          GM.setValue("autosearchcache",JSON.stringify(cache));
          handleresponse(response, false);
        }
      });
    }
  });
}

function metacritic_waitForHotkeys() {
  listenForHotkeys("meta",metacritic_searchcontainer);
}

function metacritic_searchcontainer(ev, query) {
  if(!query) {
    if(current.type == "music") {
      query = current.data[0];
    } else {
      query = current.data.join(" ");
    }
  }
  $("#mcdiv123").remove();
  var div = $('<div id="mcdiv123"></div>').appendTo(document.body);
  div.css({
    position:"fixed", 
    bottom :0, 
    left: 0,
    minWidth: 300,
    maxHeight: "80%",
    maxWidth: 640,
    overflow:"auto",
    backgroundColor: "#fff",
    border: "2px solid #bbb",
    borderRadius:" 6px",
    boxShadow: "0 0 3px 3px rgba(100, 100, 100, 0.2)",
    color: "#000",
    padding:" 3px",
    zIndex: "5010001",
  });
  var query = $('<input type="text" size="60" id="mcisearchquery">').appendTo(div).focus().val(query).on('keypress', function(e) {
    var code = e.keyCode || e.which;
    if(code == 13) { // Enter key
      metacritic_search.call(this,e);
    }
  });
  $('<button id="mcisearchbutton">').text("Search").appendTo(div).click(metacritic_search);
}


function metacritic_search(ev, query) {
  if(!query) { // Use values from search form
    query = $("#mcisearchquery").val();
  }
  var type = searchType2metacritic(current.type);

  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = CSS;
  document.head.appendChild(style);

  var div = $("#mcdiv123");
  var loader = $('<div style="width:20px; height:20px;" class="grespinner"></div>').appendTo($("#mcisearchbutton"));
  
  var url = baseURL_search.replace("{type}",encodeURIComponent(type)).replace("{query}",encodeURIComponent(query));

  metacritic_searchResults(url, 
  // On success
  function(results, time) {
    loader.remove();
    
    var accept = function(ev) {
      var a = $(this.parentNode).find("a[href*='metacritic.com']");
      var metaurl = a.attr("href");
      
      var docurl = document.location.href;

      addToMap(docurl,metaurl).then(function() {
        metacritic_showHoverInfo(metaurl);
      });
    };
    var denyAll = function(ev) {
      var urls = [];
      var docurl = document.location.href;
      $("#mcdiv123searchresults").find("div.result a[href*='metacritic.com']").each(function() {
        addToBlacklist(docurl, this.href);
      });
    };
    
    var resultdiv = $("#mcdiv123searchresults").length?$("#mcdiv123searchresults").html(""):$('<div id="mcdiv123searchresults"></div>').css("max-width","95%").appendTo(div);
    results.forEach(function(html) {
      var singleresult = $('<div class="result"></div>').html(fixMetacriticURLs(html)+'<div style="clear:left"></div>').appendTo(resultdiv);
      $('<span title="Assist us: This is the correct entry!" style="cursor:pointer; color:green; font-size: 13px;">&check;</span>').prependTo(singleresult).click(accept);
    });
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleFormat()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#10062;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });
    $('<span title="Assist us: None of the above is the correct item!" style="cursor:pointer; float:right; color:crimson; font-size: 11px;">&cross;</span>').appendTo(sub).click(function() {if(confirm("None of the above is the correct item\nConfirm?")) denyAll()});
  },
  // On error i.e. no results
  function(results, time) {
    loader.remove();
    var resultdiv = $("#mcdiv123searchresults").length?$("#mcdiv123searchresults").html(""):$('<div id="mcdiv123searchresults"></div>').appendTo(div);
    resultdiv.html("No search results.");
    
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleFormat()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#10062;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });
    
  }
  );
}

var current = {
  url : null,
  type : null,
  data : null, // Array of raw search keys 
  searchTerm : null
};


async function showURL(url) {
  if(! await isBlacklisted(url)) {
    var docurl = document.location.host.replace(/^www\./,"") + document.location.pathname + document.location.search;
    docurl = filterUniversalUrl(docurl);
    metacritic_showHoverInfo(url, docurl);
  } else {
    console.log(url +" is blacklisted!");
  }
}


var metacritic = {
  "mapped" : function metacritic_mapped(url, type) {
    // url was in the map/whitelist
    current.data = [url]
    current.url = url;
    current.type = type;
    current.searchTerm = url;
    showURL(url);
  },
  "music" : function metacritic_music(artistname, albumname) {
    current.data = [albumname.trim(),artistname.trim()]
    artistname = name2metacritic(artistname);
    albumname = albumname.replace("&"," ");
    albumname = name2metacritic(albumname);
    var url = baseURL_music + albumname + "/" + artistname;
    current.url = url;
    current.type = "music";
    current.searchTerm = albumname + "/" + artistname;
    showURL(url);
  },
  "movie" : function metacritic_movie(moviename) {
    current.data = [moviename.trim()]
    moviename = name2metacritic(moviename);
    var url = baseURL_movie + moviename;
    current.url = url;
    current.type = "movie";
    current.searchTerm = moviename;
    showURL(url);
  },
  "tv" : function metacritic_tv(seriesname) {
    current.data = [seriesname.trim()]
    seriesname = name2metacritic(seriesname);
    var url = baseURL_tv + seriesname;
    current.url = url;
    current.type = "tv";
    current.searchTerm = seriesname;
    showURL(url);
  },
  "pcgame" : function metacritic_pcgame(gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename);
    var url = baseURL_pcgame + gamename;
    current.url = url;
    current.type = "pcgame";
    current.searchTerm = gamename;
    showURL(url);
  },
  "ps4game" : function metacritic_ps4game(gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename);
    var url = baseURL_ps4 + gamename;
    current.url = url;
    current.type = "ps4game";
    current.searchTerm = gamename;
    showURL(url);
  },
  "xonegame" : function metacritic_xonegame(gamename) {
    current.data = [gamename.trim()]
    gamename = name2metacritic(gamename);
    var url = baseURL_xone + gamename;
    current.url = url;
    current.type = "xonegame";
    current.searchTerm = gamename;
    showURL(url);
  }
};


var Always = () => true;
var sites = {
  'bandcamp' : {
    host : ["bandcamp.com"],
    condition : function() {
      return unsafeWindow.TralbumData
    },
    products : [{
      condition : Always,
      type : "music",
      data : () => [unsafeWindow.TralbumData.artist, unsafeWindow.TralbumData.current.title]
    }]
  },
  'itunes' : {
    host : ["itunes.apple.com"],
    condition : Always,
    products : [{
      condition : () => ~document.location.href.indexOf("/album/") ,
      type : "music",
      data : () => [document.querySelector("h2.t-hero-subheadline").textContent.trim(), document.querySelector("h1.t-hero-headline").textContent.trim()] 
    }]
  },
  'googleplay' : {
    host : ["play.google.com"],
    condition : Always,
    products : [
    {
      condition : () => ~document.location.href.indexOf("/album/"),
      type : "music",
      data : () => [document.querySelector("*[itemprop=byArtist] a").textContent, document.querySelector("*[itemprop=name]").textContent]
    },
    {
      condition : () => ~document.location.href.indexOf("/movies/details/"),
      type : "movie",
      data : () => document.querySelector("*[itemprop=name]").textContent
    }
    ]
  },
  'imdb' : {
    host : ["imdb.com"],
    condition : Always,
    products : [
    {
      condition : function() { 
        var e = document.querySelector("meta[property='og:type']");
        if(e) {
          return e.content == "video.movie"
        }
        return false; 
      },
      type : "movie",
      data : function() {
        if(document.querySelector("h1[itemprop=name]")) { // Movie homepage (New design 2015-12)
          return document.querySelector("h1[itemprop=name]").firstChild.textContent.trim();
        } else if(document.querySelector("*[itemprop=name] a") && document.querySelector("*[itemprop=name] a").firstChild.data) { // Subpage of a move
          return document.querySelector("*[itemprop=name] a").firstChild.data.trim();
        } else if(document.querySelector(".title-extra[itemprop=name]")) { // Movie homepage: sub-/alternative-/original title
          return document.querySelector(".title-extra[itemprop=name]").firstChild.textContent.replace(/\"/g,"").trim();
        } else { // Movie homepage (old design)
          return document.querySelector("*[itemprop=name]").firstChild.textContent.trim();
        }
      }
    },
    {
      condition : function() { 
        var e = document.querySelector("meta[property='og:type']");
        if(e) {
          return e.content == "video.tv_show"
        }
        return false; 
      },
      type : "tv",
      data : () => document.querySelector("*[itemprop=name]").textContent
    }
    ]
  },
  'steam' : {
    host : ["store.steampowered.com"],
    condition : () => document.querySelector("*[itemprop=name]"),
    products : [{
      condition : Always,
      type : "pcgame",
      data : () => document.querySelector("*[itemprop=name]").textContent
    }]
  },
  'tv.com' : {
    host : ["www.tv.com"],
    condition : () => document.querySelector("meta[property='og:type']"),
    products : [{
      condition : () => document.querySelector("meta[property='og:type']").content == "tv_show" && document.querySelector("h1[data-name]"),
      type : "tv",
      data : () => document.querySelector("h1[data-name]").dataset.name
    }]
  },
  'rottentomatoes' : {
    host : ["www.rottentomatoes.com"],
    condition : Always,
    products : [{
      condition : () => document.location.pathname.startsWith("/m/"),
      type : "movie",
      data : () => document.querySelector("h1").firstChild.textContent
    },
    {
      condition : () =>  document.location.pathname.startsWith("/tv/") ,
      type : "tv",
      data : () => unsafeWindow.BK.TvSeriesTitle
    }
    ]
  },
  'serienjunkies' : {
    host : ["www.serienjunkies.de"],
    condition : Always,
    products : [{
      condition : () =>  Always,
      type : "tv",
      data : function() {
        if(document.querySelector("h1[itemprop=name]")) {
          return document.querySelector("h1[itemprop=name]").textContent;
        } else {
          var n = $("a:contains(Details zur)");
          if(n) {
            var name = n.text().match(/Details zur Produktion der Serie (.+)/)[1];
            return name;
          }
        }
      }
    }]
  },
  'gamespot' : {
    host : ["gamespot.com"],
    condition : () => document.querySelector("[itemprop=device]"),
    products : [
    {
      condition : () => ~$("[itemprop=device]").text().indexOf("PC"),
      type : "pcgame",
      data : () => document.querySelector("h1[itemprop=name]").textContent 
    },
    {
      condition : () => ~$("[itemprop=device]").text().indexOf("PS4"),
      type : "ps4game",
      data : () => document.querySelector("h1[itemprop=name]").textContent
    },
    {
      condition : () => ~$("[itemprop=device]").text().indexOf("XONE"),
      type : "xonegame",
      data : () => document.querySelector("h1[itemprop=name]").textContent
    }
    ]
  },
  'amazon' : {
    host : ["amazon."],
    condition : Always,
    products : [
    {
      condition : function() {
        try {
          if(document.querySelector(".nav-categ-image").alt.toLowerCase().indexOf("musi") != -1) {
            return true;
          }
        } catch(e) {}
        var music = ["Music","Musique","Musik","Música","Musica","音楽"];
        return music.some(function(s) {
          if(~document.title.indexOf(s)) {
            return true;
          } else {
            return false;
          }
        });
      },
      type : "music",
      data : function() {
        var artist = document.querySelector("#ProductInfoArtistLink").textContent.trim();
        var title = document.querySelector("#title_feature_div").textContent.trim();
        title = title.replace(/\[([^\]]*)\]/g,""); // Remove [brackets] and their content
        return [artist, title];
      }
    },
    {
      condition : () => (document.getElementById("aiv-content-title") && document.getElementsByClassName("season-single-dark").length),
      type : "tv",
      data : () => document.getElementById("aiv-content-title").firstChild.data.trim()
    },
    {
      condition : () => document.getElementById("aiv-content-title"),
      type : "movie",
      data : () => document.getElementById("aiv-content-title").firstChild.data.trim()
    }
    ]
  },
  'BoxOfficeMojo' : {
    host : ["boxofficemojo.com"],
    condition : () => ~document.location.search.indexOf("id="),
    products : [{
      condition : () => document.querySelector("#body table:nth-child(2) tr:first-child b"),
      type : "movie",
      data : () => document.querySelector("#body table:nth-child(2) tr:first-child b").firstChild.data
    }]
  },
  'AllMovie' : {
    host : ["allmovie.com"],
    condition : () => document.querySelector("h2[itemprop=name].movie-title"),
    products : [{
      condition : () => document.querySelector("h2[itemprop=name].movie-title"),
      type : "movie",
      data : () => document.querySelector("h2[itemprop=name].movie-title").firstChild.data.trim()
    }]
  },
  'en.wikipedia' : {
    host : ["en.wikipedia.org"],
    condition : Always,
    products : [{
      condition : function() {
        if(!document.querySelector(".infobox .summary")) {
          return false;
        }
        var r = /\d\d\d\d films/;
        return $("#catlinks a").filter((i,e) => e.firstChild.data.match(r)).length;
      },
      type : "movie",
      data : () => document.querySelector(".infobox .summary").firstChild.data
    },
    {
      condition : function() {
        if(!document.querySelector(".infobox .summary")) {
          return false;
        }
        var r = /television series/;
        return $("#catlinks a").filter((i,e) => e.firstChild.data.match(r)).length;
      },
      type : "tv",
      data : () => document.querySelector(".infobox .summary").firstChild.data
    }]
  },
  'movies.com' : {
    host : ["movies.com"],
    condition : () => document.querySelector("meta[property='og:title']"),
    products : [{
      condition : Always,
      type : "movie",
      data : () => document.querySelector("meta[property='og:title']").content
    }]
  },
  'themoviedb' : {
    host : ["themoviedb.org"],
    condition : () => document.querySelector("meta[property='og:type']"),
    products : [{
      condition : () => document.querySelector("meta[property='og:type']").content == "movie",
      type : "movie",
      data : () => document.querySelector("meta[property='og:title']").content
    },
    {
      condition : () => document.querySelector("meta[property='og:type']").content == "tv_series",
      type : "tv",
      data : () => document.querySelector("meta[property='og:title']").content
    }]
  },
  'letterboxd' : {
    host : ["letterboxd.com"],
    condition : () => unsafeWindow.filmData && "name" in unsafeWindow.filmData,
    products : [{
      condition : Always,
      type : "movie",
      data : () => unsafeWindow.filmData.name
    }]
  },
  'TVmaze' : {
    host : ["tvmaze.com"],
    condition : () => document.querySelector("h1"),
    products : [{
      condition : Always,
      type : "tv",
      data : () => document.querySelector("h1").firstChild.data
    }]
  },
  'TVGuide' : {
    host : ["tvguide.com"],
    condition : Always,
    products : [{
      condition : () => document.location.pathname.startsWith("/tvshows/"),
      type : "tv",
      data : () => document.querySelector("meta[property='og:title']").content
    }]
  },
  'followshows' : {
    host : ["followshows.com"],
    condition : Always,
    products : [{
      condition : () => document.querySelector("meta[property='og:type']").content == "video.tv_show",
      type : "tv",
      data : () => document.querySelector("meta[property='og:title']").content
    }]
  },
  'TheTVDB' : {
    host : ["thetvdb.com"],
    condition : Always,
    products : [{
      condition : () => ~document.location.search.indexOf("tab=series"),
      type : "tv",
      data : () => document.querySelector("#content h1").firstChild.data
    }]
  },
  'ConsequenceOfSound' : {
    host : ["consequenceofsound.net"],
    condition : () => document.querySelector("meta[property='og:title']"),
    products : [{
      condition : () => document.querySelector("meta[property='og:title']").content.match(/.+: (.+) [-–] (.+)/),
      type : "music",
      data : function() {
        var m = document.querySelector("meta[property='og:title']").content.match(/.+: (.+) [-–] (.+)/);
        m.shift();
        return m;
      }
    }]
  },
  'Pitchfork' : {
    host : ["pitchfork.com"],
    condition : () => ~document.location.href.indexOf("/reviews/albums/"),
    products : [{
      condition : () => document.querySelector(".single-album-tombstone"),
      type : "music",
      data : function() {
        var artist = document.querySelector(".single-album-tombstone .artists").innerText.trim();
        var album = document.querySelector(".single-album-tombstone h1.review-title").innerText.trim();
        return [artist, album];
      }
    }]
  },
  'Last.fm' : {
    host : ["last.fm"],
    condition : () => document.querySelector("*[data-page-resource-type]") && document.querySelector("*[data-page-resource-type]").dataset.pageResourceType == "album",
    products : [{
      condition : () => document.querySelector("*[data-page-resource-type]").dataset.pageResourceName,
      type : "music",
      data : function() {
        var artist = document.querySelector("*[data-page-resource-type]").dataset.pageResourceArtistName;
        var album = document.querySelector("*[data-page-resource-type]").dataset.pageResourceName;
        return [artist, album];
      }
    }]
  },
  'TVNfo' : {
    host : ["tvnfo.com"],
    condition : () => document.querySelector("#tvsign"),
    products : [{
      condition : Always,
      type : "tv",
      data : () => document.querySelector(".heading h1").textContent.trim()
    }]
  },
  'rateyourmusic' : {
    host : ["rateyourmusic.com"],
    condition : () => document.querySelector("meta[property='og:type']"),
    products : [{
      condition : () => document.querySelector("meta[property='og:type']").content == "music.album",
      type : "music",
      data : function() {
        var artist = document.querySelector(".section_main_info .artist").innerText.trim();
        var album = document.querySelector(".section_main_info .album_title").innerText.trim();
        return [artist, album];
      }
    }]
  },
  'spotify_webplayer' : {
    host : ["open.spotify.com"],
    condition : () => Always,
    products : [{
      condition : () => document.querySelector("#main .main-view-container .content.album"),
      type : "music",
      data : function() {
        var artist = document.querySelector("#main .media-bd div a[href*='artist']").textContent;
        var album = document.querySelector("#main .media-bd h2").textContent;
        return [artist, album];
      }
    },
    {
      condition : () => document.location.pathname.startsWith("/album/") && document.querySelector("meta[property='og:type']").content == "music.album",
      type : "music",
      data : function() {
        var artist = "";
        var album = document.querySelector("meta[property='og:title']").content;
        return [artist, album];
      }
    }]
  },
  'spotify' : {
    host : ["play.spotify.com"],
    condition : () => Always,
    products : [{
      condition : () => document.location.pathname.startsWith("/album/"),
      type : "music",
      data : function() {
        var artist = document.querySelector(".context_landing p.secondary-title").textContent;
        var album = document.querySelector(".context_landing p.primary-title").textContent;
        return [artist, album];
      }
    }]
  },
};


async function main() {

  var map = false;

  for(var name in sites) {
    var site = sites[name];
    if(site.host.some(function(e) {return ~this.indexOf(e)}, document.location.hostname))
    if(site.host.some(function(e) {return ~this.indexOf(e)}, document.location.hostname) && site.condition()) {
      for(var i = 0; i < site.products.length; i++) {
        if(site.products[i].condition()) {
          // Check map for a match
          if(map === false) {
            map = JSON.parse(await GM.getValue("map","{}"));
          }
          var docurl = document.location.host.replace(/^www\./,"") + document.location.pathname + document.location.search;
          docurl = filterUniversalUrl(docurl);
          if(docurl in map) {
            // Found in map, show result
            var metaurl = map[docurl];
            metacritic["mapped"].apply(undefined, [baseURL + metaurl, site.products[i].type]);
            break;
          }
          // Try to retrieve item name from page
          var data;
          try {
            data = site.products[i].data();
          } catch(e) {
            data = false;
            console.log(e);
          }
          if(data) {
            metacritic[site.products[i].type].apply(undefined, Array.isArray(data)?data:[data]);
          }
          break;
        }
      }
      break;
    }
  }
}




(async function() {

  await main();
  var lastLoc = document.location.href;
  var lastContent = document.body.innerText;
  var lastCounter = 0;
  function newpage() {
    if(lastContent == document.body.innerText && lastCounter < 15) {
      window.setTimeout(newpage, 500);
      lastCounter++;
    } else {
      lastCounter = 0;
      main();
    }
  }
  window.setInterval(function() {
    if(document.location.href != lastLoc) {
      lastLoc = document.location.href;
      $("#mcdiv123").remove();
        
      window.setTimeout(newpage,1000);
    }
  },500);

})();