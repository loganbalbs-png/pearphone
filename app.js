"use strict";

/* =========================================================
   PEAR PHONE — COMPLETE app.js
   Images required:
   pearphone.png
   pearphonepage2.png
   theslap.png

   Optional video:
   samandcatintro.mp4
   ========================================================= */

(() => {
    "use strict";

    /* ---------- ELEMENTS ---------- */

    const $ = (id) => document.getElementById(id);

    const phoneArea = $("phoneArea");
    const phoneImage = $("phoneImage");
    const appWindow = $("appWindow");
    const appTitle = $("appTitle");
    const appContent = $("appContent");
    const closeApp = $("closeApp");
    const homeButton = $("pearHomeButton");
    const keyboard = $("pearKeyboard");
    const slapTypingArea = $("slapTypingArea");
    const slapTextBar = $("slapTextBar");

    if (!phoneArea || !phoneImage) {
        console.error(
            "Pear Phone: Missing #phoneArea or #phoneImage. Check index.html."
        );
        return;
    }

    /* ---------- FILE NAMES ---------- */

    const PAGE1 = "pearphone.png";
    const PAGE2 = "pearphonepage2.png";
    const SLAP = "theslap.png";

    // Change this only if your uploaded video has a different filename.
    const VIDEO_FILE = "samandcatintro.mp4";

    /* ---------- STATE ---------- */

    let currentPage = "page1";
    let currentApp = null;
    let swipeStart = null;
    let keyboardTarget = null;
    let keyboardText = "";
    let audioContext = null;

    /* ---------- SMALL HELPERS ---------- */

    function setText(id, text) {
        const element = $(id);
        if (element) element.textContent = text;
    }

    function setHTML(html) {
        if (appContent) appContent.innerHTML = html;
    }

    function button(label, id, extraClass = "") {
        return `<button type="button" id="${id}" class="appButtonLarge ${extraClass}">${label}</button>`;
    }

    function card(content) {
        return `<div class="card">${content}</div>`;
    }

    function bind(id, eventName, callback) {
        const element = $(id);
        if (element) element.addEventListener(eventName, callback);
    }

    function safeValue(id) {
        const element = $(id);
        if (!element) return "";
        return element.dataset.value !== undefined
            ? element.dataset.value
            : element.value || "";
    }

    function message(text, id = "appResult") {
        setText(id, text);
    }

    /* =========================================================
       KEYBOARD SOUND
       Sounds are only played when a custom keyboard key is tapped.
       ========================================================= */

    function playKeySound() {
        try {
            const AudioCtor =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioCtor) return;

            if (!audioContext) audioContext = new AudioCtor();

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "square";
            oscillator.frequency.value = 520;

            gain.gain.setValueAtTime(
                0.025,
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
            // Sound is optional; the keyboard still works without it.
        }
    }

    /* =========================================================
       CUSTOM KEYBOARD
       ========================================================= */

    const keyboardRows = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M", "⌫"],
        ["SPACE", "ENTER"]
    ];

    function createKeyboard() {
        if (!keyboard) return;

        keyboard.innerHTML = "";

        keyboardRows.forEach((row) => {
            const rowElement = document.createElement("div");
            rowElement.className = "keyboardRow";

            row.forEach((key) => {
                const keyButton = document.createElement("button");
                keyButton.type = "button";
                keyButton.className = "key";
                keyButton.textContent =
                    key === "SPACE" ? "SPACE" :
                    key === "ENTER" ? "ENTER" : key;

                if (key === "SPACE") keyButton.classList.add("space");
                if (key === "ENTER") keyButton.classList.add("enter");
                if (key === "⌫") keyButton.classList.add("backspace");

                keyButton.addEventListener("pointerdown", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    playKeySound();
                    handleKeyboardKey(key);
                });

                rowElement.appendChild(keyButton);
            });

            keyboard.appendChild(rowElement);
        });
    }

    function openKeyboard(target) {
        if (!keyboard || !target) return;

        keyboardTarget = target;
        keyboardText =
            target.dataset.value !== undefined
                ? target.dataset.value
                : target.value || "";

        keyboard.classList.add("open");
        updateTypingDisplay();

        // Keep the text field visible inside the app window.
        try {
            target.scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        } catch (error) {
            // Scrolling is optional.
        }
    }

    function closeKeyboard() {
        if (keyboard) keyboard.classList.remove("open");
        keyboardTarget = null;
        keyboardText = "";
    }

    function updateTypingDisplay() {
        if (!keyboardTarget) return;

        keyboardTarget.dataset.value = keyboardText;

        if (keyboardTarget.id === "slapTextBar") {
            if (keyboardText.length > 0) {
                keyboardTarget.textContent = keyboardText;
                keyboardTarget.classList.remove("placeholder");
            } else {
                keyboardTarget.textContent = "Tap here to type...";
                keyboardTarget.classList.add("placeholder");
            }
            return;
        }

        if ("value" in keyboardTarget) {
            keyboardTarget.value = keyboardText;
        } else {
            keyboardTarget.textContent =
                keyboardText || "Tap here to type...";
        }
    }

    function handleKeyboardKey(key) {
        if (!keyboardTarget) return;

        if (key === "⌫") {
            keyboardText = keyboardText.slice(0, -1);
        } else if (key === "SPACE") {
            keyboardText += " ";
        } else if (key === "ENTER") {
            const submittedText = keyboardText.trim();
            const submittedApp = currentApp;

            keyboardTarget.dataset.value = keyboardText;
            updateTypingDisplay();
            closeKeyboard();

            if (submittedApp === "Lingo") {
                setText(
                    "translation",
                    submittedText ? submittedText + " → Hello!" : ""
                );
            } else if (submittedApp === "SplashFace") {
                if (submittedText) {
                    setText("statusResult", "✨ Draft: " + submittedText);
                }
            } else if (submittedApp === "Slap") {
                if (slapTypingArea) {
                    slapTypingArea.classList.remove("open");
                }
            }

            return;
        } else {
            keyboardText += key;
        }

        updateTypingDisplay();
    }

    function makeKeyboardInput(id) {
        const input = $(id);
        if (!input) return;

        input.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        });

        input.addEventListener("focus", () => {
            // Prevent the native mobile keyboard from being needed.
            if (input.hasAttribute("readonly")) {
                openKeyboard(input);
            }
        });
    }

    /* =========================================================
       APP WINDOWS
       ========================================================= */

    function closeCurrentApp() {
        closeKeyboard();

        const video = $("samCatVideo");
        if (video) {
            try {
                video.pause();
                video.removeAttribute("src");
                video.load();
            } catch (error) {
                // Ignore media cleanup errors.
            }
        }

        if (appWindow) appWindow.classList.remove("open");
        if (appContent) appContent.innerHTML = "";
        if (slapTypingArea) slapTypingArea.classList.remove("open");

        currentApp = null;
    }

    if (closeApp) {
        closeApp.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    if (homeButton) {
        homeButton.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

        homeButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    /* =========================================================
       INVISIBLE APP HOTSPOTS
       ========================================================= */

    function clearAppButtons() {
        phoneArea.querySelectorAll(".appButton").forEach((element) => {
            element.remove();
        });
    }

    function addApp(name, left, top, width = 11, height = 11) {
        const hotspot = document.createElement("button");

        hotspot.type = "button";
        hotspot.className = "appButton";
        hotspot.setAttribute("aria-label", name);
        hotspot.title = name;

        Object.assign(hotspot.style, {
            position: "absolute",
            left: left + "%",
            top: top + "%",
            width: width + "%",
            height: height + "%",
            padding: "0",
            margin: "0",
            border: "0",
            background: "transparent",
            color: "transparent",
            cursor: "pointer",
            zIndex: "5"
        });

        hotspot.addEventListener("pointerdown", (event) => {
            event.stopPropagation();
        });

        hotspot.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openApp(name);
        });

        phoneArea.appendChild(hotspot);
    }

    /* =========================================================
       PAGE 1
       ========================================================= */

    function showPage1() {
        currentPage = "page1";
        closeCurrentApp();
        phoneImage.src = PAGE1;
        clearAppButtons();

        [
            ["Messages", 43, 25],
            ["Camera", 54, 25],
            ["Social Fast", 36, 36],
            ["Stocks", 47, 36],
            ["Maps", 58, 36],
            ["Photos", 36, 47],
            ["Weather", 47, 47],
            ["Notes", 58, 47],
            ["iPodTunes", 30, 58],
            ["Settings", 41, 58],
            ["Clock", 52, 58],
            ["Videos", 63, 58]
        ].forEach((app) => addApp(...app));
    }

    /* =========================================================
       PAGE 2
       ========================================================= */

    function showPage2() {
        currentPage = "page2";
        closeCurrentApp();
        phoneImage.src = PAGE2;
        clearAppButtons();

        [
            ["Lingo", 38, 25],
            ["SplashFace", 51, 25],
            ["Thumb", 31, 36],
            ["DanWarp", 44, 36],
            ["Image", 56, 36],
            ["Chrono", 31, 47],
            ["ZapLook", 44, 47],
            ["Weather", 56, 47],
            ["Music", 27, 58],
            ["Monkey", 40, 58],
            ["Remark", 52, 58],
            ["Settings", 63, 58]
        ].forEach((app) => addApp(...app));
    }

    /* =========================================================
       THE SLAP
       ========================================================= */

    function showSlap() {
        currentPage = "slap";
        closeCurrentApp();
        phoneImage.src = SLAP;
        clearAppButtons();

        if (slapTypingArea) {
            slapTypingArea.classList.add("open");
        }

        if (slapTextBar) {
            slapTextBar.dataset.value = "";
            slapTextBar.textContent = "Tap here to type...";
            slapTextBar.classList.add("placeholder");
        }
    }

    if (slapTextBar) {
        slapTextBar.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            currentApp = "Slap";
            openKeyboard(slapTextBar);
        });
    }

    /* =========================================================
       APP CONTENT
       ========================================================= */

    function openApp(name) {
        if (!appWindow || !appContent || !appTitle) {
            console.error(
                "Pear Phone: Missing #appWindow, #appTitle, or #appContent in index.html."
            );
            return;
        }

        closeKeyboard();

        if (slapTypingArea) slapTypingArea.classList.remove("open");

        currentApp = name;
        appTitle.textContent = name === "SplashFace" ? "Splash Face" : name;
        appContent.innerHTML = "";
        appWindow.classList.add("open");

        /* MESSAGES */
        if (name === "Messages") {
            setHTML(`
                ${card("<b>Alex</b><br>Hey! What are you doing?")}
                ${card("<b>Mom</b><br>Don't forget dinner!")}
                <input id="messageInput" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${button("Send Message", "sendMessage")}
                ${card('<div id="messageResult">No new messages.</div>')}
            `);

            makeKeyboardInput("messageInput");

            bind("sendMessage", "click", () => {
                const text = safeValue("messageInput").trim();
                message(
                    text ? "✓ Sent: " + text : "Type something first!",
                    "messageResult"
                );
            });
        }

        /* CAMERA */
        else if (name === "Camera") {
            setHTML(`
                ${card('<div style="text-align:center;font-size:52px" id="cameraEmoji">📷</div>')}
                ${button("📸 Take Picture", "takePicture")}
                ${button("⚡ Toggle Flash", "toggleFlash")}
                <p id="cameraResult" style="text-align:center">Camera ready.</p>
            `);

            let count = 0;
            let flashOn = false;

            bind("takePicture", "click", () => {
                count++;
                message("📸 Picture " + count + " captured!", "cameraResult");
                setText("cameraEmoji", "✨📷✨");
            });

            bind("toggleFlash", "click", () => {
                flashOn = !flashOn;
                message(flashOn ? "⚡ Flash ON" : "Flash OFF", "cameraResult");
            });
        }

        /* SOCIAL FAST */
        else if (name === "Social Fast") {
            setHTML(`
                ${card("<b>🔥 Trending</b><p>#PearPhone</p>")}
                ${card("<b>👤 Alex</b><p>This phone is crazy 😂</p>")}
                <input id="socialPost" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${button("📤 Post", "postSocial")}
                <p id="socialResult" style="text-align:center"></p>
            `);

            makeKeyboardInput("socialPost");

            bind("postSocial", "click", () => {
                const text = safeValue("socialPost").trim();
                message(
                    text ? "🔥 Posted: " + text : "Write something first!",
                    "socialResult"
                );
            });
        }

        /* STOCKS */
        else if (name === "Stocks") {
            setHTML(`
                ${card("<b>🍐 Pear Inc.</b><br><br>$182.42<br>📈 +3.24%")}
                ${card("<b>💻 TechCo</b><br><br>$94.18<br>📈 +1.82%")}
                ${button("🔄 Refresh", "refreshStocks")}
                <p id="stocksResult" style="text-align:center">Market data is simulated.</p>
            `);

            bind("refreshStocks", "click", () => {
                message("✓ Prices refreshed (demo).", "stocksResult");
            });
        }

        /* MAPS */
        else if (name === "Maps") {
            setHTML(`
                <input id="mapSearch" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${card('<div style="height:90px;background:#83c9ff;display:grid;place-items:center;font-size:42px">🗺️</div>')}
                ${button("📍 Find Location", "findMap")}
                <p id="mapResult" style="text-align:center"></p>
            `);

            makeKeyboardInput("mapSearch");

            bind("findMap", "click", () => {
                const location = safeValue("mapSearch").trim();
                message(
                    location ? "📍 Destination: " + location : "📍 Current location (demo)",
                    "mapResult"
                );
            });
        }

        /* PHOTOS */
        else if (name === "Photos") {
            setHTML(`
                <h3>📸 My Photos</h3>
                <div class="photoGrid">
                    <div class="photo">🌴</div><div class="photo">🌊</div>
                    <div class="photo">🐶</div><div class="photo">🏖️</div>
                    <div class="photo">🌅</div><div class="photo">📸</div>
                </div>
                ${button("➕ Add Photo", "addPhoto")}
                ${button("🔀 Shuffle", "shufflePhotos")}
                <p id="photoResult" style="text-align:center"></p>
            `);

            bind("addPhoto", "click", () => {
                message("📸 Demo photo added!", "photoResult");
            });

            bind("shufflePhotos", "click", () => {
                const grid = appContent.querySelector(".photoGrid");
                if (grid) {
                    for (let i = grid.children.length; i >= 0; i--) {
                        grid.appendChild(grid.children[Math.random() * i | 0]);
                    }
                }
                message("🔀 Photos shuffled!", "photoResult");
            });
        }

        /* WEATHER */
        else if (name === "Weather") {
            setHTML(`
                ${card('<div style="text-align:center"><div style="font-size:44px">☀️</div><h2>72°F</h2><p>Sunny</p><p>Feels like 74°F</p></div>')}
                ${button("🔄 Refresh", "refreshWeather")}
                <p id="weatherResult" style="text-align:center">Demo weather</p>
            `);

            bind("refreshWeather", "click", () => {
                message("☀️ Weather refreshed (demo).", "weatherResult");
            });
        }

        /* NOTES */
        else if (name === "Notes") {
            setHTML(`
                <input id="noteTitle" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                <textarea id="noteBody" class="appTextarea" placeholder="Tap here to type..." readonly data-value=""></textarea>
                ${button("💾 Save Note", "saveNote")}
                ${button("🗑️ Clear", "clearNote")}
                <p id="noteResult" style="text-align:center"></p>
            `);

            makeKeyboardInput("noteTitle");
            makeKeyboardInput("noteBody");

            bind("saveNote", "click", () => {
                const title = safeValue("noteTitle").trim();
                const body = safeValue("noteBody").trim();
                message(
                    title || body ? "✓ Note saved (demo)!" : "Write a note first!",
                    "noteResult"
                );
            });

            bind("clearNote", "click", () => {
                ["noteTitle", "noteBody"].forEach((id) => {
                    const element = $(id);
                    if (element) {
                        element.value = "";
                        element.dataset.value = "";
                    }
                });
                message("Note cleared.", "noteResult");
            });
        }

        /* SETTINGS */
        else if (name === "Settings") {
            setHTML(`
                ${card("<b>Wi-Fi</b><br>🟢 Connected")}
                ${card("<b>Bluetooth</b><br>🔵 On")}
                ${card('<b>Brightness</b><br><input id="brightness" type="range" min="0" max="100" value="80" style="width:100%">')}
                ${card("<b>Battery</b><br>🔋 87%")}
                ${button("Save Settings", "saveSettings")}
                <p id="settingsResult" style="text-align:center"></p>
            `);

            bind("saveSettings", "click", () => {
                message("✓ Settings saved (demo).", "settingsResult");
            });
        }

        /* MUSIC / IPOD TUNES */
        else if (name === "Music" || name === "iPodTunes") {
            setHTML(`
                ${card('<div style="text-align:center"><div style="font-size:48px">🎵</div><b>Pear Tunes</b><p id="songName">Sam & Cat intro</p></div>')}
                <video id="samCatVideo" controls playsinline preload="metadata" style="width:100%;max-height:150px;display:block">
                    <source src="${VIDEO_FILE}" type="video/mp4">
                    Your browser cannot play this video.
                </video>
                ${button("▶ Play Intro", "playIntro")}
                ${button("⏸ Pause", "pauseIntro")}
                <p id="musicResult" style="text-align:center">Put ${VIDEO_FILE} beside index.html and app.js.</p>
            `);

            bind("playIntro", "click", async () => {
                const video = $("samCatVideo");
                if (!video) return;

                try {
                    await video.play();
                    message("▶ Playing Sam & Cat intro.", "musicResult");
                } catch (error) {
                    message(
                        "Can't play the video. Check the filename and upload the MP4.",
                        "musicResult"
                    );
                }
            });

            bind("pauseIntro", "click", () => {
                const video = $("samCatVideo");
                if (video) video.pause();
                message("⏸ Paused.", "musicResult");
            });
        }

        /* CLOCK / CHRONO */
        else if (name === "Clock" || name === "Chrono") {
            setHTML(`
                <div id="clockTime" style="font-size:28px;text-align:center;margin:15px"></div>
                <div id="clockDate" style="text-align:center"></div>
                ${button("🔄 Update Time", "updateTime")}
            `);

            const updateTime = () => {
                setText("clockTime", new Date().toLocaleTimeString());
                setText("clockDate", new Date().toLocaleDateString());
            };

            updateTime();
            bind("updateTime", "click", updateTime);
        }

        /* LINGO */
        else if (name === "Lingo") {
            setHTML(`
                ${card("<b>🌎 Lingo Translator</b><p>Type something below.</p>")}
                <input id="lingoWord" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${button("🌎 Translate", "translate")}
                <p id="translation" style="text-align:center"></p>
            `);

            makeKeyboardInput("lingoWord");

            bind("translate", "click", () => {
                const word = safeValue("lingoWord").trim();
                message(word ? word + " → Hello! (demo)" : "Type something first!", "translation");
            });
        }

        /* SPLASH FACE */
        else if (name === "SplashFace") {
            setHTML(`
                ${card('<div style="text-align:center"><div style="font-size:44px">😎</div><b>Splash Face</b><p>Share your mood.</p></div>')}
                <input id="status" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${button("😄 Happy", "happyFace")}
                ${button("😎 Cool", "coolFace")}
                ${button("😢 Sad", "sadFace")}
                ${button("📤 Post", "postStatus")}
                ${card('<div id="statusResult">No status posted yet.</div>')}
            `);

            makeKeyboardInput("status");

            const addEmoji = (emoji) => {
                const input = $("status");
                if (!input) return;
                input.dataset.value = emoji + " " + (input.dataset.value || "");
                openKeyboard(input);
            };

            bind("happyFace", "click", () => addEmoji("😄"));
            bind("coolFace", "click", () => addEmoji("😎"));
            bind("sadFace", "click", () => addEmoji("😢"));

            bind("postStatus", "click", () => {
                const value = safeValue("status").trim();
                message(
                    value ? "✨ Posted: " + value : "Type a status first!",
                    "statusResult"
                );
            });
        }

        /* THUMB */
        else if (name === "Thumb") {
            setHTML(`
                <div id="thumbFace" style="text-align:center;font-size:60px">👍</div>
                ${button("👍 Thumbs Up", "thumb")}
                <h2 id="thumbCount" style="text-align:center">0</h2>
                <p id="thumbMessage" style="text-align:center">Give it a thumbs up!</p>
            `);

            let count = 0;
            bind("thumb", "click", () => {
                count++;
                setText("thumbCount", String(count));
                setText("thumbMessage", count >= 10 ? "🔥 You're on fire!" : "👍 Nice!");
            });
        }

        /* DANWARP */
        else if (name === "DanWarp") {
            setHTML(`
                ${card('<div style="text-align:center;font-size:40px">🌀</div><b>DanWarp</b><p>Entertainment Center</p>')}
                ${button("🌀 WARP", "warp")}
                ${button("📺 Shows", "shows")}
                ${button("🎬 Episodes", "episodes")}
                <p id="warpResult" style="text-align:center">Ready.</p>
            `);

            bind("warp", "click", () => message("🌀 WARP ACTIVATED!", "warpResult"));
            bind("shows", "click", () => message("📺 Show library opened (demo).", "warpResult"));
            bind("episodes", "click", () => message("🎬 Episode library ready (demo).", "warpResult"));
        }

        /* IMAGE */
        else if (name === "Image") {
            setHTML(`
                ${card('<div style="text-align:center;font-size:50px">🖼️</div>')}
                <input id="imageUpload" type="file" accept="image/*" class="appInput">
                <img id="imagePreview" alt="Selected image preview" style="display:none;width:100%;max-height:100px;object-fit:contain">
                ${button("✨ Rotate Image", "rotateImage")}
                <p id="imageResult" style="text-align:center">Choose an image to preview it.</p>
            `);

            bind("imageUpload", "change", () => {
                const input = $("imageUpload");
                const preview = $("imagePreview");

                if (!input || !preview || !input.files || !input.files[0]) return;

                const file = input.files[0];
                if (preview.dataset.objectUrl) {
                    URL.revokeObjectURL(preview.dataset.objectUrl);
                }

                const url = URL.createObjectURL(file);
                preview.dataset.objectUrl = url;
                preview.src = url;
                preview.style.display = "block";
                preview.style.transform = "rotate(0deg)";
                preview.dataset.rotation = "0";
                message("🖼️ " + file.name, "imageResult");
            });

            bind("rotateImage", "click", () => {
                const preview = $("imagePreview");
                if (!preview || !preview.src) return;

                const rotation = ((Number(preview.dataset.rotation || 0) + 90) % 360);
                preview.dataset.rotation = String(rotation);
                preview.style.transform = "rotate(" + rotation + "deg)";
            });
        }

        /* ZAPLOOK */
        else if (name === "ZapLook") {
            setHTML(`
                <input id="zapSearchInput" class="appInput" placeholder="Tap here to type..." readonly data-value="">
                ${button("🔎 Search", "zapSearchButton")}
                ${card('<div id="zapResult">Search for something.</div>')}
            `);

            makeKeyboardInput("zapSearchInput");

            bind("zapSearchButton", "click", () => {
                const search = safeValue("zapSearchInput").trim();
                message(
                    search ? "🔎 Searching for: " + search + " (demo)" : "Type something first!",
                    "zapResult"
                );
            });
        }

        /* MONKEY */
        else if (name === "Monkey") {
            setHTML(`
                <div id="monkeyFace" style="text-align:center;font-size:60px">🐒</div>
                ${button("🐒 Activate Monkey", "monkey")}
                ${button("💃 Monkey Dance", "monkeyDance")}
                <p id="monkeyResult" style="text-align:center"></p>
            `);

            bind("monkey", "click", () => {
                setText("monkeyFace", "🙈🐒🙉");
                message("🐒 OOO OOO AAH AAH!", "monkeyResult");
            });

            bind("monkeyDance", "click", () => {
                setText("monkeyFace", "🕺🐒🕺");
                message("🐒 MONKEY DANCE!", "monkeyResult");
            });
        }

        /* REMARK */
        else if (name === "Remark") {
            setHTML(`
                <textarea id="remark" class="appTextarea" placeholder="Tap here to type..." readonly data-value=""></textarea>
                ${button("💾 Save Remark", "saveRemark")}
                ${button("🗑️ Clear", "clearRemark")}
                <p id="remarkResult" style="text-align:center"></p>
            `);

            makeKeyboardInput("remark");

            bind("saveRemark", "click", () => {
                const value = safeValue("remark").trim();
                message(value ? "✓ Remark saved (demo)!" : "Write something first!", "remarkResult");
            });

            bind("clearRemark", "click", () => {
                const input = $("remark");
                if (input) {
                    input.value = "";
                    input.dataset.value = "";
                }
                message("Remark cleared.", "remarkResult");
            });
        }

        /* VIDEOS */
        else if (name === "Videos") {
            setHTML(`
                ${card('<div style="text-align:center;font-size:45px">🎬</div><b>Pear Videos</b>')}
                ${button("▶ Featured Video", "featuredVideo")}
                ${button("🎲 Random Video", "randomVideo")}
                <p id="videoResult" style="text-align:center">Choose a video.</p>
            `);

            bind("featuredVideo", "click", () => {
                message("▶ Add your video file to the video app to play it.", "videoResult");
            });

            bind("randomVideo", "click", () => {
                const videos = ["Comedy Clip", "Music Video", "Funny Moment", "Sam & Cat Clip"];
                message("🎲 Selected: " + videos[Math.floor(Math.random() * videos.length)], "videoResult");
            });
        }

        /* GENERIC FALLBACK FOR ANY OTHER APP */
        else {
            setHTML(`
                ${card("<h3></h3><p>Welcome to this Pear Phone app.</p>")}
                ${button("✨ Open", "genericAction")}
                <p id="genericResult" style="text-align:center"></p>
            `);

            const heading = appContent.querySelector("h3");
            if (heading) heading.textContent = name;

            bind("genericAction", "click", () => {
                message("✓ " + name + " is ready!", "genericResult");
            });
        }
    }

    /* =========================================================
       SWIPES
       Ignore gestures inside apps, keyboard, and app hotspots.
       ========================================================= */

    function isInteractiveTarget(target) {
        if (!target || !target.closest) return false;

        return Boolean(
            target.closest("#appWindow") ||
            target.closest("#pearKeyboard") ||
            target.closest("#pearHomeButton") ||
            target.closest(".appButton") ||
            target.closest("#slapTypingArea")
        );
    }

    phoneArea.addEventListener("pointerdown", (event) => {
        if (isInteractiveTarget(event.target)) {
            swipeStart = null;
            return;
        }

        swipeStart = {
            x: event.clientX,
            y: event.clientY,
            pointerId: event.pointerId
        };
    });

    phoneArea.addEventListener("pointerup", (event) => {
        if (!swipeStart) return;

        const start = swipeStart;
        swipeStart = null;

        if (isInteractiveTarget(event.target)) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minimum = 60;

        // Side-to-side: open The Slap; from The Slap return to Page 1.
        if (absX >= minimum && absX > absY) {
            if (currentPage === "slap") {
                showPage1();
            } else {
                showSlap();
            }
            return;
        }

        // Swipe up: Page 1 -> Page 2.
        if (absY >= minimum && absY > absX) {
            if (deltaY < 0 && currentPage === "page1") {
                showPage2();
            } else if (deltaY > 0 && currentPage === "page2") {
                showPage1();
            }
        }
    });

    phoneArea.addEventListener("pointercancel", () => {
        swipeStart = null;
    });

    /* Prevent app gestures from bubbling into phone swipes. */
    if (appWindow) {
        ["pointerdown", "pointerup", "click"].forEach((eventName) => {
            appWindow.addEventListener(eventName, (event) => {
                event.stopPropagation();
            });
        });
    }

    if (keyboard) {
        ["pointerdown", "pointerup", "click"].forEach((eventName) => {
            keyboard.addEventListener(eventName, (event) => {
                event.stopPropagation();
            });
        });
    }

    /* =========================================================
       START
       ========================================================= */

    createKeyboard();
    showPage1();

    console.log("Pear Phone app.js loaded successfully.");
})();
