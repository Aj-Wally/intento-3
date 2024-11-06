//Elementos DOM que se relacionan con la información de la pista
let now_playing = document.querySelector('.now-playing');//Mostrará la canción que esté sonando
let track_art = document.querySelector('.track-art');//Imágen de la canción
let track_name = document.querySelector('.track-name');//Nombre de la canción
let track_artist = document.querySelector('.track-artist');//Nombre del artista

//Botones de control de reproducción
let playpause_btn = document.querySelector('.playpause-track');//Botón de play/pausa
let next_btn = document.querySelector('.next-track');//Botón de siguiente canción
let prev_btn = document.querySelector('.prev-track');//Botón de canción anterior

//Control del tiempo, volumen y barra de progreso
let seek_slider = document.querySelector('.seek_slider');//Barra de progreso de la canción
let volume_slider = document.querySelector('.volume_slider');//Control de volumen
let curr_time = document.querySelector('.current-time');//Tiempo actual de la canción
let total_duration = document.querySelector('.total-duration');//Duración total de la canción
let wave = document.getElementById('wave');//ola de reproducción cuando se reproduce la canción
let randomIcon = document.querySelector('.fa-random');//Icono de reproducción aleatoria
let curr_track = document.createElement('audio');//Elemento de audio para las canciones

// Variables de control del estado de la música
let track_index = 0;//Índice de la canción
let isPlaying = false;//Estado de reproducción en el cual si indica que es falso no reproducirá nada y si es verdadero reproducirá la música
let isRandom = false;//indicará el estado de la reproducción aleatoría (actualmente siendo está falsa que quiere decir que está apagado)
let updateTimer;//actualizará la barra de progreso de la canción y la barra del tiempo

// Lista de canciones con detalles (imagen, nombre, artista, archivo de música)
const music_list = [

    {
        img: 'imagen/emily.jpeg',
        name: 'Playlist',
        artist: 'The Emptiness Machine, Linkin Park',
        music: 'musica/The Emptiness Machine.mp3'
    },

    {
        img: 'imagen/chester.png',
        name: 'Playlist',
        artist: 'Given Up, Likin Park',
        music: 'musica/Given Up.mp3'
    },

    {
        img: 'imagen/fear.jpg',
        name: 'Playlist',
        artist: 'Fear, Pato Shourcair',
        music: 'musica/Fear.mp3'
    },

    {
        img: 'imagen/morenita.jpg',
        name: 'Playlist',
        artist: 'Mi morenita, Grupo Marca Registrada',
        music: 'musica/Mi Morenita.mp3'
    },

];

//Cargará la canción según el índice de la lista
loadTrack(track_index);

function loadTrack(track_index) {
    clearInterval(updateTimer);//Detiene cualquier barra de progreso activa
    reset();//Reinicia los valores visuales (tiempo y barra de progreso)

    curr_track.src = music_list[track_index].music;//Asigna la fuente de la canción
    curr_track.load();//Carga el archivo de música

    //Actualizará la imagen, nombre de la canción y nombre del artista
    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "cancion " + (track_index + 1) + " de " + music_list.length;

    //Establece un temporizador para actualizar el progreso de la pista actual a cada segundo
    updateTimer = setInterval(setUpdate, 1000);

    //indicará que cuando la canción termine, pase a la siguiente canción
    curr_track.addEventListener('ended', nextTrack);

    //Cambia el fondo a un color aleatorio
    random_bg_color();
}

//Genera colores de fondo aleatorios y luego los aplica a la página
function random_bg_color() {
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    //Función que generará un código hexadecimal aleatorio de 6 dígitos
    function populate(a) {
        for (let i = 0; i < 6; i++) {
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }

    //Genera dos colores aleatorios y crea un degradado al final
    let color1 = populate('#');
    let color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + color1 + ',' + color2 + ")";
    document.body.style.background = gradient;// Aplicará el resultado del degradado en nuestra página web
}

//Reiniciará la interfaz de usuario del reproductor
function reset() {
    curr_time.textContent = "00:00";//Reiniciará el tiempo actual
    total_duration.textContent = "00:00";//Reiniciará la duración total
    seek_slider.value = 0;//Reiniciará la barra de progreso
}

//Alterna el modo de reproducción aleatoria
function randomTrack() {
    isRandom ? pauseRandom() : playRandom;
}

//Función que activa la reproducción aleatoria
function playRandom() {
    isRandom = true;
    randomIcon.classList.add('randomActive');
}

//Función que desactiva la reproducción aleatoria
function pauseRandom() {
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}

//Repetirá la pista actual
function repeatTrack() {
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}

//Alternará entre reproducir y pausar la canción
function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

//Reproducirá la canción actual
function playTrack() {
    curr_track.play();//Reproduce la canción
    isPlaying = true;//Cambia el estado de reproducción a verdadero que indica que la canción debería de sonar
    track_art.classList.add('rotate');//Aplica la rotación a la imagen
    wave.classList.add('loader');//Activa el efecto de olas de líneas
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';//Cambia el icono a pausa
}

//Pausará la canción actual
function pauseTrack() {
    curr_track.pause();//pausa la canción
    isPlaying = false;//Cambiará el estado de reproducción a falso que indicá que se deberá pausar la canción
    track_art.classList.remove('rotate');//Detiene la rotación de la imagen
    wave.classList.remove('loader');//Desactiva el efecto de olas de líneas
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';//Cambia el icono a reproducir
}

//Pasa a la siguiente canción
function nextTrack() {
    if (track_index < music_list.length - 1 && isRandom == false) {
        track_index += 1;//Avanza a la siguiente canción (si no está en modo aleatorio)
    } else if (track_index < music_list.length - 1 && isRandom === true) {
        let random_index = Number.parseInt(Math.random() * music_list.length);//Selecciona una canción aleatoria
        track_index = random_index;
    } else {
        track_index = 0;//Si es la última canción, vuelve al inicio
    }
    loadTrack(track_index);//Carga la nueva canción
    playTrack();//La reproduce
}

//Pasa a la cacnción anterior
function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;//Retrocede a la cancion anterior
    } else {
        track_index = music_list.length - 1;//Si es la primera canción, volverá a la última
    }
    loadTrack(track_index);//Carga la carga la nueva canción
    playTrack();//La reproduce
}

//Permite avanzar de manera manual a una parte de la canción usando la barra de progreso
function seekTo() {
    let seekTo = curr_track.duration * (seek_slider.value / 100);//Calcula la posición que se desea
    curr_track.currentTime = seekTo;//Avanza la canción a esa posición
}

//Ajusta el volumen de la canción según el valor del control de volumen
function setVolume() {
    curr_track.volume = volume_slider.value / 100;//Establece el volumen
}

//Actualizará el tiempo actual de la canción y la barra de progreso
function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)) { //Verifica si la duración de la canción es válida
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);//Calcula el porcentaje de la canción completada
        seek_slider.value = seekPosition;//Actualizará la barra de progreso

        //Calcula los minutos y segundos actuales
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);

        //Calcula la duración total de la canción
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        //Añade un 0 si los segundos son menores a 10
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        //Actualiza el tiempo actual y la duración total en pantalla
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

