/**
 * Funcion que obtiene todos los argumentos de la URL
 * @return {object} objeto con todos los argumentos en formato clave, valor 
 * @see {@link https://stackoverflow.com/posts/20097994/edit}
 */
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


/**
 * Funcion que dependiendo del tipo que estes tratando de cargar en la pagina te pinta una cabecera u otra
 * @param {object} cabecera Recibe la cabecera de la pagina sobre la que pintar los datos
 * @param {string} tipo Indica el tipo de cabecera que vamos a pintar
 * @param {string} titulo Titulo del header
 */
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

/**
 * Funcion carga el contenito de la pagina para el Top del pais y el de la busqueda, genera tanto la tabla como los cuatro circulos primeros
 * @param {array} tracks Array con todas las canciones a mostrar
 */
function añadeContenido(tracks){
  tracks.forEach(añadeATabla);
  for(var i = 0; i < 4; i++){
    ponEnCirculos(tracks[i], i);
  }
}

/**
 * LLamada Ajaxa una URL
 * @param {string} url URL a la que le queremos hacer la peticion
 * @param {object} callback
 * @see {@link https://github.com/Fictizia/Master-en-Programacion-FullStack-con-JavaScript-y-Node.js_ed2/blob/master/teoria/clase16.md#ajax-en-la-pr%C3%A1ctica}
 */
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

/**
 * Carga los datos de la tabla fila a fila
 * @param {object} item elemento que vamos a insertar en la tabla
 * @param {number} index indice del elemento sobre el que estamos iterando
 */
function añadeATabla(item,index){
  var tabla = document.querySelector('#cuerpoTabla');
  var tr = document.createElement('tr');
  var artistaTabla = "";
  //Si no hay parametros solo tendremos un solo artista, en caso contrario iteramos sobre los colaboradores
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

/**
 * Rellena un circulo segun el elemento 
 * @param {object} track
 * @param {number} posicion indice del elemento sobre el que estamos iterando
 */
function ponEnCirculos(track,posicion){
  var circulo = "#circulo-"+ posicion;
  document.querySelector(circulo).setAttribute('href', track.link);
  document.querySelector(circulo +' > img').src = track.album.cover_xl;
  document.querySelector(circulo +' > h4').innerText = track.title;
  document.querySelector(circulo +' > span').innerText = track.artist.name;
}

/**
 * Rellena un circulo con la imagen y la informacion del artista
 * @param {} respuesta Respuesta de la llamada AJAX para pintar la informacion del artista
 */
function pintaArtist(respuesta){
  var artista = JSON.parse(respuesta);
  document.querySelector('.placeholderArtist > h1').innerText = artista.name;
  document.querySelector('.placeholderArtist > .nFans').innerText = artista.nb_fan + " fans";
  document.querySelector('.placeholderArtist > img').src = artista.picture_xl;
  
}

/**
 * Rellena la tabla con las canciones del artista
 * @param {} respuesta Respuesta de la llamada AJAX para pintar las canciones del artista
 */
function topTracksArtist(respuesta){
  var topTracks = JSON.parse(respuesta);
  var tracks = topTracks.data;
  tracks.forEach(añadeATabla);
  document.querySelector(".loader").style.display = 'none';
}

/**
 * Recibe la informacion del pais y seugn el pais en el que se encuentre realiza una llamada nueva
 * @param {} respuesta Respuesta de la llamada AJAX para pintar las canciones del artista
 */
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
    añadeContenido(tracks);
    document.querySelector(".loader").style.display = 'none';
  });
}
//Ocultamos el mensaje de error, para solo mostrarlo en caso de error
var error = document.getElementById('error');
error.style.display = 'none';
//Obtenemos los valores de la URL
const urlParams = getUrlVars();
var cabecera = document.querySelector('.main');
if(urlParams.hasOwnProperty("q")){//Si tenemos algo que buscar
  var miBusqueda = decodeURI(urlParams["q"]);
  creaCabecera(cabecera,"topCuatroCirculos", "Resultados de ");
  var URLBusqueda ="https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="+miBusqueda+"&limit=50";
  var titulo = document.querySelector('#topOf');
  titulo.insertAdjacentHTML('beforeend', '"'+miBusqueda+'"');
  peticionAjax(URLBusqueda, function(respuesta) {
    var topTracks = JSON.parse(respuesta);
    if(topTracks.total !== 0){//Si la busqueda da resultados
      var tracks = topTracks.data;
      añadeContenido(tracks);
    } else{//Si no da resultados mostramos error
      cabecera.style.display = 'none';
      error.style.display = 'block';
      document.getElementById('tubusqueda').innerText = '"'+miBusqueda+'"';
    }
    document.querySelector(".loader").style.display = 'none';
  });
}else if(urlParams.hasOwnProperty("artist")){//Si tenemos parametro artista
  var myParam = urlParams["artist"];
  creaCabecera(cabecera,"artista");
  peticionAjax("https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+myParam, pintaArtist);
  peticionAjax("https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+myParam+"/top?limit=50", topTracksArtist);
}else{//Si no mostramos el top segun el pais
  creaCabecera(cabecera,"topCuatroCirculos", "Top Tracks of ");
  peticionAjax("https://ipapi.co/json/", topTracksCountry);
}