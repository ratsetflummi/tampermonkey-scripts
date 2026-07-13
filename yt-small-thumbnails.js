// ==UserScript==
// @name         Small Thumbnails
// @namespace    http://tampermonkey.net/
// @version      2026-06-06
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(resizeVideos, 2000);
    setInterval(resizeVideos, 10000);

    function resizeVideos() {
        document.querySelectorAll("ytd-rich-item-renderer").forEach(item => {
            resizeVideo(item);
        });
        document.querySelectorAll("yt-lockup-view-model").forEach(item => {
            resizeVideo(item);
        });
    }

    function resizeVideo(item) {
        const title = item.querySelector(".ytLockupMetadataViewModelHeadingReset");
        if (!title) {
            return;
        }
        let membersOnly = false;
        item.querySelectorAll("div").forEach(div => {
            if (div.innerText == "Members only") {
                membersOnly = true;
            }
        });
        if (membersOnly) {
            item.style.display = "none";
        }
        item.style.border = "1px white solid";
        item.style.backgroundColor = "#2b2b2b";
        item.style.padding = "10px";
        item.prepend(title);
        item.style.width = "95%";
        item.style.marginTop = "10px";
        item.querySelectorAll("span").forEach(span => {
            span.style.fontSize = "20px";
        });
        title.querySelector("span").style.fontSize = "30px";
        const image = item.querySelector(".ytLockupViewModelContentImage");
        image.style.maxWidth = "60px";
        const touchButton = item.querySelector(".ytLockupViewModelHost.ytLockupViewModelVertical.ytLockupViewModelRichGridLegacyMargin.ytLockupViewModelFlexNone");
        touchButton.style.width = "50%";
        const contextMenuButton = item.querySelector(".ytLockupMetadataViewModelMenuButton");
        contextMenuButton.style.position = "absolute";
        contextMenuButton.style.right = "-250px";
        // const meta = item.querySelector(".ytLockupViewModelMetadata");
        // const channels = [];
        // let stop = false;
        // meta.querySelector(".ytLockupMetadataViewModelTextContainer").querySelectorAll("span").forEach(span=>{
        //     if(!span.classList.contains("ytAttributedStringHost") || !span.classList.contains("ytContentMetadataViewModelDelimiter")){
        //        stop = true;
        //     }
        //     console.log(span.classList);
        //     if(!stop && !span.classList.contains("ytContentMetadataViewModelDelimiter")){
        //         channels.push(span);
        //     }
        // });
        // channels.forEach(channel=>{
        //     meta.prepend(channel);
        // });
    }

})();