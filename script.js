document.addEventListener('DOMContentLoaded', function() {
    // ========== CONFIGURAÇÃO DE ELEMENTOS ========== //
    // Elementos do player
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const volumeBar = document.querySelector('.volume-bar');
    const musicTitle = document.querySelector('.music-title');
    const musicArtist = document.querySelector('.music-artist');
    const mediaContainer = document.querySelector('.media-container');
    const imageBanner = document.querySelector('.music-banner');
    const videoBanner = document.querySelector('.video-banner');

    // Elementos do modal
    const infoBtn = document.querySelector('.info-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const welcomeModal = document.querySelector('.welcome-modal');

    // ========== LISTA DE MÚSICAS ========== //
    const songs = [{
            title: "Vencedor",
            artist: "MC Kevin",
            media: {
                type: "video",
                source: "assets/media/music0.mp4"
            },
            src: "assets/music/music0.mp4"
        },
        {
            title: "Magnólia",
            artist: "Playboi Carti",
            media: {
                type: "image",
                source: "assets/images/music1.jpg"
            },
            src: "assets/music/song1.mp4"
        },
        {
            title: "Falling Down",
            artist: "XXXTENTACION",
            media: {
                type: "image",
                source: "assets/images/music2.jpg"
            },
            src: "assets/music/song2.mp4"
        },
            {
            title: "Lil Peep",
            artist: "nuts",
            media: {
                type: "image",
                source: "assets/images/music3.jpg"
            },
            src: "assets/music/song3.mp4"
        }
    ];

    // ========== VARIÁVEIS GLOBAIS ========== //
    let currentSongIndex = 0;
    const audio = new Audio();
    let isPlaying = false;
    let audioInitialized = false;

    // ========== FUNÇÕES DE INICIALIZAÇÃO ========== //
    function initializeSite() {
        loadProfileMedia();
        setupEventListeners();

        // Mostra modal de boas-vindas se for a primeira visita
        if (welcomeModal && !sessionStorage.getItem('welcomeShown')) {
            welcomeModal.classList.add('active');
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }

    function loadProfileMedia() {
        // Carrega banner do perfil
        const profileBanner = document.querySelector('.profile-banner');
        if (profileBanner) {
            profileBanner.style.backgroundImage = "url('assets/images/profile-banner.jpg')";
        }

        // Carrega foto de perfil
        const profilePic = document.querySelector('.profile-pic');
        if (profilePic) {
            profilePic.style.backgroundImage = "url('assets/images/profile-pic.jpg')";
        }
    }

    // ========== FUNÇÕES DO PLAYER ========== //
    function initAudioOnInteraction() {
        if (!audioInitialized) {
            audioInitialized = true;
            loadSong(songs[currentSongIndex]);
            audio.volume = volumeBar ? volumeBar.value / 100 : 0.8;

            if (welcomeModal) {
                welcomeModal.classList.remove('active');
            }

            playSong().catch(e => console.log("Autoplay bloqueado:", e));
        }
    }

    function loadSong(song) {
        if (musicTitle) musicTitle.textContent = song.title;
        if (musicArtist) musicArtist.textContent = song.artist;
        loadMedia(song);
        audio.src = song.src;

        if (isPlaying) {
            audio.play().catch(e => console.log("Erro ao tocar música:", e));
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    function loadMedia(song) {
        if (!mediaContainer || !imageBanner || !videoBanner) return;

        // Pausa vídeo atual se estiver tocando
        if (videoBanner.src) {
            videoBanner.pause();
            videoBanner.currentTime = 0;
        }

        if (song.media.type === "video") {
            // Configura o vídeo
            videoBanner.src = song.media.source;
            videoBanner.style.display = "block";
            imageBanner.style.display = "none";

            // Tenta reproduzir o vídeo
            videoBanner.play().catch(e => {
                console.log("Autoplay de vídeo bloqueado:", e);
                showImageFallback();
            });
        } else {
            // Configura a imagem
            imageBanner.style.backgroundImage = `url('${song.media.source}')`;
            imageBanner.style.display = "block";
            videoBanner.style.display = "none";
            videoBanner.src = "";
        }

        function showImageFallback() {
            imageBanner.style.backgroundImage = "url('assets/images/default-banner.jpg')";
            imageBanner.style.display = "block";
            videoBanner.style.display = "none";
        }
    }

    async function playSong() {
        try {
            await audio.play();
            isPlaying = true;
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } catch (e) {
            console.log("Erro ao tocar música:", e);
        }
    }

    function pauseSong() {
        isPlaying = false;
        audio.pause();
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function updateProgressBar() {
        if (!progressBar) return;
        const {
            duration,
            currentTime
        } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
        }
    }

    function setProgress(e) {
        if (!progressBar) return;
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    }

    function setVolume() {
        audio.volume = this.value / 100;
    }

    // ========== CONFIGURAÇÃO DE EVENTOS ========== //
    function setupEventListeners() {
        // Evento de inicialização
        document.addEventListener('click', initAudioOnInteraction, {
            once: true
        });

        // Controles do player
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (audioInitialized) {
                    isPlaying ? pauseSong() : playSong();
                } else {
                    initAudioOnInteraction();
                }
            });
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSong);
        if (prevBtn) prevBtn.addEventListener('click', prevSong);

        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('ended', nextSong);

        if (progressBar) progressBar.addEventListener('click', setProgress);
        if (volumeBar) volumeBar.addEventListener('input', setVolume);

        // Modais
        if (infoBtn && modalOverlay) {
            infoBtn.addEventListener('click', () => {
                modalOverlay.classList.add('active');
            });
        }

        if (modalCloseBtn && modalOverlay) {
            modalCloseBtn.addEventListener('click', () => {
                modalOverlay.classList.add('closing');
                setTimeout(() => {
                    modalOverlay.classList.remove('active', 'closing');
                }, 500);
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.add('closing');
                    setTimeout(() => {
                        modalOverlay.classList.remove('active', 'closing');
                    }, 500);
                }
            });
        }

        if (welcomeModal) {
            welcomeModal.addEventListener('click', () => {
                welcomeModal.classList.remove('active');
                initAudioOnInteraction();
            });
        }

        // Efeito 3D nos cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const x = e.clientX - card.getBoundingClientRect().left;
                const y = e.clientY - card.getBoundingClientRect().top;

                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;

                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // Botões "Ver mais"
        document.querySelectorAll('.item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank');
                }
            });
        });
    }

    // ========== INICIALIZAÇÃO DO SITE ========== //
    initializeSite();

});

const titles = ["</>", "!P", "!Pi", "!Pin", "!Pino",];
let index = 0;
setInterval(function() {
    document.title = titles[index];
    index = (index + 1) % titles.length;
}, 300);
