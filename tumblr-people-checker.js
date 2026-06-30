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

    const timeout = 3000;
    const viewPostTimeout = 500;
    const followingTimeout = 10000;
    const reloadTimeout = 4000;
    const elementsToResize = ['a', 'p', 'li', 'span', 'time', 'blockquote']
    // everything below here is code. changing stuff in here might make the extension not work anymore
    // i can't stop you from poking around though
    // have fun and be yourself
    // and if it does break, just download a fresh version


    let definitions = {};
    let blogDefinitions;
    let formattingDefinitions;
    try {
        definitions = JSON.parse(getCookie("peopleCheckerData"));

        blogDefinitions = definitions["blogDefinitions"];
        formattingDefinitions = definitions["formattingDefinitions"];
        if (!blogDefinitions) {
            addDefaultBlogDefinitions();
        }
        if (!formattingDefinitions) {
            addDefaultFormattingDefinitions();
        }
    }
    catch {
        addDefaultBlogDefinitions();
        addDefaultFormattingDefinitions();
    }
    addBaseDefinitions();

    function addDefaultFormattingDefinitions() {
        formattingDefinitions = {
            "hideCommunityPosts": true,
            "commentBackground": "#292929",
            "commentColor": "#ffffff",
            "tagColor": "#efefef",
            "borderWidth": 1,
            "borderColor": "#000000",
            "expandButtonTextColor": "#ffffff",
            "expandButtonBackgroundColor": "#353535",
            "expandButtonBorderColor": "#000000",
            "borderStyle": "solid",
            "cornerRounding": 15,
            "spaceBelowComments": 15,
            "spaceBelowPosts": 30,
            "textSize": 20,
            "textHeightModifier": 1.2,

        };
        definitions.formattingDefinitions = formattingDefinitions;
        saveDefinitions();
    }
    function addDefaultBlogDefinitions() {
        blogDefinitions = {
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
        definitions.blogDefinitions = blogDefinitions;
        saveDefinitions();
    }
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            min-height: ${formattingDefinitions.textSize * formattingDefinitions.textHeightModifier}px;
            margin: 0 10px;
            border: ${formattingDefinitions.borderStyle} ${formattingDefinitions.expandButtonBorderColor} ${formattingDefinitions.borderWidth}px;
            border-radius: ${formattingDefinitions.cornerRounding}px;
            background-color: ${formattingDefinitions.expandButtonBackgroundColor};
            color: ${formattingDefinitions.expandButtonTextColor};
            padding: 10px;
            font-size: ${formattingDefinitions.textSize}px;
        }
        select {
            width: 90%;
            margin: 5%;
            font-size: ${formattingDefinitions.textSize}px;
        }
        #modal, #background{
            z-index: 101;
        }
        #modal {
            text-align: center;
            max-heigth: 70vh;
            overflow-y: auto;
            position: fixed;
            top: 15vh;
            left: 15vw;
            height: 70vh;
            width: 70vw;
            color: ${formattingDefinitions.commentColor};
            background-color: ${formattingDefinitions.commentBackground};
            border: ${formattingDefinitions.borderStyle} ${formattingDefinitions.expandButtonBorderColor} 3px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .row{
                margin: 10px;
                margin-bottom: 20px;
                border: ${formattingDefinitions.borderStyle} ${formattingDefinitions.expandButtonBorderColor} ${formattingDefinitions.borderWidth}px;
                padding: 5px;
            }

            .question{
                text-align: center;
                font-size: 30px;
                margin: 10% 0;
            }

            .btn {
                min-height: 50px;
                display: block;
                margin-bottom: 20px;
            }

            td {
                padding: 5px;
            }
        }
        #background{
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
        }
        table {
            width: 90%;
            margin: 0 5%;
        }
        .import-input{
            width: 99%;
            height: 60%;
        }
        .hidden, #modal.hidden {
            display: none;
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
        addOpenSettingsButton();
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
                addOpenSettingsButton();
            }
            if (formattingDefinitions.hideCommunityPosts) {
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
            header.style.border = `${formattingDefinitions.borderStyle} ${formattingDefinitions.borderColor} ${formattingDefinitions.borderWidth}px`;
            header.style.borderRadius = `${formattingDefinitions.cornerRounding}px`;
            header.style.marginBottom = `${formattingDefinitions.spaceBelowComments}px`;
            header.style.backgroundColor = formattingDefinitions.commentBackground;

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
                tags.style.border = `${formattingDefinitions.borderStyle} ${formattingDefinitions.borderColor} ${formattingDefinitions.borderWidth}px`;
                tags.style.borderRadius = `${formattingDefinitions.cornerRounding}px`;
                tags.style.backgroundColor = formattingDefinitions.commentBackground;
                tags.style.paddingBottom = "15px";

                tags.querySelectorAll("a").forEach(tag => {
                    tag.style.color = formattingDefinitions.tagColor;
                })
            }

            Object.keys(blogDefinitions).forEach(type => {
                blogDefinitions[type].urls.forEach(name => {
                    if (postLink.href.includes(`/${name}/`)) {
                        header.style.backgroundColor = blogDefinitions[type].colors.backgroundColor;
                        header.style.color = blogDefinitions[type].colors.textColor;
                    }
                });
            });

            const postBody = post.querySelector(".LaNUG") || post.querySelector(".Qb2zX");
            if (!postBody) return;
            post.style.marginBottom = `${formattingDefinitions.spaceBelowPosts}px`;

            addEditBlogButton(header, postLink.href.split("tumblr.com/")[1].split("/")[0]);

            const asks = Array.from(postBody.querySelectorAll(".XZFs6"));
            const comments = Array.from(postBody.querySelectorAll(".u2tXn")).concat(asks);
            if (postBody.querySelector("._7Vla9") || postBody.querySelector(".WIYYp")) {
                comments.forEach(comment => {
                    const link = comment.querySelectorAll("a")[2];
                    const time = comment.querySelector("time");
                    [link, time].forEach(element => {
                        if (element) {
                            element.style.display = "inline-block";
                        }
                    });
                    comment.style.borderRadius = `${formattingDefinitions.cornerRounding}px`;
                    comment.style.border = `${formattingDefinitions.borderStyle} ${formattingDefinitions.borderColor} ${formattingDefinitions.borderWidth}px`;
                    comment.style.backgroundColor = formattingDefinitions.commentBackground;
                    comment.style.color = formattingDefinitions.commentColor;
                    comment.style.marginBottom = `${formattingDefinitions.spaceBelowComments}px`;
                    comment.style.padding = "10px";
                });
            } else {
                postBody.style.borderRadius = `${formattingDefinitions.cornerRounding}px`;
                postBody.style.border = `${formattingDefinitions.borderStyle} ${formattingDefinitions.borderColor} ${formattingDefinitions.borderWidth}px`;
                postBody.style.backgroundColor = formattingDefinitions.commentBackground;
                postBody.style.color = formattingDefinitions.commentColor;
                postBody.style.marginBottom = `${formattingDefinitions.spaceBelowComments}px`;
                postBody.style.padding = "10px";
            }


            blogDefinitions.hidden.urls.forEach(name => {
                if (window.location.href.includes(name)) return;
                if (postLink.href.includes(`/${name}/`)) {
                    addExpandButton(postBody, header, " hidden blog");
                }
            });

            blogDefinitions.hideAsks?.urls.forEach(name => {
                if (post.querySelectorAll(".XZFs6").length > 0) {
                    if (postLink.href.includes(`/${name}/`)) {
                        addExpandButton(postBody, header, " ask");
                    }
                }
            })

            const rebloggedFrom = header.querySelector("div").querySelector("div").querySelector("div");
            if (!rebloggedFrom) return;
            const headerInfo = rebloggedFrom.children[1].children[1];
            headerInfo.style.fontSize = `${formattingDefinitions.textSize}px`;
            headerInfo.style.minHeight = `${formattingDefinitions.textSize * formattingDefinitions.textHeightModifier}px`;
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
            Object.keys(blogDefinitions).forEach(type => {
                blogDefinitions[type].urls.forEach(name => {
                    if (headerInfo.classList.contains("checked")) return;
                    if (rebloggedFrom.ariaLabel.includes(`reblogged from ${name}`)) {
                        if (type === "hidden") {
                            const commentElement = document.createElement("span");
                            rebloggedFromHiddenUser = true;
                        }
                        headerInfo.style.color = blogDefinitions[type].colors.contrastColor;
                        headerInfo.classList.add("checked");
                    }
                });
            });

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

                Object.keys(blogDefinitions).forEach(type => {
                    blogDefinitions[type].urls.forEach(name => {
                        if (commentLink.href.includes(`/${name}/`)) {
                            comment.style.backgroundColor = blogDefinitions[type].colors.backgroundColor;
                            comment.style.color = blogDefinitions[type].colors.textColor;
                        }
                        if (window.location.href.includes(name)) return;
                        if (commentLink.href.includes("tumblr.com/")) {
                            const commentBlogName = commentLink.href.split("tumblr.com/")[1].split("/")[0];
                            if ((rebloggedFromHiddenUser && !(i === commentNumber && postBlogName === commentBlogName)) || blogDefinitions.hidden.urls.includes(commentBlogName)) {
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
            if (30 > formattingDefinitions.textSize) {
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
        const background = document.querySelector("#background");
        background.classList.remove("hidden");
        modal.innerHTML = "";
        modal.classList.remove("hidden");
        return modal;
    }

    function closeModal() {
        let modal = document.querySelector("#modal");
        if (!modal) {
            modal = addEditModal();
        }
        const background = document.querySelector("#background");
        modal.innerHTML = "";
        modal.classList.add("hidden");
        background.classList.add("hidden");
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
                Object.values(blogDefinitions).forEach(type => {
                    type.urls = type.urls.filter(url => url !== name);
                });
                blogDefinitions[dropdown.value].urls.push(name);
                saveAndGo();
                closeModal();
            });

            dropdown.addEventListener("change", () => {
                addToTypeButton.innerText = `add ${name} to ${dropdown.value}`;
            });

            Object.keys(blogDefinitions).forEach(type => {
                if (type === "hidden" || type === "hideAsks") return;
                const option = document.createElement("option");
                option.value = type;
                option.innerText = type;
                dropdown.appendChild(option);
                blogDefinitions[type].urls.forEach(url => {
                    if (url === name) {
                        option.selected = true;
                    }
                });
            });

            addToTypeButton.innerText = `add ${name} to ${dropdown.value}`;

            const removeBlogDefinitionButton = createButton(modal, `remove definition for ${name}`, [], () => {
                Object.values(blogDefinitions).forEach(type => {
                    if (type === "hidden" || type === "hideAsks") return;
                    type.urls = type.urls.filter(url => url !== name);
                });
                saveAndGo();
                closeModal();
            });


            const hideBlogButton = createButton(modal, blogDefinitions.hidden.urls.includes(name) ? "unhide Blog" : "hide Blog", [], () => {
                if (blogDefinitions.hidden.urls.includes(name)) {
                    hideBlogButton.innerText = "hide Blog";
                    blogDefinitions.hidden.urls = blogDefinitions.hidden.urls.filter(url => url !== name);
                } else {
                    hideBlogButton.innerText = "unhide Blog";
                    blogDefinitions.hidden.urls.push(name);
                }
                saveAndGo();
            });

            const hideAsksButton = createButton(modal, blogDefinitions.hideAsks.urls.includes(name) ? "unhide Asks" : "hide Asks", [], () => {
                if (blogDefinitions.hideAsks.urls.includes(name)) {
                    hideAsksButton.innerText = "hide Asks";
                    blogDefinitions.hideAsks.urls = blogDefinitions.hideAsks.urls.filter(url => url !== name);
                } else {
                    hideAsksButton.innerText = "unhide Asks";
                    blogDefinitions.hideAsks.urls.push(name);
                }
                saveAndGo();
            });

            addCloseButton(modal);
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
        const background = document.createElement("div");
        background.id = "background";
        background.addEventListener("click", closeModal);
        document.querySelector("body").appendChild(background);
        document.querySelector("body").appendChild(modal);
        closeModal();
        return modal;
    }

    function openFormattingModal() {
        const modal = openModal();
        const table = document.createElement("table");
        modal.appendChild(table);
        Object.entries(formattingDefinitions).forEach(([type, value]) => {
            const row = document.createElement("tr");
            const th = document.createElement("th");
            const td = document.createElement("td");
            table.appendChild(row);
            row.appendChild(th);
            row.appendChild(td);

            const input = document.createElement("input");
            input.id = type;
            td.appendChild(input);
            switch (typeof (value)) {
                case "boolean":
                    input.type = "checkbox";
                    input.checked = value;
                    break;
                case "string":
                    if (value.startsWith("#"))
                        input.type = "color";
                    else
                        input.type = "text";
                    break;
                case "number":
                    input.type = "number";
                    break;
                default:
                // code block
            }
            input.value = value;

            th.innerText = type;
        });

        const saveButton = createButton(modal, "save", [], () => {
            Object.keys(formattingDefinitions).forEach(type => {
                const input = table.querySelector(`#${type}`);
                switch (input.type) {
                    case "checkbox":
                        formattingDefinitions[type] = input.checked;
                        break;
                    case "text":
                        formattingDefinitions[type] = input.value;
                        break;
                    case "color":
                        formattingDefinitions[type] = input.value;
                        break;
                    case "number":
                        formattingDefinitions[type] = Number(input.value);
                        break;
                    default:
                    // code block
                }
            });
            saveAndGo();
            closeModal();
        });
        addCloseButton(modal);

    }

    function openTypeModal() {
        const modal = openModal();
        Object.entries(blogDefinitions).forEach(([type, value]) => {
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

            name.style.border = `${formattingDefinitions.borderStyle} ${value.colors.contrastColor} ${formattingDefinitions.borderWidth}px`;
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
            urlSummary.style.border = `${formattingDefinitions.borderStyle} ${formattingDefinitions.expandButtonBorderColor} ${formattingDefinitions.borderWidth}px`;
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
                        name.style.border = `${formattingDefinitions.borderStyle} ${input.value} ${formattingDefinitions.borderWidth}px`;
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
                        name.style.border = `${formattingDefinitions.borderStyle} ${input.value} ${formattingDefinitions.borderWidth}px`;
                    }
                });
            });
            // { backgroundColor: "black", textColor: "orange", contrastColor: "orange" }
        });

        const saveColorsButton = createButton(modal, "save colors", [], () => {
            modal.querySelectorAll(".row").forEach(row => {
                const typeName = row.id;
                row.querySelectorAll(".colorValue").forEach(input => {
                    blogDefinitions[typeName].colors[input.id] = input.value;
                });
            });
            saveAndGo();
            openTypeModal();
        });

        const input = document.createElement("input");
        modal.appendChild(input);
        input.placeholder = "new type name...";
        const addTypeButton = createButton(modal, "add new type", [], () => {
            if (Object.keys(blogDefinitions).find(type => type === input.value)) {
                openTypeModal();
                return;
            }
            blogDefinitions[input.value] = {
                "colors": { "backgroundColor": "black", "textColor": "white", "contrastColor": "grey" },
                "urls": [],
            }
            saveAndGo();
            openTypeModal();
        });

        addCloseButton(modal);
    }

    function addEditTypesButton(parent) {
        const button = createButton(parent, "Edit Types", [], openTypeModal);
    }

    function addEditFormattingButton(parent) {
        const button = createButton(parent, "Edit Formatting", [], openFormattingModal);
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
                if (isValidData(newDefinitions.blogDefinitions)) {
                    formattingDefinitions = newDefinitions.formattingDefinitions;
                    blogDefinitions = newDefinitions.blogDefinitions;
                    addBaseDefinitions();
                    saveAndGo();
                    closeModal();
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
        addCloseButton(modal);
    }

    function addOpenSettingsButton() {
        const settingsList = document.querySelector(".gM9qK");
        if (!settingsList || settingsList?.classList.contains("addedCheckerSettings")) return;
        settingsList?.classList.add("addedCheckerSettings");
        const entry = document.createElement("li");
        settingsList.appendChild(entry);
        const button = createButton(entry, "Checker Settings", ["edit-button"], openSettingsModal);
    }

    function openSettingsModal() {
        const modal = openModal();
        addEditTypesButton(modal);
        addEditFormattingButton(modal);
        addExportDataButton(modal);
        addCloseButton(modal);
    }

    function addCloseButton(parent) {
        return createButton(parent, "close", [], closeModal);
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
            Object.keys(blogDefinitions).forEach(type => {
                if (type != name) {
                    newDefinitions[type] = blogDefinitions[type];
                }
            });
            blogDefinitions = newDefinitions;
            saveAndGo();
            openTypeModal();
        });
    }

    function resizeText() {
        elementsToResize.forEach(type => {
            document.querySelectorAll(type).forEach(element => {
                element.style.fontSize = `${formattingDefinitions.textSize}px`;
                element.style.minHeight = `${formattingDefinitions.textSize * formattingDefinitions.textHeightModifier}px`;
            });
        });
        document.querySelectorAll("svg").forEach(element => {
            element.style.minHeight = `${formattingDefinitions.textSize}px`;
            element.style.minWidth = `${formattingDefinitions.textSize}px`;
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
        if (!blogDefinitions.hidden) {
            blogDefinitions["hidden"] = {
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
        if (!blogDefinitions.hideAsks) {
            blogDefinitions["hideAsks"] = {
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
        definitions.formattingDefinitions = formattingDefinitions;
        definitions.blogDefinitions = blogDefinitions;
        setCookie("peopleCheckerData", JSON.stringify(definitions));
    }

    function saveAndGo() {
        saveDefinitions();
        go();
    }

})();