const phone = document.getElementById("phone");
const screen = document.getElementById("screen");
const appScreen = document.getElementById("appScreen");
const appContent = document.getElementById("appContent");
const backButton = document.getElementById("backButton");

const pages = [
    "Parphone.png",
    "Parphone Page 2.png"
];

let currentPage = 0;

let startX = 0;
let startY = 0;
let isSwiping = false;


// --------------------------------
// CHANGE PHONE PAGE
// --------------------------------

function showPage(page) {

    if (page < 0) {
        page = 0;
    }

    if (page >= pages.length) {
        page = pages.length - 1;
    }

    currentPage = page;

    screen.src = pages[currentPage];

    removeTouchZones();

    if (currentPage === 0) {
        createPage1Buttons();
    }

    if (currentPage === 1) {
        createPage2Buttons();
    }
}


// --------------------------------
// SWIPE DETECTION
// --------------------------------

phone.addEventListener("pointerdown", function(event) {

    startX = event.clientX;
    startY = event.clientY;

    isSwiping = true;
});


phone.addEventListener("pointerup", function(event) {

    if (!isSwiping) {
        return;
    }

    isSwiping = false;

    const endX = event.clientX;
    const endY = event.clientY;

    const differenceX = endX - startX;
    const differenceY = endY - startY;

    const minimumSwipe = 50;


    // Horizontal swipe
    if (Math.abs(differenceX) > Math.abs(differenceY)) {

        if (Math.abs(differenceX) > minimumSwipe) {

            openSlap();
        }

        return;
    }


    // Vertical swipe
    if (Math.abs(differenceY) > minimumSwipe) {

        if (differenceY < 0) {

            // Swipe UP
            showPage(currentPage + 1);

        } else {

            // Swipe DOWN
            showPage(currentPage - 1);
        }
    }

});


// --------------------------------
// TOUCH ZONES
// --------------------------------

function removeTouchZones() {

    document.querySelectorAll(".touch-zone").forEach(function(button) {
        button.remove();
    });
}


function createTouchZone(x, y, width, height, callback) {

    const button = document.createElement("button");

    button.className = "touch-zone";

    button.style.left = x + "%";
    button.style.top = y + "%";

    button.style.width = width + "%";
    button.style.height = height + "%";

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        callback();
    });

    phone.appendChild(button);
}


// --------------------------------
// PAGE 1 APPS
// --------------------------------

function createPage1Buttons() {

    /*
        These coordinates are percentages of the screen.

        We will adjust these after testing the
        actual touchscreen.
    */


    // Messages
    createTouchZone(
        43, 25,
        15, 12,
        function() {
            openApp("Messages");
        }
    );


    // Camera
    createTouchZone(
        55, 25,
        15, 12,
        function() {
            openApp("Camera");
        }
    );


    // Social Fast
    createTouchZone(
        37, 36,
        15, 12,
        function() {
            openApp("Social Fast");
        }
    );


    // Maps
    createTouchZone(
        57, 36,
        15, 12,
        function() {
            openApp("Maps");
        }
    );


    // Photos
    createTouchZone(
        37, 47,
        15, 12,
        function() {
            openApp("Photos");
        }
    );


    // Weather
    createTouchZone(
        48, 47,
        15, 12,
        function() {
            openApp("Weather");
        }
    );


    // Notes
    createTouchZone(
        58, 47,
        15, 12,
        function() {
            openApp("Notes");
        }
    );


    // Settings
    createTouchZone(
        42, 58,
        15, 12,
        function() {
            openApp("Settings");
        }
    );


    // Clock
    createTouchZone(
        53, 58,
        15, 12,
        function() {
            openApp("Clock");
        }
    );


    // Videos
    createTouchZone(
        62, 58,
        15, 12,
        function() {
            openApp("Videos");
        }
    );
}


// --------------------------------
// PAGE 2 APPS
// --------------------------------

function createPage2Buttons() {

    // Lingo
    createTouchZone(
        40, 25,
        15, 12,
        function() {
            openApp("Lingo");
        }
    );


    // SplashFace
    createTouchZone(
        55, 25,
        15, 12,
        function() {
            openApp("SplashFace");
        }
    );


    // Thumb
    createTouchZone(
        35, 36,
        15, 12,
        function() {
            openApp("Thumb");
        }
    );


    // DanWarp
    createTouchZone(
        47, 36,
        15, 12,
        function() {
            openApp("DanWarp");
        }
    );


    // Image
    createTouchZone(
        58, 36,
        15, 12,
        function() {
            openApp("Image");
        }
    );


    // Chrono
    createTouchZone(
        35, 48,
        15, 12,
        function() {
            openApp("Chrono");
        }
    );


    // ZapLook
    createTouchZone(
        47, 48,
        15, 12,
        function() {
            openApp("ZapLook");
        }
    );


    // Weather
    createTouchZone(
        58, 48,
        15, 12,
        function() {
            openApp("Weather");
        }
    );


    // Music
    createTouchZone(
        32, 59,
        15, 12,
        function() {
            openApp("Music");
        }
    );


    // Monkey
    createTouchZone(
        44, 59,
        15, 12,
        function() {
            openApp("Monkey");
        }
    );


    // Remark
    createTouchZone(
        53, 59,
        15, 12,
        function() {
            openApp("Remark");
        }
    );


    // Settings
    createTouchZone(
        62, 59,
        15, 12,
        function() {
            openApp("Settings");
        }
    );
}


// --------------------------------
// OPEN AN APP
// --------------------------------

function openApp(appName) {

    appScreen.classList.add("active");

    appContent.innerHTML = `

        <div style="
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            color:white;
            font-family:Arial,sans-serif;
            background:linear-gradient(135deg,#0787ff,#0044aa);
            text-align:center;
        ">

            <h1 style="font-size:40px;margin-bottom:15px;">
                ${appName}
            </h1>

            <p style="font-size:20px;">
                ${appName} is opening...
            </p>

        </div>
    `;
}


// --------------------------------
// THE SLAP
// --------------------------------

function openSlap() {

    removeTouchZones();

    screen.src = "Slap.com.png";

    appScreen.classList.remove("active");

    currentPage = -1;
}


// --------------------------------
// BACK BUTTON
// --------------------------------

backButton.addEventListener("click", function() {

    appScreen.classList.remove("active");

    showPage(
        currentPage >= 0 ? currentPage : 0
    );

});


// --------------------------------
// START PHONE
// --------------------------------

showPage(0);
