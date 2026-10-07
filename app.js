const phone = document.getElementById("phone");
const phoneImage = document.getElementById("phoneImage");

const appScreen = document.getElementById("appScreen");
const appTitle = document.getElementById("appTitle");
const appText = document.getElementById("appText");
const backButton = document.getElementById("backButton");


/* =====================================================
   EXACT FILENAMES FROM YOUR GITHUB REPOSITORY
   ===================================================== */

const PAGE_1 = "pearphone.png";
const PAGE_2 = "pearphonepage2.png";
const SLAP = "theslap.png";


let currentScreen = "page1";


let startX = 0;
let startY = 0;
let trackingSwipe = false;


/* =====================================================
   SHOW THE PICTURE
   ===================================================== */

function showScreen(screen) {

    currentScreen = screen;

    removeButtons();

    if (screen === "page1") {

        phoneImage.src = PAGE_1;

        createPage1Buttons();

    }

    else if (screen === "page2") {

        phoneImage.src = PAGE_2;

        createPage2Buttons();

    }

    else if (screen === "slap") {

        phoneImage.src = SLAP;

        createSlapButtons();
    }
}


/* =====================================================
   REMOVE OLD INVISIBLE BUTTONS
   ===================================================== */

function removeButtons() {

    document.querySelectorAll(".appButton").forEach(button => {
        button.remove();
    });
}


/* =====================================================
   CREATE AN INVISIBLE BUTTON
   ===================================================== */

function addAppButton(name, left, top, width, height) {

    const button = document.createElement("button");

    button.className = "appButton";

    button.style.left = left + "%";
    button.style.top = top + "%";

    button.style.width = width + "%";
    button.style.height = height + "%";

    button.setAttribute("aria-label", name);

    button.addEventListener("pointerdown", function(event) {
        event.stopPropagation();
    });

    button.addEventListener("pointerup", function(event) {
        event.stopPropagation();
    });

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        openApp(name);
    });

    phone.appendChild(button);
}


/* =====================================================
   PAGE 1
   pearphone.png
   ===================================================== */

function createPage1Buttons() {

    addAppButton("Messages", 38, 25, 14, 12);

    addAppButton("Camera", 53, 25, 14, 12);

    addAppButton("Social Fast", 34, 35, 14, 12);

    addAppButton("Stocks", 46, 35, 14, 12);

    addAppButton("Maps", 57, 35, 14, 12);

    addAppButton("Photos", 34, 46, 14, 12);

    addAppButton("Weather", 46, 46, 14, 12);

    addAppButton("Notes", 57, 46, 14, 12);

    addAppButton("iPodTunes", 28, 56, 14, 12);

    addAppButton("Settings", 40, 56, 14, 12);

    addAppButton("Clock", 51, 56, 14, 12);

    addAppButton("Videos", 62, 56, 14, 12);
}


/* =====================================================
   PAGE 2
   pearphonepage2.png
   ===================================================== */

function createPage2Buttons() {

    addAppButton("Lingo", 38, 25, 14, 12);

    addAppButton("SplashFace", 51, 25, 14, 12);

    addAppButton("Thumb", 31, 36, 14, 12);

    addAppButton("DanWarp", 44, 36, 14, 12);

    addAppButton("Image", 56, 36, 14, 12);

    addAppButton("Chrono", 31, 47, 14, 12);

    addAppButton("ZapLook", 44, 47, 14, 12);

    addAppButton("Weather", 56, 47, 14, 12);

    addAppButton("Music", 27, 58, 14, 12);

    addAppButton("Monkey", 39, 58, 14, 12);

    addAppButton("Remark", 51, 58, 14, 12);

    addAppButton("Settings", 62, 58, 14, 12);
}


/* =====================================================
   THE SLAP
   theslap.png
   ===================================================== */

function createSlapButtons() {

    /*
     * TheSlap is currently displayed exactly as
     * your uploaded picture.
     *
     * We can make the text box, emoji selector,
     * keyboard, Home, Friends, Mail and Photos
     * interactive next.
     */
}


/* =====================================================
   OPEN AN APP
   ===================================================== */

function openApp(name) {

    appTitle.textContent = name;

    appText.textContent = name + " app";

    appScreen.classList.add("open");
}


/* =====================================================
   CLOSE APP
   ===================================================== */

backButton.addEventListener("click", function() {

    appScreen.classList.remove("open");

});


/* =====================================================
   SWIPE START
   ===================================================== */

phone.addEventListener("pointerdown", function(event) {

    startX = event.clientX;
    startY = event.clientY;

    trackingSwipe = true;
});


/* =====================================================
   SWIPE END
   ===================================================== */

phone.addEventListener("pointerup", function(event) {

    if (!trackingSwipe) {
        return;
    }

    trackingSwipe = false;

    const endX = event.clientX;
    const endY = event.clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const minimumSwipe = 60;


    /* -----------------------------
       SIDE TO SIDE
       ----------------------------- */

    if (Math.abs(deltaX) > Math.abs(deltaY)) {

        if (Math.abs(deltaX) >= minimumSwipe) {

            if (currentScreen === "slap") {

                showScreen("page1");

            } else {

                showScreen("slap");
            }
        }

        return;
    }


    /* -----------------------------
       UP / DOWN
       ----------------------------- */

    if (Math.abs(deltaY) >= minimumSwipe) {

        if (deltaY < 0) {

            // Swipe UP
            if (currentScreen === "page1") {
                showScreen("page2");
            }

        } else {

            // Swipe DOWN
            if (currentScreen === "page2") {
                showScreen("page1");
            }
        }
    }

});


/* =====================================================
   START
   ===================================================== */

showScreen("page1");
