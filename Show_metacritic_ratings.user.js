// ==UserScript==
// @name        Show Metacritic.com ratings
// @description Show metacritic metascore and user ratings on: Bandcamp, Apple Itunes (Music), Amazon (Music,Movies,TV Shows), IMDb (Movies), Google Play (Music, Movies), TV.com, Steam, Gamespot (PS4, XONE, PC), Rotten Tomatoes, Serienjunkies
// @namespace   cuzi
// @oujs:author cuzi
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @resource    global.min.css http://www.metacritic.com/css/global.min.1445030030.css
// @resource    base.min.css http://www.metacritic.com/css/filters/base.min.1445029958.css
// @license     GNUGPL
// @version     1
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
// ==/UserScript==

var baseURL = "http://www.metacritic.com/";

var baseURL_music = "http://www.metacritic.com/music/";
var baseURL_movie = "http://www.metacritic.com/movie/";
var baseURL_pcgame = "http://www.metacritic.com/game/pc/";
var baseURL_ps4 = "http://www.metacritic.com/game/playstation-4/";
var baseURL_xone = "http://www.metacritic.com/game/xbox-one/";
var baseURL_tv = "http://www.metacritic.com/tv/";

var baseURL_search = "http://www.metacritic.com/search/{type}/{query}/results";

var mybrowser = "other";
if(~navigator.userAgent.indexOf("Chrome")) {
  mybrowser = "chrome";
}


var CSS =   "/* http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/*/\
#mcdiv123 .grespinner {\
    height:16px;\
    width:16px;\
    margin:0px auto;\
    position:relative;\
    -webkit-animation: rotation .6s infinite linear;\
    -moz-animation: rotation .6s infinite linear;\
    -o-animation: rotation .6s infinite linear;\
    animation: rotation .6s infinite linear;\
    border-left:6px solid rgba(0,174,239,.15);\
    border-right:6px solid rgba(0,174,239,.15);\
    border-bottom:6px solid rgba(0,174,239,.15);\
    border-top:6px solid rgba(0,174,239,.8);\
    border-radius:100%;\
  }\
  @-webkit-keyframes rotation {\
    from {-webkit-transform: rotate(0deg);}\
    to {-webkit-transform: rotate(359deg);}\
  }\
  @-moz-keyframes rotation {\
    from {-moz-transform: rotate(0deg);}\
    to {-moz-transform: rotate(359deg);}\
  }\
  @-o-keyframes rotation {\
    from {-o-transform: rotate(0deg);}\
    to {-o-transform: rotate(359deg);}\
  }\
  \
  @keyframes rotation {\
    from {transform: rotate(0deg);}\
    to {transform: rotate(359deg);}\
  }\
\
#mcdiv123searchresults .result {\
  font: 12px arial,helvetica,serif;\
  border-top-width: 1px;\
  border-top-color:#ccc;\
  border-top-style:solid;\
  padding:5px;\
}\
#mcdiv123searchresults .result .result_type {\
    display: inline;\
}\
#mcdiv123searchresults .result .result_wrap {\
    float: left;\
    width: 100%;\
}\
#mcdiv123searchresults .result .has_score {\
    padding-left: 42px;\
}\
#mcdiv123searchresults .result .basic_stats {\
    height: 1%;\
    overflow: hidden;\
}\
#mcdiv123searchresults .result .basic_stat {\
    display: inline;\
    float: right;\
    overflow: hidden;\
    width: 100%;\
}\
#mcdiv123searchresults .result h3 {\
    font-size: 14px;\
    font-weight: bold;\
}\
#mcdiv123searchresults .result a {\
    color: #09f;\
    font-weight: bold;\
    text-decoration: none;\
}\
#mcdiv123searchresults .metascore_w.positive, #mcdiv123searchresults .metascore_w.sixtyone, #mcdiv123searchresults .metascore_w.game.seventyfive, #mcdiv123searchresults .metascore_w.score_favorable, #mcdiv123searchresults .metascore_w.score_outstanding {\
    background-color: #6c3;\
}\
#mcdiv123searchresults .metascore_w.mixed, #mcdiv123searchresults .metascore_w.forty, #mcdiv123searchresults .metascore_w.game.fifty, #mcdiv123searchresults .metascore_w.score_mixed {\
    background-color: #fc3;\
}\
#mcdiv123searchresults .metascore_w.negative, #mcdiv123searchresults .metascore_w.score_terrible, #mcdiv123searchresults .metascore_w.score_unfavorable {\
    background-color: #f00;\
}\
\
#mcdiv123searchresults span.metascore_w, #mcdiv123searchresults a.metascore_w {\
    display: inline-block;\
}\
#mcdiv123searchresults .result .metascore_w {\
    color: #fff !important;\
    font-family: Arial,Helvetica,sans-serif;\
    font-size: 17px;\
    font-style: normal !important;\
    font-weight: bold !important;\
    height: 2em;\
    line-height: 2em;\
    text-align: center;\
    vertical-align: middle;\
    width: 2em;\
    float: left;\
    margin: 0 0 0 -42px;\
}\
#mcdiv123searchresults .result .basic_stat {\
    display: inline;\
    float: right;\
    overflow: hidden;\
    width: 100%;\
}\
#mcdiv123searchresults .result .more_stats {\
    font-size: 10px;\
    color:#444;\
}\
#mcdiv123searchresults .result .release_date .data {\
  font-weight: bold;\
  color:#000;\
}\
#mcdiv123searchresults ol, #mcdiv123searchresults ul {\
    list-style: outside none none;\
}\
#mcdiv123searchresults .result li.stat {\
    background: transparent none repeat scroll 0 0;\
    display: block;\
    float: none;\
    white-space: normal;\
}\
#mcdiv123searchresults .result li.stat {\
    display: inline;\
    float: left;\
    margin: 0;\
    padding: 0 6px 0 0;\
    white-space: nowrap;\
}\
#mcdiv123searchresults .result .deck {\
    margin: 3px 0 0;\
}\
#mcdiv123searchresults .result .basic_stat {\
    display: inline;\
    float: right;\
    overflow: hidden;\
    width: 100%;\
}\
";
  
function name2metacritic(s) {
  return s.replace(/\W+/g, " ").toLowerCase().trim().replace(/\W+/g,"-");
}
function minutesSince(time) {
  var seconds = ((new Date()).getTime() - time.getTime()) / 1000;
  return seconds>60?parseInt(seconds/60)+" min ago":"now";
}
function fixMetacriticURLs(html) {
  return html.replace(/<a /g,'<a target="_blank" ').replace(/href="\//g,'href="'+baseURL).replace(/src="\//g,'src="'+baseURL);
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
          $(document).unbind("keydown.listenForHotkeys");
          cb();
        }
      }
    }
  });
}


function metacritic_hoverInfo(url, cb, errorcb) {
  // Get the metacritic hover info. Requests are cached.
  var handleresponse = function(response, cached) {
    if(response.status == 200 && cb) {
      cb(response.responseText, new Date(response.time));
    } else if(response.status != 200 && errorcb) {
      errorcb(response.responseText, new Date(response.time));
      if(!cached)
        console.log("Show metacritic ratings: Error:"+response.status+"\n"+url);
    }
  };
  
  var cache = JSON.parse(GM_getValue("hovercache","{}"));
  for(var prop in cache) {
    // Delete cached values, that are older than 2 hours
    if((new Date()).getTime() - (new Date(cache[prop].time)).getTime() > 2*60*60*1000) { 
      delete cache[prop];
    }
  }
  
  if(url in cache) {
    handleresponse(cache[url], true);
  } else {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      data: "hoverinfo=1",
      headers: {
        "Referer" : url,
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
        "Host" : "www.metacritic.com",
        "User-Agent" : navigator.userAgent,
        "X-Requested-With" : "XMLHttpRequest"
      },
      onload: function(response) { 
        response.time = (new Date()).toJSON();
        cache[url] = response;
        GM_setValue("hovercache",JSON.stringify(cache));
        handleresponse(response, false);
      }
    });
  }
}
function metacritic_searchResults(url, cb, errorcb) {
  // Get metacritic search results. Requests are cached.
  var handleresponse = function(response, cached) {
    if(response.results.length && cb) {
      cb(response.results, new Date(response.time));
    } else if(response.results.length == 0 && errorcb) {
      errorcb(response.results, new Date(response.time));
    }
  };
  
  var cache = JSON.parse(GM_getValue("searchcache","{}"));
  for(var prop in cache) {
    // Delete cached values, that are older than 2 hours
    if((new Date()).getTime() - (new Date(cache[prop].time)).getTime() > 2*60*60*1000) { 
      delete cache[prop];
    }
  }
  
  if(url in cache) {
    handleresponse(cache[url], true);
  } else {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      data: "hoverinfo=1",
      headers: {
        "Referer" : url,
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
        "Host" : "www.metacritic.com",
        "User-Agent" : navigator.userAgent
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
        GM_setValue("searchcache",JSON.stringify(cache));
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

function metacritic_showHoverInfo(url) {
  metacritic_hoverInfo(url, 
  // On Success
  function(html, time) {
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
    var functions = {
      "other" : {
        "parent": function() {},
        "frame" : function() {
          var f = parent.document.getElementById('mciframe123');
          for(var i =0; f.clientHeight < document.body.scrollHeight && i < 100; i++) {
            f.style.width = parseInt(f.style.width)+10+"px";
          }
          if(f.clientHeight < document.body.scrollHeight) {
            f.style.height = parseInt(f.style.height)+15+"px";
            f.style.width = "300px";
            sizecorrection();
          }
        }
      },
      "chrome" : {
        "parent" : function() {
          var f = parent.document.getElementById('mciframe123');
          window.addEventListener("message", function(e){
            if("mcimessage1" in e.data) {
              f.style.width = parseInt(f.style.width)+10+"px";
            } else if("mcimessage2" in e.data) {
              f.style.height = parseInt(f.style.height)+15+"px";
              f.style.width = "300px";
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
          var i = 0;
          window.addEventListener("message", function(e){
            if(!("mcimessage3" in e.data)) return; 
            if(e.data.mciframe123_clientHeight < document.body.scrollHeight && i < 100) {
              parent.postMessage({"mcimessage1":1},'*');
              i++;
            }
            if(i >= 100) {
              parent.postMessage({"mcimessage2":1},'*')
              i = 0;
            } 
          });
          parent.postMessage({"mcimessage1":1},'*');
        }
      }
      
    };
    
    var framesrc = 'data:text/html,';
    framesrc += encodeURIComponent('<!DOCTYPE html>\
    <html lang="en">\
      <head>\
        <meta charset="utf-8">\
        <title>Metacritic info</title>\
        <link rel="stylesheet" href="'+(mybrowser=="chrome"?"data:text/css;base64,":"")+GM_getResourceURL("base.min.css")+'" type="text/css">\
        <link rel="stylesheet" href="'+(mybrowser=="chrome"?"data:text/css;base64,":"")+GM_getResourceURL("global.min.css")+'" type="text/css">\
        <style>body { margin:0px; padding:0px; background:white; }</style>\
        <script>\
        function on_load() {\
          ('+functions[mybrowser].frame.toString()+')();\
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
      width: 300,
      height: 170,
      border: "none"
    });
    
    functions[mybrowser].parent();
       
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleFormat()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#128128;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });

  },
  // On error i.e. no result on metacritic.com
  function(html, time) {
    listenForHotkeys("meta",function() {
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
      var query = $('<input type="text" size="60" id="mcisearchquery">').val(url.split("/").pop().replace(/-/g," ")).appendTo(div).on('keypress', function(e) {
        var code = e.keyCode || e.which;
        if(code == 13) { // Enter key
          metacritic_search.call(this,e);
        }
      });
      $('<button id="mcisearchbutton">').text("Search").appendTo(div).click(metacritic_search);
    });
  }  
  );
}

function metacritic_search() {
  var query = $("#mcisearchquery").val();
  var type = "all";
  
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
    var resultdiv = $("#mcdiv123searchresults").length?$("#mcdiv123searchresults").html(""):$('<div id="mcdiv123searchresults"></div>').css("max-width","95%").appendTo(div);
    results.forEach(function(html) {
      $('<div class="result"></div>').html(fixMetacriticURLs(html)+'<div style="clear:left"></div>').appendTo(resultdiv);
    });
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleFormat()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#128128;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });
  },
  // On error i.e. no results
  function(results, time) {
    loader.remove();
    var resultdiv = $("#mcdiv123searchresults").length?$("#mcdiv123searchresults").html(""):$('<div id="mcdiv123searchresults"></div>').appendTo(div);
    resultdiv.html("No search results.");
    
    var sub = $("<div></div>").appendTo(div);
    $('<time style="color:#b6b6b6; font-size: 11px;" datetime="'+time+'" title="'+time.toLocaleFormat()+'">'+minutesSince(time)+'</time>').appendTo(sub);
    $('<a style="color:#b6b6b6; font-size: 11px;" target="_blank" href="'+url+'" title="Open Metacritic">'+decodeURI(url.replace("http://www.","@"))+'</a>').appendTo(sub);
    $('<span title="Hide me" style="cursor:pointer; float:right; color:#b6b6b6; font-size: 11px;">&#128128;</span>').appendTo(sub).click(function() {
      document.body.removeChild(this.parentNode.parentNode);
    });
    
  }
  );
}




function metacritic_music(artistname, albumname) {
  artistname = name2metacritic(artistname);
  albumname = name2metacritic(albumname);
  var url = baseURL_music + albumname + "/" + artistname;
  metacritic_showHoverInfo(url);
}

function metacritic_movie(moviename) {
  moviename = name2metacritic(moviename);
  var url = baseURL_movie + moviename;
  metacritic_showHoverInfo(url);
}

function metacritic_pcgame(gamename) {
  gamename = name2metacritic(gamename);
  var url = baseURL_pcgame + gamename;
  metacritic_showHoverInfo(url);
}

function metacritic_ps4game(gamename) {
  gamename = name2metacritic(gamename);
  var url = baseURL_ps4 + gamename;
  metacritic_showHoverInfo(url);
}

function metacritic_xonegame(gamename) {
  gamename = name2metacritic(gamename);
  var url = baseURL_xone + gamename;
  metacritic_showHoverInfo(url);
}

function metacritic_tv(seriesname) {
  seriesname = name2metacritic(seriesname);
  var url = baseURL_tv + seriesname;
  metacritic_showHoverInfo(url);
}



function host_amazonMusic() {
  var music = ["Music","Musique","Musik","Música","Musica","音楽"];
  return music.some(function(s) {
    if(~document.title.indexOf(s)) {
      return true;
    } else {
      return false;
    }
  });
}


function main() {

  if(~document.location.host.indexOf("bandcamp.com") && unsafeWindow.TralbumData) {
    metacritic_music(unsafeWindow.TralbumData.artist, unsafeWindow.TralbumData.current.title);
  }
  else if(~document.location.host.indexOf("itunes.apple.com") && ~document.location.href.indexOf("/album/")) {
    metacritic_music(document.querySelector("*[itemprop=byArtist]").textContent, document.querySelector("*[itemprop=name]").textContent);
  }
  else if(~document.location.host.indexOf("play.google.com")) {
    if(~document.location.href.indexOf("/album/")) {
      metacritic_music(document.querySelector("*[itemprop=byArtist] a").textContent, document.querySelector("*[itemprop=name]").textContent);
    } else if(~document.location.href.indexOf("/movies/details/")) {
      metacritic_movie(document.querySelector("*[itemprop=name]").textContent);
    }
  }
  else if(~document.location.host.indexOf("amazon")) {
    if(host_amazonMusic()) {
      var artist = document.querySelector("#byline .author a").textContent;
      var title = document.getElementById("productTitle").textContent;
      title = title.replace(/\[([^\]]*)\]/g,""); // Remove [brackets] and their content
      metacritic_music(artist, title);
    } else if(document.getElementById("aiv-content-title") && document.getElementsByClassName("season-single-dark").length) {
      metacritic_tv(document.getElementById("aiv-content-title").firstChild.data.trim());
    } else if(document.getElementById("aiv-content-title")) {
      metacritic_movie(document.getElementById("aiv-content-title").firstChild.data.trim());
    }
  }
  else if(~document.location.host.indexOf("imdb.com")) {
    metacritic_movie(document.querySelector("*[itemprop=name]").textContent);
  }
  else if(~document.location.host.indexOf("store.steampowered.com")) {
    metacritic_pcgame(document.querySelector("*[itemprop=name]").textContent);
  }
  else if(~document.location.host.indexOf("gamespot.com")) {
    if($("[itemprop=device]").text().contains("PC")) {
      metacritic_pcgame(document.querySelector("h1[itemprop=name]").textContent);
    } else if($("[itemprop=device]").text().contains("PS4")) {
      metacritic_ps4game(document.querySelector("h1[itemprop=name]").textContent);
    } else if($("[itemprop=device]").text().contains("XONE")) {
      metacritic_xonegame(document.querySelector("h1[itemprop=name]").textContent);
    }
  }
  else if(~document.location.host.indexOf("www.serienjunkies.de")) {
    if(document.querySelector("h1[itemprop=name]")) {
      metacritic_tv(document.querySelector("h1[itemprop=name]").textContent);
    } else {
      var n = $("a:contains(Details zur)");
      if(n) {
        var name = n.text().match(/Details zur Produktion der Serie (.+)/)[1];
        metacritic_tv(name);
      }
    }
  }
  else if(~document.location.host.indexOf("www.tv.com")) {
    metacritic_tv(document.querySelector("h1[itemprop=name]").textContent);
  }
  else if(~document.location.host.indexOf("www.rottentomatoes.com")) {
    if(~document.location.href.indexOf(".com/m/")) {
      metacritic_movie(document.querySelector("h1[itemprop=name]").firstChild.textContent);
    } else if(~document.location.href.indexOf(".com/tv/")) {
      metacritic_tv(document.querySelector("*[itemprop=partOfSeries] *[itemprop=name]").textContent);
    }
  }
  
}




main();
var lastLoc = document.location.href;
window.setInterval(function() {
  if(document.location.href != lastLoc) {
    lastLoc = document.location.href;
    $("#mcdiv123").remove();
    window.setTimeout(main,500);
  }
},500);

