

let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    // Check if the input is a valid number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Round seconds to nearest integer
    var totalSeconds = Math.round(seconds);

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(totalSeconds / 60);
    var remainingSeconds = totalSeconds % 60;

    // Add leading zero if needed
    var minutesStr = (minutes < 10 ? '0' : '') + minutes;
    var secondsStr = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return minutesStr + ':' + secondsStr;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    
        // Play the first song
    }
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
        <img class="invert" src="img/music.svg" alt="" >
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Honey</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class = "invert" src="img/play.svg" alt="">

        </div></li>`;
        
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs
}



const playMusic=(track,pause=false)=>{
    let audio=new Audio(`/${currFolder}/`+track)
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="img/pause.svg"
    }
    // currentSong.play()

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs`)
    let response=await a.text()
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            
            
            if (e.href.includes("http://127.0.0.1:3000/songs") && !e.href.includes(".htaccess")){
                
                let folder=e.href.split("/").slice(-2)[0]
                // Get the metadata of the folder
                let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
                let response=await a.json()
                cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                <div class="play">
                
                <svg xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true"
                viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE"
                style="fill: black; width: 30px; height: 30px;">
                <path
                d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                </path>
                </svg>
                
                </div>
                <img src="http://127.0.0.1:3000/songs/${folder}/cover.jpeg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>`
                
                
        }
    }
        // Load the playlist when card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item=>{
                
                songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
            })
        })
}

async function main(){
// get list of all the songs

    await getSongs("songs/2Karan_Aujla")
    playMusic(songs[0],true)

// Display all the albums on the page
    displayAlbums()

    

    // Attach an event listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    // Add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })
    

    // Add event for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
        
    })
}
    // Add event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"

    })

    // Add event listener for previous song

    previous.addEventListener("click",()=>{
       
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     
        if((index-1)>=0){
            playMusic(songs[index+1])
        }
    })
    
    // Add event listener for next song shakk hai ispar
    
    next.addEventListener("click",()=>{
     
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }

    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting volume to",e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }

        

    })
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume= 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value=10

        }
    })



main()

// 1:39:35