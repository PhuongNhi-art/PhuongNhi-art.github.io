const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE = 'Life-music';
const songName = $('.player-left__info .player-left__info-name');
const songArtist = $('.player-left__info .player-left__info-desc');
const songImage = $('.player-left__info-img');
const songAudio = $('.player-center__timeline #audio');
const player = $('.player');
const playBtn = $('.play-center__toggle-play');
const progress = $('#progress');
const cdThumb = $('.player-left__info-img');
const btnNext= $('.player-center__next');
const btnPrev = $('.player-center__prev');
const btnRepeat = $('.player-center__repeat')
const btnRandom = $('.player-center__random');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:  JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config));
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    songs: [
        {
            name: "Kill This Love",
            singer: "BlackPink",
            path: "./assets/mp3/KillThisLove-BLACKPINK-6291967.mp3",
            image: "./assets/img/kill-this-love.jpg"
        },
        {
            name: "Don'T Know What To Do",
            singer: "BlackPink",
            path: "./assets/mp3/DonTKnowWhatToDo-BLACKPINK-6291963.mp3",
            image:
                "./assets/img/dont-know-what-to-do.jpg"
        },
        {
            name: "Kick It",
            singer: "BlackPink",
            path:
                "./assets/mp3/KickIt-BLACKPINK-6291964.mp3",
            image: "./assets/img/kick-it.jpg"
        },
        {
            name: "Hope Not ",
            singer: "BlackPink",
            path: "./assets/mp3/HopeNot-BLACKPINK-6291965.mp3",
            image:
                "./assets/img/hope-not.jfif"
        },
        {
            name: "Ddu-Du Ddu-Du (Remix Version) ",
            singer: "BlackPink",
            path: "./assets/mp3/DduduDduduRemixVersion-BLACKPINK-6291966.mp3",
            image:
                "./assets/img/Ddu-ddu.png"
        },

        
    ],
    render: function () {
        // var i = 0;
        const htmls = this.songs.map((song,index) => {
            // i++;
            return `
            <tr class='song ${index===this.currentIndex ? 'active':''}' data-index='${index}'>
                            <th scope="row">
                                <span class="table-item__count">${index+1}</span>
                                <i class="table-item__icon-play fa-solid fa-play"></i>
                            </th>
                            <td class="table-item ${index===this.currentIndex ? 'active':''}">
                                <img class="table-item__img" src="${song.image}" alt="">
                                <div class="table-item__title text-left">
                                    <span class="table-item__title-name">${song.name}</span>
                                    <div class="table-item__title-artist">${song.singer}</div>
                                </div>
                            </td>
                            <td>Otto</td>
                            <td>
                                <div class="item">
                                    <i class="table-item__icon-left fa-regular fa-heart"></i>
                                    <span>2:11</span>
                                    <i class="table-item__icon-right fa-solid fa-ellipsis"></i>
                                </div>
                               
                            </td>
                          </tr>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    //định nghĩa các thuộc tính cho object 
    defineProperties: function () {
        //define currentSong -> getter
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
        
    },
    //Xử lý sự kiện dom
    handleEvent: function () {
        const _this = this;

        
        //xử lý quay hoặc dừng
        // console.log(cdThumb);
        const cdThumbAnimate = cdThumb.animate([
            {transform:  'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        }//10 giay
        )
        // cdThumbAnimate.pause();

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }   
            else {
                
                audio.play();
               
            }
        }
        //khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
                
                player.classList.add('playing');
                cdThumbAnimate.play();
        }
        audio.onpause = function(){
            _this.isPlaying = false;
            
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration*100);
                progress.value = progressPercent;

            }
        }
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        //Khi next bài
        btnNext.onclick = function(e) {
            _this.nextSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        },
        btnPrev.onclick = function(e) {
            _this.prevSong();
            audio.play();
            _this.render();
        }
        btnRandom.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        },
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }
        audio.onended = function() {
            console.log(_this.isRandom);
            if (_this.isRandom) {
                _this.playRandomSong();
                audio.play();
                _this.render(); 
            } else if (_this.isRepeat){
               audio.play();
            }
            else {
                _this.nextSong();
            }
        }
        //lắng nghe click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
           if (songNode) {
               _this.currentIndex = Number(songNode.dataset.index);
               _this.loadCurrentSong();
               audio.play();
               _this.render();
           }
           

        }
    },
    scrollToActiveSong: function() {
        setTimeout(()=> {
            $('tr.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },500);
    },
    loadCurrentSong: function () {

        songName.textContent = this.currentSong.name;
        songArtist.textContent = this.currentSong.singer;
        songImage.src = this.currentSong.image;
        songAudio.src = this.currentSong.path;

    },
    nextSong: function() {
        
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
        
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        console.log(this);
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        console.log(newIndex)
        this.currentIndex = newIndex;
        
        this.loadCurrentSong();
    },
    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        //render playlist
        this.render();

        //hiển thị trạng thái ban đầu của button
        // console.log(btnRandom)
        // console.log(btnRandom,this.isRandom)
        // btnRandom.classList.toggle('active', this.isRandom);
        
        // btnRepeat.classList.toggle('active', this.isRepeat);
    }

}
app.start();