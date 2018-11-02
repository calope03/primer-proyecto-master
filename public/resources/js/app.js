var identificadoresPais={
  Mundial: 3155776842,
  US: 1313621735, //USA
  BR: 1111141961, //Brazil
  DE: 1111143121, //Germany
  FR: 1109890291, //France
  GB: 1111142221, //UK
  CA: 1652248171, //Canada
  ZA: 1362528775, //SouthAfrica
  YV: 1362527605, //Venezuela
  UA: 1362526495, //Ukraine
  TN: 1362525375, //Tunisia
  TH: 1362524475, //Thailand
  SV: 1362523615, //ElSalvador
  SN: 1362523075, //Senegal
  SI: 1362522355, //Slovenia
  SA: 1362521285, //SaudiArabia
  PY: 1362520135, //Paraguay
  PT: 1362519755, //Portugal
  PH: 1362518895, //Philippines
  PE: 1362518525, //Peru
  MY: 1362515675, //Malaysia
  MA: 1362512715, //Morocco
  LB: 1362511155, //Lebanon
  KR: 1362510315, //SouthKorea
  JP: 1362508955, //Japan
  JO: 1362508765, //Jordan
  JM: 1362508575, //Jamaic
  HU: 1362506695, //Hungary
  EG: 1362501615, //Egypt
  EC: 1362501235, //Ecuador
  DZ: 1362501015, //Algeria
  BO: 1362495515, //Bolivia
  AE: 1362491345, //UnitedArabEmirates
  SG: 1313620765, //Singapore
  SE: 1313620305, //Sweden
  NO: 1313619885, //Norway
  IE: 1313619455, //Ireland
  DK: 1313618905, //Denmark
  CR: 1313618455, //CostaRica
  CH: 1313617925, //Switzerland
  AU: 1313616925, //Australia
  AT: 1313615765, //Austria
  AR: 1279119721, //Argentina
  CL: 1279119121, //Chile
  GT: 1279118671, //Guatemala
  RO: 1279117071, //Romania
  SK: 1266973701, //Slovakia
  CS: 1266972981, //Serbia
  PL: 1266972311, //Poland
  NL: 1266971851, //Netherlands
  HR: 1266971131, //Croatia
  CZ: 1266969571, //CzechRepublic
  BE: 1266968331, //Belgium
  LV: 1221037511, //Latvia
  LT: 1221037371, //Lithuania
  EE: 1221037201, //Estonia
  FI: 1221034071, //Findland
  HN: 1116190301, //Honduras
  ES: 1116190041, //Spain
  RU: 1116189381, //Russia
  TR: 1116189071, //Turkey
  ID: 1116188761, //Indonesia
  CO: 1116188451, //Colombia
  IT: 1116187241, //Italy
  MX: 1111142361  //Mexico
}
///https://www.deezer.com/es/channels/module/6956d235-bf37-4e04-a7b4-92554f259fc9

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
  
  tr.innerHTML = '<td># '+(index+1)+'</td> <td>' + item.title+'</td> <td>'+ item.artist.name +'</td> <td>'+ item.album.title +'</td>  <td><a href="'+ item.link +'" class = "playMe"> <img src="/public/resources/images/play.png" class = "playButton" alt="Play me"/>Play Me</a></td>'

  tabla.appendChild(tr);
}

function ponEnCirculos(track,posicion){
  var circulo = "#circulo-"+ posicion;
  document.querySelector(circulo).setAttribute('href', track.link);
  document.querySelector(circulo +' > img').src = track.album.cover_xl;
  document.querySelector(circulo +' > h4').innerText = track.title;
  document.querySelector(circulo +' > span').innerText = track.album.title;
}


peticionAjax("https://ipapi.co/json/", function(respuesta) {
  
  var localizacion = JSON.parse(respuesta);
  var pais = localizacion.country;
  
  var titulo = document.querySelector('#topOf');
  
  var idPlaylistPais = "";
  if(identificadoresPais.hasOwnProperty(pais)){
    idPlaylistPais = identificadoresPais[pais];
    titulo.insertAdjacentHTML('beforeend', localizacion.country_name);
  }else{
    idPlaylistPais = identificadoresPais.Mundial;
    titulo.insertAdjacentHTML('beforeend', "Worldwide");
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
});



//https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=69482ec81a0686a94e58bfedd7221697
//ttps://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=69482ec81a0686a94e58bfedd7221697&format=json