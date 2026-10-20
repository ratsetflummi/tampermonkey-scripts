// ==UserScript==
// @name         Add/Remove Tags from search
// @namespace    http://tampermonkey.net/
// @version      2026-10-20
// @description  buttons to quickly add/remove tags
// @author       You
// @match        https://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const tagSidebar = document.querySelector("#tag-sidebar");
    const imageContainer = document.querySelector(".image-container");
    if (imageContainer) {
        imageContainer.after(tagSidebar);
    }

    document.querySelectorAll(".tag-type-general").forEach(tag => {
        tag.style.display = "block";
        tag.querySelectorAll("a").forEach(link => {
            link.style.display = "inline";
        });
        const addButton = makeButton("+", tag);
        const removeButton = makeButton("-", tag);
        let tagText = tag.querySelectorAll("a")[1].innerText;
        tagText = tagText.trim();
        tagText = tagText.replaceAll(" ", "_");
        addButton.addEventListener("click", () => {
            addToSearch(tagText);
        });
        removeButton.addEventListener("click", () => {
            addToSearch("-" + tagText);
        });
    });

    function makeButton(text, parent) {
        const button = document.createElement("button");
        button.innerText = text;
        parent.appendChild(button);
        button.style.width = "60px";
        button.style.height = "30px";
        button.style.margin = "5px";
        return button;
    }

    function addToSearch(term) {
        const searchBar = document.querySelector("input[name='tags']");
        const tags = window.location.href.split("&tags=")[1] || "";
        window.location.href = "https://rule34.xxx/index.php?page=post&s=list&tags=" + tags + "+" + term;
    }

})();
