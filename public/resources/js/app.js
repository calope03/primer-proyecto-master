function ajaxGet(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status >= 200 && req.status < 400) {
      // Llamada ala función callback pasándole la respuesta
      callback(req.responseText);
    } else {
      console.error(req.status + " " + req.statusText);
    }
  });
  req.addEventListener("error", function(){
    console.error("Error de red");
  });
  req.send(null);
}

function añadeATabla(item,index){
  
  var tabla = document.querySelector('#cuerpoTabla');

  var tr = document.createElement('tr');
  
  tr.innerHTML = '<td># '+(index+1)+'</td> <td>' + item.name+'</td> <td>'+ item.artist.name +'</td>  <td><a href="'+ item.url +'" class = "playMe"> <img src="/public/resources/images/play.png" class = "playButton" alt="Play me"/>Play Me</a></td>'

  tabla.appendChild(tr);
}

function ponEnCirculos(track,posicion){
  var imagen = "imagen-"+ posicion;
  document.getElementById(imagen).src = track.image[3]["#text"];
  
}

ajaxGet("https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=69482ec81a0686a94e58bfedd7221697&format=json", function(respuesta) {
  
  var topTracks = JSON.parse(respuesta);
  
  var tracks = topTracks.tracks.track;
  
  tracks.forEach(añadeATabla);
  
  for(var i = 0; i < 4; i++){
    ponEnCirculos(tracks[i], i+1);
  }
  
  console.log(tracks);
 
});

//https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=69482ec81a0686a94e58bfedd7221697