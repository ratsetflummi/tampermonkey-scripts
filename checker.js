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
    const elementsToResize = ["a", "p", "li", "span", "time"];

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

    // define groups of users here
    // you can add more groups by following the schema below

    // include "hidden" if you want to be able to hide posts from certain users
    // hides only posts that were reblogged by a user or from a user on the list
    // the original intent was to be able to hide your own posts, but you can also use this for other users you don't want to see
    const definitions = {
        "hidden": {
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
                "ratsetflummi",
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

    // everything below here is code. changing stuff in here might make the extension not work anymore
    // i can't stop you from poking around though
    // have fun and be yourself
    // and if it does break, just download a fresh version

    const textHeightModifier = 1.2;

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
        checkBlog();
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


    function checkBlog() {
        const postList = document.querySelectorAll("article");
        postList.forEach(post => {
            if (hideCommunityPosts) {
                const dash = document.querySelector("[data-timeline-id]")?.querySelector("div");
                if (dash?.children) {
                    Array.from(dash.children).forEach(entry => {
                        const nextButton = Array.from(entry.querySelectorAll("button")).filter(button => button.ariaLabel == "Next");
                        if (!entry.querySelector("article") && nextButton.length == 0) {
                            entry.style.display = "none";
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
                    post.style.display = "none";
                    return;
                };
            }
            const header = post.querySelector("header");
            if (!header) {
                post.style.display = "none";
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
            headerBlogName.style.display = "inline-block";

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

            const postBody = header.nextElementSibling.querySelector("span").querySelector("div");
            if (!postBody) return;
            post.style.marginBottom = `${spaceBelowPosts}px`;

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
                    headerInfo.querySelector(".ar_IZ").style.display = "none";
                }
            }
            definitions.hidden?.urls?.forEach(name => {
                if (window.location.href.includes(name)) return;
                if (postLink.href.includes(`/${name}/`)) {
                    addExpandButton(postBody, header);
                }
            });

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

            const commentNumber = postBody.children.length;
            let i = 0;
            Array.from(postBody.children).forEach(comment => {
                i++;
                const commentHeader = comment.querySelector("div");
                if (!commentHeader) return;

                const commentLink = commentHeader.querySelector("a");
                if (!commentLink) return;

                Object.keys(definitions).forEach(type => {
                    definitions[type].urls.forEach(name => {
                        if (commentLink.href.includes(`/${name}/`)) {
                            comment.style.backgroundColor = definitions[type].colors.backgroundColor;
                            comment.style.color = definitions[type].colors.textColor;
                        } else {
                            if (window.location.href.includes(name)) return;
                            if (commentLink.href.includes("tumblr.com/")) {
                                const commentBlogName = commentLink.href.split("tumblr.com/")[1].split("/")[0];
                                if (rebloggedFromHiddenUser && !(i === commentNumber && postBlogName === commentBlogName)) {
                                    addExpandButton(comment);
                                }
                            }
                        }
                    });
                });

            });
        });
    }

    function addExpandButton(element, buttonParent = null) {
        if (element.classList.contains("expand")) return;
        element.style.display = "none";
        const expandElement = document.createElement("div");
        const expandButton = document.createElement("button");
        expandElement.appendChild(expandButton);
        element.classList.add("expand");
        expandButton.innerText = "expand";
        expandButton.style.fontSize = `${textSize}px`;
        expandButton.style.minHeight = `${textSize * textHeightModifier}px`;
        expandButton.addEventListener("click", () => {
            if (element.style.display == "none") {
                element.style.display = "";
                expandButton.innerText = "minimize";
            } else {
                element.style.display = "none";
                expandButton.innerText = "expand";
            }
        });
        expandButton.style.margin = "0 10px";
        expandButton.style.border = `${borderStyle} ${expandButtonBorderColor} ${borderWidth}px`;
        expandButton.style.borderRadius = `${cornerRounding}px`;
        expandButton.style.backgroundColor = `${expandButtonBackgroundColor}`;
        expandButton.style.color = `${expandButtonTextColor}`;
        expandButton.style.padding = "10px";
        if (!buttonParent) {
            buttonParent = element.parentElement;
            if (30 > textSize) {
                expandElement.style.minHeight = "30px";
            }
            expandButton.style.padding = "10px 5px";
            buttonParent.insertBefore(expandElement, element);
        } else {
            buttonParent.appendChild(expandButton);
        }
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

})();