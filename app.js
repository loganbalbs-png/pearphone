const phone = document.getElementById("phone");
const phoneImage = document.getElementById("phoneImage");

const appScreen = document.getElementById("app");
const appName = document.getElementById("appName");
const appDescription = document.getElementById("appDescription");
const backButton = document.getElementById("back");

let currentPage = 1;

let startX = 0;
let startY = 0;


/* =====================================================
   EXACT FILE NAMES
   ===================================================== */

const PAGE1 = "pearphone.png";
const PAGE2 = "pearphonepage2.png";
const SLAP = "theslap.png";


/* =====================================================
   OPEN AN APP
   ===================================================== */

function openApp(name) {

    appName.textContent = name;

    appDescription.textContent = name + " app";

    appScreen.classList.add("open");
}


/* =====================================================
   CLOSE APP
   ===================================================== */

backButton.addEventListener("click", function () {

    appScreen.classList.remove("open");

});


/* =====================================================
   REMOVE INVISIBLE BUTTONS
   ===================================================== */

function clearButtons() {

    const buttons = document.querySelectorAll(".app");

    buttons.forEach(function (button) {
        button.remove();
    });

}


/* =====================================================
   CREATE INVISIBLE APP BUTTON
   ===================================================== */

function addButton(name, x, y, width, height) {

    const button = document.createElement("button");

    button.className = "app";

    button.setAttribute("aria-label", name);

    button.style.left = x + "%";
    button.style.top = y + "%";

    button.style.width = width + "%";
    button.style.height = height + "%";

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        openApp(name);

    });

    phone.appendChild(button);

}


/* =====================================================
   PAGE 1
   pearphone.png
   ===================================================== */

function page1() {

    currentPage = 1;

    clearButtons();

    phoneImage.src = PAGE1;


    /*
       These buttons are positioned over the
       actual icons in pearphone.png.
    */


    // Messages
    addButton(
        "Messages",
        46,
        28,
        11,
        11
    );


    // Camera
    addButton(
        "Camera",
        57,
        28,
        11,
        11
    );


    // Social Fast
    addButton(
        "Social Fast",
        40,
        39,
        11,
        11
    );


    // Stocks
    addButton(
        "Stocks",
        50,
        39,
        11,
        11
    );


    // Maps
    addButton(
        "Maps",
        61,
        39,
        11,
        11
    );


    // Photos
    addButton(
        "Photos",
        40,
        50,
        11,
        11
    );


    // Weather
    addButton(
        "Weather",
        51,
        50,
        11,
        11
    );


    // Notes
    addButton(
        "Notes",
        62,
        50,
        11,
        11
    );


    // iPodTunes
    addButton(
        "iPodTunes",
        33,
        60,
        11,
        11
    );


    // Settings
    addButton(
        "Settings",
        44,
        60,
        11,
        11
    );


    // Clock
    addButton(
        "Clock",
        55,
        60,
        11,
        11
    );


    // Videos
    addButton(
        "Videos",
        66,
        60,
        11,
        11
    );

}


/* =====================================================
   PAGE 2
   pearphonepage2.png
   ===================================================== */

function page2() {

    currentPage = 2;

    clearButtons();

    phoneImage.src = PAGE2;


    // Lingo
    addButton(
        "Lingo",
        40,
        28,
        11,
        11
    );


    // SplashFace
    addButton(
        "SplashFace",
        53,
        28,
        11,
        11
    );


    // Thumb
    addButton(
        "Thumb",
        33,
        39,
        11,
        11
    );


    // DanWarp
    addButton(
        "DanWarp",
        46,
        39,
        11,
        11
    );


    // Image
    addButton(
        "Image",
        59,
        39,
        11,
        11
    );


    // Chrono
    addButton(
        "Chrono",
        33,
        51,
        11,
        11
    );


    // ZapLook
    addButton(
        "ZapLook",
        46,
        51,
        11,
        11
    );


    // Weather
    addButton(
        "Weather",
        59,
        51,
        11,
        11
    );


    // Music
    addButton(
        "Music",
        28,
        62,
        11,
        11
    );


    // Monkey
    addButton(
        "Monkey",
        41,
        62,
        11,
        11
    );


    // Remark
    addButton(
        "Remark",
        54,
        62,
        11,
        11
    );


    // Settings
    addButton(
        "Settings",
        66,
        62,
        11,
        11
    );

}


/* =====================================================
   SHOW THE SLAP
   ===================================================== */

function slap() {

    clearButtons();

    phoneImage.src = SLAP;

    currentPage = 0;

}


/* =====================================================
   SWIPE DETECTION
   ===================================================== */

phone.addEventListener("pointerdown", function (event) {

    startX = event.clientX;
    startY = event.clientY;

});


phone.addEventListener("pointerup", function (event) {

    const endX = event.clientX;
    const endY = event.clientY;

    const changeX = endX - startX;
    const changeY = endY - startY;

    const absX = Math.abs(changeX);
    const absY = Math.abs(changeY);

    const minimum = 60;


    /* Horizontal swipe */

    if (absX > absY && absX > minimum) {

        if (currentPage === 0) {

            page1();

        } else {

            slap();

        }

        return;
    }


    /* Vertical swipe */

    if (absY > absX && absY > minimum) {

        if (changeY < 0) {

            /* Swipe UP */

            if (currentPage === 1) {
                page2();
            }

        } else {

            /* Swipe DOWN */

            if (currentPage === 2) {
                page1();
            }

        }

    }

});


/* =====================================================
   START ON PAGE 1
   ===================================================== */

page1();
