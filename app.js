const phone = document.getElementById("phone");

const app = document.getElementById("app");

const appName = document.getElementById("appName");

const appText = document.getElementById("appText");

const back = document.getElementById("back");



/*
========================================================
CLICK AN APP ON THE ACTUAL PNG
========================================================
*/

const appButtons = document.querySelectorAll(
    "#pearPhoneMap area"
);


appButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedApp =
            button.getAttribute("data-app");


        openApp(selectedApp);

    });

});



/*
========================================================
OPEN APP
========================================================
*/

function openApp(name) {

    appName.textContent = name;

    appText.textContent =
        name + " app opened.";


    app.classList.add("open");

}



/*
========================================================
BACK TO THE ACTUAL PHONE PICTURE
========================================================
*/

back.addEventListener("click", function() {

    app.classList.remove("open");

});
