"use strict";

(() => {
    /* =====================================================
       PEAR PHONE — COMPLETE APP SCRIPT
       Keep these files beside index.html:
       pearphone.png
       pearphonepage2.png
       theslap.png
       samandcatintro.mp4
       ===================================================== */

    const $ = id => document.getElementById(id);

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
            "Pear Phone: index.html must contain #phoneArea and #phoneImage."
        );
        return;
    }

    const PAGE1 = "pearphone.png";
    const PAGE2 = "pearphonepage2.png";
    const SLAP = "theslap.png";
    
    const VIDEO_FILE = "videos/samandcatintro.mp4";
   
    let currentPage = "page1";
    let currentApp = null;
    let swipeStart = null;
    let keyboardTarget = null;
    let keyboardText = "";
    let audioContext = null;

    /* =====================================================
       HELPERS
       ===================================================== */

    function setText(id, value) {
        const element = $(id);
        if (element) element.textContent = value;
    }

    function setHTML(value) {
        if (appContent) appContent.innerHTML = value;
    }

    function bind(id, eventName, callback) {
        const element = $(id);
        if (element) element.addEventListener(eventName, callback);
    }

    function card(content) {
        return `<div class="card">${content}</div>`;
    }

    function button(label, id) {
        return `<button type="button" id="${id}" class="appButtonLarge">${label}</button>`;
    }

    function getValue(id) {
        const element = $(id);
        if (!element) return "";

        if (element.dataset.value !== undefined) {
            return element.dataset.value;
        }

        return element.value || "";
    }

    function setResult(id, value) {
        setText(id, value);
    }

    /* =====================================================
       KEYBOARD SOUNDS
       Only the custom keyboard plays key sounds.
       ===================================================== */

    function playKeySound() {
        try {
            const AudioCtor =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioCtor) return;

            if (!audioContext) {
                audioContext = new AudioCtor();
            }

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
            // Keyboard still works if audio is unavailable.
        }
    }

    /* =====================================================
       CUSTOM KEYBOARD
       ===================================================== */

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

        keyboardRows.forEach(row => {
            const rowElement = document.createElement("div");
            rowElement.className = "keyboardRow";

            row.forEach(key => {
                const keyButton = document.createElement("button");

                keyButton.type = "button";
                keyButton.className = "key";
                keyButton.textContent =
                    key === "SPACE" || key === "ENTER"
                        ? key
                        : key;

                if (key === "SPACE") {
                    keyButton.classList.add("space");
                }

                if (key === "ENTER") {
                    keyButton.classList.add("enter");
                }

                if (key === "⌫") {
                    keyButton.classList.add("backspace");
                }

                keyButton.addEventListener("pointerdown", event => {
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
        if (keyboard) {
            keyboard.classList.remove("open");
        }

        keyboardTarget = null;
        keyboardText = "";
    }

    function updateTypingDisplay() {
        if (!keyboardTarget) return;

        keyboardTarget.dataset.value = keyboardText;

        if (keyboardTarget.id === "slapTextBar") {
            if (keyboardText.length) {
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
            }

            if (submittedApp === "Slap" && slapTypingArea) {
                slapTypingArea.classList.remove("open");
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

        input.addEventListener("pointerdown", event => {
            event.preventDefault();
            event.stopPropagation();
            openKeyboard(input);
        });
    }

    /* =====================================================
       CLOSE APP
       ===================================================== */

    function closeCurrentApp() {
        closeKeyboard();

        const video = $("samCatVideo");

        if (video) {
            try {
                video.pause();
            } catch (error) {
                // Ignore media cleanup errors.
            }
        }

        if (appWindow) {
            appWindow.classList.remove("open");
        }

        if (appContent) {
            appContent.innerHTML = "";
        }

        if (slapTypingArea) {
            slapTypingArea.classList.remove("open");
        }

        currentApp = null;
    }

    if (closeApp) {
        closeApp.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    if (homeButton) {
        homeButton.addEventListener("pointerdown", event => {
            event.preventDefault();
            event.stopPropagation();
        });

        homeButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    /* =====================================================
       INVISIBLE APP TOUCH ZONES

       The existing app coordinates are retained.
       Zones are reduced and rounded to fit closer to icons.
       ===================================================== */

    function clearAppButtons() {
        phoneArea.querySelectorAll(".appButton").forEach(button => {
            button.remove();
        });
    }

    function addApp(name, left, top, width = 11, height = 11) {
        const hotspot = document.createElement("button");

        hotspot.type = "button";
        hotspot.className = "appButton";
        hotspot.setAttribute("aria-label", name);
        hotspot.title = name;

        // Shrink the existing zone and move it inward so
        // the clickable area is centered more closely on the icon.
        const insetX = width * 0.10;
        const insetY = height * 0.10;

        Object.assign(hotspot.style, {
            position: "absolute",
            left: (left + insetX) + "%",
            top: (top + insetY) + "%",
            width: (width - insetX * 2) + "%",
            height: (height - insetY * 2) + "%",
            padding: "0",
            margin: "0",
            border: "0",
            borderRadius: "24%",
            background: "transparent",
            color: "transparent",
            cursor: "pointer",
            zIndex: "5",
            touchAction: "manipulation"
        });

        hotspot.addEventListener("pointerdown", event => {
            event.stopPropagation();
        });

        hotspot.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openApp(name);
        });

        phoneArea.appendChild(hotspot);
    }

    /* =====================================================
       PAGE 1
       ===================================================== */

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
        ].forEach(app => addApp(...app));
    }

    /* =====================================================
       PAGE 2
       ===================================================== */

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
        ].forEach(app => addApp(...app));
    }

    /* =====================================================
       THE SLAP
       ===================================================== */

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
        slapTextBar.addEventListener("pointerdown", event => {
            event.preventDefault();
            event.stopPropagation();

            currentApp = "Slap";
            openKeyboard(slapTextBar);
        });
    }

    /* =====================================================
       OPEN APP
       ===================================================== */

    function openApp(name) {
        if (!appWindow || !appTitle || !appContent) {
            console.error(
                "Pear Phone: Check #appWindow, #appTitle, and #appContent in index.html."
            );
            return;
        }

        closeKeyboard();

        if (slapTypingArea) {
            slapTypingArea.classList.remove("open");
        }

        currentApp = name;
        appTitle.textContent =
            name === "SplashFace" ? "Splash Face" : name;

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
                const value = getValue("messageInput").trim();

                setResult(
                    "messageResult",
                    value ? "✓ Sent: " + value : "Type something first!"
                );
            });
        }

        /* CAMERA */
        else if (name === "Camera") {
            setHTML(`
                ${card('<div id="cameraEmoji" style="text-align:center;font-size:52px">📷</div>')}
                ${button("📸 Take Picture", "takePicture")}
                ${button("⚡ Toggle Flash", "toggleFlash")}
                <p id="cameraResult" style="text-align:center">Camera ready.</p>
            `);

            let count = 0;
            let flashOn = false;

            bind("takePicture", "click", () => {
                count++;
                setText("cameraEmoji", "✨📷✨");
                setResult("cameraResult", "📸 Picture " + count + " captured!");
            });

            bind("toggleFlash", "click", () => {
                flashOn = !flashOn;
                setResult("cameraResult", flashOn ? "⚡ Flash ON" : "Flash OFF");
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
                const value = getValue("socialPost").trim();

                setResult(
                    "socialResult",
                    value ? "🔥 Posted: " + value : "Write something first!"
                );
            });
        }

        /* STOCKS */
        else if (name === "Stocks") {
            setHTML(`
                ${card("<b>🍐 Pear Inc.</b><br><br>$182.42<br>📈 +3.24%")}
                ${card("<b>💻 TechCo</b><br><br>$94.18<br>📈 +1.82%")}
                ${button("🔄 Refresh", "refreshStocks")}
                <p id="stocksResult" style="text-align:center">Demo stock prices.</p>
            `);

            bind("refreshStocks", "click", () => {
                setResult("stocksResult", "✓ Prices refreshed (demo).");
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
                const location = getValue("mapSearch").trim();

                setResult(
                    "mapResult",
                    location ? "📍 Destination: " + location : "📍 Current location (demo)"
                );
            });
        }

        /* PHOTOS */
        else if (name === "Photos") {
            setHTML(`
                <h3>📸 My Photos</h3>
                <div class="photoGrid">
                    <div class="photo">🌴</div>
                    <div class="photo">🌊</div>
                    <div class="photo">🐶</div>
                    <div class="photo">🏖️</div>
                    <div class="photo">🌅</div>
                    <div class="photo">📸</div>
                </div>
                ${button("➕ Add Photo", "addPhoto")}
                ${button("🔀 Shuffle", "shufflePhotos")}
                <p id="photoResult" style="text-align:center"></p>
            `);

            bind("addPhoto", "click", () => {
                setResult("photoResult", "📸 Demo photo added!");
            });

            bind("shufflePhotos", "click", () => {
                const grid = appContent.querySelector(".photoGrid");

                if (grid) {
                    const items = Array.from(grid.children);

                    for (let i = items.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [items[i], items[j]] = [items[j], items[i]];
                    }

                    items.forEach(item => grid.appendChild(item));
                }

                setResult("photoResult", "🔀 Photos shuffled!");
            });
        }

        /* WEATHER */
        else if (name === "Weather") {
            setHTML(`
                ${card('<div style="text-align:center"><div style="font-size:44px">☀️</div><h2>72°F</h2><p>Sunny</p><p>Feels like 74°F</p></div>')}
                ${button("🔄 Refresh", "refreshWeather")}
                <p id="weatherResult" style="text-align:center">Demo weather.</p>
            `);

            bind("refreshWeather", "click", () => {
                setResult("weatherResult", "☀️ Weather refreshed (demo).");
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
                const title = getValue("noteTitle").trim();
                const body = getValue("noteBody").trim();

                setResult(
                    "noteResult",
                    title || body ? "✓ Note saved (demo)!" : "Write a note first!"
                );
            });

            bind("clearNote", "click", () => {
                ["noteTitle", "noteBody"].forEach(id => {
                    const element = $(id);

                    if (element) {
                        element.value = "";
                        element.dataset.value = "";
                    }
                });

                setResult("noteResult", "Note cleared.");
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
                setResult("settingsResult", "✓ Settings saved (demo).");
            });
        }

        /* MUSIC / IPOD TUNES */
        else if (name === "Music" || name === "iPodTunes") {
            setHTML(`
                ${card('<div style="text-align:center"><div style="font-size:42px">🎵</div><b>Pear Tunes</b><p>Sam & Cat Intro</p></div>')}

                <video
                    id="samCatVideo"
                    controls
                    playsinline
                    preload="auto"
                    style="width:100%;max-height:180px;background:#222;display:block"
                >
                    <source src="./${VIDEO_FILE}" type="video/mp4">
                    Your browser cannot play this video.
                </video>

                ${button("▶ Play with Sound", "playIntro")}
                ${button("⏸ Pause", "pauseIntro")}

                <p id="musicResult" style="text-align:center">
                    Ready to play.
                </p>
            `);

            const video = $("samCatVideo");

            if (video) {
                video.muted = false;
                video.defaultMuted = false;
                video.volume = 1;

                video.addEventListener("error", () => {
                    setResult(
                        "musicResult",
                        "Video failed to load. Check the filename, upload, and MP4 format."
                    );

                    console.error(
                        "Pear Tunes video error:",
                        video.error
                    );
                });

                video.addEventListener("playing", () => {
                    setResult("musicResult", "▶ Playing with sound.");
                });

                video.addEventListener("ended", () => {
                    setResult("musicResult", "Intro finished.");
                });

                video.addEventListener("volumechange", () => {
                    if (video.muted) video.muted = false;
                });
            }

            bind("playIntro", "click", async () => {
                const player = $("samCatVideo");
                if (!player) return;

                player.muted = false;
                player.defaultMuted = false;
                player.volume = 1;

                try {
                    await player.play();
                    setResult("musicResult", "▶ Playing with sound.");
                } catch (error) {
                    setResult(
                        "musicResult",
                        "Playback failed. Check that the MP4 exists and uses a browser-compatible format."
                    );

                    console.error("Pear Tunes playback error:", error);
                }
            });

            bind("pauseIntro", "click", () => {
                const player = $("samCatVideo");

                if (player) player.pause();

                setResult("musicResult", "⏸ Paused.");
            });
        }

        /* CLOCK / CHRONO */
        else if (name === "Clock" || name === "Chrono") {
            setHTML(`
                <div id="clockTime" style="font-size:28px;text-align:center;margin:15px"></div>
                <div id="clockDate" style="text-align:center"></div>
                ${button("🔄 Update Time", "updateTime")}
            `);

            function updateTime() {
                setText("clockTime", new Date().toLocaleTimeString());
                setText("clockDate", new Date().toLocaleDateString());
            }

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
                const word = getValue("lingoWord").trim();

                setResult(
                    "translation",
                    word ? word + " → Hello! (demo)" : "Type something first!"
                );
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

            function addEmoji(emoji) {
                const input = $("status");
                if (!input) return;

                input.dataset.value = emoji + " " + (input.dataset.value || "");
                openKeyboard(input);
            }

            bind("happyFace", "click", () => addEmoji("😄"));
            bind("coolFace", "click", () => addEmoji("😎"));
            bind("sadFace", "click", () => addEmoji("😢"));

            bind("postStatus", "click", () => {
                const value = getValue("status").trim();

                setResult(
                    "statusResult",
                    value ? "✨ Posted: " + value : "Type a status first!"
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

                setText(
                    "thumbMessage",
                    count >= 10 ? "🔥 You're on fire!" : "👍 Nice!"
                );
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

            bind("warp", "click", () => {
                setResult("warpResult", "🌀 WARP ACTIVATED!");
            });

            bind("shows", "click", () => {
                setResult("warpResult", "📺 Show library opened (demo).");
            });

            bind("episodes", "click", () => {
                setResult("warpResult", "🎬 Episode library ready (demo).");
            });
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

                if (!input || !preview || !input.files || !input.files[0]) {
                    return;
                }

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

                setResult("imageResult", "🖼️ " + file.name);
            });

            bind("rotateImage", "click", () => {
                const preview = $("imagePreview");

                if (!preview || !preview.src) return;

                const rotation =
                    (Number(preview.dataset.rotation || 0) + 90) % 360;

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
                const search = getValue("zapSearchInput").trim();

                setResult(
                    "zapResult",
                    search ? "🔎 Searching for: " + search + " (demo)" : "Type something first!"
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
                setResult("monkeyResult", "🐒 OOO OOO AAH AAH!");
            });

            bind("monkeyDance", "click", () => {
                setText("monkeyFace", "🕺🐒🕺");
                setResult("monkeyResult", "🐒 MONKEY DANCE!");
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
                const value = getValue("remark").trim();

                setResult(
                    "remarkResult",
                    value ? "✓ Remark saved (demo)!" : "Write something first!"
                );
            });

            bind("clearRemark", "click", () => {
                const input = $("remark");

                if (input) {
                    input.value = "";
                    input.dataset.value = "";
                }

                setResult("remarkResult", "Remark cleared.");
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
                setResult(
                    "videoResult",
                    "▶ Add a video file to play it here."
                );
            });

            bind("randomVideo", "click", () => {
                const videos = [
                    "Comedy Clip",
                    "Music Video",
                    "Funny Moment",
                    "Sam & Cat Clip"
                ];

                const selected =
                    videos[Math.floor(Math.random() * videos.length)];

                setResult("videoResult", "🎲 Selected: " + selected);
            });
        }

        /* OTHER APPS */
        else {
            setHTML(`
                ${card("<h3></h3><p>Welcome to this Pear Phone app.</p>")}
                ${button("✨ Open", "genericAction")}
                <p id="genericResult" style="text-align:center"></p>
            `);

            const heading = appContent.querySelector("h3");
            if (heading) heading.textContent = name;

            bind("genericAction", "click", () => {
                setResult("genericResult", "✓ " + name + " is ready!");
            });
        }
    }

    /* =====================================================
       SWIPES
       ===================================================== */

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

    phoneArea.addEventListener("pointerdown", event => {
        if (isInteractiveTarget(event.target)) {
            swipeStart = null;
            return;
        }

        swipeStart = {
            x: event.clientX,
            y: event.clientY
        };
    });

    phoneArea.addEventListener("pointerup", event => {
        if (!swipeStart) return;

        const start = swipeStart;
        swipeStart = null;

        if (isInteractiveTarget(event.target)) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minimum = 60;

        // Side-to-side opens The Slap.
        // Side-to-side from The Slap returns to Page 1.
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

    if (appWindow) {
        ["pointerdown", "pointerup", "click"].forEach(eventName => {
            appWindow.addEventListener(eventName, event => {
                event.stopPropagation();
            });
        });
    }

    if (keyboard) {
        ["pointerdown", "pointerup", "click"].forEach(eventName => {
            keyboard.addEventListener(eventName, event => {
                event.stopPropagation();
            });
        });
    }

    /* =====================================================
       INITIALIZE
       ===================================================== */

    createKeyboard();
    showPage1();

    console.log("Pear Phone app.js loaded successfully.");
})();
