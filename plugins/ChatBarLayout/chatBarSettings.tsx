/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";
import "./index";

import { React } from "@webpack/common";

let savedChildrenArray: string[] = [];
let savedNonButton: string[] = [];

export function SettingsButtons() {
    const buttonParent = document.querySelector(".buttons__74017");
    const miniChatBar = document.querySelector(".chat_ee72fa");
    const children = buttonParent?.children;
    const childrenArray = Array.from(children ?? []).filter(child =>
        !child.classList.contains("separator_aa63ab") &&
        !child.classList.contains("container_aa63ab") &&
        !(child.classList.contains("vc-chatbar-button") &&
        child.querySelector(".button__24af7") === null) &&
        child.tagName !== "SPAN"

    ).map(child => (child.cloneNode(true) as Element).outerHTML);
    const nonButtons = Array.from(children ?? []).filter(child =>
        (child.classList.contains("vc-chatbar-button") &&
        child.querySelector(".button__24af7") === null)

    ).map(child => (child.cloneNode(true) as Element).outerHTML);
    if (children && !miniChatBar) {
        savedChildrenArray = childrenArray;
        savedNonButton = nonButtons;
        console.log("[ChatBarLayout] updated childrenArray", savedChildrenArray);
        console.log("[ChatBarLayout] updated nonButtons", savedNonButton);
    }
    if (savedChildrenArray.length > 0) {
        return (
            <div draggable className="vc-chatbar-discord-button buttonElement">
                <div className="separator_aa63ab"></div>
            </div>
        );
    } else {
        return (
            <p style={{ color:"azure" }}>Please load chatbar buttons.</p>
        );
    }
}

let foundElement = 0;
let selectedButton: HTMLElement | null = null;

function MouseClicking(e: React.MouseEvent) {
    const selectedElement = (e.target as HTMLElement).closest(".buttonElement") as HTMLElement;
    const container = document.querySelector(".layer_bc663c:not([class*=' '])") as HTMLElement;
    container.appendChild(selectedElement);
    window.addEventListener("mousemove", MouseMoving);
    window.addEventListener("mouseup", MouseRelease);
    selectedButton = selectedElement;
    foundElement = 1;
    const elementpos = selectedElement.getBoundingClientRect();
    console.log("[chatBarLayout] hovering over element", elementpos.left, elementpos.top);
}
function MouseMoving(e) {
    if (foundElement > 0) {
        const currentButton = selectedButton as HTMLElement;
        console.log("[chatBarLayout] grabbing Element", currentButton);
        currentButton?.setAttribute("style", `position: absolute;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        pointer-events: none;`);
        console.log("[chatbarlayout] mouse position", e.clientX, e.clientY);
    }
}
function MouseRelease() {
    foundElement = 0;
    const currentButton = selectedButton as HTMLElement;
    currentButton.style.pointerEvents = "auto";
    window.removeEventListener("mousemove", MouseMoving);
    window.removeEventListener("mouseup", MouseRelease);
    console.log("[chatBarLayout] letting go element", selectedButton);
}

export default function ChatBarSettings() {
    return (
        <>
            <div className="buttonContainer wrapper__72c38">
                <div className="buttonElementContainer">
                    {savedChildrenArray.map((html, index) => (
                        <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
                        onMouseMove={MouseMoving} key={index}
                        className=" vc-chatbar-discord-button buttonElement"
                        dangerouslySetInnerHTML={{ __html: html }}/>
                    ))}
                    {savedNonButton.map((html, index) => (
                        <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
                        onMouseMove={MouseMoving} key={index}
                        className="vc-chatbar-discord-button buttonElement"
                        dangerouslySetInnerHTML={{ __html: html }}/>
                    ))}
                    <SettingsButtons/>
                </div>
            </div>
            <div className="chatBarButtonPlacement wrapper__72c38">
                <div className="buttonSlotContainer">
                    <div className="buttonSlot"></div>
                </div>
            </div>
        </>
    );
}
