function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

const urlParams = getUrlVars();
//const myParam = urlParams.get('artist');

var cabecera = document.querySelector('.main');

if(urlParams.hasOwnProperty("q")){
  var miBusqueda = urlParams["q"];
  creaCabecera(cabecera,"topCuatroCirculos", "Resultados de ");
  var URLBusqueda ="https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="+miBusqueda+"&limit=50";
  
  var titulo = document.querySelector('#topOf');
  titulo.insertAdjacentHTML('beforeend', miBusqueda);
  
  peticionAjax(URLBusqueda, function(respuesta) {
    var topTracks = JSON.parse(respuesta);
    console.log(topTracks);
    var tracks = topTracks.data;
    tracks.forEach(añadeATabla);
    for(var i = 0; i < 4; i++){
      ponEnCirculos(tracks[i], i);
    }
    console.log(tracks);
   
  });
}else if(urlParams.hasOwnProperty("artist")){
  var myParam = urlParams["artist"];
  creaCabecera(cabecera,"artista");
  peticionAjax("https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+myParam, pintaArtist);
  peticionAjax("https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+myParam+"/top?limit=50", topTracksArtist);
}else{
  creaCabecera(cabecera,"topCuatroCirculos", "Top Tracks of ");
  peticionAjax("https://ipapi.co/json/", topTracksCountry);
}

function creaCabecera(cabecera, tipo, titulo){
  if (tipo === "topCuatroCirculos") {
    cabecera.insertAdjacentHTML('afterbegin', `
          <h1 class="page-header" id = "topOf">${titulo}</h1>

          <div class="row placeholders">
            <a class="col-xs-6 col-sm-3 placeholder" id="circulo-0">
              <img id = "imagen-1" src="/public/resources/images/prueba.png" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">
              <h4>Label</h4>
              <span class="text-muted">Something else</span>
            </a>
            <a class="col-xs-6 col-sm-3 placeholder" id="circulo-1">
              <img id = "imagen-2" src="/public/resources/images/prueba.png" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">
              <h4>Label</h4>
              <span class="text-muted">Something else</span>
            </a>
            <a class="col-xs-6 col-sm-3 placeholder" id="circulo-2">
              <img id = "imagen-3" src="/public/resources/images/prueba.png" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">
              <h4>Label</h4>
              <span class="text-muted">Something else</span>
            </a>
            <a class="col-xs-6 col-sm-3 placeholder" id="circulo-3">
              <img id = "imagen-4" src="/public/resources/images/prueba.png" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">
              <h4>Label</h4>
              <span class="text-muted">Something else</span>
            </a>
          </div>`);
  }else if (tipo === "artista") {
    cabecera.insertAdjacentHTML('afterbegin', `
          <div class="row placeholdersArtist">
            <div class="col-xs-3 col-sm-3 placeholderArtist" id="circulo">
              <img id = "imagen-1" src="/public/resources/images/prueba.png" width="250" height="250" class="img-responsive" alt="Generic placeholder thumbnail">
            </div> 
            <div class="col-xs-7 col-sm-7 placeholderArtist"><h1>Label</h1>
              <h5 class="text-muted nFans">Something else</h5>
            </div>`);
  }
}

function peticionAjax(url, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {

        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status === 404) {
            console.error("ERROR! 404");
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}



function añadeATabla(item,index){
  
  var tabla = document.querySelector('#cuerpoTabla');

  var tr = document.createElement('tr');
  
  var artistaTabla = "";
  if(!myParam){
    artistaTabla = '<a href="?artist='+ item.artist.id +'" class = "">'+ item.artist.name +'</a>';
  }else{
    for(var i=0; i<item.contributors.length-1; i++){
      artistaTabla += '<a href="?artist='+ item.contributors[i].id +'" class = "">'+ item.contributors[i].name +', </a>';
    }
     artistaTabla += '<a href="?artist='+ item.contributors[item.contributors.length-1].id +'" class = "">'+ item.contributors[item.contributors.length-1].name +'</a>';
  }
  
  tr.innerHTML = '<td># '+(index+1)+'</td> <td>' + item.title+'</td> <td>'+ artistaTabla +'</td> <td>'+ item.album.title +'</td>  <td><a href="'+ item.link +'" class = "playMe"> <img src="/public/resources/images/play.png" class = "playButton" alt="Play me"/>Play Me</a></td>';

  tabla.appendChild(tr);
}

function ponEnCirculos(track,posicion){
  var circulo = "#circulo-"+ posicion;
  document.querySelector(circulo).setAttribute('href', track.link);
  document.querySelector(circulo +' > img').src = track.album.cover_xl;
  document.querySelector(circulo +' > h4').innerText = track.title;
  document.querySelector(circulo +' > span').innerText = track.artist.name;
}
function pintaArtist(respuesta){
  var artista = JSON.parse(respuesta);
  document.querySelector('.placeholderArtist > h1').innerText = artista.name;
  document.querySelector('.placeholderArtist > .nFans').innerText = artista.nb_fan + " fans";
  document.querySelector('.placeholderArtist > img').src = artista.picture_xl;
  
}

function topTracksArtist(respuesta){
  var topTracks = JSON.parse(respuesta);
  var tracks = topTracks.data;
  tracks.forEach(añadeATabla);
  
  console.log(topTracks);
}


function topTracksCountry(respuesta) {
  
  var localizacion = JSON.parse(respuesta);
  var pais = localizacion.country;
  
  var titulo = document.querySelector('#topOf');
  
  var idPlaylistPais = "";
  if(identificadoresPais.hasOwnProperty(pais)){
    idPlaylistPais = identificadoresPais[pais];
    titulo.insertAdjacentHTML('beforeend', localizacion.country_name);
  }else{
    idPlaylistPais = identificadoresPais.Mundial;
    
  }
  var listaPais = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/playlist/" + idPlaylistPais + "?limit=50";
  
  peticionAjax(listaPais, function(respuesta) {
  
    var topTracks = JSON.parse(respuesta);
    var tracks = topTracks.tracks.data;
    tracks.forEach(añadeATabla);
    for(var i = 0; i < 4; i++){
      ponEnCirculos(tracks[i], i);
    }
    console.log(tracks);
   
  });
}
