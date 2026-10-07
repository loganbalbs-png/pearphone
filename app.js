const phoneContainer = document.getElementById("phone-container");
const phoneImage = document.getElementById("phone-image");

const appScreen = document.getElementById("app-screen");
const appTitle = document.getElementById("app-title");
const appDescription = document.getElementById("app-description");
const backButton = document.getElementById("back-button");


let currentPage = 1;

let startX = 0;
let startY = 0;

let swipeStarted = false;


// ======================================================
// PAGE IMAGES
// ======================================================

const pages = {
    1: "Parphone.png",
    2: "Parphone Page 2.png",
    slap: "Slap.com.png"
};


// ======================================================
// SHOW PAGE
// ======================================================

function showPage(page) {

    removeButtons();

    currentPage = page;

    if (page === 1) {

        phoneImage.src = pages[1];

        createPage1Buttons();

    }

    else if (page === 2) {

        phoneImage.src = pages[2];

        createPage2Buttons();

    }

    else if (page === "slap") {

        phoneImage.src = pages.slap;

        createSlapButtons();
    }
}


// ======================================================
// REMOVE OLD CLICKABLE AREAS
// ======================================================

function removeButtons() {

    document.querySelectorAll(".app-button").forEach(button => {
        button.remove();
    });
}


// ======================================================
// CREATE AN INVISIBLE BUTTON OVER AN APP
//
// x/y/width/height are percentages of the picture.
// ======================================================

function createButton(name, x, y, width, height, action) {

    const button = document.createElement("button");

    button.className = "app-button";

    button.dataset.app = name;

    button.style.left = x + "%";
    button.style.top = y + "%";

    button.style.width = width + "%";
    button.style.height = height + "%";

    button.addEventListener("pointerdown", function(event) {

        event.stopPropagation();

    });

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        action();

    });

    phoneContainer.appendChild(button);
}


// ======================================================
// PAGE 1
// ======================================================

function createPage1Buttons() {

    /*
     * These are the app positions on YOUR picture.
     *
     * We can fine-tune them after you test it.
     */


    // Messages
    createButton(
        "Messages",
        41, 26,
        18, 12,
        () => openApp("Messages")
    );


    // Camera
    createButton(
        "Camera",
        56, 26,
        17, 12,
        () => openApp("Camera")
    );


    // Social Fast
    createButton(
        "Social Fast",
        37, 37,
        17, 12,
        () => openApp("Social Fast")
    );


    // Stocks
    createButton(
        "Stocks",
        47, 37,
        17, 12,
        () => openApp("Stocks")
    );


    // Maps
    createButton(
        "Maps",
        58, 37,
        17, 12,
        () => openApp("Maps")
    );


    // Photos
    createButton(
        "Photos",
        37, 48,
        17, 12,
        () => openApp("Photos")
    );


    // Weather
    createButton(
        "Weather",
        48, 48,
        17, 12,
        () => openApp("Weather")
    );


    // Notes
    createButton(
        "Notes",
        58, 48,
        17, 12,
        () => openApp("Notes")
    );


    // iPodTunes
    createButton(
        "iPodTunes",
        31, 58,
        17, 12,
        () => openApp("iPodTunes")
    );


    // Settings
    createButton(
        "Settings",
        42, 58,
        17, 12,
        () => openApp("Settings")
    );


    // Clock
    createButton(
        "Clock",
        53, 58,
        17, 12,
        () => openApp("Clock")
    );


    // Videos
    createButton(
        "Videos",
        63, 58,
        17, 12,
        () => openApp("Videos")
    );
}


// ======================================================
// PAGE 2
// ======================================================

function createPage2Buttons() {

    // Lingo
    createButton(
        "Lingo",
        39, 25,
        18, 12,
        () => openApp("Lingo")
    );


    // SplashFace
    createButton(
        "SplashFace",
        53, 25,
        18, 12,
        () => openApp("SplashFace")
    );


    // Thumb
    createButton(
        "Thumb",
        32, 36,
        18, 12,
        () => openApp("Thumb")
    );


    // DanWarp
    createButton(
        "DanWarp",
        44, 36,
        18, 12,
        () => openApp("DanWarp")
    );


    // Image
    createButton(
        "Image",
        56, 36,
        18, 12,
        () => openApp("Image")
    );


    // Chrono
    createButton(
        "Chrono",
        32, 48,
        18, 12,
        () => openApp("Chrono")
    );


    // ZapLook
    createButton(
        "ZapLook",
        44, 48,
        18, 12,
        () => openApp("ZapLook")
    );


    // Weather
    createButton(
        "Weather",
        56, 48,
        18, 12,
        () => openApp("Weather")
    );


    // Music
    createButton(
        "Music",
        27, 59,
        18, 12,
        () => openApp("Music")
    );


    // Monkey
    createButton(
        "Monkey",
        40, 59,
        18, 12,
        () => openApp("Monkey")
    );


    // Remark
    createButton(
        "Remark",
        51, 59,
        18, 12,
        () => openApp("Remark")
    );


    // Settings
    createButton(
        "Settings",
        62, 59,
        18, 12,
        () => openApp("Settings")
    );
}


// ======================================================
// SLAP.COM
// ======================================================

function createSlapButtons() {

    /*
     * These will eventually become the actual
     * interactive Slap.com controls.
     *
     * For now the picture itself is displayed.
     */
}


// ======================================================
// OPEN AN APP
// ======================================================

function openApp(name) {

    appTitle.textContent = name;

    appDescription.textContent =
        name + " app";

    appScreen.classList.add("open");
}


// ======================================================
// CLOSE APP
// ======================================================

backButton.addEventListener("click", function() {

    appScreen.classList.remove("open");

});


// ======================================================
// SWIPE START
// ======================================================

phoneContainer.addEventListener("pointerdown", function(event) {

    startX = event.clientX;
    startY = event.clientY;

    swipeStarted = true;

});


// ======================================================
// SWIPE END
// ======================================================

phoneContainer.addEventListener("pointerup", function(event) {

    if (!swipeStarted) {
        return;
    }

    swipeStarted = false;


    const endX = event.clientX;
    const endY = event.clientY;


    const deltaX = endX - startX;
    const deltaY = endY - startY;


    const minimumSwipe = 60;


    // ------------------------------------------
    // HORIZONTAL SWIPE
    // ------------------------------------------

    if (Math.abs(deltaX) > Math.abs(deltaY)) {

        if (Math.abs(deltaX) >= minimumSwipe) {

            showPage("slap");

        }

        return;
    }


    // ------------------------------------------
    // VERTICAL SWIPE
    // ------------------------------------------

    if (Math.abs(deltaY) >= minimumSwipe) {

        // Swipe UP → Page 2
        if (deltaY < 0) {

            if (currentPage === 1) {
                showPage(2);
            }

        }

        // Swipe DOWN → Page 1
        else {

            if (currentPage === 2) {
                showPage(1);
            }

        }

    }

});


// ======================================================
// START ON PAGE 1
// ======================================================

showPage(1);
