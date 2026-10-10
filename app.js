
/* ============================================================
   PEAR PHONE OS
   Extended interactive version
   Inspired by Sam & Cat
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ========================================================
       ELEMENTS
       ======================================================== */

    const phoneArea = document.getElementById("phoneArea");
    const phoneImage = document.getElementById("phoneImage");
    const homeButton = document.getElementById("pearHomeButton");
    const slapTypingArea = document.getElementById("slapTypingArea");
    const slapTextBar = document.getElementById("slapTextBar");
    const appWindow = document.getElementById("appWindow");
    const appTitle = document.getElementById("appTitle");
    const closeButton = document.getElementById("closeApp");
    const appContent = document.getElementById("appContent");
    const keyboard = document.getElementById("pearKeyboard");

    if (!phoneArea || !appWindow || !appContent) {
        console.error("Pear Phone: required HTML elements were not found.");
        return;
    }

    /* ========================================================
       CONFIGURATION
       ======================================================== */

    const CONFIG = {
        pageOneImage: "pearphone.png",
        pageTwoImage: "pearphonepage2.png",
        slapImage: "theslap.png",
        introVideo: "videos/samandcatintro.mp4",
        swipeThreshold: 55,
        keyboardSound: true,
        saveNotes: true
    };

    /* ========================================================
       STATE
       ======================================================== */

    const state = {
        currentPage: 1,
        currentScreen: "phone",
        currentApp: "",
        keyboardTarget: null,
        shift: false,
        capsLock: false,
        soundEnabled: true,
        musicVolume: 0.8,
        notes: "",
        messages: [],
        contacts: [
            { name: "Sam", emoji: "🥊" },
            { name: "Cat", emoji: "🐱" },
            { name: "Dice", emoji: "🎲" },
            { name: "Goomer", emoji: "💪" }
        ],
        photos: [],
        alarms: [],
        musicPlaying: false,
        lastOpenedApp: "",
        appHistory: [],
        stopwatchRunning: false,
        stopwatchSeconds: 0,
        calculatorValue: "0",
        theme: "classic"
    };

    /* ========================================================
       HELPERS
       ======================================================== */

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function makeButton(label, callback, className = "pearButton") {
        const button = createElement("button", className, label);
        button.type = "button";
        button.addEventListener("click", callback);
        return button;
    }

    function makeInput(placeholder, type = "text") {
        const input = createElement("input", "pearInput");
        input.type = type;
        input.placeholder = placeholder;
        input.autocomplete = "off";
        return input;
    }

    function makeCard(title, description = "") {
        const card = createElement("div", "pearCard");
        const heading = createElement("h3", "", title);

        card.appendChild(heading);

        if (description) {
            card.appendChild(createElement("p", "", description));
        }

        return card;
    }

    function makeStatus(message) {
        return createElement("p", "pearStatus", message);
    }

    function clearContent() {
        appContent.replaceChildren();

        if (keyboard) {
            keyboard.classList.remove("open");
            keyboard.replaceChildren();
        }

        if (slapTypingArea) {
            slapTypingArea.classList.remove("open");

            if (slapTypingArea.parentElement !== phoneArea) {
                phoneArea.appendChild(slapTypingArea);
            }
        }
    }

    function setTitle(title) {
        if (appTitle) appTitle.textContent = title;
    }

    function showWindow(title) {
        setTitle(title);
        appWindow.classList.add("open");
        state.currentScreen = "app";
        state.currentApp = title;
        state.lastOpenedApp = title;
        state.appHistory.push(title);

        if (state.appHistory.length > 50) {
            state.appHistory.shift();
        }
    }

    function setPage(page) {
        state.currentPage = page === 2 ? 2 : 1;

        if (phoneImage) {
            phoneImage.src = state.currentPage === 1
                ? CONFIG.pageOneImage
                : CONFIG.pageTwoImage;

            phoneImage.onerror = () => {
                console.warn("Pear Phone page image could not load.");
            };
        }

        document.querySelectorAll(".pearHotspot").forEach(button => {
            button.remove();
        });

        createHotspots();
    }

    function closeCurrentApp() {
        stopCurrentVideo();
        clearContent();

        appWindow.classList.remove("open");
        state.currentApp = "";
        state.currentScreen = "phone";
        state.keyboardTarget = null;

        if (keyboard) keyboard.classList.remove("open");

        if (phoneImage && state.currentScreen !== "slap") {
            phoneImage.src = state.currentPage === 1
                ? CONFIG.pageOneImage
                : CONFIG.pageTwoImage;
        }
    }

    /* ========================================================
       EXTRA STYLING
       Adds styles without changing index.html.
       ======================================================== */

    const extraStyles = document.createElement("style");

    extraStyles.textContent = `
        .pearButton {
            display: block;
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #777;
            border-radius: 8px;
            background: linear-gradient(#5fc5ff, #087fe0);
            color: white;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
        }

        .pearButton:active {
            transform: scale(.97);
            filter: brightness(.85);
        }

        .pearInput {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            margin: 4px 0;
            border: 1px solid #aaa;
            border-radius: 6px;
            font-size: 12px;
        }

        .pearCard {
            padding: 8px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: white;
            overflow-wrap: anywhere;
        }

        .pearCard h3 {
            margin: 0 0 5px;
            font-size: 13px;
        }

        .pearCard p {
            margin: 4px 0;
        }

        .pearStatus {
            padding: 6px;
            color: #444;
            font-size: 10px;
            overflow-wrap: anywhere;
        }

        .pearGrid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5px;
        }

        .pearGrid .pearButton {
            min-height: 45px;
        }

        .pearMessage {
            padding: 7px;
            margin: 5px 0;
            border-radius: 10px;
            background: #d8f8d0;
            overflow-wrap: anywhere;
        }

        .pearBubble {
            display: inline-block;
            max-width: 90%;
            padding: 7px;
            border-radius: 10px;
            background: #d8f8d0;
            color: #111;
        }

        .pearVideo {
            width: 100%;
            max-height: 190px;
            background: #000;
            border-radius: 8px;
        }

        .pearClock {
            padding: 12px 0;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
        }

        .pearPhotoTile {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 65px;
            border-radius: 8px;
            background: linear-gradient(135deg,#7de0ff,#ffb2dc);
            font-size: 25px;
        }

        .pearHotspot {
            position: absolute;
            z-index: 80;
            padding: 0;
            border: 0;
            background: transparent;
            cursor: pointer;
            touch-action: manipulation;
        }

        .pearHotspot:active {
            background: rgba(255,255,255,.16);
            border-radius: 50%;
        }

        #appWindow.open {
            display: flex;
            flex-direction: column;
        }

        #appContent {
            overflow: auto;
            overscroll-behavior: contain;
        }

        #pearKeyboard.open {
            display: block;
        }
    `;

    document.head.appendChild(extraStyles);

    /* ========================================================
       KEYBOARD SOUND
       Uses a short generated tone instead of an external file.
       ======================================================== */

    let audioContext = null;

    function playKeySound() {
        if (!state.soundEnabled || !CONFIG.keyboardSound) return;

        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            audioContext ||= new AudioContextClass();

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "square";
            oscillator.frequency.value = 620;

            gain.gain.setValueAtTime(0.035, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.035
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.04);
        } catch (error) {
            console.warn("Keyboard sound unavailable.", error);
        }
    }

    /* ========================================================
       CUSTOM PEAR KEYBOARD
       ======================================================== */

    const KEY_ROWS = [
        ["1","2","3","4","5","6","7","8","9","0"],
        ["q","w","e","r","t","y","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["⇧","z","x","c","v","b","n","m","⌫"],
        ["123","space",".","@","enter"]
    ];

    function buildKeyboard(target) {
        if (!keyboard) return;

        state.keyboardTarget = target;
        keyboard.replaceChildren();

        KEY_ROWS.forEach(row => {
            const rowElement = createElement("div", "keyboardRow");

            row.forEach(keyName => {
                const button = createElement("button", "key", keyName);
                button.type = "button";

                if (keyName === "space") button.classList.add("space");
                if (keyName === "enter") button.classList.add("enter");
                if (keyName === "⌫") button.classList.add("backspace");

                button.addEventListener("pointerdown", event => {
                    event.preventDefault();
                    playKeySound();
                    pressKey(keyName);
                });

                rowElement.appendChild(button);
            });

            keyboard.appendChild(rowElement);
        });

        keyboard.classList.add("open");
    }

    function pressKey(keyName) {
        const target = state.keyboardTarget;

        if (!target || !target.isConnected) return;

        if (keyName === "⇧") {
            state.shift = !state.shift;
            refreshKeyboardLabels();
            return;
        }

        if (keyName === "123") {
            state.capsLock = !state.capsLock;
            refreshKeyboardLabels();
            return;
        }

        if (keyName === "enter") {
            target.dispatchEvent(new KeyboardEvent("keydown", {
                key: "Enter",
                bubbles: true
            }));

            target.dispatchEvent(new Event("change", { bubbles: true }));
            return;
        }

        if (keyName === "⌫") {
            if (target.isContentEditable) {
                target.textContent = target.textContent.slice(0, -1);
            } else {
                const start = target.selectionStart ?? target.value.length;
                const end = target.selectionEnd ?? target.value.length;

                if (start === end && start > 0) {
                    target.value =
                        target.value.slice(0, start - 1) +
                        target.value.slice(end);

                    target.setSelectionRange(start - 1, start - 1);
                } else {
                    target.value =
                        target.value.slice(0, start) +
                        target.value.slice(end);

                    target.setSelectionRange(start, start);
                }
            }

            target.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        let character = keyName === "space" ? " " : keyName;

        if (character.length === 1 && /[a-z]/i.test(character)) {
            if (state.shift || state.capsLock) {
                character = character.toUpperCase();
            }

            if (state.shift) state.shift = false;
        }

        if (target.isContentEditable) {
            target.textContent += character;
        } else {
            const start = target.selectionStart ?? target.value.length;
            const end = target.selectionEnd ?? target.value.length;

            target.value =
                target.value.slice(0, start) +
                character +
                target.value.slice(end);

            try {
                target.setSelectionRange(
                    start + character.length,
                    start + character.length
                );
            } catch (_) {}
        }

        target.dispatchEvent(new Event("input", { bubbles: true }));
        refreshKeyboardLabels();
    }

    function refreshKeyboardLabels() {
        if (!keyboard) return;

        keyboard.querySelectorAll(".key").forEach(button => {
            const original = button.dataset.original || button.textContent;
            button.dataset.original = original;

            if (/^[a-z]$/i.test(original)) {
                button.textContent =
                    state.shift || state.capsLock
                        ? original.toUpperCase()
                        : original.toLowerCase();
            }
        });
    }

    function wireKeyboardInput(container = appContent) {
        container.querySelectorAll(
            "input[type='text'], input[type='search'], textarea, [contenteditable='true']"
        ).forEach(input => {
            input.addEventListener("focus", () => buildKeyboard(input));
        });
    }

    /* ========================================================
       PAGE HOTSPOTS
       ======================================================== */

    const PAGE_ONE_APPS = [
        ["Messages",43,25],
        ["Camera",54,25],
        ["Social Fast",36,36],
        ["Stocks",47,36],
        ["Maps",58,36],
        ["Photos",36,47],
        ["Weather",47,47],
        ["Notes",58,47],
        ["iPodTunes",30,58],
        ["Settings",41,58],
        ["Clock",52,58],
        ["Videos",63,58]
    ];

    const PAGE_TWO_APPS = [
        ["Lingo",38,25],
        ["SplashFace",51,25],
        ["Thumb",31,36],
        ["DanWarp",44,36],
        ["Image",56,36],
        ["Chrono",31,47],
        ["ZapLook",44,47],
        ["Weather",56,47],
        ["Music",27,58],
        ["Monkey",40,58],
        ["Remark",52,58],
        ["Settings",63,58]
    ];

    function createHotspots() {
        document.querySelectorAll(".pearHotspot").forEach(element => {
            element.remove();
        });

        const apps = state.currentPage === 1
            ? PAGE_ONE_APPS
            : PAGE_TWO_APPS;

        apps.forEach(([name, x, y]) => {
            const button = createElement("button", "pearHotspot");
            button.type = "button";
            button.setAttribute("aria-label", name);
            button.title = name;

            /* Small invisible hit areas centred on the app location. */
            button.style.left = `${x - 4.5}%`;
            button.style.top = `${y - 4.5}%`;
            button.style.width = "9%";
            button.style.height = "9%";

            button.addEventListener("click", () => openApp(name));

            phoneArea.appendChild(button);
        });
    }

    /* ========================================================
       TOUCH AND MOUSE SWIPING
       ======================================================== */

    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerActive = false;

    phoneArea.addEventListener("pointerdown", event => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        pointerActive = true;
    });

    phoneArea.addEventListener("pointerup", event => {
        if (!pointerActive) return;
        pointerActive = false;

        if (appWindow.classList.contains("open")) return;

        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;

        if (
            Math.abs(dx) < CONFIG.swipeThreshold &&
            Math.abs(dy) < CONFIG.swipeThreshold
        ) return;

        if (Math.abs(dy) > Math.abs(dx)) {
            if (dy < 0) {
                setPage(2);
            } else {
                setPage(1);
            }
        } else {
            if (dx < 0) {
                openSlap();
            } else {
                setPage(1);
            }
        }
    });

    phoneArea.addEventListener("pointercancel", () => {
        pointerActive = false;
    });

    /* ========================================================
       SLAP APP
       ======================================================== */

    function openSlap() {
        showWindow("The Slap");
        clearContent();

        const heading = createElement("h3", "", "The Slap");
        const description = createElement(
            "p",
            "",
            "Post something to The Slap!"
        );

        const input = makeInput("What's happening?");
        const postButton = makeButton("Post", () => {
            const message = input.value.trim();

            if (!message) return;

            const post = makeCard("Your Slap Post", message);
            appContent.insertBefore(post, input);
            input.value = "";
        });

        appContent.append(heading, description, input, postButton);
        buildKeyboard(input);
    }

    /* ========================================================
       VIDEO PLAYER
       ======================================================== */

    let currentVideo = null;

    function stopCurrentVideo() {
        if (!currentVideo) return;

        try {
            currentVideo.pause();
            currentVideo.removeAttribute("src");
            currentVideo.load();
        } catch (error) {
            console.warn("Could not stop video.", error);
        }

        currentVideo = null;
        state.musicPlaying = false;
    }

    function renderPearTunes() {
        const heading = createElement("h3", "", "Pear Tunes");
        const description = createElement(
            "p",
            "",
            "Watch the Sam & Cat intro."
        );

        const video = createElement("video", "pearVideo");
        video.id = "samCatVideo";
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.volume = state.musicVolume;

        const source = document.createElement("source");
        source.src = CONFIG.introVideo;
        source.type = "video/mp4";

        video.appendChild(source);
        currentVideo = video;

        const status = makeStatus(
            "Ready. Press Play Sam & Cat Intro."
        );

        const playButton = makeButton(
            "▶ Play Sam & Cat Intro",
            async () => {
                try {
                    await video.play();
                    state.musicPlaying = true;
                    status.textContent = "Now playing.";
                } catch (error) {
                    status.textContent =
                        "Playback failed. Check the video path and format.";
                    console.error(error);
                }
            }
        );

        const pauseButton = makeButton("⏸ Pause", () => {
            video.pause();
            state.musicPlaying = false;
            status.textContent = "Paused.";
        });

        const restartButton = makeButton("↻ Restart", () => {
            video.currentTime = 0;
            video.play().then(() => {
                state.musicPlaying = true;
                status.textContent = "Restarting intro.";
            }).catch(error => {
                status.textContent = "Press play to start the video.";
                console.warn(error);
            });
        });

        const volumeLabel = createElement("label", "", "Volume");
        const volume = createElement("input", "pearInput");
        volume.type = "range";
        volume.min = "0";
        volume.max = "1";
        volume.step = "0.05";
        volume.value = String(state.musicVolume);

        volume.addEventListener("input", () => {
            state.musicVolume = Number(volume.value);
            video.volume = state.musicVolume;
        });

        video.addEventListener("playing", () => {
            state.musicPlaying = true;
            status.textContent = "Now playing.";
        });

        video.addEventListener("pause", () => {
            state.musicPlaying = false;
        });

        video.addEventListener("ended", () => {
            state.musicPlaying = false;
            status.textContent = "The intro has finished.";
        });

        video.addEventListener("error", () => {
            status.textContent =
                "Video could not load. Confirm videos/samandcatintro.mp4 exists.";
        });

        appContent.append(
            heading,
            description,
            video,
            playButton,
            pauseButton,
            restartButton,
            volumeLabel,
            volume,
            status
        );
    }

    /* ========================================================
       MESSAGES
       ======================================================== */

    function renderMessages() {
        appContent.appendChild(
            createElement("h3", "", "Messages")
        );

        const contactSelect = document.createElement("select");
        contactSelect.className = "pearInput";

        state.contacts.forEach(contact => {
            const option = document.createElement("option");
            option.value = contact.name;
            option.textContent = `${contact.emoji} ${contact.name}`;
            contactSelect.appendChild(option);
        });

        const input = makeInput("Write a message...");
        const sendButton = makeButton("Send Message", () => {
            const message = input.value.trim();
            if (!message) return;

            state.messages.push({
                contact: contactSelect.value,
                text: message,
                time: new Date().toLocaleTimeString()
            });

            input.value = "";
            renderMessages();
        });

        appContent.append(contactSelect, input, sendButton);

        const history = makeCard("Conversation History");

        if (!state.messages.length) {
            history.appendChild(
                createElement("p", "", "No messages yet.")
            );
        }

        state.messages.forEach(message => {
            const bubble = createElement("div", "pearMessage");
            bubble.textContent =
                `${message.contact}: ${message.text} (${message.time})`;
            history.appendChild(bubble);
        });

        appContent.appendChild(history);
        wireKeyboardInput();
    }

    /* ========================================================
       NOTES
       ======================================================== */

    function renderNotes() {
        appContent.appendChild(createElement("h3", "", "Notes"));

        const textarea = createElement("textarea", "appTextarea");
        textarea.placeholder = "Write your notes...";
        textarea.value = state.notes;

        const saveButton = makeButton("Save Note", () => {
            state.notes = textarea.value;

            try {
                if (CONFIG.saveNotes) {
                    localStorage.setItem("pearPhoneNotes", state.notes);
                }
            } catch (_) {}

            status.textContent = "Note saved.";
        });

        const status = makeStatus("Your notes stay here while this page is open.");

        try {
            state.notes =
                localStorage.getItem("pearPhoneNotes") || state.notes;
            textarea.value = state.notes;
        } catch (_) {}

        appContent.append(textarea, saveButton, status);
        wireKeyboardInput();
    }

    /* ========================================================
       PHOTOS
       ======================================================== */

    function renderPhotos() {
        appContent.appendChild(createElement("h3", "", "Photos"));

        const grid = createElement("div", "pearGrid");

        const tiles = [
            ["🌅", "Sunset"],
            ["🌴", "Vacation"],
            ["🐱", "Cat"],
            ["🎬", "Sam & Cat"],
            ["📸", "Camera"],
            ["⭐", "Favorites"]
        ];

        tiles.forEach(([emoji, label]) => {
            const tile = makeButton(`${emoji} ${label}`, () => {
                const message = makeStatus(`${label} selected.`);
                appContent.appendChild(message);
            });

            grid.appendChild(tile);
        });

        appContent.appendChild(grid);

        const upload = makeInput("Choose a photo");
        upload.type = "file";
        upload.accept = "image/*";

        upload.addEventListener("change", () => {
            const file = upload.files && upload.files[0];
            if (!file) return;

            const image = document.createElement("img");
            image.alt = file.name;
            image.style.width = "100%";
            image.style.marginTop = "8px";
            image.style.borderRadius = "8px";
            image.src = URL.createObjectURL(file);

            appContent.appendChild(image);
        });

        appContent.appendChild(upload);
    }

    /* ========================================================
       CAMERA
       ======================================================== */

    let cameraStream = null;

    async function renderCamera() {
        appContent.appendChild(createElement("h3", "", "Camera"));

        const preview = document.createElement("video");
        preview.className = "pearVideo";
        preview.autoplay = true;
        preview.playsInline = true;

        const status = makeStatus(
            "Camera permission is required to use the camera."
        );

        const start = makeButton("Start Camera", async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Camera access is unavailable.");
                }

                cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });

                preview.srcObject = cameraStream;
                status.textContent = "Camera is running.";
            } catch (error) {
                status.textContent =
                    "Camera could not start. Check browser permissions.";
                console.error(error);
            }
        });

        const capture = makeButton("Take Snapshot", () => {
            if (!preview.videoWidth) {
                status.textContent = "Start the camera first.";
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = preview.videoWidth;
            canvas.height = preview.videoHeight;

            canvas.getContext("2d").drawImage(
                preview, 0, 0, canvas.width, canvas.height
            );

            const image = document.createElement("img");
            image.src = canvas.toDataURL("image/png");
            image.alt = "Camera snapshot";
            image.style.width = "100%";

            appContent.appendChild(image);
        });

        appContent.append(preview, start, capture, status);
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
    }

    /* ========================================================
       WEATHER
       ======================================================== */

    function renderWeather() {
        appContent.appendChild(createElement("h3", "", "Weather"));

        const card = makeCard(
            "Today's Forecast",
            "☀️ Mostly sunny"
        );

        card.appendChild(createElement("p", "", "Temperature: 22°C"));
        card.appendChild(createElement("p", "", "Feels like: 24°C"));
        card.appendChild(createElement("p", "", "Wind: Light breeze"));
        card.appendChild(createElement("p", "", "Forecast: Sunny intervals"));

        appContent.appendChild(card);

        appContent.appendChild(
            makeStatus("Sample weather display; live weather is not connected.")
        );

        appContent.appendChild(
            makeButton("Refresh Forecast", () => {
                appContent.appendChild(
                    makeStatus("Forecast refreshed.")
                );
            })
        );
    }

    /* ========================================================
       SETTINGS
       ======================================================== */

    function renderSettings() {
        appContent.appendChild(createElement("h3", "", "Settings"));

        const soundButton = makeButton(
            `Keyboard Sounds: ${state.soundEnabled ? "ON" : "OFF"}`,
            () => {
                state.soundEnabled = !state.soundEnabled;
                renderCurrentApp();
            }
        );

        const pageOneButton = makeButton(
            "Go to Page 1",
            () => {
                closeCurrentApp();
                setPage(1);
            }
        );

        const pageTwoButton = makeButton(
            "Go to Page 2",
            () => {
                closeCurrentApp();
                setPage(2);
            }
        );

        const themeButton = makeButton(
            `Theme: ${state.theme}`,
            () => {
                state.theme = state.theme === "classic"
                    ? "blue"
                    : "classic";

                document.body.style.background =
                    state.theme === "blue" ? "#dcefff" : "#ffffff";

                renderCurrentApp();
            }
        );

        const resetButton = makeButton("Reset App View", () => {
            closeCurrentApp();
            setPage(1);
        });

        appContent.append(
            soundButton,
            themeButton,
            pageOneButton,
            pageTwoButton,
            resetButton
        );
    }

    /* ========================================================
       CLOCK AND CHRONO
       ======================================================== */

    let clockInterval = null;
    let stopwatchInterval = null;

    function renderClock() {
        appContent.appendChild(createElement("h3", "", "Clock"));

        const clock = createElement("div", "pearClock");

        function updateClock() {
            if (clock.isConnected) {
                clock.textContent = new Date().toLocaleTimeString();
            }
        }

        updateClock();

        clearInterval(clockInterval);
        clockInterval = setInterval(updateClock, 1000);

        appContent.appendChild(clock);

        const date = createElement(
            "p",
            "",
            new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        );

        appContent.appendChild(date);
    }

    function renderChrono() {
        appContent.appendChild(createElement("h3", "", "Chrono"));

        const display = createElement("div", "pearClock", "00:00:00");

        function updateDisplay() {
            const total = state.stopwatchSeconds;
            const hours = Math.floor(total / 3600);
            const minutes = Math.floor((total % 3600) / 60);
            const seconds = total % 60;

            display.textContent = [
                hours, minutes, seconds
            ].map(number => String(number).padStart(2, "0")).join(":");
        }

        const startButton = makeButton("Start", () => {
            if (state.stopwatchRunning) return;

            state.stopwatchRunning = true;

            stopwatchInterval = setInterval(() => {
                state.stopwatchSeconds++;
                updateDisplay();
            }, 1000);
        });

        const pauseButton = makeButton("Pause", () => {
            state.stopwatchRunning = false;
            clearInterval(stopwatchInterval);
        });

        const resetButton = makeButton("Reset", () => {
            state.stopwatchRunning = false;
            clearInterval(stopwatchInterval);
            state.stopwatchSeconds = 0;
            updateDisplay();
        });

        appContent.append(display, startButton, pauseButton, resetButton);
    }

    /* ========================================================
       CALCULATOR
       ======================================================== */

    function renderCalculator() {
        appContent.appendChild(createElement("h3", "", "Calculator"));

        const display = makeInput("0");
        display.readOnly = true;
        display.value = state.calculatorValue;

        const grid = createElement("div", "pearGrid");

        [
            "7","8","9","÷",
            "4","5","6","×",
            "1","2","3","−",
            "C","0","=","+"
        ].forEach(symbol => {
            grid.appendChild(makeButton(symbol, () => {
                if (symbol === "C") {
                    state.calculatorValue = "0";
                } else if (symbol === "=") {
                    calculateResult();
                } else {
                    state.calculatorValue =
                        state.calculatorValue === "0"
                            ? symbol
                            : state.calculatorValue + symbol;
                }

                display.value = state.calculatorValue;
            }));
        });

        function calculateResult() {
            const expression = state.calculatorValue
                .replaceAll("÷", "/")
                .replaceAll("×", "*")
                .replaceAll("−", "-");

            if (!/^[0-9+\-*/(). ]+$/.test(expression)) {
                state.calculatorValue = "Error";
                return;
            }

            try {
                const result = Function(
                    `"use strict"; return (${expression})`
                )();

                state.calculatorValue =
                    Number.isFinite(result) ? String(result) : "Error";
            } catch (_) {
                state.calculatorValue = "Error";
            }
        }

        appContent.append(display, grid);
    }

    /* ========================================================
       LINGO
       ======================================================== */

    function renderLingo() {
        appContent.appendChild(createElement("h3", "", "Lingo"));

        const input = makeInput("Type something...");
        const output = makeCard("Translation", "Your translated text will appear here.");

        const translate = makeButton("Translate", () => {
            const text = input.value.trim();

            output.replaceChildren(
                createElement("h3", "", "Translation"),
                createElement(
                    "p",
                    "",
                    text
                        ? `You said: ${text}`
                        : "Type something first."
                )
            );
        });

        appContent.append(input, translate, output);
        wireKeyboardInput();
    }

    /* ========================================================
       SPLASH FACE
       ======================================================== */

    function renderSplashFace() {
        appContent.appendChild(createElement("h3", "", "Splash Face"));

        const preview = createElement("div", "pearPhotoTile", "📸");
        preview.style.minHeight = "100px";

        const caption = makeInput("Write a caption...");
        const choosePhoto = makeInput("Choose an image");
        choosePhoto.type = "file";
        choosePhoto.accept = "image/*";

        choosePhoto.addEventListener("change", () => {
            const file = choosePhoto.files && choosePhoto.files[0];
            if (!file) return;

            const image = document.createElement("img");
            image.src = URL.createObjectURL(file);
            image.alt = "Splash Face image";
            image.style.width = "100%";
            image.style.borderRadius = "8px";

            preview.replaceChildren(image);
        });

        const share = makeButton("Share Splash", () => {
            const card = makeCard(
                "Splash Face Post",
                caption.value || "My new Splash Face post!"
            );

            appContent.appendChild(card);
        });

        appContent.append(preview, choosePhoto, caption, share);
        wireKeyboardInput();
    }

    /* ========================================================
       THUMB
       ======================================================== */

    function renderThumb() {
        appContent.appendChild(createElement("h3", "", "Thumb"));

        const countDisplay = createElement("div", "pearClock", "👍 0");
        let count = 0;

        appContent.appendChild(countDisplay);

        appContent.appendChild(makeButton("Give a Thumb", () => {
            count++;
            countDisplay.textContent = `👍 ${count}`;
        }));

        appContent.appendChild(makeButton("Reset Thumbs", () => {
            count = 0;
            countDisplay.textContent = "👍 0";
        }));
    }

    /* ========================================================
       DANWARP
       ======================================================== */

    function renderDanWarp() {
        appContent.appendChild(createElement("h3", "", "DanWarp"));

        appContent.appendChild(makeCard(
            "DanWarp",
            "A place for show updates and behind-the-scenes ideas."
        ));

        const updates = [
            "Sam & Cat",
            "Behind the scenes",
            "Cast moments",
            "Comedy clips"
        ];

        updates.forEach(item => {
            appContent.appendChild(makeButton(item, () => {
                appContent.appendChild(
                    makeStatus(`${item} selected.`)
                );
            }));
        });
    }

    /* ========================================================
       IMAGE APP
       ======================================================== */

    function renderImage() {
        appContent.appendChild(createElement("h3", "", "Image"));

        const picker = makeInput("Choose an image");
        picker.type = "file";
        picker.accept = "image/*";

        const preview = document.createElement("img");
        preview.alt = "Image preview";
        preview.style.width = "100%";
        preview.style.borderRadius = "8px";

        picker.addEventListener("change", () => {
            const file = picker.files && picker.files[0];
            if (file) preview.src = URL.createObjectURL(file);
        });

        appContent.append(picker, preview);
    }

    /* ========================================================
       ZAPLOOK
       ======================================================== */

    function renderZapLook() {
        appContent.appendChild(createElement("h3", "", "ZapLook"));

        const search = makeInput("Search...");
        const results = makeCard("Search Results", "Enter a search term.");

        const searchButton = makeButton("Search", () => {
            results.replaceChildren(
                createElement("h3", "", "Search Results"),
                createElement(
                    "p",
                    "",
                    search.value.trim()
                        ? `You searched for: ${search.value.trim()}`
                        : "Please enter a search term."
                )
            );
        });

        appContent.append(search, searchButton, results);
        wireKeyboardInput();
    }

    /* ========================================================
       MONKEY
       ======================================================== */

    function renderMonkey() {
        appContent.appendChild(createElement("h3", "", "Monkey"));

        const emoji = createElement("div", "pearClock", "🐒");

        appContent.appendChild(emoji);

        appContent.appendChild(makeButton("Monkey Sound", () => {
            playKeySound();
        }));

        appContent.appendChild(makeButton("Change Monkey", () => {
            emoji.textContent = ["🐒","🙈","🙉","🙊"][
                Math.floor(Math.random() * 4)
            ];
        }));
    }

    /* ========================================================
       REMARK
       ======================================================== */

    function renderRemark() {
        appContent.appendChild(createElement("h3", "", "Remark"));

        const input = makeInput("Write a remark...");
        const list = createElement("div", "");

        const add = makeButton("Add Remark", () => {
            const text = input.value.trim();
            if (!text) return;

            const card = makeCard("Remark", text);
            list.prepend(card);
            input.value = "";
        });

        appContent.append(input, add, list);
        wireKeyboardInput();
    }

    /* ========================================================
       MAPS
       ======================================================== */

    function renderMaps() {
        appContent.appendChild(createElement("h3", "", "Maps"));

        appContent.appendChild(makeCard(
            "Pear Maps",
            "Map preview"
        ));

        const destination = makeInput("Enter a destination...");
        const search = makeButton("Find Destination", () => {
            const place = destination.value.trim();

            appContent.appendChild(makeStatus(
                place
                    ? `Destination: ${place}`
                    : "Enter a destination first."
            ));
        });

        appContent.append(destination, search);
        wireKeyboardInput();
    }

    /* ========================================================
       STOCKS
       ======================================================== */

    function renderStocks() {
        appContent.appendChild(createElement("h3", "", "Stocks"));

        [
            ["PEAR", "$42.80", "+2.4%"],
            ["SAM", "$18.25", "+0.8%"],
            ["CAT", "$27.10", "-0.5%"]
        ].forEach(([name, price, change]) => {
            appContent.appendChild(makeCard(
                name,
                `${price}  |  ${change}`
            ));
        });

        appContent.appendChild(makeStatus(
            "Example stock prices; not live financial data."
        ));
    }

    /* ========================================================
       SOCIAL FAST
       ======================================================== */

    function renderSocialFast() {
        appContent.appendChild(createElement("h3", "", "Social Fast"));

        const input = makeInput("What's on your mind?");
        const feed = createElement("div", "");

        const postButton = makeButton("Post", () => {
            const text = input.value.trim();
            if (!text) return;

            const post = makeCard("Your Post", text);
            const like = makeButton("♡ Like", () => {
                like.textContent = like.textContent === "♡ Like"
                    ? "♥ Liked"
                    : "♡ Like";
            });

            post.appendChild(like);
            feed.prepend(post);
            input.value = "";
        });

        appContent.append(input, postButton, feed);
        wireKeyboardInput();
    }

    /* ========================================================
       VIDEOS
       ======================================================== */

    function renderVideos() {
        appContent.appendChild(createElement("h3", "", "Videos"));

        appContent.appendChild(makeCard(
            "Sam & Cat Intro",
            "Open Pear Tunes to play the intro video."
        ));

        appContent.appendChild(makeButton("Open Pear Tunes", () => {
            openApp("iPodTunes");
        }));

        const upload = makeInput("Choose a video");
        upload.type = "file";
        upload.accept = "video/*";

        upload.addEventListener("change", () => {
            const file = upload.files && upload.files[0];
            if (!file) return;

            stopCurrentVideo();

            const video = document.createElement("video");
            video.className = "pearVideo";
            video.controls = true;
            video.playsInline = true;
            video.src = URL.createObjectURL(file);

            currentVideo = video;
            appContent.appendChild(video);
        });

        appContent.appendChild(upload);
    }

    /* ========================================================
       APP ROUTER
       ======================================================== */

    function renderCurrentApp() {
        switch (state.currentApp) {
            case "Messages":
                renderMessages();
                break;

            case "Notes":
                renderNotes();
                break;

            case "Photos":
                renderPhotos();
                break;

            case "Camera":
                renderCamera();
                break;

            case "Weather":
                renderWeather();
                break;

            case "Settings":
                renderSettings();
                break;

            case "Clock":
                renderClock();
                break;

            case "Chrono":
                renderChrono();
                break;

            case "Lingo":
                renderLingo();
                break;

            case "SplashFace":
                renderSplashFace();
                break;

            case "Thumb":
                renderThumb();
                break;

            case "DanWarp":
                renderDanWarp();
                break;

            case "Image":
                renderImage();
                break;

            case "ZapLook":
                renderZapLook();
                break;

            case "Monkey":
                renderMonkey();
                break;

            case "Remark":
                renderRemark();
                break;

            case "Maps":
                renderMaps();
                break;

            case "Stocks":
                renderStocks();
                break;

            case "Social Fast":
                renderSocialFast();
                break;

            case "Videos":
                renderVideos();
                break;

            case "iPodTunes":
            case "Music":
                renderPearTunes();
                break;

            default:
                appContent.appendChild(
                    createElement("h3", "", state.currentApp)
                );

                appContent.appendChild(makeCard(
                    state.currentApp,
                    `${state.currentApp} is ready to use.`
                ));

                appContent.appendChild(makeButton(
                    "Back to Pear Phone",
                    closeCurrentApp
                ));
        }
    }

    /* ========================================================
       OPEN APP
       ======================================================== */

    function openApp(name) {
        stopCamera();
        stopCurrentVideo();

        clearContent();
        showWindow(name);

        if (name === "The Slap" || name === "Slap") {
            openSlap();
            return;
        }

        renderCurrentApp();
    }

    /* ========================================================
       HOME AND CLOSE CONTROLS
       ======================================================== */

    if (homeButton) {
        homeButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeCurrentApp();
        });
    }

    /* ========================================================
       KEYBOARD DISMISSAL
       ======================================================== */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (keyboard) keyboard.classList.remove("open");
            closeCurrentApp();
        }
    });

    /* ========================================================
       PREVENT PHONE IMAGE DRAGGING
       ======================================================== */

    if (phoneImage) {
        phoneImage.addEventListener("dragstart", event => {
            event.preventDefault();
        });
    }

    /* ========================================================
       CLEANUP ON APP SWITCH
       ======================================================== */

    function cleanupApp() {
        stopCamera();
        stopCurrentVideo();
        clearInterval(clockInterval);
        clearInterval(stopwatchInterval);
        state.stopwatchRunning = false;
    }

    const originalCloseCurrentApp = closeCurrentApp;

    closeButton?.addEventListener("click", cleanupApp);
    homeButton?.addEventListener("click", cleanupApp);

    /* ========================================================
       BOOT SEQUENCE
       ======================================================== */

    try {
        state.notes = localStorage.getItem("pearPhoneNotes") || "";
    } catch (_) {
        state.notes = "";
    }

    setPage(1);

    if (keyboard) {
        keyboard.classList.remove("open");
    }

    appWindow.classList.remove("open");

    console.log("Pear Phone OS loaded successfully.");
});
