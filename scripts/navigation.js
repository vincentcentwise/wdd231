document.addEventListener("DOMContentLoaded", function () {

    const yearSpan = document.querySelector("#currentyear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const modifiedSpan = document.querySelector("#lastModified");
    if (modifiedSpan) {
        const lastModified = new Date(document.lastModified);
        const options = { year: "numeric", month: "long", day: "numeric" };
        modifiedSpan.textContent = lastModified.toLocaleDateString("en-US", options);
    }
    const navbutton = document.querySelector('#ham-btn');

    const hamburger = document.getElementById('ham-btn');
    const navMenu = document.getElementById('navMenu');
    if (hamburger) {
        navbutton.addEventListener('click', () => {
            navbutton.classList.toggle('show');
            navMenu.classList.toggle('active');
        });
        }


});
