// ==UserScript==
// @name         people checker
// @namespace    http://tampermonkey.net/
// @version      2026-06-18
// @description  mark posts from friends and enemies, and change up the style of posts while you're at it
// @author       You
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // you can change these to change the style of the website. standard colour settings are optimized for the vampire colour scheme
    const commentBackground = "#292929";
    const commentColor = "white";
    const tagColor = "#efefef";
    const borderWidth = 1;
    const borderColor = "black";
    const borderStyle = "solid"; // solid, dotted, dashed, etc. look up css border styles for all options
    const expandButtonTextColor = "white";
    const expandButtonBackgroundColor = "grey";
    const expandButtonBorderColor = "black";

    // define how round the corners of posts and comments are
    const cornerRounding = 15;

    //define how much space there is between comments and between posts
    const spaceBelowComments = 15;
    const spaceBelowPosts = 30;

    // define how large text should be, and which elements should be resized. uses html element tags
    const textSize = 20;
    const elementsToResize = ["a", "p", "li", "span", "time", "blockquote"];

    // define how long the extension waits before it tries to load the style in milliseconds
    // if the styles take too long to load in then try lowering these
    // if the styles don't load in at all then these need to be higher
    // timeout is the time it waits after you click on the Previous and Next button
    // followinTimeout is how long it waits to load after you click on the following page.
    const timeout = 3000;
    const viewPostTimeout = 500;
    const followingTimeout = 10000;
    const reloadTimeout = 4000;

    // decide if you want to hide community posts completely. set to false if you want to see community posts. for some reason.
    const hideCommunityPosts = true;

    // everything below here is code. changing stuff in here might make the extension not work anymore
    // i can't stop you from poking around though
    // have fun and be yourself
    // and if it does break, just download a fresh version

    const textHeightModifier = 1.2;

    let definitions;

    try {
        definitions = JSON.parse(getCookie("peopleCheckerData"));
    }
    catch {
        definitions = {
            "hidden": {
                "colors": {
                    "backgroundColor": "black",
                    "textColor": "orange",
                    "contrastColor": "orange",
                },
                "urls": [
                ]
            },

            "hideAsks": {
                "colors": {
                    "backgroundColor": "black",
                    "textColor": "orange",
                    "contrastColor": "orange",
                },
                "urls": [
                ]
            },

            "friends": {
                "colors": {
                    "backgroundColor": "#264175",
                    "textColor": "white",
                    "contrastColor": "#0058FF",
                },
                "urls": [
                ]
            },

            "enemies": {
                "colors": {
                    "backgroundColor": "#61111B",
                    "textColor": "white",
                    "contrastColor": "#FF0524",
                },
                "urls": [
                ]
            },
        }
        saveDefinitions();
    }
    addBaseDefinitions();

    const style = document.createElement('style');
    style.textContent = `
        .btn {
            min-height: ${textSize * textHeightModifier}px;
            margin: 0 10px;
            border: ${borderStyle} ${expandButtonBorderColor} ${borderWidth}px;
            border-radius: ${cornerRounding}px;
            background-color: ${expandButtonBackgroundColor};
            color: ${expandButtonTextColor};
            padding: 10px;
            font-size: ${textSize}px;
        }
        .hidden {
            display: none;
        }
        select {
            width: 90%;
            margin: 5%;
            font-size: ${textSize}px;
        }
        #modal {
            max-heigth: 70vh;
            overflow-y: auto;
            position: fixed;
            top: 15vh;
            left: 15vw;
            height: 70vh;
            width: 70vw;
            color: ${commentColor};
            background-color: ${commentBackground};
            border: ${borderStyle} ${expandButtonBorderColor} 3px;

            .row{
                margin: 10px;
                margin-bottom: 20px;
                border: ${borderStyle} ${expandButtonBorderColor} ${borderWidth}px;
                padding: 5px;
            }

            .question{
                text-align: center;
                font-size: 30px;
                margin: 10% 0;
            }

            .btn {
                display: block;
                margin-bottom: 20px;
            }

            td {
                padding: 5px;
            }
        }
        table {
            width: 90%;
            margin: 0 5%;
        }
        .import-input{
            width: 100%;
            height: 60%;
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        go();
    }, viewPostTimeout);

    setTimeout(() => {
        go();
    }, reloadTimeout);

    document.addEventListener("keyup", () => {
        setTimeout(() => {
            go();
        }, viewPostTimeout);

        setTimeout(() => {
            go();
        }, reloadTimeout);
    });

    const followingButtons = document.querySelectorAll("[href='/dashboard/following']");
    followingButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, viewPostTimeout);
        });
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, followingTimeout);
        });
    })
    const subButtons = document.querySelectorAll("[href='/dashboard/blog_subs']");
    subButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, viewPostTimeout);
        });
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, reloadTimeout);
        });
    })
    const forYouButtons = document.querySelectorAll("[href='/dashboard/stuff_for_you']");
    forYouButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, viewPostTimeout);
        });
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, followingTimeout);
        });
    })
    const tagsButtons = document.querySelectorAll("[href='/dashboard/hubs']");
    tagsButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, viewPostTimeout);
        });
        button.addEventListener("click", () => {
            setTimeout(() => {
                go();
            }, reloadTimeout);
        });
    })

    function go() {
        setButtons();
        checkBlogs();
        resizeText();
    }

    function setButtons() {
        getButtons().forEach(button => {
            if (button.classList.contains("linked")) return;
            button.addEventListener("click", () => {
                setTimeout(() => {
                    go();
                }, viewPostTimeout);

                setTimeout(() => {
                    go();
                }, timeout);
            });
            button.classList.add("linked");
        });
    }

    function getButtons() {
        const buttons = document.querySelectorAll("button");
        const links = document.querySelectorAll("a");
        const returnButtons = [];
        buttons.forEach(button => {
            returnButtons.push(button);
        });
        links.forEach(link => {
            returnButtons.push(link);
        });
        return returnButtons;
    }

    function checkBlogs() {
        const postList = document.querySelectorAll("article");
        postList.forEach(post => {
            if (!document.querySelector(".edit-button")) {
                addSettingsButtons(post);
            }
            if (hideCommunityPosts) {
                const dash = document.querySelector("[data-timeline-id]")?.querySelector("div");
                if (dash?.children) {
                    Array.from(dash.children).forEach(entry => {
                        const nextButton = Array.from(entry.querySelectorAll("button")).filter(button => button.ariaLabel == "Next");
                        if (!entry.querySelector("article") && nextButton.length == 0) {
                            entry.classList.add("hidden");
                        }
                    });
                }
                let isCommunity = false;
                post.querySelectorAll("button").forEach(button => {
                    if (button.dataset.wallContext == "communities") {
                        isCommunity = true;
                    }
                });
                if (isCommunity) {
                    post.classList.add("hidden");
                    return;
                };
            }
            const header = post.querySelector("header");
            if (!header) {
                post.classList.add("hidden");
                return;
            }
            header.style.border = `${borderStyle} ${borderColor} ${borderWidth}px`;
            header.style.borderRadius = `${cornerRounding}px`;
            header.style.marginBottom = `${spaceBelowComments}px`;
            header.style.backgroundColor = commentBackground;

            const postLink = header.querySelector("a");
            const postBlogName = postLink.href.split("tumblr.com/")[1].split("/")[0];
            let headerBlogName;
            if (header.children[1].children[0].children[0].role) {
                headerBlogName = header.children[1].children[1].children[0].children[1].querySelector("a");
            } else {
                headerBlogName = header.children[1].children[0].children[0].children[1].querySelector("a");
            }
            if (headerBlogName) {
                headerBlogName.style.display = "inline-block";
            }

            let tags;
            const footer = post.querySelector("footer");
            if (footer?.parentElement.children.length > 1) {
                tags = footer.parentElement.children[0];
            }

            if (tags) {
                tags.style.border = `${borderStyle} ${borderColor} ${borderWidth}px`;
                tags.style.borderRadius = `${cornerRounding}px`;
                tags.style.backgroundColor = commentBackground;
                tags.style.paddingBottom = "15px";

                tags.querySelectorAll("a").forEach(tag => {
                    tag.style.color = tagColor;
                })
            }

            Object.keys(definitions).forEach(type => {
                definitions[type].urls.forEach(name => {
                    if (postLink.href.includes(`/${name}/`)) {
                        header.style.backgroundColor = definitions[type].colors.backgroundColor;
                        header.style.color = definitions[type].colors.textColor;
                    }
                });
            });

            const postBody = post.querySelector(".LaNUG") || post.querySelector(".Qb2zX");
            if (!postBody) return;
            post.style.marginBottom = `${spaceBelowPosts}px`;

            addEditBlogButton(header, postLink.href.split("tumblr.com/")[1].split("/")[0]);

            if (postBody.querySelector("._7Vla9") || postBody.querySelector(".WIYYp")) {
                Array.from(postBody.children).forEach(comment => {
                    const link = comment.querySelectorAll("a")[2];
                    const time = comment.querySelector("time");
                    [link, time].forEach(element => {
                        if (element) {
                            element.style.display = "inline-block";
                        }
                    });
                    comment.style.borderRadius = `${cornerRounding}px`;
                    comment.style.border = `${borderStyle} ${borderColor} ${borderWidth}px`;
                    comment.style.backgroundColor = commentBackground;
                    comment.style.color = commentColor;
                    comment.style.marginBottom = `${spaceBelowComments}px`;
                    comment.style.padding = "10px";
                });
            } else {
                postBody.style.borderRadius = `${cornerRounding}px`;
                postBody.style.border = `${borderStyle} ${borderColor} ${borderWidth}px`;
                postBody.style.backgroundColor = commentBackground;
                postBody.style.color = commentColor;
                postBody.style.marginBottom = `${spaceBelowComments}px`;
                postBody.style.padding = "10px";
            }


            definitions.hidden.urls.forEach(name => {
                if (window.location.href.includes(name)) return;
                if (postLink.href.includes(`/${name}/`)) {
                    addExpandButton(postBody, header, " hidden blog");
                }
            });

            definitions.hideAsks?.urls.forEach(name => {
                if (post.querySelectorAll(".XZFs6").length > 0) {
                    if (postLink.href.includes(`/${name}/`)) {
                        addExpandButton(postBody, header, " ask");
                    }
                }
            })

            const rebloggedFrom = header.querySelector("div").querySelector("div").querySelector("div");
            if (!rebloggedFrom) return;
            const headerInfo = rebloggedFrom.children[1].children[1];
            headerInfo.style.fontSize = `${textSize}px`;
            headerInfo.style.minHeight = `${textSize * textHeightModifier}px`;
            const headerInfoText = headerInfo.children[0];
            if (headerInfoText) {
                headerInfoText.style.display = "inline-block";
                if (headerInfoText.querySelector("span")) {
                    headerInfoText.querySelector("span").style.display = "block";
                }
            }
            if (headerInfo) {
                headerInfo.querySelector("time").style.marginLeft = "5px";
                if (headerInfo.querySelector(".ar_IZ")) {
                    headerInfo.querySelector(".ar_IZ").classList.add("hidden");
                }
            }

            let rebloggedFromHiddenUser = false;
            Object.keys(definitions).forEach(type => {
                definitions[type].urls.forEach(name => {
                    if (headerInfo.classList.contains("checked")) return;
                    if (rebloggedFrom.ariaLabel.includes(`reblogged from ${name}`)) {
                        if (type === "hidden") {
                            const commentElement = document.createElement("span");
                            rebloggedFromHiddenUser = true;
                        }
                        headerInfo.style.color = definitions[type].colors.contrastColor;
                        headerInfo.classList.add("checked");
                    }
                });
            });

            const comments = Array.from(postBody.querySelectorAll(".u2tXn"));
            const commentNumber = comments.length;
            let i = 0;
            Array.from(comments).forEach(comment => {
                i++;
                const commentHeader = comment.querySelector("div");
                if (!commentHeader) return;

                const commentLink = commentHeader.querySelector("a");
                if (!commentLink) return;
                const commentBody = comment.children[1];
                addEditBlogButton(commentHeader, commentLink.href.split("tumblr.com/")[1].split("/")[0]);

                Object.keys(definitions).forEach(type => {
                    definitions[type].urls.forEach(name => {
                        if (commentLink.href.includes(`/${name}/`)) {
                            comment.style.backgroundColor = definitions[type].colors.backgroundColor;
                            comment.style.color = definitions[type].colors.textColor;
                        }
                        if (window.location.href.includes(name)) return;
                        if (commentLink.href.includes("tumblr.com/")) {
                            const commentBlogName = commentLink.href.split("tumblr.com/")[1].split("/")[0];
                            if ((rebloggedFromHiddenUser && !(i === commentNumber && postBlogName === commentBlogName)) || definitions.hidden.urls.includes(commentBlogName)) {
                                addExpandButton(commentBody, commentHeader);
                            }
                        }

                    });
                });

            });
        });
    }

    function addExpandButton(element, buttonParent = null, explanation = "") {
        if (element.classList.contains("expand")) return;
        element.classList.add("hidden");
        const expandElement = document.createElement("div");
        const expandButton = createButton(expandElement, "expand", [], () => {
            if (element.classList.contains("hidden")) {
                element.classList.remove("hidden");
                expandButton.innerText = "minimize";
            } else {
                element.classList.add("hidden");
                expandButton.innerText = "expand";
            }
        });
        element.classList.add("expand");
        if (!buttonParent) {
            explanation = " comment";
            buttonParent = element.parentElement;
            if (30 > textSize) {
                expandElement.style.minHeight = "30px";
            }
            buttonParent.insertBefore(expandElement, element);
        } else {
            buttonParent.appendChild(expandButton);
        }
        expandButton.innerText = `expand${explanation}`;
    }

    function openModal() {
        let modal = document.querySelector("#modal");
        if (!modal) {
            modal = addEditModal();
        }
        modal.innerHTML = "";
        modal.classList.remove("hidden");
        return modal;
    }

    function closeModal() {
        let modal = document.querySelector("#modal");
        if (!modal) {
            modal = addEditModal();
        }
        modal.innerHTML = "";
        modal.classList.add("hidden");
        return modal;
    }

    function addEditBlogButton(parent, name) {
        if (parent.classList.contains("has-edit-button")) return;
        parent.classList.add("has-edit-button");
        const button = createButton(parent, "edit", [], () => {
            const modal = openModal();

            const dropdown = document.createElement("select");
            modal.appendChild(dropdown);

            const addToTypeButton = createButton(modal, "add to type", [], () => {
                Object.values(definitions).forEach(type => {
                    type.urls = type.urls.filter(url => url !== name);
                });
                definitions[dropdown.value].urls.push(name);
                saveDefinitions();
                closeModal();
            });

            dropdown.addEventListener("change", () => {
                addToTypeButton.innerText = `add ${name} to ${dropdown.value}`;
            });

            Object.keys(definitions).forEach(type => {
                if (type === "hidden" || type === "hideAsks") return;
                const option = document.createElement("option");
                option.value = type;
                option.innerText = type;
                dropdown.appendChild(option);
                definitions[type].urls.forEach(url => {
                    if (url === name) {
                        option.selected = true;
                    }
                });
            });

            addToTypeButton.innerText = `add ${name} to ${dropdown.value}`;

            const removeBlogDefinitionButton = createButton(modal, `remove definition for ${name}`, [], () => {
                Object.values(definitions).forEach(type => {
                    if (type === "hidden" || type === "hideAsks") return;
                    type.urls = type.urls.filter(url => url !== name);
                });
                saveDefinitions();
                closeModal();
            });


            const hideBlogButton = createButton(modal, definitions.hidden.urls.includes(name) ? "unhide Blog" : "hide Blog", [], () => {
                if (definitions.hidden.urls.includes(name)) {
                    hideBlogButton.innerText = "hide Blog";
                    definitions.hidden.urls = definitions.hidden.urls.filter(url => url !== name);
                } else {
                    hideBlogButton.innerText = "unhide Blog";
                    definitions.hidden.urls.push(name);
                }
                saveDefinitions();
            });

            const hideAsksButton = createButton(modal, definitions.hideAsks.urls.includes(name) ? "unhide Asks" : "hide Asks", [], () => {
                if (definitions.hideAsks.urls.includes(name)) {
                    hideAsksButton.innerText = "hide Asks";
                    definitions.hideAsks.urls = definitions.hideAsks.urls.filter(url => url !== name);
                } else {
                    hideAsksButton.innerText = "unhide Asks";
                    definitions.hideAsks.urls.push(name);
                }
                saveDefinitions();
            });

            const closeModalButton = createButton(modal, "close", [], closeModal);
        });
    }
    // TODO
    // edit classes button
    // urls and classes in cookies
    // add / remove / rename class
    // define class colors in cookie
    // change colors buttons

    function addEditModal() {
        const modal = document.createElement("div");
        modal.id = "modal";
        document.querySelector("body").appendChild(modal);
        closeModal();
        modal.innerText = "modal";
        return modal;
    }

    function openTypeModal() {
        const modal = openModal();
        Object.entries(definitions).forEach(([type, value]) => {
            const row = document.createElement("div");
            modal.appendChild(row);
            const name = document.createElement("div");
            const nameSpan = document.createElement("span");
            name.innerText = type;
            row.appendChild(nameSpan);
            nameSpan.appendChild(name);

            const table = document.createElement("table");
            const nameRow = document.createElement("tr");
            const colorRow = document.createElement("tr");
            const textInputRow = document.createElement("tr");
            row.appendChild(table);
            table.appendChild(nameRow);
            table.appendChild(colorRow);
            table.appendChild(textInputRow);

            name.style.border = `${borderStyle} ${value.colors.contrastColor} ${borderWidth}px`;
            name.style.backgroundColor = value.colors.backgroundColor;
            name.style.color = value.colors.textColor;

            row.classList.add("row");
            row.id = type;

            const urlDetails = document.createElement("details");
            const urlSummary = document.createElement("summary");
            urlDetails.appendChild(urlSummary);
            urlSummary.innerText = "URLs";
            const urlList = document.createElement("ul");
            urlDetails.appendChild(urlList);
            urlDetails.style.marginTop = "15px";
            urlSummary.style.border = `${borderStyle} ${expandButtonBorderColor} ${borderWidth}px`;
            urlSummary.style.padding = "5px";
            value.urls.forEach(url => {
                const entry = document.createElement("li");
                entry.style.marginTop = "15px";
                const link = document.createElement("a");
                urlList.appendChild(entry);
                entry.appendChild(link);
                link.innerText = url;
                link.href = `https://tumblr.com/${url}/`;
            });
            row.appendChild(urlDetails);

            if (type !== "hidden" && type !== "hideAsks") {
                const deleteButton = createButton(name, "delete", [], () => {
                    openDeleteTypeModal(type);
                })
            }

            Object.entries(value.colors).forEach(([colorName, value]) => {
                const nameCell = document.createElement("td");
                nameCell.innerText = `${colorName}:`;
                nameRow.appendChild(nameCell);
                const inputCell = document.createElement("td");
                const textInputCell = document.createElement("td");
                const input = document.createElement("input");
                const textInput = document.createElement("input");
                textInput.addEventListener("change", () => {
                    input.value = textInput.value;
                    if (colorName === "backgroundColor") {
                        name.style.backgroundColor = input.value;
                    }
                    if (colorName === "textColor") {
                        name.style.color = input.value;
                    }
                    if (colorName === "contrastColor") {
                        name.style.border = `${borderStyle} ${input.value} ${borderWidth}px`;
                    }
                });
                input.id = colorName;
                input.classList.add("colorValue");
                colorRow.classList.add("colorRow");
                inputCell.appendChild(input);
                colorRow.appendChild(inputCell);
                textInputCell.appendChild(textInput);
                textInputRow.appendChild(textInputCell);
                input.type = "color";
                input.value = value;
                textInput.value = input.value;
                input.addEventListener("change", () => {
                    textInput.value = input.value;
                    if (colorName === "backgroundColor") {
                        name.style.backgroundColor = input.value;
                    }
                    if (colorName === "textColor") {
                        name.style.color = input.value;
                    }
                    if (colorName === "contrastColor") {
                        name.style.border = `${borderStyle} ${input.value} ${borderWidth}px`;
                    }
                });
            });
            // { backgroundColor: "black", textColor: "orange", contrastColor: "orange" }
        });

        const saveColorsButton = createButton(modal, "save colors", [], () => {
            modal.querySelectorAll(".row").forEach(row => {
                const typeName = row.id;
                row.querySelectorAll(".colorValue").forEach(input => {
                    definitions[typeName].colors[input.id] = input.value;
                });
            });
            saveDefinitions();
            openTypeModal();
        });

        const newTypeRow = document.createElement("div");
        modal.appendChild(newTypeRow);
        const input = document.createElement("input");
        newTypeRow.appendChild(input);
        const addTypeButton = createButton(newTypeRow, "add new type", [], () => {
            if (Object.keys(definitions).find(type => type === input.value)) {
                openTypeModal();
                return;
            }
            definitions[input.value] = {
                "colors": { "backgroundColor": "black", "textColor": "white", "contrastColor": "grey" },
                "urls": [],
            }
            saveDefinitions();
            openTypeModal();
        });

        const closeModalButton = createButton(modal, "close", [], () => {
            closeModal();
        });
    }

    function addEditTypesButton(parent) {
        const button = createButton(parent, "Edit Types", ["edit-button"], () => {
            openTypeModal();
        });
    }

    function addExportDataButton(parent) {
        const button = createButton(parent, "Import/Export", [], () => {
            openExportModal();
        });
    }

    function openExportModal() {
        const modal = openModal();
        const input = document.createElement("textarea");
        input.classList.add("import-input");
        modal.appendChild(input);
        const importButton = createButton(modal, "Import", [], () => {
            const inputText = input.value;
            try {
                const newDefinitions = JSON.parse(inputText);
                if (isValidData(newDefinitions)) {
                    definitions = newDefinitions;
                    addBaseDefinitions();
                    saveDefinitions();
                    closeModal();
                    go();
                } else {
                    console.log("invalid data");
                    console.log(newDefinitions);
                }
            } catch {
                console.log(`can't parse ${inputText}`);
            }
        });
        const exportButton = createButton(modal, "Export", [], () => {
            const exportString = JSON.stringify(definitions).split(":{").join(":\n{").split("},").join("},\n\n").split(`,"`).join(`,\n"`);
            input.value = exportString;
        });
        const closeModalButton = createButton(modal, "close", [], closeModal);
    }

    function addSettingsButtons(post) {
        const settingsBox = document.createElement("div");
        post.parentElement.prepend(settingsBox);
        addEditTypesButton(settingsBox);
        addExportDataButton(settingsBox);
    }

    function openDeleteTypeModal(name) {
        const modal = openModal();
        const question = document.createElement("h2");
        const deleteButton = document.createElement("button");
        const cancelButton = document.createElement("button");
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "center";
        modal.appendChild(question);
        modal.appendChild(row);
        question.classList.add("question");
        row.appendChild(deleteButton);
        row.appendChild(cancelButton);
        deleteButton.classList.add("btn");
        cancelButton.classList.add("btn");
        question.innerText = `delete ${name}?`;
        deleteButton.innerText = "delete";
        cancelButton.innerText = "cancel";
        cancelButton.addEventListener("click", () => {
            openTypeModal();
        });
        deleteButton.addEventListener("click", () => {
            const newDefinitions = {};
            Object.keys(definitions).forEach(type => {
                if (type != name) {
                    newDefinitions[type] = definitions[type];
                }
            });
            definitions = newDefinitions;
            saveDefinitions();
            openTypeModal();
        });
    }

    function resizeText() {
        elementsToResize.forEach(type => {
            document.querySelectorAll(type).forEach(element => {
                element.style.fontSize = `${textSize}px`;
                element.style.minHeight = `${textSize * textHeightModifier}px`;
            });
        });
        document.querySelectorAll("svg").forEach(element => {
            element.style.minHeight = `${textSize}px`;
            element.style.minWidth = `${textSize}px`;
        });
    }

    function createButton(parent, innerText, classes, clickFunction) {
        const button = document.createElement("button");
        button.classList.add("btn");
        classes.forEach(clss => {
            button.classList.add(`${clss}`);
        })
        button.innerText = innerText;
        parent.appendChild(button);

        button.addEventListener("click", () => {
            clickFunction();
        });
        return button;
    }

    function isValidData(obj) {
        if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
            return false;
        }

        for (const value of Object.values(obj)) {
            // Each top-level value must be an object
            if (typeof value !== "object" || value === null) {
                return false;
            }

            const { colors, urls } = value;

            // colors is required
            if (
                typeof colors !== "object" ||
                colors === null ||
                typeof colors.backgroundColor !== "string" ||
                typeof colors.textColor !== "string" ||
                typeof colors.contrastColor !== "string" ||
                colors.backgroundColor === "" ||
                colors.textColor === "" ||
                colors.contrastColor === ""
            ) {
                return false;
            }

            // urls must be an array of strings (can be empty)
            if (
                !Array.isArray(urls) ||
                !urls.every(url => typeof url === "string")
            ) {
                return false;
            }
        }

        return true;
    }

    function addBaseDefinitions() {
        if (!definitions.hidden) {
            definitions["hidden"] = {
                "colors": {
                    "backgroundColor": "black",
                    "textColor": "orange",
                    "contrastColor": "orange",
                },
                "urls": [
                ]
            }
            saveDefinitions();
        }
        if (!definitions.hideAsks) {
            definitions["hideAsks"] = {
                "colors": {
                    "backgroundColor": "black",
                    "textColor": "orange",
                    "contrastColor": "orange",
                },
                "urls": [
                ]
            }
            saveDefinitions();
        }
    }

    function setCookie(cname, cvalue) {
        const d = new Date();
        d.setTime(d.getTime() + (50 * 365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function deleteCookie(cname) {
        const d = new Date();
        d.setTime(d.getTime() + (50 * 365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=delete;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function saveDefinitions() {
        setCookie("peopleCheckerData", JSON.stringify(definitions));
        go();
    }

})();