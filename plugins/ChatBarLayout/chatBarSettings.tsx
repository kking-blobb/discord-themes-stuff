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
    if (children) {
        savedChildrenArray = childrenArray;
        savedNonButton = nonButtons;
    }
    console.log("[ChatBarLayout] updated childrenArray", savedChildrenArray);
    console.log("[ChatBarLayout] updated nonButtons", savedNonButton);
}

export default function ChatBarSettings() {
    return (
        <div>
            <div className="buttonContainer wrapper__72c38">
                <div className="buttonElementContainer">
                    {savedChildrenArray.map((html, index) => (
                        <div draggable className="buttonElement" key={index} dangerouslySetInnerHTML={{ __html: html }}/>
                    ))}
                    {savedNonButton.map((html, index) => (
                        <div draggable className="vc-chatbar-discord-button buttonElement" key={index} dangerouslySetInnerHTML={{ __html: html }}/>
                    ))}
                    <div draggable className="vc-chatbar-discord-button buttonElement">
                        <div className="separator_aa63ab"></div>
                    </div>
                </div>
            </div>
            <div className="chatBarButtonPlacement wrapper__72c38">
                <div className="buttonSlotContainer">
                    <div className="buttonSlot"></div>
                </div>
            </div>
        </div>
    );
}
