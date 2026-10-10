"use strict";

/* =========================================================
   PEAR PHONE — SETTINGS
   ========================================================= */

const PAGE1 = "pearphone.png";
const PAGE2 = "pearphonepage2.png";
const SLAP = "theslap.png";

// Change this if your video has a different exact filename.
const VIDEO_FILE = "samandcatintro.mp4";

/* =========================================================
   ELEMENTS
   ========================================================= */

const phoneArea = document.getElementById("phoneArea");
const phoneImage = document.getElementById("phoneImage");
const appWindow = document.getElementById("appWindow");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");
const closeApp = document.getElementById("closeApp");
const pearHomeButton = document.getElementById("pearHomeButton");
const pearKeyboard = document.getElementById("pearKeyboard");
const slapTypingArea = document.getElementById("slapTypingArea");
const slapTextBar = document.getElementById("slapTextBar");

let currentPage = "page1";
let currentApp = null;
let startX = 0;
let startY = 0;
let swipeStarted = false;
let keyboardTarget = null;
let keyboardText = "";
let audioContext = null;

/* =========================================================
   KEYBOARD SOUND
   ========================================================= */

function playKeySound() {
    try {
        if (!audioContext) {
            audioContext = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "square";
        oscillator.frequency.value = 520;

        gain.gain.setValueAtTime(
            0.035,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.045
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.045);
    } catch (error) {
        // Keyboard sound is optional if audio is unavailable.
    }
}

/* =========================================================
   ON-SCREEN KEYBOARD
   ========================================================= */

const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ["SPACE", "ENTER"]
];

function createKeyboard() {
    pearKeyboard.innerHTML = "";

    keyboardRows.forEach(function(row) {
        const rowElement = document.createElement("div");
        rowElement.className = "keyboardRow";

        row.forEach(function(key) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "key";

            if (key === "SPACE") {
                button.classList.add("space");
                button.textContent = "SPACE";
            } else if (key === "ENTER") {
                button.classList.add("enter");
                button.textContent = "ENTER";
            } else if (key === "⌫") {
                button.classList.add("backspace");
                button.textContent = "⌫";
            } else {
                button.textContent = key;
            }

            button.addEventListener("pointerdown", function(event) {
                event.preventDefault();
                event.stopPropagation();

                playKeySound();
                handleKeyboardKey(key);
            });

            rowElement.appendChild(button);
        });

        pearKeyboard.appendChild(rowElement);
    });
}

function openKeyboard(target) {
    if (!target) return;

    keyboardTarget = target;
    keyboardText = target.dataset.value || "";

    pearKeyboard.classList.add("open");
    updateTypingDisplay();
}

function closeKeyboard() {
    pearKeyboard.classList.remove("open");
    keyboardTarget = null;
    keyboardText = "";
}

function handleKeyboardKey(key) {
    if (!keyboardTarget) return;

    if (key === "⌫") {
        keyboardText = keyboardText.slice(0, -1);
    } else if (key === "SPACE") {
        keyboardText += " ";
    } else if (key === "ENTER") {
        const target = keyboardTarget;
        const text = keyboardText;

        target.dataset.value = text;
        updateTypingDisplay();

        if (currentApp === "Lingo") {
            const result = document.getElementById("translation");

            if (result) {
                result.textContent = text ? text + " → Hello!" : "";
            }
        }

        closeKeyboard();
        return;
    } else {
        keyboardText += key;
    }

    keyboardTarget.dataset.value = keyboardText;
    updateTypingDisplay();
}

function updateTypingDisplay() {
    if (!keyboardTarget) return;

    if (keyboardTarget.id === "slapTextBar") {
        if (keyboardText) {
            keyboardTarget.textContent = keyboardText;
            keyboardTarget.classList.remove("placeholder");
        } else {
            keyboardTarget.textContent = "Tap here to type...";
            keyboardTarget.classList.add("placeholder");
        }
    } else {
        keyboardTarget.value = keyboardText;
    }
}

/* =========================================================
   CLOSE APP
   ========================================================= */

function closeCurrentApp() {
    // Stop any video that might still be playing.
    const video = document.getElementById("samCatVideo");

    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
    }

    closeKeyboard();

    slapTypingArea.classList.remove("open");
    appWindow.classList.remove("open");
    appContent.innerHTML = "";

    currentApp = null;
}

closeApp.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    closeCurrentApp();
});

pearHomeButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

pearHomeButton.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    closeCurrentApp();
});

/* =========================================================
   APP BUTTONS
   ========================================================= */

function clearAppButtons() {
    document.querySelectorAll(".appButton").forEach(function(button) {
        button.remove();
    });
}

function addApp(name, left, top, width, height) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "appButton";
    button.setAttribute("aria-label", name);

    button.style.left = left + "%";
    button.style.top = top + "%";
    button.style.width = width + "%";
    button.style.height = height + "%";

    button.addEventListener("pointerdown", function(event) {
        event.stopPropagation();
    });

    button.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        openApp(name);
    });

    phoneArea.appendChild(button);
}

/* =========================================================
   PAGE 1
   ========================================================= */

function showPage1() {
    currentPage = "page1";

    closeCurrentApp();
    phoneImage.src = PAGE1;
    clearAppButtons();

    addApp("Messages", 43, 25, 11, 11);
    addApp("Camera", 54, 25, 11, 11);
    addApp("Social Fast", 36, 36, 11, 11);
    addApp("Stocks", 47, 36, 11, 11);
    addApp("Maps", 58, 36, 11, 11);
    addApp("Photos", 36, 47, 11, 11);
    addApp("Weather", 47, 47, 11, 11);
    addApp("Notes", 58, 47, 11, 11);
    addApp("iPodTunes", 30, 58, 11, 11);
    addApp("Settings", 41, 58, 11, 11);
    addApp("Clock", 52, 58, 11, 11);
    addApp("Videos", 63, 58, 11, 11);
}

/* =========================================================
   PAGE 2
   ========================================================= */

function showPage2() {
    currentPage = "page2";

    closeCurrentApp();
    phoneImage.src = PAGE2;
    clearAppButtons();

    addApp("Lingo", 38, 25, 11, 11);
    addApp("SplashFace", 51, 25, 11, 11);
    addApp("Thumb", 31, 36, 11, 11);
    addApp("DanWarp", 44, 36, 11, 11);
    addApp("Image", 56, 36, 11, 11);
    addApp("Chrono", 31, 47, 11, 11);
    addApp("ZapLook", 44, 47, 11, 11);
    addApp("Weather", 56, 47, 11, 11);
    addApp("Music", 27, 58, 11, 11);
    addApp("Monkey", 40, 58, 11, 11);
    addApp("Remark", 52, 58, 11, 11);
    addApp("Settings", 63, 58, 11, 11);
}

/* =========================================================
   THE SLAP
   ========================================================= */

function showSlap() {
    currentPage = "slap";

    closeCurrentApp();
    phoneImage.src = SLAP;
    clearAppButtons();

    appTitle.textContent = "The Slap";
    appContent.innerHTML = "";

    slapTextBar.dataset.value = "";
    slapTextBar.textContent = "Tap here to type...";
    slapTextBar.classList.add("placeholder");

    slapTypingArea.classList.add("open");
    appContent.appendChild(slapTypingArea);
    appWindow.classList.add("open");
}

slapTextBar.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    event.stopPropagation();
    openKeyboard(slapTextBar);
});

/* =========================================================
   TEXT INPUT HELPERS
   ========================================================= */

function connectKeyboard(input) {
    input.addEventListener("pointerdown", function(event) {
        if (input.readOnly) {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        }
    });

    input.addEventListener("focus", function() {
        if (input.readOnly) {
            openKeyboard(input);
        }
    });
}

/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(name) {
    closeKeyboard();
    slapTypingArea.classList.remove("open");

    currentApp = name;
    appTitle.textContent = name === "SplashFace" ? "Splash Face" : name;
    appContent.innerHTML = "";
    appWindow.classList.add("open");

    /* MESSAGES */
    if (name === "Messages") {
        appContent.innerHTML = `
            <div class="card"><b>Alex</b><br>Hey! What are you doing?</div>
            <div class="card"><b>Mom</b><br>Don't forget dinner!</div>
            <input id="messageInput" class="appInput" placeholder="Type a message...">
            <button id="sendMessage" class="appButtonLarge">Send Message</button>
            <div id="messageResult" class="card">No new messages.</div>
        `;

        const input = document.getElementById("messageInput");

        input.addEventListener("focus", function() {
            openKeyboard(input);
        });

        document.getElementById("sendMessage").onclick = function() {
            const value = input.value.trim();

            document.getElementById("messageResult").textContent =
                value ? "✓ Sent: " + value : "Type something first!";
        };
    }

    /* CAMERA */
    else if (name === "Camera") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center;font-size:55px;padding:25px">📷</div>
            <button id="takePicture" class="appButtonLarge">📸 Take Picture</button>
            <button id="flash" class="appButtonLarge">⚡ Flash</button>
            <p id="cameraResult" style="text-align:center">Camera ready</p>
        `;

        let pictures = 0;

        document.getElementById("takePicture").onclick = function() {
            pictures++;
            document.getElementById("cameraResult").textContent =
                "📸 Picture " + pictures + " captured!";
        };

        document.getElementById("flash").onclick = function() {
            document.getElementById("cameraResult").textContent = "⚡ Flash ON";
        };
    }

    /* PHOTOS */
    else if (name === "Photos") {
        appContent.innerHTML = `
            <h3>📸 My Photos</h3>
            <div class="photoGrid">
                <div class="photo">🌴</div><div class="photo">🌊</div>
                <div class="photo">🐶</div><div class="photo">🏖️</div>
                <div class="photo">🌅</div><div class="photo">📸</div>
            </div>
            <button id="addPhoto" class="appButtonLarge">➕ Add Photo</button>
            <button id="shufflePhotos" class="appButtonLarge">🔀 Shuffle</button>
            <p id="photoResult" style="text-align:center"></p>
        `;

        document.getElementById("addPhoto").onclick = function() {
            document.getElementById("photoResult").textContent = "📸 New photo added!";
        };

        document.getElementById("shufflePhotos").onclick = function() {
            document.getElementById("photoResult").textContent = "🔀 Photos shuffled!";
        };
    }

    /* WEATHER */
    else if (name === "Weather") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center">
                <div style="font-size:45px">☀️</div>
                <h2>72°F</h2><p>Sunny</p><p>Feels like 74°F</p>
            </div>
            <button id="refreshWeather" class="appButtonLarge">🔄 Refresh</button>
            <p id="weatherResult" style="text-align:center">Last updated now</p>
        `;

        document.getElementById("refreshWeather").onclick = function() {
            document.getElementById("weatherResult").textContent = "☀️ Weather updated!";
        };
    }

    /* MAPS */
    else if (name === "Maps") {
        appContent.innerHTML = `
            <input id="mapSearch" class="appInput" placeholder="Where do you want to go?">
            <div class="card" style="height:100px;background:#83c9ff;display:flex;align-items:center;justify-content:center;font-size:40px">🗺️</div>
            <button id="findMap" class="appButtonLarge">📍 Find Location</button>
            <p id="mapResult" style="text-align:center"></p>
        `;

        const input = document.getElementById("mapSearch");
        input.addEventListener("focus", function() {
            openKeyboard(input);
        });

        document.getElementById("findMap").onclick = function() {
            const location = input.value.trim();
            document.getElementById("mapResult").textContent =
                "📍 " + (location || "Current location");
        };
    }

    /* NOTES */
    else if (name === "Notes") {
        appContent.innerHTML = `
            <input id="noteTitle" class="appInput" placeholder="Note title">
            <textarea id="noteBody" class="appTextarea" placeholder="Write something..."></textarea>
            <button id="saveNote" class="appButtonLarge">💾 Save Note</button>
            <button id="clearNote" class="appButtonLarge">🗑️ Clear</button>
            <p id="noteResult" style="text-align:center"></p>
        `;

        const title = document.getElementById("noteTitle");
        const body = document.getElementById("noteBody");

        title.addEventListener("focus", function() {
            openKeyboard(title);
        });

        body.addEventListener("focus", function() {
            openKeyboard(body);
        });

        document.getElementById("saveNote").onclick = function() {
            document.getElementById("noteResult").textContent = "✓ Note saved!";
        };

        document.getElementById("clearNote").onclick = function() {
            title.value = "";
            body.value = "";
        };
    }

    /* SETTINGS */
    else if (name === "Settings") {
        appContent.innerHTML = `
            <div class="card"><b>Wi-Fi</b><br>🟢 Connected</div>
            <div class="card"><b>Bluetooth</b><br>🔵 On</div>
            <div class="card"><b>Brightness</b><br><br><input type="range" min="0" max="100" value="80" style="width:100%"></div>
            <div class="card"><b>Battery</b><br>🔋 87%</div>
            <button id="saveSettings" class="appButtonLarge">Save Settings</button>
        `;

        document.getElementById("saveSettings").onclick = function() {
            this.textContent = "✓ Saved!";
        };
    }

    /* PEAR TUNES — REAL VIDEO PLAYBACK */
    else if (name === "Music" || name === "iPodTunes") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center">
                <div style="font-size:32px">🍐🎵</div>
                <b>PearTunes</b>
                <p>Sam &amp; Cat Intro</p>
            </div>

            <video
                id="samCatVideo"
                controls
                playsinline
                preload="metadata"
            >
                <source src="${VIDEO_FILE}" type="video/mp4">
                Your browser cannot play this video.
            </video>

            <button id="playIntro" class="appButtonLarge">
                ▶ Play Sam &amp; Cat Intro
            </button>

            <button id="pauseIntro" class="appButtonLarge">
                ⏸ Pause
            </button>

            <p id="musicResult" style="text-align:center">
                Ready to play.
            </p>
        `;

        const video = document.getElementById("samCatVideo");
        const result = document.getElementById("musicResult");

        video.addEventListener("playing", function() {
            result.textContent = "▶ Playing Sam & Cat!";
        });

        video.addEventListener("pause", function() {
            if (!video.ended) {
                result.textContent = "⏸ Video paused.";
            }
        });

        video.addEventListener("ended", function() {
            result.textContent = "✓ Intro finished!";
        });

        video.addEventListener("error", function() {
            result.textContent =
                "Video couldn't load. Check the filename and repository path.";
        });

        document.getElementById("playIntro").onclick = async function() {
            try {
                await video.play();
                result.textContent = "▶ Playing Sam & Cat!";
            } catch (error) {
                result.textContent =
                    "Tap the video Play button to start playback.";
            }
        };

        document.getElementById("pauseIntro").onclick = function() {
            video.pause();
        };
    }

    /* CLOCK / CHRONO */
    else if (name === "Clock" || name === "Chrono") {
        appContent.innerHTML = `
            <div id="time" style="font-size:30px;text-align:center;margin:15px"></div>
            <button id="updateTime" class="appButtonLarge">🔄 Update Time</button>
        `;

        function updateTime() {
            document.getElementById("time").textContent =
                new Date().toLocaleTimeString();
        }

        updateTime();
        document.getElementById("updateTime").onclick = updateTime;
    }

    /* LINGO */
    else if (name === "Lingo") {
        appContent.innerHTML = `
            <div class="card"><b>🌎 Lingo Translator</b><p>Type something below.</p></div>
            <input id="lingoWord" class="appInput" placeholder="Tap here to type..." readonly data-value="">
            <button id="translate" class="appButtonLarge">🌎 Translate</button>
            <p id="translation" style="text-align:center;font-size:13px"></p>
        `;

        const input = document.getElementById("lingoWord");

        input.addEventListener("pointerdown", function(event) {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        });

        document.getElementById("translate").onclick = function() {
            const word = input.dataset.value || "";
            document.getElementById("translation").textContent =
                word ? word + " → Hello!" : "Type something first!";
        };
    }

    /* SPLASH FACE */
    else if (name === "SplashFace") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center;padding:8px">
                <div style="font-size:48px">😎</div>
                <b>Splash Face</b><p>Share your mood.</p>
            </div>
            <input id="status" class="appInput" placeholder="What's happening?" readonly data-value="">
            <button id="happyFace" class="appButtonLarge">😄 Happy</button>
            <button id="coolFace" class="appButtonLarge">😎 Cool</button>
            <button id="sadFace" class="appButtonLarge">😢 Sad</button>
            <button id="postStatus" class="appButtonLarge">📤 Post</button>
            <div id="statusResult" class="card" style="text-align:center">No status posted yet.</div>
        `;

        const status = document.getElementById("status");

        status.addEventListener("pointerdown", function(event) {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(status);
        });

        function setStatusEmoji(emoji) {
            status.dataset.value = emoji + " ";
            openKeyboard(status);
        }

        document.getElementById("happyFace").onclick = function() {
            setStatusEmoji("😄");
        };

        document.getElementById("coolFace").onclick = function() {
            setStatusEmoji("😎");
        };

        document.getElementById("sadFace").onclick = function() {
            setStatusEmoji("😢");
        };

        document.getElementById("postStatus").onclick = function() {
            const value = status.dataset.value || "";
            document.getElementById("statusResult").textContent =
                value ? "✨ Posted: " + value : "Type a status first!";
        };
    }

    /* THUMB */
    else if (name === "Thumb") {
        appContent.innerHTML = `
            <div style="text-align:center;font-size:60px">👍</div>
            <button id="thumb" class="appButtonLarge">👍 Thumbs Up</button>
            <h2 id="thumbCount" style="text-align:center">0</h2>
            <p id="thumbMessage" style="text-align:center">Give it a thumbs up!</p>
        `;

        let count = 0;

        document.getElementById("thumb").onclick = function() {
            count++;
            document.getElementById("thumbCount").textContent = count;
            document.getElementById("thumbMessage").textContent =
                count >= 10 ? "🔥 You're on fire!" : "👍 Nice!";
        };
    }

    /* DANWARP */
    else if (name === "DanWarp") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center">
                <div style="font-size:45px">🌀</div>
                <b>DanWarp</b><p>Entertainment Center</p>
            </div>
            <button id="warp" class="appButtonLarge">🌀 WARP</button>
            <button id="shows" class="appButtonLarge">📺 Shows</button>
            <button id="episodes" class="appButtonLarge">🎬 Episodes</button>
            <p id="warpResult" style="text-align:center">Ready</p>
        `;

        document.getElementById("warp").onclick = function() {
            document.getElementById("warpResult").textContent = "🌀 WARP ACTIVATED!";
        };

        document.getElementById("shows").onclick = function() {
            document.getElementById("warpResult").textContent = "📺 Shows coming soon!";
        };

        document.getElementById("episodes").onclick = function() {
            document.getElementById("warpResult").textContent = "🎬 Episode library ready!";
        };
    }

    /* IMAGE */
    else if (name === "Image") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center;font-size:55px">🖼️</div>
            <button id="selectImage" class="appButtonLarge">🖼️ Select Image</button>
            <button id="editImage" class="appButtonLarge">✨ Edit Image</button>
            <p id="imageResult" style="text-align:center"></p>
        `;

        document.getElementById("selectImage").onclick = function() {
            document.getElementById("imageResult").textContent = "🖼️ Image selected!";
        };

        document.getElementById("editImage").onclick = function() {
            document.getElementById("imageResult").textContent = "✨ Editing tools opened!";
        };
    }

    /* ZAPLOOK */
    else if (name === "ZapLook") {
        appContent.innerHTML = `
            <input id="zapSearchInput" class="appInput" placeholder="Search ZapLook..." readonly data-value="">
            <button id="zapSearchButton" class="appButtonLarge">🔎 Search</button>
            <div id="zapResult" class="card">Search for something.</div>
        `;

        const input = document.getElementById("zapSearchInput");

        input.addEventListener("pointerdown", function(event) {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        });

        document.getElementById("zapSearchButton").onclick = function() {
            const search = input.dataset.value || "";
            document.getElementById("zapResult").textContent =
                search ? "🔎 Searching for: " + search : "Type something first!";
        };
    }

    /* MONKEY */
    else if (name === "Monkey") {
        appContent.innerHTML = `
            <div id="monkeyFace" style="text-align:center;font-size:65px">🐒</div>
            <button id="monkey" class="appButtonLarge">🐒 Activate Monkey</button>
            <button id="monkeyDance" class="appButtonLarge">💃 Monkey Dance</button>
            <p id="monkeyResult" style="text-align:center"></p>
        `;

        document.getElementById("monkey").onclick = function() {
            document.getElementById("monkeyResult").textContent = "🐒 OOO OOO AAH AAH!";
        };

        document.getElementById("monkeyDance").onclick = function() {
            document.getElementById("monkeyFace").textContent = "🕺🐒🕺";
            document.getElementById("monkeyResult").textContent = "🐒 MONKEY DANCE!";
        };
    }

    /* REMARK */
    else if (name === "Remark") {
        appContent.innerHTML = `
            <textarea id="remark" class="appTextarea" placeholder="Write a remark..."></textarea>
            <button id="saveRemark" class="appButtonLarge">💾 Save Remark</button>
            <button id="clearRemark" class="appButtonLarge">🗑️ Clear</button>
            <p id="remarkResult" style="text-align:center"></p>
        `;

        document.getElementById("saveRemark").onclick = function() {
            const value = document.getElementById("remark").value;
            document.getElementById("remarkResult").textContent =
                value ? "✓ Remark saved!" : "Write something first!";
        };

        document.getElementById("clearRemark").onclick = function() {
            document.getElementById("remark").value = "";
        };
    }

    /* STOCKS */
    else if (name === "Stocks") {
        appContent.innerHTML = `
            <div class="card"><b>🍎 Pear Inc.</b><br><br>$182.42<br>📈 +3.24%</div>
            <div class="card"><b>💻 TechCo</b><br><br>$94.18<br>📈 +1.82%</div>
            <button id="refreshStocks" class="appButtonLarge">🔄 Refresh</button>
        `;

        document.getElementById("refreshStocks").onclick = function() {
            this.textContent = "✓ Updated!";
        };
    }

    /* SOCIAL FAST */
    else if (name === "Social Fast") {
        appContent.innerHTML = `
            <div class="card"><b>🔥 Trending</b><p>#PearPhone</p></div>
            <div class="card"><b>👤 Alex</b><p>This phone is crazy 😂</p></div>
            <input id="socialPost" class="appInput" placeholder="What's on your mind?" readonly data-value="">
            <button id="postSocial" class="appButtonLarge">📤 Post</button>
            <p id="socialResult" style="text-align:center"></p>
        `;

        const input = document.getElementById("socialPost");

        input.addEventListener("pointerdown", function(event) {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        });

        document.getElementById("postSocial").onclick = function() {
            const value = input.dataset.value || "";
            document.getElementById("socialResult").textContent =
                value ? "🔥 Posted!" : "Write something first!";
        };
    }

    /* VIDEOS */
    else if (name === "Videos") {
        appContent.innerHTML = `
            <div class="card" style="text-align:center">🎬<br><br>Pear Videos</div>
            <button id="featuredVideo" class="appButtonLarge">▶ Featured</button>
            <button id="randomVideo" class="appButtonLarge">🎲 Random Video</button>
            <p id="videoResult" style="text-align:center">Choose a video.</p>
        `;

        document.getElementById("featuredVideo").onclick = function() {
            document.getElementById("videoResult").textContent = "▶ Playing Featured Video";
        };

        document.getElementById("randomVideo").onclick = function() {
            document.getElementById("videoResult").textContent = "🎲 Random video selected!";
        };
    }

    /* GENERIC FALLBACK */
    else {
        appContent.innerHTML = `
            <div class="card"><h3>${name}</h3><p>Welcome to ${name}.</p></div>
            <button id="genericAction" class="appButtonLarge">✨ Open</button>
            <p id="genericResult" style="text-align:center"></p>
        `;

        document.getElementById("genericAction").onclick = function() {
            document.getElementById("genericResult").textContent = "✓ Done!";
        };
    }
}

/* =========================================================
   SWIPE HANDLING
   ========================================================= */

phoneArea.addEventListener("pointerdown", function(event) {
    if (event.target.closest("#appWindow")) return;
    if (event.target.closest("#pearHomeButton")) return;
    if (event.target.classList.contains("appButton")) return;

    startX = event.clientX;
    startY = event.clientY;
    swipeStarted = true;
});

phoneArea.addEventListener("pointerup", function(event) {
    if (!swipeStarted) return;

    swipeStarted = false;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const minimum = 60;

    if (absX > absY && absX >= minimum) {
        if (currentPage === "slap") {
            showPage1();
        } else {
            showSlap();
        }

        return;
    }

    if (absY > absX && absY >= minimum) {
        if (deltaY < 0 && currentPage === "page1") {
            showPage2();
        } else if (deltaY > 0 && currentPage === "page2") {
            showPage1();
        }
    }
});

/* =========================================================
   INITIALIZE
   ========================================================= */

createKeyboard();
showPage1();
