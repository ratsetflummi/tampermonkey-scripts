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
        .remove-button {
            width: 40px;
            margin-left: 10px;
            background-color: #051226;
            color: white;
        }
        li {
            margin-bottom: 20px;
            margin-top: 20px;
        }
        .tag-list-inc, .tag-list-exl{
            margin-right: 10px;
            margin-left: 10px;
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
            blacklistUi.querySelectorAll("li").forEach(item => {
                const num = item.querySelector("a").querySelector("span");
                num.remove();
                const text = item.querySelector("a").innerText;
                item.appendChild(num);
                const button = document.createElement("button");
                button.innerText = " - ";
                item.appendChild(button);
                button.addEventListener("click", () => {
                    window.location.href = window.location.href + "+-" + text;
                });
                button.classList.add("remove-button");
            })
            const posts = document.querySelector("#posts");
            posts?.prepend(blacklistUi);
            imageAndNav?.prepend(blacklistUi);
        }, timeout);
    }

})();