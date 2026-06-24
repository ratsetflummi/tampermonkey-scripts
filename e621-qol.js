// ==UserScript==
// @name         QoL
// @namespace    http://tampermonkey.net/
// @version      2026-06-24
// @description  try to take over the world!
// @author       You
// @match        https://e621.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const textSize = 20;
    const textHeightModifier = 1.2;
    const borderStyle = "solid";
    const borderColor = "#112645";
    const borderWidth = 1;
    const cornerRounding = 5;
    const timeout = 200;

    go();

    const style = document.createElement('style');
    style.textContent = `
        .nav-link.prev, .nav-link.next {
            min-height: ${textSize * textHeightModifier}px;
            margin: 0 10px;
            border: ${borderStyle} ${borderColor} ${borderWidth}px;
            border-radius: ${cornerRounding}px;
            padding: 10px;
            font-size: ${textSize}px;
        }
    `;
    document.head.appendChild(style);

    function go() {
        setTimeout(() => {
            // remove news banner
            document.querySelector("#news")?.remove();

            document.querySelectorAll(".blacklisted").forEach(thumbnail => {
                thumbnail.style.setProperty("display", "block", "important");
            });

            const imageAndNav = document.querySelector("#image-and-nav");
            if (imageAndNav) {
                const topLinks = imageAndNav.querySelector("#nav-links-top");

                const bottomLinks = topLinks.cloneNode(true);
                imageAndNav.appendChild(bottomLinks);
            }
            const blacklistUi = document.querySelector(".blacklist-ui");
            const posts = document.querySelector("#posts");
            posts?.prepend(blacklistUi);
            imageAndNav?.prepend(blacklistUi);
        }, timeout);
    }

})();