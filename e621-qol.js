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
        .nav-link.prev, .nav-link.next, .nav-link.first, .nav-link.last {
            min-height: ${textSize * textHeightModifier}px;
            border: ${borderStyle} ${borderColor} ${borderWidth}px;
            border-radius: ${cornerRounding}px;
            padding: 10px;
            font-size: ${textSize}px;
        }
        // #nav-links-top{
        //     position: fixed !important;
        //     bottom: 0;
        //     left: 0;
        //     z-index: 6;
        //     width: 100vw;
        //     margin-bottom: 0 !important;
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
                const postSearch = document.querySelector(".search");
                imageAndNav.after(postSearch);
                const topLinks = imageAndNav.querySelector("#nav-links-top");
                imageAndNav.appendChild(topLinks);
                const sequenceLinks = topLinks.querySelector(".search-seq-nav");
                topLinks.appendChild(sequenceLinks);
            }
            const navigation = document.querySelector(".navigation");
            navigation.style.marginTop = "30vh";
            const blacklistUi = document.querySelector(".blacklist-ui");
            const posts = document.querySelector("#posts");
            posts?.prepend(blacklistUi);
            imageAndNav?.prepend(blacklistUi);
        }, timeout);
    }

})();