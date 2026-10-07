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


/* =========================================================
   IMAGE FILES
   ========================================================= */

const PAGE1 =
    "pearphone.png";

const PAGE2 =
    "pearphonepage2.png";

const SLAP =
    "theslap.png";


/* =========================================================
   CURRENT SCREEN
   ========================================================= */

let currentScreen =
    "page1";


/* =========================================================
   SWIPE VARIABLES
   ========================================================= */

let startX = 0;

let startY = 0;

let swipeActive = false;


/* =========================================================
   CLOSE APP
   ========================================================= */

closeApp.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        closeCurrentApp();

    }
);


/* =========================================================
   CLOSE CURRENT APP
   ========================================================= */

function closeCurrentApp() {

    appWindow.classList.remove("open");

    appContent.innerHTML = "";

}


/* =========================================================
   CREATE INVISIBLE APP BUTTON
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


    button.type =
        "button";


    button.className =
        "appButton";


    button.setAttribute(
        "aria-label",
        name
    );


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
        "click",
        function(event) {

            event.stopPropagation();

            openApp(name);

        }
    );


    phoneArea.appendChild(button);

}


/* =========================================================
   REMOVE ALL APP BUTTONS
   ========================================================= */

function removeAppButtons() {

    document
        .querySelectorAll(".appButton")
        .forEach(
            function(button) {

                button.remove();

            }
        );

}


/* =========================================================
   PAGE 1
   ========================================================= */

function showPage1() {

    currentScreen =
        "page1";


    closeCurrentApp();


    phoneImage.src =
        PAGE1;


    removeAppButtons();


    /*
     * PAGE 1 APPS
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


    closeCurrentApp();


    phoneImage.src =
        PAGE2;


    removeAppButtons();


    /*
     * PAGE 2 APPS
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
   SLAP
   ========================================================= */

function showSlap() {

    currentScreen =
        "slap";


    closeCurrentApp();


    phoneImage.src =
        SLAP;


    removeAppButtons();

}


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(name) {

    appTitle.textContent =
        name;


    appContent.innerHTML =
        "";


    appWindow.classList.add(
        "open"
    );


    /* =====================================================
       MESSAGES
       ===================================================== */

    if (name === "Messages") {

        appContent.innerHTML = `

            <div class="card">
                <b>Alex</b>
                <br>
                Hey! What are you doing?
            </div>

            <div class="card">
                <b>Mom</b>
                <br>
                Don't forget dinner!
            </div>

            <textarea
                id="message"
                class="appTextarea"
                placeholder="Message..."
            ></textarea>

            <button
                id="sendMessage"
                class="appButtonLarge"
            >
                Send
            </button>

            <p id="messageResult"></p>

        `;


        document
            .getElementById("sendMessage")
            .onclick = function() {

                const message =
                    document.getElementById(
                        "message"
                    ).value;


                document.getElementById(
                    "messageResult"
                ).textContent =
                    "✓ Sent: " + message;

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
                id="addPhoto"
                class="appButtonLarge"
            >
                Add Photo
            </button>

            <p id="photoResult"></p>

        `;


        document
            .getElementById("addPhoto")
            .onclick = function() {

                document.getElementById(
                    "photoResult"
                ).textContent =
                    "📸 Photo added!";

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
                    font-size:55px;
                    padding:25px;
                "
            >
                📷
            </div>

            <button
                id="takePicture"
                class="appButtonLarge"
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

                <h2>
                    ☀️ 72°F
                </h2>

                <p>
                    Sunny
                </p>

                <p>
                    Feels like 74°F
                </p>

            </div>

            <button
                id="refreshWeather"
                class="appButtonLarge"
            >
                Refresh
            </button>

            <p id="weatherResult"></p>

        `;


        document
            .getElementById(
                "refreshWeather"
            )
            .onclick = function() {

                document.getElementById(
                    "weatherResult"
                ).textContent =
                    "☀️ Weather updated!";

            };

    }


    /* =====================================================
       MAPS
       ===================================================== */

    else if (name === "Maps") {

        appContent.innerHTML = `

            <input
                id="mapSearch"
                class="appInput"
                placeholder="Search..."
            >

            <div
                class="card"
                style="
                    height:100px;
                    background:#83c9ff;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:40px;
                "
            >
                📍
            </div>

            <button
                id="findMap"
                class="appButtonLarge"
            >
                Search
            </button>

            <p id="mapResult"></p>

        `;


        document
            .getElementById("findMap")
            .onclick = function() {

                const location =
                    document.getElementById(
                        "mapSearch"
                    ).value;


                document.getElementById(
                    "mapResult"
                ).textContent =
                    "📍 " +
                    (
                        location ||
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
                id="noteTitle"
                class="appInput"
                placeholder="Title"
            >

            <textarea
                id="noteBody"
                class="appTextarea"
                placeholder="Write something..."
            ></textarea>

            <button
                id="saveNote"
                class="appButtonLarge"
            >
                Save
            </button>

            <p id="noteResult"></p>

        `;


        document
            .getElementById("saveNote")
            .onclick = function() {

                document.getElementById(
                    "noteResult"
                ).textContent =
                    "✓ Note saved!";

            };

    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    else if (name === "Settings") {

        appContent.innerHTML = `

            <div class="card">
                <b>Wi-Fi</b>
                <br>
                Connected
            </div>

            <div class="card">
                <b>Bluetooth</b>
                <br>
                On
            </div>

            <div class="card">

                <b>Brightness</b>

                <br><br>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value="80"
                    style="width:100%"
                >

            </div>

            <button
                id="saveSettings"
                class="appButtonLarge"
            >
                Save Settings
            </button>

        `;


        document
            .getElementById("saveSettings")
            .onclick = function() {

                alert(
                    "Settings saved!"
                );

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
                        font-size:55px;
                    "
                >
                    🎵
                </div>

                <b>
                    Pear Music
                </b>

                <p>
                    Nothing playing
                </p>

            </div>

            <button
                id="play"
                class="appButtonLarge"
            >
                ▶ Play
            </button>

            <button
                id="stop"
                class="appButtonLarge"
            >
                ■ Stop
            </button>

            <p id="musicResult"></p>

        `;


        document
            .getElementById("play")
            .onclick = function() {

                document.getElementById(
                    "musicResult"
                ).textContent =
                    "▶ Playing music";

            };


        document
            .getElementById("stop")
            .onclick = function() {

                document.getElementById(
                    "musicResult"
                ).textContent =
                    "■ Music stopped";

            };

    }


    /* =====================================================
       CLOCK
       ===================================================== */

    else if (
        name === "Clock" ||
        name === "Chrono"
    ) {

        appContent.innerHTML = `

            <div
                id="time"
                style="
                    font-size:30px;
                    text-align:center;
                    margin:15px;
                "
            >
            </div>

            <button
                id="updateTime"
                class="appButtonLarge"
            >
                Update Time
            </button>

        `;


        function updateTime() {

            document.getElementById(
                "time"
            ).textContent =
                new Date().toLocaleTimeString();

        }


        updateTime();


        document
            .getElementById(
                "updateTime"
            )
            .onclick =
            updateTime;

    }


    /* =====================================================
       LINGO
       ===================================================== */

    else if (name === "Lingo") {

        appContent.innerHTML = `

            <input
                id="lingoWord"
                class="appInput"
                placeholder="Enter a word"
            >

            <button
                id="translate"
                class="appButtonLarge"
            >
                Translate
            </button>

            <p id="translation"></p>

        `;


        document
            .getElementById("translate")
            .onclick = function() {

                const word =
                    document.getElementById(
                        "lingoWord"
                    ).value;


                document.getElementById(
                    "translation"
                ).textContent =
                    word +
                    " → Hello";

            };

    }


    /* =====================================================
       SPLASHFACE
       ===================================================== */

    else if (name === "SplashFace") {

        appContent.innerHTML = `

            <div
                style="
                    text-align:center;
                    font-size:60px;
                "
            >
                😎
            </div>

            <input
                id="status"
                class="appInput"
                placeholder="Your status"
            >

            <button
                id="setStatus"
                class="appButtonLarge"
            >
                Set Status
            </button>

            <p id="statusResult"></p>

        `;


        document
            .getElementById("setStatus")
            .onclick = function() {

                document.getElementById(
                    "statusResult"
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
                    font-size:65px;
                "
            >
                👍
            </div>

            <button
                id="thumb"
                class="appButtonLarge"
            >
                Thumbs Up
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
            .getElementById("thumb")
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
                style="
                    text-align:center;
                    font-size:60px;
                "
            >
                🌀
            </div>

            <button
                id="warp"
                class="appButtonLarge"
            >
                WARP
            </button>

            <p
                id="warpResult"
                style="text-align:center"
            >
                Ready
            </p>

        `;


        document
            .getElementById("warp")
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
                    text-align:center;
                    font-size:60px;
                "
            >
                🖼️
            </div>

            <button
                class="appButtonLarge"
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

            <input
                id="zapSearchInput"
                class="appInput"
                placeholder="Search"
            >

            <button
                id="zapSearchButton"
                class="appButtonLarge"
            >
                Search
            </button>

            <p id="zapResult"></p>

        `;


        document
            .getElementById(
                "zapSearchButton"
            )
            .onclick = function() {

                const search =
                    document.getElementById(
                        "zapSearchInput"
                    ).value;


                document.getElementById(
                    "zapResult"
                ).textContent =
                    "Searching for: " +
                    search;

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
                    font-size:70px;
                "
            >
                🐒
            </div>

            <button
                id="monkey"
                class="appButtonLarge"
            >
                Activate Monkey
            </button>

            <p
                id="monkeyResult"
                style="text-align:center"
            ></p>

        `;


        document
            .getElementById("monkey")
            .onclick = function() {

                document.getElementById(
                    "monkeyResult"
                ).textContent =
                    "🐒 OOO OOO AAH AAH!";

            };

    }


    /* =====================================================
       REMARK
       ===================================================== */

    else if (name === "Remark") {

        appContent.innerHTML = `

            <textarea
                id="remark"
                class="appTextarea"
                placeholder="Write a remark..."
            ></textarea>

            <button
                id="saveRemark"
                class="appButtonLarge"
            >
                Save Remark
            </button>

            <p id="remarkResult"></p>

        `;


        document
            .getElementById(
                "saveRemark"
            )
            .onclick = function() {

                document.getElementById(
                    "remarkResult"
                ).textContent =
                    "✓ Remark saved!";

            };

    }


    /* =====================================================
       DEFAULT
       ===================================================== */

    else {

        appContent.innerHTML = `

            <div class="card">

                <h3>
                    ${name}
                </h3>

                <p>
                    Welcome to ${name}.
                </p>

            </div>

            <button
                class="appButtonLarge"
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
   SWIPE START
   ========================================================= */

phoneArea.addEventListener(
    "pointerdown",
    function(event) {


        /*
         * Don't start a page swipe when
         * touching an app icon.
         */

        if (
            event.target.classList &&
            event.target.classList.contains(
                "appButton"
            )
        ) {

            return;

        }


        /*
         * Don't start a page swipe inside
         * the app window.
         */

        if (
            event.target.closest(
                "#appWindow"
            )
        ) {

            return;

        }


        startX =
            event.clientX;


        startY =
            event.clientY;


        swipeActive = true;

    }
);


/* =========================================================
   SWIPE END
   ========================================================= */

phoneArea.addEventListener(
    "pointerup",
    function(event) {


        if (!swipeActive) {

            return;

        }


        swipeActive = false;


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


        const minimumSwipe =
            60;


        /*
         * SIDEWAYS
         */

        if (
            horizontal > vertical &&
            horizontal >= minimumSwipe
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
         * UP / DOWN
         */

        if (
            vertical > horizontal &&
            vertical >= minimumSwipe
        ) {


            /*
             * SWIPE UP
             */

            if (
                deltaY < 0 &&
                currentScreen === "page1"
            ) {

                showPage2();

            }


            /*
             * SWIPE DOWN
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
