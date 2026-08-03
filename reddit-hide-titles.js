// ==UserScript==
// @name         Hide Post Titles
// @namespace    http://tampermonkey.net/
// @version      2026-08-03
// @description  hide reddit post titles
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

(function() {
    document.addEventListener("scroll",()=>{
        document.querySelectorAll("[slot='title']").forEach(title=>{
            title.style.display = "none";
        })
    })

    // Your code here...
})();
