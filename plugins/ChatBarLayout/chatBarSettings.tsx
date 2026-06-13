/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";
import "./index";

import { React } from "@webpack/common";

let savedChildrenArray: string[] = [];

export function SettingsButtons() {
    const buttonParent = document.querySelector(".buttons__74017");
    const miniChatBar = document.querySelector(".chat_ee72fa");
    const children = buttonParent?.children;
    const childrenArray = Array.from(children ?? []).filter(child =>
        !child.classList.contains("separator_aa63ab") &&
        !child.classList.contains("container_aa63ab") &&
        child.tagName !== "SPAN"

    ).map(child => (child.cloneNode(true) as Element).outerHTML);
    console.log("[chatbarlayout] array length", savedChildrenArray.length);
    if (children && !miniChatBar) {
        savedChildrenArray = childrenArray;
        console.log("[ChatBarLayout] updated childrenArray", savedChildrenArray);
        return;
    }
    if (savedChildrenArray.length > 0) {
        return (
            <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
            onMouseMove={MouseMoving} id={`order-${savedChildrenArray.length + 1}`}
            style={{ "order": savedChildrenArray.length + 1 }}
            className="vc-chatbar-discord-button buttonElement">
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

function MouseClicking(e) {
    const selectedElement = (e.target as HTMLElement).closest(".buttonElement") as HTMLElement;
    selectedButton = selectedElement;
    foundElement = 1;
    window.addEventListener("mousemove", MouseMoving);
    window.addEventListener("mouseup", MouseRelease);
    console.log("[chatBarLayout] grabbing Element", selectedElement);

    const slotContainer = document.querySelector(".chatBarButtonPlacement") as HTMLElement;
    if (selectedElement.parentElement === slotContainer) {
        const nextsiblingSlot = selectedElement.nextElementSibling;
        nextsiblingSlot?.remove();
        console.log("[chatBarLayout] slotContainer children length", slotContainer.children.length);
        if (slotContainer.children.length === 2){
            const aloneParentSlot = slotContainer.firstElementChild as HTMLElement;
            const aloneSlot = aloneParentSlot.firstElementChild as HTMLElement;
            aloneSlot.className = "buttonSlot";
            return;
        }
        for (let i = 0; i < slotContainer.children.length; i++){
            (slotContainer.children[i + 1] as HTMLElement).style.order = String(i);
        }
        return;
    }
}
function MouseMoving(e) {
    if (foundElement === 0) {
        return;
    }
    const currentButton = selectedButton as HTMLElement;
    const container = document.querySelector(".layer_bc663c:not([class*=' '])") as HTMLElement;
    container.appendChild(currentButton);
    currentButton.children[0]?.setAttribute("style", "pointer-events: none;");
    currentButton?.setAttribute("style", `position: absolute;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    transform: translate(-50%, -50%);`);
    const element = document.elementsFromPoint(e.clientX, e.clientY);
    const selectedSlot = element.find(el => el.classList.contains("buttonSlotContainer")) as HTMLElement;
    const hoverableSlot = selectedSlot?.firstElementChild as HTMLElement;
    if (hoverableSlot.classList.contains("slotHoverable")) {
        currentButton.style.pointerEvents = "none";
        return;
    }
    currentButton.style.pointerEvents = "auto";
    console.log("[chatbarlayout] mouse position", e.clientX, e.clientY);
}
function MouseRelease(e) {
    foundElement = 0;
    const currentButton = selectedButton as HTMLElement;
    window.removeEventListener("mousemove", MouseMoving);
    window.removeEventListener("mouseup", MouseRelease);
    const element = document.elementsFromPoint(e.clientX, e.clientY);
    const selectedSlot = element.find(el => el.classList.contains("buttonSlotContainer")) as HTMLElement;
    const buttonContainer = document.querySelector(".buttonElementContainer") as HTMLElement;
    if (!selectedSlot?.classList.contains("buttonSlotContainer")) {
        console.log("[chatBarLayout] letting go element", selectedButton);
        const orderID = currentButton.id.replace("order-", "");
        currentButton.removeAttribute("style");
        currentButton.style.order = orderID;
        buttonContainer.appendChild(currentButton);
        return;
    }

    console.log("[chatbarlayout] found slot for selected button");
    const slotContainer = document.querySelector(".chatBarButtonPlacement") as HTMLElement;
    selectedSlot.after(currentButton);
    selectedSlot.remove();
    currentButton.removeAttribute("style");
    const slotBefore = document.createElement("div");
        slotBefore.className = "buttonSlotContainer";
        slotBefore.innerHTML = "<div class='slotHoverable'></div>";
    const slotAfter = document.createElement("div");
        slotAfter.className = "buttonSlotContainer";
        slotAfter.innerHTML = "<div class='slotHoverable'></div>";
    selectedButton?.parentElement?.insertBefore(slotBefore, selectedButton);
    selectedButton?.after(slotAfter);
    for (let i = 0; i < slotContainer.children.length; i++){
        (slotContainer.children[i + 1] as HTMLElement).style.order = String(i);
    }
}

export default function ChatBarSettings() {
    return (
        <>
            <div className="buttonContainer wrapper__72c38">
                <div className="buttonElementContainer">
                    {savedChildrenArray.map((html, index) => (
                        <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
                        onMouseMove={MouseMoving} key={index} id={`order-${index}`}
                        style={{ "order": index }}
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
