"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const phoneArea =
    document.getElementById("phoneArea");


const phoneImage =
    document.getElementById("phoneImage");


const appWindow =
    document.getElementById("appWindow");


const appTitle =
    document.getElementById("appTitle");


const appContent =
    document.getElementById("appContent");


const closeApp =
    document.getElementById("closeApp");


const pageIndicator =
    document.getElementById("pageIndicator");


/* =========================================================
   EXACT FILE NAMES
   ========================================================= */

const PAGE_1 =
    "pearphone.png";


const PAGE_2 =
    "pearphonepage2.png";


const SLAP =
    "theslap.png";


/* =========================================================
   CURRENT SCREEN
   ========================================================= */

let currentScreen = "page1";


/* =========================================================
   SWIPE VARIABLES
   ========================================================= */

let startX = 0;

let startY = 0;

let swiping = false;


/* =========================================================
   REMOVE OLD APP BUTTONS
   ========================================================= */

function removeAppButtons() {

    const buttons =
        document.querySelectorAll(".appButton");


    buttons.forEach(
        function(button) {

            button.remove();

        }
    );

}


/* =========================================================
   CREATE AN INVISIBLE CLICKABLE APP
   ========================================================= */

function createAppButton(
    name,
    left,
    top,
    width,
    height
) {

    const button =
        document.createElement("button");


    button.type = "button";


    button.className =
        "appButton";


    button.setAttribute(
        "aria-label",
        name
    );


    /*
     * These coordinates are percentages
     * of the ORIGINAL PHONE IMAGE.
     *
     * Because the button is inside the
     * same container as the image, it
     * rotates with the image.
     */

    button.style.left =
        left + "%";


    button.style.top =
        top + "%";


    button.style.width =
        width + "%";


    button.style.height =
        height + "%";


    button.addEventListener(
        "pointerdown",
        function(event) {

            event.stopPropagation();

        }
    );


    button.addEventListener(
        "pointerup",
        function(event) {

            event.stopPropagation();

        }
    );


    button.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            openApp(name);

        }
    );


    phoneArea.appendChild(button);

}


/* =========================================================
   PAGE 1
   ========================================================= */

function showPage1() {

    currentScreen =
        "page1";


    phoneImage.src =
        PAGE_1;


    pageIndicator.textContent =
        "Page 1";


    removeAppButtons();


    /*
     * These are the apps in pearphone.png.
     */

    createAppButton(
        "Messages",
        43,
        25,
        11,
        11
    );


    createAppButton(
        "Camera",
        54,
        25,
        11,
        11
    );


    createAppButton(
        "Social Fast",
        36,
        36,
        11,
        11
    );


    createAppButton(
        "Stocks",
        47,
        36,
        11,
        11
    );


    createAppButton(
        "Maps",
        58,
        36,
        11,
        11
    );


    createAppButton(
        "Photos",
        36,
        47,
        11,
        11
    );


    createAppButton(
        "Weather",
        47,
        47,
        11,
        11
    );


    createAppButton(
        "Notes",
        58,
        47,
        11,
        11
    );


    createAppButton(
        "iPodTunes",
        30,
        58,
        11,
        11
    );


    createAppButton(
        "Settings",
        41,
        58,
        11,
        11
    );


    createAppButton(
        "Clock",
        52,
        58,
        11,
        11
    );


    createAppButton(
        "Videos",
        63,
        58,
        11,
        11
    );

}


/* =========================================================
   PAGE 2
   ========================================================= */

function showPage2() {

    currentScreen =
        "page2";


    phoneImage.src =
        PAGE_2;


    pageIndicator.textContent =
        "Page 2";


    removeAppButtons();


    /*
     * These are the apps in pearphonepage2.png.
     */

    createAppButton(
        "Lingo",
        38,
        25,
        11,
        11
    );


    createAppButton(
        "SplashFace",
        51,
        25,
        11,
        11
    );


    createAppButton(
        "Thumb",
        31,
        36,
        11,
        11
    );


    createAppButton(
        "DanWarp",
        44,
        36,
        11,
        11
    );


    createAppButton(
        "Image",
        56,
        36,
        11,
        11
    );


    createAppButton(
        "Chrono",
        31,
        47,
        11,
        11
    );


    createAppButton(
        "ZapLook",
        44,
        47,
        11,
        11
    );


    createAppButton(
        "Weather",
        56,
        47,
        11,
        11
    );


    createAppButton(
        "Music",
        27,
        58,
        11,
        11
    );


    createAppButton(
        "Monkey",
        40,
        58,
        11,
        11
    );


    createAppButton(
        "Remark",
        52,
        58,
        11,
        11
    );


    createAppButton(
        "Settings",
        63,
        58,
        11,
        11
    );

}


/* =========================================================
   THE SLAP
   ========================================================= */

function showSlap() {

    currentScreen =
        "slap";


    phoneImage.src =
        SLAP;


    pageIndicator.textContent =
        "TheSlap";


    removeAppButtons();

}


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(name) {

    appTitle.textContent =
        name;


    appContent.innerHTML = "";


    appWindow.classList.add(
        "open"
    );


    /* =====================================================
       MESSAGES
       ===================================================== */

    if (name === "Messages") {

        appContent.innerHTML = `

            <div class="card">
                <strong>Alex</strong>
                <p>Hey! What are you doing?</p>
            </div>

            <div class="card">
                <strong>Mom</strong>
                <p>Don't forget about dinner!</p>
            </div>

            <input
                class="appInput"
                id="messageInput"
                placeholder="Type a message..."
            >

            <button
                class="appAction"
                id="sendMessage"
            >
                Send
            </button>

            <div id="messageResult"></div>
        `;


        document
            .getElementById("sendMessage")
            .onclick = function() {

                const text =
                    document.getElementById(
                        "messageInput"
                    ).value;


                document.getElementById(
                    "messageResult"
                ).innerHTML =
                    "<div class='card'>" +
                    "✓ Message sent: " +
                    escapeHTML(text) +
                    "</div>";

            };

    }


    /* =====================================================
       PHOTOS
       ===================================================== */

    else if (name === "Photos") {

        appContent.innerHTML = `

            <h3>Photos</h3>

            <div class="photoGrid">

                <div class="photo">🌴</div>

                <div class="photo">🌊</div>

                <div class="photo">🐶</div>

                <div class="photo">🏖️</div>

                <div class="photo">🌅</div>

                <div class="photo">📸</div>

            </div>

            <button
                class="appAction"
                id="newPhoto"
            >
                Add Photo
            </button>

            <p id="photoResult"></p>

        `;


        document
            .getElementById("newPhoto")
            .onclick = function() {

                document.getElementById(
                    "photoResult"
                ).textContent =
                    "📸 New photo added!";

            };

    }


    /* =====================================================
       CAMERA
       ===================================================== */

    else if (name === "Camera") {

        appContent.innerHTML = `

            <div
                class="card"
                style="
                    text-align:center;
                    font-size:60px;
                    padding:30px;
                "
            >
                📷
            </div>

            <button
                class="appAction"
                id="takePicture"
            >
                Take Picture
            </button>

            <p id="cameraResult"></p>

        `;


        document
            .getElementById("takePicture")
            .onclick = function() {

                document.getElementById(
                    "cameraResult"
                ).textContent =
                    "📸 Picture taken!";

            };

    }


    /* =====================================================
       WEATHER
       ===================================================== */

    else if (name === "Weather") {

        appContent.innerHTML = `

            <div class="card">
                <h2>☀️ 72°F</h2>
                <p>Sunny</p>
                <p>Feels like 74°F</p>
            </div>

            <button
                class="appAction"
                id="refreshWeather"
            >
                Refresh Weather
            </button>

            <p id="weatherResult"></p>

        `;


        document
            .getElementById("refreshWeather")
            .onclick = function() {

                document.getElementById(
                    "weatherResult"
                ).textContent =
                    "Weather refreshed! ☀️";

            };

    }


    /* =====================================================
       MAPS
       ===================================================== */

    else if (name === "Maps") {

        appContent.innerHTML = `

            <input
                class="appInput"
                id="mapInput"
                placeholder="Search location..."
            >

            <div
                class="card"
                style="
                    height:140px;
                    background:#80c8ff;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:50px;
                "
            >
                📍
            </div>

            <button
                class="appAction"
                id="mapSearch"
            >
                Search
            </button>

            <p id="mapResult"></p>

        `;


        document
            .getElementById("mapSearch")
            .onclick = function() {

                const place =
                    document.getElementById(
                        "mapInput"
                    ).value;


                document.getElementById(
                    "mapResult"
                ).textContent =
                    "📍 " +
                    (
                        place ||
                        "Current location"
                    );

            };

    }


    /* =====================================================
       NOTES
       ===================================================== */

    else if (name === "Notes") {

        appContent.innerHTML = `

            <input
                class="appInput"
                id="noteTitle"
                placeholder="Note title"
            >

            <textarea
                class="appInput"
                id="noteText"
                style="height:100px"
                placeholder="Write your note..."
            ></textarea>

            <button
                class="appAction"
                id="saveNote"
            >
                Save Note
            </button>

            <div id="noteResult"></div>

        `;


        document
            .getElementById("saveNote")
            .onclick = function() {

                document.getElementById(
                    "noteResult"
                ).innerHTML =
                    "<div class='card'>✓ Note saved!</div>";

            };

    }


    /* =====================================================
       MUSIC
       ===================================================== */

    else if (
        name === "Music" ||
        name === "iPodTunes"
    ) {

        appContent.innerHTML = `

            <div
                class="card"
                style="text-align:center"
            >

                <div
                    style="
                        font-size:70px;
                        margin:15px;
                    "
                >
                    🎵
                </div>

                <h3>
                    Pear Music
                </h3>

                <p>
                    Now Playing
                </p>

            </div>

            <button
                class="appAction"
                id="playMusic"
            >
                ▶ Play
            </button>

            <button
                class="appAction"
                id="stopMusic"
            >
                ■ Stop
            </button>

            <p id="musicResult"></p>

        `;


        document
            .getElementById("playMusic")
            .onclick = function() {

                document.getElementById(
                    "musicResult"
                ).textContent =
                    "▶ Playing";

            };


        document
            .getElementById("stopMusic")
            .onclick = function() {

                document.getElementById(
                    "musicResult"
                ).textContent =
                    "■ Stopped";

            };

    }


    /* =====================================================
       CLOCK / CHRONO
       ===================================================== */

    else if (
        name === "Clock" ||
        name === "Chrono"
    ) {

        appContent.innerHTML = `

            <div
                id="clockDisplay"
                style="
                    text-align:center;
                    font-size:38px;
                    margin:25px 0;
                "
            >
                --:--
            </div>

            <button
                class="appAction"
                id="refreshClock"
            >
                Update Time
            </button>

        `;


        function updateClock() {

            const now =
                new Date();


            document.getElementById(
                "clockDisplay"
            ).textContent =
                now.toLocaleTimeString();

        }


        updateClock();


        document
            .getElementById("refreshClock")
            .onclick =
            updateClock;

    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    else if (name === "Settings") {

        appContent.innerHTML = `

            <div class="card">
                <strong>Wi-Fi</strong>
                <p>Connected</p>
            </div>

            <div class="card">
                <strong>Bluetooth</strong>
                <p>On</p>
            </div>

            <div class="card">
                <strong>Brightness</strong>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value="80"
                    style="width:100%"
                >

            </div>

            <button
                class="appAction"
                onclick="
                    alert('Settings saved!')
                "
            >
                Save Settings
            </button>

        `;

    }


    /* =====================================================
       PAGE 2: LINGO
       ===================================================== */

    else if (name === "Lingo") {

        appContent.innerHTML = `

            <h3>Lingo</h3>

            <input
                class="appInput"
                id="lingoInput"
                placeholder="Type a word..."
            >

            <button
                class="appAction"
                id="translateButton"
            >
                Translate
            </button>

            <div id="lingoResult"></div>

        `;


        document
            .getElementById("translateButton")
            .onclick = function() {

                const word =
                    document.getElementById(
                        "lingoInput"
                    ).value;


                document.getElementById(
                    "lingoResult"
                ).innerHTML =
                    "<div class='card'>" +
                    "Translation: " +
                    escapeHTML(word) +
                    " → Hello" +
                    "</div>";

            };

    }


    /* =====================================================
       SPLASHFACE
       ===================================================== */

    else if (name === "SplashFace") {

        appContent.innerHTML = `

            <div
                class="card"
                style="
                    text-align:center;
                    font-size:60px;
                "
            >
                😎
            </div>

            <input
                class="appInput"
                placeholder="Your status..."
                id="faceStatus"
            >

            <button
                class="appAction"
                id="updateFace"
            >
                Update Face
            </button>

            <p id="faceResult"></p>

        `;


        document
            .getElementById("updateFace")
            .onclick = function() {

                document.getElementById(
                    "faceResult"
                ).textContent =
                    "Status updated!";

            };

    }


    /* =====================================================
       THUMB
       ===================================================== */

    else if (name === "Thumb") {

        appContent.innerHTML = `

            <div
                style="
                    text-align:center;
                    font-size:90px;
                "
            >
                👍
            </div>

            <button
                class="appAction"
                id="thumbButton"
            >
                Give a Thumbs Up
            </button>

            <h2
                id="thumbCount"
                style="text-align:center"
            >
                0
            </h2>

        `;


        let count = 0;


        document
            .getElementById("thumbButton")
            .onclick = function() {

                count++;


                document.getElementById(
                    "thumbCount"
                ).textContent =
                    count;

            };

    }


    /* =====================================================
       DANWARP
       ===================================================== */

    else if (name === "DanWarp") {

        appContent.innerHTML = `

            <div
                class="card"
                style="
                    text-align:center;
                    font-size:45px;
                "
            >
                🌀
            </div>

            <button
                class="appAction"
                id="warpButton"
            >
                WARP!
            </button>

            <p
                id="warpResult"
                style="text-align:center"
            >
                Ready
            </p>

        `;


        document
            .getElementById("warpButton")
            .onclick = function() {

                document.getElementById(
                    "warpResult"
                ).textContent =
                    "🌀 WARP ACTIVATED!";

            };

    }


    /* =====================================================
       IMAGE
       ===================================================== */

    else if (name === "Image") {

        appContent.innerHTML = `

            <div
                class="card"
                style="
                    height:150px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:70px;
                "
            >
                🖼️
            </div>

            <button
                class="appAction"
                onclick="
                    alert('Image selected!')
                "
            >
                Select Image
            </button>

        `;

    }


    /* =====================================================
       ZAPLOOK
       ===================================================== */

    else if (name === "ZapLook") {

        appContent.innerHTML = `

            <div
                style="
                    text-align:center;
                    font-size:70px;
                "
            >
                🔍
            </div>

            <input
                class="appInput"
                id="zapInput"
                placeholder="Search..."
            >

            <button
                class="appAction"
                id="zapSearch"
            >
                Search
            </button>

            <p id="zapResult"></p>

        `;


        document
            .getElementById("zapSearch")
            .onclick = function() {

                const query =
                    document.getElementById(
                        "zapInput"
                    ).value;


                document.getElementById(
                    "zapResult"
                ).textContent =
                    "Searching for: " +
                    query;

            };

    }


    /* =====================================================
       MONKEY
       ===================================================== */

    else if (name === "Monkey") {

        appContent.innerHTML = `

            <div
                style="
                    text-align:center;
                    font-size:80px;
                "
            >
                🐒
            </div>

            <button
                class="appAction"
                id="monkeyButton"
            >
                Make Monkey Do Something
            </button>

            <p
                id="monkeyResult"
                style="text-align:center"
            ></p>

        `;


        document
            .getElementById("monkeyButton")
            .onclick = function() {

                const sounds = [
                    "🐒 OOO OOO AAH AAH!",
                    "🐒 Monkey activated!",
                    "🐒 Banana time!",
                    "🐒 EEEEEEE!"
                ];


                const random =
                    sounds[
                        Math.floor(
                            Math.random() *
                            sounds.length
                        )
                    ];


                document.getElementById(
                    "monkeyResult"
                ).textContent =
                    random;

            };

    }


    /* =====================================================
       REMARK
       ===================================================== */

    else if (name === "Remark") {

        appContent.innerHTML = `

            <h3>Remark</h3>

            <textarea
                class="appInput"
                id="remarkInput"
                style="height:100px"
                placeholder="Write a remark..."
            ></textarea>

            <button
                class="appAction"
                id="saveRemark"
            >
                Save Remark
            </button>

            <p id="remarkResult"></p>

        `;


        document
            .getElementById("saveRemark")
            .onclick = function() {

                document.getElementById(
                    "remarkResult"
                ).textContent =
                    "✓ Remark saved!";

            };

    }


    /* =====================================================
       DEFAULT FOR OTHER APPS
       ===================================================== */

    else {

        appContent.innerHTML = `

            <div class="card">

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    Welcome to ${escapeHTML(name)}.
                </p>

            </div>

            <button
                class="appAction"
                onclick="
                    alert('Button pressed!')
                "
            >
                Press Me
            </button>

        `;

    }

}


/* =========================================================
   ESCAPE TEXT
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   SWIPE START
   ========================================================= */

phoneArea.addEventListener(
    "pointerdown",
    function(event) {


        /*
         * Don't start a swipe when an app
         * button is being pressed.
         */

        if (
            event.target.classList &&
            event.target.classList.contains(
                "appButton"
            )
        ) {

            return;

        }


        startX =
            event.clientX;


        startY =
            event.clientY;


        swiping = true;

    }
);


/* =========================================================
   SWIPE END
   ========================================================= */

phoneArea.addEventListener(
    "pointerup",
    function(event) {


        if (!swiping) {

            return;

        }


        swiping = false;


        const endX =
            event.clientX;


        const endY =
            event.clientY;


        const deltaX =
            endX - startX;


        const deltaY =
            endY - startY;


        const horizontal =
            Math.abs(deltaX);


        const vertical =
            Math.abs(deltaY);


        const minimum =
            60;


        /*
         * HORIZONTAL SWIPE
         */

        if (
            horizontal > vertical &&
            horizontal >= minimum
        ) {


            if (
                currentScreen === "slap"
            ) {

                showPage1();

            }

            else {

                showSlap();

            }


            return;

        }


        /*
         * VERTICAL SWIPE
         */

        if (
            vertical > horizontal &&
            vertical >= minimum
        ) {


            /*
             * UP
             */

            if (
                deltaY < 0 &&
                currentScreen === "page1"
            ) {

                showPage2();

            }


            /*
             * DOWN
             */

            else if (
                deltaY > 0 &&
                currentScreen === "page2"
            ) {

                showPage1();

            }

        }

    }
);


/* =========================================================
   START
   ========================================================= */

showPage1();
