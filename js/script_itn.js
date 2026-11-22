/*
The MIT License (MIT) 
PARAN JARE RIKO

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const RADIO_NAME = 'Bintang Tenggara';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'https://stream.zeno.fm/kc67gypcxghtv';

// You can find the mount point in the Broadcast Settings.
// To generate the Zeno Radio API link from the mount point,
// exclude the '/source' part and append the remaining mount point to the base URL of the API.
// For example, if the mount point is 'yn65fsaurfhvv/source',
// the API link will be 'https://api.zeno.fm/mounts/metadata/subscribe/yn65fsaurfhvv'.

const url = 'https://api.zeno.fm/mounts/metadata/subscribe/kc67gypcxghtv';

// Variable to control history display: true = display / false = hides
let showHistory = true; 

window.onload = function () {
    var page = new Page;
    page.changeTitlePage();
    page.setVolume();

    var radioName = document.getElementById('radioName');
    if (radioName) radioName.textContent = RADIO_NAME;

    var player = new Player();
    player.play();

    // The music data currently being played arrives via SSE (connectToEventSource).
    // not via polling. The height of the cover is the responsibility of the CSS (aspect-ratio).

    localStorage.removeItem('musicHistory');
}

// Letter cache: stores the Promise itself (not just the result) so that
// two nearly simultaneous calls for the same song (SSE + polling)
// Reuse the same request instead of hammering the APIs again.
var lyricsCache = {};

function fetchLyrics(currentArtist, currentSong) {
    var cacheKey = (currentArtist + ' - ' + currentSong).toLowerCase();
    if (lyricsCache[cacheKey]) {
        return lyricsCache[cacheKey];
    }

    var promise = (async function () {
        // The Vagalume API has been discontinued â€” search on lyrics.ovh and,
        // if you don't find it, on LRCLIB (none require an API key).
        var lyric = null;
        try {
            var response = await fetch('https://api.lyrics.ovh/v1/' + encodeURIComponent(currentArtist) + '/' + encodeURIComponent(currentSong));
            var data = await response.json();
            if (data && data.lyrics) lyric = data.lyrics;
        } catch (error) {}

        if (!lyric) {
            try {
                var responseGet = await fetch('https://lrclib.net/api/get?artist_name=' + encodeURIComponent(currentArtist) + '&track_name=' + encodeURIComponent(currentSong));
                if (responseGet.ok) {
                    var dataGet = await responseGet.json();
                    lyric = dataGet.plainLyrics || dataGet.syncedLyrics || null;
                }
            } catch (error) {}
        }

        if (!lyric) {
            try {
                var responseSearch = await fetch('https://lrclib.net/api/search?track_name=' + encodeURIComponent(currentSong) + '&artist_name=' + encodeURIComponent(currentArtist));
                if (responseSearch.ok) {
                    var results = await responseSearch.json();
                    var hit = Array.isArray(results) && results.find(function (r) { return r.plainLyrics || r.syncedLyrics; });
                    if (hit) lyric = hit.plainLyrics || hit.syncedLyrics;
                }
            } catch (error) {}
        }

        return lyric;
    })();

    lyricsCache[cacheKey] = promise;
    return promise;
}

// DOM control
class Page {
    constructor() {
        this.changeTitlePage = function (title = RADIO_NAME) {
            document.title = title;
        };

        this.refreshCurrentSong = function (song, artist) {
            var currentSong = document.getElementById('currentSong');
            var currentArtist = document.getElementById('currentArtist');

            if (song !== currentSong.innerHTML) {
                // Animate transition
                currentSong.className = 'animated flipInY text-uppercase';
                currentSong.innerHTML = song;

                currentArtist.className = 'animated flipInY text-capitalize';
                currentArtist.innerHTML = artist;

                // Refresh modal title
                document.getElementById('lyricsSong').innerHTML = song + ' - ' + artist;

                // Remove animation classes
                setTimeout(function () {
                    currentSong.className = 'text-uppercase';
                    currentArtist.className = 'text-capitalize';
                }, 2000);
            }
        };

        // Function to update the cover image
        this.refreshCover = function (song = '', artist) {
        const Commercial_Break = 'https://warningfm.github.io/v3/img/podUnZj.png';
        const Bintang_Tenggara = 'https://cdn.bintangtenggarafm.com/img/rbtfm-640.png';
        const JINGLESETELAHIKLAN = 'https://live.staticflickr.com/65535/53804698952_be7cefe6cd_z.jpg';
        const TS = 'https://warningfm.github.io/v3/img/vAFxMxc.png';
        const Dengarkami = 'https://live.staticflickr.com/65535/55120669630_c789fc91c8.jpg';
        const JINGLE = 'https://lastfm.freetls.fastly.net/i/u/ar0/a25b0e8fa1772422c6ebb3dd61316df2.png';
        const TANDAWAKTUSHOLATDHUHUR = 'https://live.staticflickr.com/65535/53815587960_2ded7e8990_z.jpg';
        const ASHAR = 'https://live.staticflickr.com/65535/53808429057_45e11e4986_z.jpg';
        const ADZANMAGHRIB = 'https://i.scdn.co/image/ab67616d0000b273f9fc89132411c52d8c6bc537';
        const OpeningRadio = 'https://cdn.bintangtenggarafm.com/img/MJMi7Kc.png';
        const LAGUPENUTUPRADIO = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNEamewgAbyAZFYi_B0GkmXat8Z1aglWgubnf10D8etRJu2ZtJEt_fuk8EVhCVEolKvUl7Lqo8TQZmCilmGcCssvzzKn8LDg9e-mrvdbrRrzq3KSFx3e_4hN5jizPhyFBuFCmqvogZS99aGrfi6GrQMBd0l59bWk1THfsXR1-44zhIPuSMQV64kylXQ-YZ/s1600/penutupan.jpg';
        const Citizen = 'https://thumbs2.imgbox.com/b1/29/LxXCnvNr_t.jpg';
        const JELAJAHDESA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEju93kG2MbF4wulmf2HqIsNtbLeAh57ldbuKD6gRRM-DzUl-so8as-uaaUJzO_YaHWuVo7cLro1Ihp5LuyTsppRk_7Al2T7Om5CSUqiLlhkSYdL0QDajPjeIfW7jrPKzGe6D4_TKsj6BDoRYDlSYOAmIlcduoM3lQQFU4oThuM671dzfstZqQRH0G5K6QD2/s1600/Jelajahdesa.jpg';
        const WISATABUDAYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj76_ShbSLBp_jr_Og-mX5b-010-7qIIEPM3ZZeN84zyldmyMX2NS-yLfMPZLa46N7tBFwX8EKlwbUe-9wqU6U_0FO2jV54YFdV0AEvhW0r8jAa5YAE-5TCHgS-uB2HUVHHj0MN9P8xhg5jHAFY-3tMvD_u1BvHdUScYgev4ZcBSCrepzs_75lcKn4dAOdN/s1600/G8Qnr1y.jpg';
        const SHOLAWAT = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIpqY48J4bs8uxDW02DXU_87iAkbYboTn0pxJQ5p0wyoQKt4YYr7BnqczK2UhAcbHkeUyM2m-5IHhUD_jTvWts-7HPMgRU1s4ZJsstS-Kq74NNqHRgsdxkrUoEGhttVFPkCjjR_O766XT_r1WaC2kcUgwkAP9zWSXLzvocqlz-0Y8NU3ViCiC-T9Jfb5bz/s1600/Wf3SDEt.png';
        const RadioBintangTenggara = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLSPAs-qRbddzeii-poy3k5Tsz26fYDw8AFeK04iNOxM1HCD6zMOmi5i9bhK6FBGDree32YzCUhiThpyFYr5Cd9A4yiHlOH9MnYPlH3psMW_zzRL0I6yCuMuAA1RvFfGSJEsY0UY3kQjG8xUDSarEVEWBdFS046suoDe25Ar0K8izBvMwrJIZl-aJ_U_1I/s1600/fF8yUE0.png';
        const AlffyRev  = 'https://i.scdn.co/image/ab67616d0000b273d0572746e75788f3a073899b';
        const Ajeng = 'https://i.scdn.co/image/ab67616d0000b273f82c2fa93ef91d7cc86be1d2';
        const Agnes_Monica = 'https://i.scdn.co/image/ab6761610000e5eb09160e5ffdc256e65713a8a9';
        const INNA_Ft_Yandel = 'https://i1.sndcdn.com/artworks-000060831547-7emuqa-t500x500.jpg';
        const SOLUSI_SEHAT = 'https://images2.imgbox.com/f8/ca/GwuLQxLZ_o.jpg';
        const Ari_Lasso = 'https://i.scdn.co/image/ab6761610000e5eb4e1ed336c3ff93a95fa44e14';
        const Gracie_Abrams = 'https://i.scdn.co/image/ab67616d0000b2733be2b12525a2f506780901a3';
        const Andmesh = 'https://i1.sndcdn.com/artworks-000644192974-fr8aja-t500x500.jpg';
        const Dewa_19_Ft_Virzha = 'https://i.scdn.co/image/ab67616d0000b2734383e26d01a2dd18452b7b37';
        const Dewa_19_Ft_Ello = 'https://i.scdn.co/image/ab67616d0000b2730b591f8644a5a5106169a30a';
        const Libianca_Ft_Cian_Ducrot = 'https://i.scdn.co/image/ab67616d0000b273d14949518f0851b6d9e61eeb';
        const TRIAD = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9VTihL_Wl56YYsKExxz0JJk3GD8LS6roXDK7lz01orNPSLAOpUxVMdSOcKeI3LzUDHnhUFAgvfZmOyyeq-52UEqVkIaA9wzioIrgRvIP8cuCyywILD3-IVphe-VpLF4d6WMyH4jROrHICBlTTb1mMj20ezaD_Ue9GJ_nNOb3I4LsSCbIGNkmoxvvpv6Ov/s1600/2281e5d180adff9b.jpg';
        const Kotak = 'https://i.scdn.co/image/ab67616d0000b273db843f40730bee6fb77ecb13';
        const Kirana_Setio = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9c/43/2e/9c432e8e-15ec-e94f-35f3-8322ca48bab3/artwork.jpg/1200x1200bf-60.jpg';
        const Fadly_Ft_Natasha = 'https://i.scdn.co/image/ab67616d0000b2737022d4a537820482e1034044';
        const Alma_Esbeye = 'https://i.scdn.co/image/ab67616d0000b2739e7d30df02b301c12516ca65'; 
        const TAHUKAH_ANDA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlgtNm-H7v4NN3ibwE-_yLPhMVdetUfOUYL9x8YYs4QQRpzvo0emUq1OuaR-LMMAoNKeqJxHK4TFavoPS8GfxZyJdOpdnf0RPn5UlQ4kURFbcdMRr7sB37xM-Qb0QxzmDq65Eh9FkQHEM6US2Y8lOxZgIV_pyBdO3MTcIRDkal6xquL1Hi6-XwodtxAAOb/s1600/taukahAnda.jpg'; 
        const Alfina_Nindiyani  = 'https://i.scdn.co/image/ab67616d0000b273946b5d7310dc575af58ac613'; 
        const OPENING  = 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/grand-opening-design-template-3a37c804c55cf85d2ba959af479c656d_screen.jpg?ts=1575735007'; 
        const TS_MAGHRIB  = 'https://thumbs2.imgbox.com/ee/79/665Dlrr2_t.jpg';
        const Galang_Sanubari  = 'https://cdn.bintangtenggarafm.com/img/Galang_Sanubari.jpg';
        const Sarah_Sofyan  = 'https://cdn.bintangtenggarafm.com/img/Sarah_Sofyan.jpg';
        const Zefya_Rani  = 'https://cdn.bintangtenggarafm.com/img/Zefya_Rani.jpg';
        const Rima_Indah  = 'https://cdn.bintangtenggarafm.com/img/Rima_Indah.jpg';
        const Okki_Nila  = 'https://cdn.bintangtenggarafm.com/img/Okki_Nila.jpg';
        const Anita_Sumardi  = 'https://cdn.bintangtenggarafm.com/img/Anita_Sumardi.jpg';
        const Nurul_Hidayah  = 'https://cdn.bintangtenggarafm.com/img/Nurul_Hidayah.jpg';
        const CLOSING  = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvJpO-eAcjIJ4w2y6YQMxNpaB7FEO9Z_GqZUDsp97gEg3BtCVGePx0vX56MiTTpsnVpjm8xoUif8ifFQFYNcfcJihj-rWw-1ik3rhtU5hDJ1uyy184-w7U6Gmisnp58bcOFIeS9lxFEg7RI_VenietESGTzEgnz5TBkYH9WBvpD-aylJtfqfyqGwm93L1a/s1600/ms5QoI6.jpg'; 
        const Alda_Risma  = 'https://i.scdn.co/image/ab67616d0000b2734fd8f936305cb28b2bb53ab7'; 
        const PERISTIWA_HARI_INI  = 'https://cdn.bintangtenggarafm.com/img/nTZlhHe.jpg'; 
        const BMKG  = 'https://warningfm.github.io/v3/img/GtwFlOb.png'; 
        const Mayang_Sari  = 'https://i.scdn.co/image/ab67616d0000b2733deb71f184e845a821d500d6'; 
        const Samsons = 'https://images.genius.com/6ef0ad66be031798666d9f8e2305aca9.640x640x1.jpg'; 
        const TANDA_WAKTU_SHOLAT_ISYA = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzt-WdylfzOt4IZmb5vj6PbWsGNOGpV8YlrDTs7fejgDXPUhPI3BZ46RGlcEQGZJ9odFY0F6b9nNLHLHkXQRv8ihvehx7hIv6fz9gsclWh-gA22pMZuoVZNQvralLXFH6DLGAuAIWN400HhQkL3XmycIIopi0EZCT8TqTdhpFUYSMsFrz-jGhGOtluDwW3/s1600/uSKMZns.jpg'; 
        const Anisa_Rahman = 'https://i.scdn.co/image/ab67616d0000b273948e6ac1d0bc98d8269b9697'; 
        const Anggun = 'https://i.scdn.co/image/ab67616d0000b273068bcbbb986ad0ee76c02f76'; 
        const Power_Slaves = 'https://i.scdn.co/image/ab67616d0000b2733fd1e0089d0b10e143ea976f'; 
        const Second_Civil = 'https://i.scdn.co/image/ab67616d0000b2732f75cb4fe81408c68d9e847d'; 
        const Ismi_Azis = 'https://i.scdn.co/image/ab67616d0000b273835d5ee8832686e418f78e4f'; 
        const IKLAN = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3kvdmC7dAKO4NEBIHYqzIVCpCUjPipqTOwGJ-PZceBRYHQIhRI61imk6t2QXqJBBRsI4MYazWX1ecCGLery0jUwK9fkPpv7YQHKvE1W4OzRqHpal3VMsAvwl1pwYx28_-wP1KS9nq2EaR2E2qv3hw0k_mbfo9FagXNwhYNaOmZGRreSQwn2XsZ4FCyiw_/s1600/1200x1200iklan.jpg';
        const Station_Offline = 'https://cdn.bintangtenggarafm.com/img/offline.jpg'; 

        if (artist == 'Commercial Break') {var urlCoverArt = Commercial_Break;}
            else if (artist == 'Bintang Tenggara') {var urlCoverArt = Bintang_Tenggara;}
            else if (artist == 'JINGLE SETELAH IKLAN') {var urlCoverArt = JINGLESETELAHIKLAN;}
            else if (artist == 'TS') {var urlCoverArt = TS;}
            else if (artist == 'DENGAR KAMI') {var urlCoverArt = Dengarkami;}
            else if (artist == 'JINGLE') {var urlCoverArt = JINGLE;}
            else if (artist == 'TANDA WAKTU SHOLAT DHUHUR') {var urlCoverArt = TANDAWAKTUSHOLATDHUHUR;}
            else if (artist == 'TANDA WAKTU SHOLAT ASHAR') {var urlCoverArt = ASHAR;}
            else if (artist == 'ADZAN MAGHRIB') {var urlCoverArt = ADZANMAGHRIB;}
            else if (artist == 'Opening Radio') {var urlCoverArt = OpeningRadio;}
            else if (artist == 'LAGU PENUTUP RADIO') {var urlCoverArt = LAGUPENUTUPRADIO;}
            else if (artist == 'Citizen Journalism') {var urlCoverArt = Citizen;}
            else if (artist == 'JELAJAH DESA') {var urlCoverArt = JELAJAHDESA;}
            else if (artist == 'WISATA BUDAYA') {var urlCoverArt = WISATABUDAYA;}
            else if (artist == 'SHOLAWAT THIBBIL QULUB') {var urlCoverArt = SHOLAWAT;}
            else if (artist == 'Radio Bintang Tenggara') {var urlCoverArt = RadioBintangTenggara;}
            else if (artist == 'Alffy Rev') {var urlCoverArt = AlffyRev;}
            else if (artist == 'Ajeng') {var urlCoverArt = Ajeng;}
            else if (artist == 'Agnes Monica') {var urlCoverArt = Agnes_Monica;}
            else if (artist == 'INNA Ft Yandel') {var urlCoverArt = INNA_Ft_Yandel;}
            else if (artist == 'SOLUSI SEHAT') {var urlCoverArt = SOLUSI_SEHAT;}
            else if (artist == 'ARI LASSO') {var urlCoverArt = Ari_Lasso;}
            else if (artist == 'Gracie Abrams') {var urlCoverArt = Gracie_Abrams;}
            else if (artist == 'Andmesh') {var urlCoverArt = Andmesh;}
            else if (artist == 'Dewa 19 Ft Virzha') {var urlCoverArt = Dewa_19_Ft_Virzha;}
            else if (artist == 'Dewa 19 Ft Ello') {var urlCoverArt = Dewa_19_Ft_Ello;}
            else if (artist == 'Fadly Ft Natasha') {var urlCoverArt = Fadly_Ft_Natasha;}
            else if (artist == 'T.R.I.A.D') {var urlCoverArt = TRIAD;}
            else if (artist == 'Kotak') {var urlCoverArt = Kotak;}
            else if (artist == 'Kirana Setio') {var urlCoverArt = Kirana_Setio;}
            else if (artist == 'Alma Esbeye') {var urlCoverArt = Alma_Esbeye;} 
            else if (artist == 'TAHUKAH ANDA') {var urlCoverArt = TAHUKAH_ANDA;} 
            else if (artist == 'Alfina Nindiyani') {var urlCoverArt = Alfina_Nindiyani;} 
            else if (artist == 'OPENING') {var urlCoverArt = OPENING;} 
            else if (artist == 'TS MAGHRIB') {var urlCoverArt = TS_MAGHRIB;}
            else if (artist == 'GALANG SANUBARI') {var urlCoverArt = Galang_Sanubari;}
            else if (artist == 'SARAH SOFYAN') {var urlCoverArt = Sarah_Sofyan;}
            else if (artist == 'ZEFYA RANI') {var urlCoverArt = Zefya_Rani;}
            else if (artist == 'RIMA INDAH') {var urlCoverArt = Rima_Indah;}
            else if (artist == 'OKKI NILA') {var urlCoverArt = Okki_Nila;}
            else if (artist == 'ANITA SUMARDI') {var urlCoverArt = Anita_Sumardi;}
            else if (artist == 'NURUL HIDAYAH') {var urlCoverArt = Nurul_Hidayah;}
            else if (artist == 'CLOSING') {var urlCoverArt = CLOSING;}
            else if (artist == 'Alda Risma') {var urlCoverArt = Alda_Risma;}
            else if (artist == 'PERISTIWA HARI INI') {var urlCoverArt = PERISTIWA_HARI_INI;}
            else if (artist == 'BMKG') {var urlCoverArt = BMKG;}
            else if (artist == 'Mayang Sari') {var urlCoverArt = Mayang_Sari;}
            else if (artist == 'Samsons') {var urlCoverArt = Samsons;}
            else if (artist == 'TANDA WAKTU SHOLAT ISYA') {var urlCoverArt = TANDA_WAKTU_SHOLAT_ISYA;}
            else if (artist == 'Anisa Rahman') {var urlCoverArt = Anisa_Rahman;}
            else if (artist == 'Anggun') {var urlCoverArt = Anggun;}
            else if (artist == 'Power Slaves') {var urlCoverArt = Power_Slaves;}
            else if (artist == 'Second Civil') {var urlCoverArt = Second_Civil;}
            else if (artist == 'Ismi Azis') {var urlCoverArt = Ismi_Azis;}
            else if (artist == 'IKLAN') {var urlCoverArt = IKLAN;}
            else if (artist == 'Station Offline') {var urlCoverArt = Station_Offline;}
        else {var urlCoverArt = DEFAULT_COVER_ART;}

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var coverArt = document.getElementById('currentCoverArt');
            var coverBackground = document.getElementById('bgCover');

            // Get cover art URL on iTunes API
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artworkUrl100 = (data.resultCount) ? data.results[0].artworkUrl100 : urlCoverArt;

                // If it returns any data, changes the image resolution or sets the default
                urlCoverArt = (artworkUrl100 != urlCoverArt) ? artworkUrl100.replace('100x100bb', '1200x1200bb') : urlCoverArt;
                var urlCoverArt96 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '96x96bb') : urlCoverArt;
                var urlCoverArt128 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '128x128bb') : urlCoverArt;
                var urlCoverArt192 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '192x192bb') : urlCoverArt;
                var urlCoverArt256 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '256x256bb') : urlCoverArt;
                var urlCoverArt384 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '384x384bb') : urlCoverArt;

                coverArt.style.backgroundImage = 'url(' + urlCoverArt + ')';
                coverArt.className = 'animated bounceInLeft';

                coverBackground.style.backgroundImage = 'url(' + urlCoverArt + ')';

                setTimeout(function () {
                    coverArt.className = '';
                }, 2000);

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song,
                        artist: artist,
                        artwork: [{
                                src: urlCoverArt96,
                                sizes: '96x96',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt128,
                                sizes: '128x128',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt192,
                                sizes: '192x192',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt256,
                                sizes: '256x256',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt384,
                                sizes: '384x384',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '512x512',
                                type: 'image/png'
                            }
                        ]
                    });
                }
            }
        }
        xhttp.open('GET', 'https://itunes.apple.com/search?term=' + artist + ' ' + song + '&media=music&limit=1', true);
        xhttp.send();
        }


        this.changeVolumeIndicator = function (volume) {
            document.getElementById('volIndicator').innerHTML = volume;

            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem('volume', volume);
            }
        };

        this.setVolume = function () {
            if (typeof (Storage) !== 'undefined') {
                var volumeLocalStorage = (!localStorage.getItem('volume')) ? 80 : localStorage.getItem('volume');
                document.getElementById('volume').value = volumeLocalStorage;
                document.getElementById('volIndicator').innerHTML = volumeLocalStorage;
            }
        };

        this.refreshLyric = async function (currentSong, currentArtist) {
            var lyric = await fetchLyrics(currentArtist, currentSong);

            var openLyric = document.getElementsByClassName('lyrics')[0];
            if (lyric) {
                document.getElementById('lyric').innerHTML = lyric.replace(/\n/g, '<br />');
                openLyric.style.opacity = "1";
                openLyric.setAttribute('data-toggle', 'modal');
            } else {
                openLyric.style.opacity = "0.3";
                openLyric.removeAttribute('data-toggle');

                var modalLyric = document.getElementById('modalLyrics');
                modalLyric.style.display = "none";
                modalLyric.setAttribute('aria-hidden', 'true');
                (document.getElementsByClassName('modal-backdrop')[0]) ? document.getElementsByClassName('modal-backdrop')[0].remove() : '';
            }
        };
    }
}

// Global variable to store the songs
var audio = new Audio(URL_STREAMING);

// Player control
class Player {
    constructor() {
        this.play = function () {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                // Autoplay blocked by the browser until the first interaction:
                // It's not an error; the user starts playback manually.
                playPromise.catch(function () {});
            }

            var defaultVolume = document.getElementById('volume').value;

            if (typeof (Storage) !== 'undefined') {
                if (localStorage.getItem('volume') !== null) {
                    audio.volume = intToDecimal(localStorage.getItem('volume'));
                } else {
                    audio.volume = intToDecimal(defaultVolume);
                }
            } else {
                audio.volume = intToDecimal(defaultVolume);
            }
            document.getElementById('volIndicator').innerHTML = defaultVolume;
        };

        this.pause = function () {
            audio.pause();
        };
    }
}

function setPlayerIcon(iconClass, label) {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    botao.className = iconClass;
    bplay.firstChild.data = label;
}

// On play, change the button to pause
audio.onplay = function () {
    setPlayerIcon('fa fa-pause', 'PAUSE');
}

// On pause, change the button to play (a menos que estejamos exibindo o
// spinner de reconexÃ£o, que tambÃ©m pausa o Ã¡udio momentaneamente)
audio.onpause = function () {
    if (!isIntentionalPause && reconnectAttempts > 0) return;
    setPlayerIcon('fa fa-play', 'PLAY');
}

// Enquanto o Ã¡udio estiver em buffer, mostra o spinner girando
audio.addEventListener('waiting', function () {
    if (!audio.paused) setPlayerIcon('fa fa-spinner fa-spin', 'CARREGANDO');
});

// Ãudio voltou a fluir de verdade: reseta as tentativas de reconexÃ£o e
// habilita o watchdog (a partir daqui uma queda deve reconectar sozinha)
audio.addEventListener('playing', function () {
    isIntentionalPause = false;
    reconnectAttempts = 0;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    setPlayerIcon('fa fa-pause', 'PAUSE');
});

// Unmute when volume changed
audio.onvolumechange = function () {
    if (audio.volume > 0) {
        audio.muted = false;
    }
}

// Automatic reconnection (unstable network) before bothering the user with the
// "Stream Down" confirm() â€” only appears if 5 consecutive attempts fail.
// It starts as *true*: before the first actual playback, there is nothing to reconnect.
// (e.g., a stream going offline while loading should not trigger a loop or a confirmation prompt).
let isIntentionalPause = true;
let reconnectAttempts = 0;
let reconnectTimeout = null;

function handleConnectionDrop() {
    if (isIntentionalPause) return;

    if (reconnectTimeout) clearTimeout(reconnectTimeout);

    if (reconnectAttempts < 5) {
        reconnectAttempts++;
        setPlayerIcon('fa fa-spinner fa-spin', 'RECONECTANDO');
        var delay = reconnectAttempts * 2000;

        reconnectTimeout = setTimeout(function () {
            audio.load();
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(function (e) { console.error('Falha ao reconectar:', e); });
            }
        }, delay);
    } else {
        reconnectAttempts = 0;
        setPlayerIcon('fa fa-play', 'PLAY');

        var confirmacao = confirm('Stream Down / Network Error. \nClick OK to try again.');
        if (confirmacao) {
            window.location.reload();
        }
    }
}

audio.onerror = handleConnectionDrop;
audio.addEventListener('stalled', handleConnectionDrop);

// Smooth volume fade when playing/pausing to avoid audio "popping."
let fadeInterval = null;

function fadeOut(callback) {
    if (fadeInterval) clearInterval(fadeInterval);
    var currentVol = audio.volume;
    var step = currentVol / 15;

    fadeInterval = setInterval(function () {
        currentVol -= step;
        if (currentVol <= 0.05) {
            audio.volume = 0;
            clearInterval(fadeInterval);
            fadeInterval = null;
            if (callback) callback();
        } else {
            audio.volume = currentVol;
        }
    }, 30);
}

function fadeIn() {
    if (fadeInterval) clearInterval(fadeInterval);
    var targetVol = intToDecimal(localStorage.getItem('volume') || document.getElementById('volume').value || 80);
    audio.volume = 0;
    var step = targetVol / 15;

    fadeInterval = setInterval(function () {
        var newVol = audio.volume + step;
        if (newVol >= targetVol) {
            audio.volume = targetVol;
            clearInterval(fadeInterval);
            fadeInterval = null;
        } else {
            audio.volume = newVol;
        }
    }, 30);
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}

function togglePlay() {
    if (!audio.paused) {
        isIntentionalPause = true;
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        fadeOut(function () {
            audio.pause();
        });
    } else {
        isIntentionalPause = false;
        fadeIn();
        audio.load();
        audio.play();
    }
}

function volumeUp() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0 && audio.volume < 1) {
            audio.volume = (vol + .01).toFixed(2);
        }
    }
}

function volumeDown() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0.01 && audio.volume <= 1) {
            audio.volume = (vol - .01).toFixed(2);
        }
    }
}

function mute() {
    if (!audio.muted) {
        document.getElementById('volIndicator').innerHTML = 0;
        document.getElementById('volume').value = 0;
        audio.volume = 0;
        audio.muted = true;
    } else {
        var localVolume = localStorage.getItem('volume');
        document.getElementById('volIndicator').innerHTML = localVolume;
        document.getElementById('volume').value = localVolume;
        audio.volume = intToDecimal(localVolume);
        audio.muted = false;
    }
}

// Function to handle event connections
function connectToEventSource(url) {
    // Create a new EventSource instance with the provided URL.
    const eventSource = new EventSource(url);

    // Add a listener for the 'message' event
    eventSource.addEventListener('message', function(event) {
        // Call the function to process the received data, passing the URL as well.
        processData(event.data, url);
    });

    // Add a listener for the 'error' event
    eventSource.addEventListener('error', function(event) {
        console.error('Erro na conexÃ£o de eventos:', event);
        // Try to reconnect after a period of time
        setTimeout(function() {
            connectToEventSource(url);
        }, 1000);
    });
}

// Function to process the received data
function processData(data) {
    // Parse JSON
    const parsedData = JSON.parse(data);
    
    // Check if the message is about the song.
    if (parsedData.streamTitle) {
        // Extract the song title and the artist
        let artist, song;
        const streamTitle = parsedData.streamTitle;

        if (streamTitle.includes('-')) {
            [artist, song] = streamTitle.split(' - ');
        } else {
            // If there is no "-" in the string, we consider the title to be just the song name.
            artist = '';
            song = streamTitle;
        }

        // Create the object with the formatted data.
        const formattedData = {
            currentSong: song.trim(),
            currentArtist: artist.trim()
        };

        // Convert the object to JSON
        const jsonData = JSON.stringify(formattedData);

        // Call the getStreamingData function with the formatted data and the URL.
        getStreamingData(jsonData);
    } else {
        console.log('Mensagem recebida:', parsedData);
    }
}

// Initiate the connection to the API
connectToEventSource(url);

// Defines the Deezer API response handling function in the global scope.
// JSONP only passes `data` â€” the current title/artist come from the DOM.
function handleDeezerResponse(data) {
    var coverArt = document.getElementById('currentCoverArt');
    var coverBackground = document.getElementById('bgCover');

    var hasResult = data && data.data && data.data.length > 0;
    // Search for the cover art by song title (artist.picture_big would search by artist)
    var artworkUrl = hasResult ? data.data[0].album.cover_big : 'https://cdn.bintangtenggarafm.com/img/rbtfm-640.png';

    coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
    coverArt.className = 'animated bounceInLeft';
    coverBackground.style.backgroundImage = 'url(' + artworkUrl + ')';

    setTimeout(function () {
        coverArt.className = '';
    }, 2000);

    if ('mediaSession' in navigator) {
        var songTitle = document.getElementById('currentSong').textContent;
        // O ICY Ã© lei: o Deezer sÃ³ fornece a capa â€” o artista exibido (na
        // tela e na tela de bloqueio) Ã© sempre o que a rÃ¡dio transmitiu
        var artistName = document.getElementById('currentArtist').textContent;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: artistName,
            artwork: ['96x96', '128x128', '192x192', '256x256', '384x384', '512x512'].map(function (size) {
                return { src: artworkUrl, sizes: size, type: 'image/png' };
            })
        });
    }
}

function getStreamingData(data) {

    console.log("ConteÃºdo dos dados recebidos:", data);
    // Parse JSON
    var jsonData = JSON.parse(data);

    var page = new Page();

    // Format characters as UTF-8
    let song = jsonData.currentSong.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
    let artist = jsonData.currentArtist.replace(/&apos;/g, '\'').replace(/&amp;/g, '&');

    // Change the title
    document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

    page.refreshCover(song, artist);
    page.refreshCurrentSong(song, artist);
    page.refreshLyric(song, artist);

    if (showHistory) {

        // Check if the song is different from the last updated one.
        if (musicHistory.length === 0 || (musicHistory[0].song !== song)) {
            // Update the history with the new song
            updateMusicHistory(artist, song);
        }

        // Update the history interface
        updateHistoryUI();

    }
}

function updateHistoryUI() {
    let historicElement = document.querySelector('.historic');
    if (showHistory) {
      historicElement.classList.remove('hidden'); // Show history
    } else {
      historicElement.classList.add('hidden'); // Hide history
    }
}

// Global variable to store the history of the last two songs
var musicHistory = [];

// Function to update the history of the last two songs
function updateMusicHistory(artist, song) {
    // Adicionar a nova mÃºsica no inÃ­cio do histÃ³rico
    musicHistory.unshift({ artist: artist, song: song });

    // Keep only the last two songs in the history
    if (musicHistory.length > 4) {
        musicHistory.pop(); // Remove a mÃºsica mais antiga do histÃ³rico
    }

    // Call the function to display the updated history.
    displayHistory();
}


function displayHistory() {
    var $historicDiv = document.querySelectorAll('#historicSong article');
    var $songName = document.querySelectorAll('#historicSong article .music-info .song');
    var $artistName = document.querySelectorAll('#historicSong article .music-info .artist');

    // Display the last two songs in the history, starting from index 1 to exclude the current song
    for (var i = 1; i < musicHistory.length && i < 3; i++) {
        $songName[i - 1].innerHTML = musicHistory[i].song;
        $artistName[i - 1].innerHTML = musicHistory[i].artist;

        // Call the function to fetch the song cover art from the Deezer API.
        refreshCoverForHistory(musicHistory[i].song, musicHistory[i].artist, i - 1);

        // Adicionar classe para animaÃ§Ã£o
        $historicDiv[i - 1].classList.add('animated');
        $historicDiv[i - 1].classList.add('slideInRight');
    }

    // Remover classes de animaÃ§Ã£o apÃ³s 2 segundos
    setTimeout(function () {
        for (var j = 0; j < 2; j++) {
            $historicDiv[j].classList.remove('animated');
            $historicDiv[j].classList.remove('slideInRight');
        }
    }, 2000);
}

// Function to update the song cover in the history
function refreshCoverForHistory(song, artist, index) {
    // CriaÃ§Ã£o da tag de script para fazer a requisiÃ§Ã£o JSONP Ã  API do Deezer
    const script = document.createElement('script');
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(song)}&output=jsonp&callback=handleDeezerResponseForHistory_${index}`;
    document.body.appendChild(script);

    // Function to handle the Deezer API response for the song history.
    window['handleDeezerResponseForHistory_' + index] = function (data) {
        if (data.data && data.data.length > 0) {
            // Atualizar a capa pelo nome do artista
            // var artworkUrl = data.data[0].artist.picture_big;
            // Atualizar a capa pelo nome da mÃºsica
            var artworkUrl = data.data[0].album.cover_big;
            // Atualizar a capa da mÃºsica no histÃ³rico usando o Ã­ndice correto
            var $coverArt = document.querySelectorAll('#historicSong article .cover-historic')[index];
            $coverArt.style.backgroundImage = 'url(' + artworkUrl + ')';
        }
    };
}


document.addEventListener('keydown', function (event) {
    var key = event.key;
    var slideVolume = document.getElementById('volume');
    var page = new Page();

    switch (key) {
        // Arrow up
        case 'ArrowUp':
            volumeUp();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Arrow down
        case 'ArrowDown':
            volumeDown();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Spacebar (preventDefault prevents page scrolling along)
        case ' ':
        case 'Spacebar':
            event.preventDefault();
            togglePlay();
            break;
        // P
        case 'p':
        case 'P':
            togglePlay();
            break;
        // M
        case 'm':
        case 'M':
            mute();
            break;
        // Numeric keys 0-9
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            var volumeValue = parseInt(key);
            audio.volume = volumeValue / 10;
            slideVolume.value = volumeValue * 10;
            page.changeVolumeIndicator(volumeValue * 10);
            break;
    }
});


function intToDecimal(vol) {
    return vol / 100;
}

function decimalToInt(vol) {
    return vol * 100;
}

// Install as PWA button: only appears when the browser indicates that the
// Installation is available (manifest + service worker already registered).
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    var installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.hidden = false;
});

document.addEventListener('DOMContentLoaded', function () {
    var installBtn = document.getElementById('installPwaBtn');
    if (!installBtn) return;

    installBtn.addEventListener('click', function () {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function () {
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
    });

    window.addEventListener('appinstalled', function () {
        installBtn.hidden = true;
    });
});
