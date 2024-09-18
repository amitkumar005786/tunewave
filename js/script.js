let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds as two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    // console.log(`${folder}`);

    currFolder = folder;
    // let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let a = await fetch(`/${folder}/`);
    // console.log(a);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(tds);

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }





    // show all the songs in the playlist

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // console.log(songUL);

    songUL.innerHTML = ''

    for (const song of songs) {
        // let songlist = song;
        // songlist.replaceAll("%20", "")
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                       <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${decodeURI(song)}</div>
                                <div>song artist</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                        </li>`
        // console.log(songUL);

    }

    // Attach an addEventListener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            // let music = e.querySelector(".info").firstElementChild.innerHTML;
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })

    return songs;

}


// ---- playmusic-------

const playmusic = (track, pause = false) => {
    // console.log("music:,", track);
    // let audio = new Audio(/songs/+music);


    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        // console.log(audio);
        currentSong.play();
        play.src = "images/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"



};


async function displayAlbums() {
    // let a = await fetch(`http://127.0.0.1:5500/spotify_Clone/songs/`);
    let a = await fetch(`/spotify_Clone/songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div);
    let anchors = div.getElementsByTagName('a')
    let cardContainer = document.querySelector(".cardContainer")
    // console.log(anchors);

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        // console.log(e.href);  

        // if (e.href.includes('/spotify_Clone/songs')) {
        if (e.href.includes('/spotify_Clone/songs/') && !e.href.includes(".htaccess")) {
            // if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            // console.log(e.href);
            // console.log(e.href.split("/").slice("-1")[0]);
            let folder = e.href.split("/").slice("-1")[0];

            // get the metadata of the folder

            let a = await fetch(`/spotify_Clone/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `
             <div class="card" data-folder="${folder}">
                        <div class="play">

                            <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                                <!-- Rounded green background -->
                                <rect fill="green" />

                                <!-- Original play button icon -->
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1"
                                    stroke-linejoin="round" />
                            </svg>

                        </div>
                        <img src="/spotify_Clone/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }

    // load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`spotify_Clone/songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })

}




async function main() {

    // get the list of all the songs
    await getSongs("spotify_Clone/songs/ncs")
    playmusic(songs[0], true)

    // Display all the albam
    displayAlbums()


    // Attach eventlistner next and previous
    play.addEventListener('click', () => {
        console.log(play);

        if (currentSong.paused) {
            currentSong.play();
            // console.log(currentSong.play());
            play.src = "images/pause.svg"

        } else {
            currentSong.pause();
            play.src = "images/play.svg"
        }

    })


    // listen for timeupdate of current song
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        // Example usage:
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;

        // for range or seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add an eventlistener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // addEventListener for  hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // addEventListener for  close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


    //add enentlistner prev and next

    previous.addEventListener("click", () => {
        // console.log("cl");
        console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0])
        console.log(index);

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
        //currentSong.src.split("/").slice("-1")[0]
        // console.log(songs);


    })

    next.addEventListener("click", () => {
        console.log("cl");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0])
        console.log(index);

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }

    })


    // add an event listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        // Set the volume (range is 0.0 to 1.0)
        currentSong.volume = parseInt(e.target.value) / 100; // 50% volume

    })

    //



}

main()


//add event listner to mute the track

document.querySelector(".volume img").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("images/volume.svg")) {
        e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
        currentSong.volume = 0
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    }
    else {
        e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
        currentSong.volume = .1
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
    }
})



