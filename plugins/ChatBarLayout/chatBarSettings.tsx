/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { React } from "@webpack/common";

export default function ChatBarSettings() {
    const buttonParent = document.querySelector(".buttons__74017");
    const children = buttonParent?.children;
    const childrenArray = Array.from(children ?? []).filter(child =>
        !child.classList.contains("separator_aa63ab") &&
        !child.classList.contains("container_aa63ab") &&
        !(child.classList.contains("vc-chatbar-button") &&
        child.querySelector(".button__24af7") === null) &&
        child.tagName !== "SPAN"
    );
    const nonButtons = Array.from(children ?? []).filter(child =>
        child.classList.contains("separator_aa63ab")
    );
    return (
        <div>
            <div className="buttonContainer wrapper__72c38 ">
                <div className="buttonElementContainer">
                    {childrenArray.map((child, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: child.outerHTML }} />
                ))}
                <div>
                    {nonButtons.map((child, index) => (
                <div className="vc-chatbar-discord-button buttonElement" key={index} dangerouslySetInnerHTML={{ __html: child.outerHTML }} />
                ))}
            </div>
        </div>
            </div>
            <div className="chatBarButtonPlacement wrapper__72c38 ">
                <div className="buttonSlotContainer">
                    <div className="buttonSlot"></div>
                </div>
            </div>
        </div>
    );
}
