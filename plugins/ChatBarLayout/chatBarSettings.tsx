/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { DataStore } from "@api/index";
import { React, useEffect } from "@webpack/common";

import { loadButtons, nonSaved,saved } from "./index";

let savedChildrenArray: string[] = [];

let foundElement = 0;
let selectedButton: HTMLElement | null = null;

export function SettingsButtons() {
    const buttonParent = document.querySelector(".buttons__74017");
    const miniChatBar = document.querySelector(".chat_ee72fa");
    const children = buttonParent?.children;
    if (saved.length > 1) { savedChildrenArray = []; return; }
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
    if (savedChildrenArray.length === 0) {
        return (
            <p style={{ color:"azure" }}>Please load chatbar buttons.</p>
        );
    }
}

function LoadNonSaved() {
    if (nonSaved.length > 0) {
        return(
            nonSaved.map((html, index) => (
                <div key={index} id={"RemoveWrapperNon"}
                dangerouslySetInnerHTML={{ __html: html }}/>
            ))
        );
    } else {
        if (savedChildrenArray.length === 0) { return; }
        return(
            <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
            onMouseMove={MouseMoving} id={`button-${savedChildrenArray.length + 1}`}
            style={{ "order": savedChildrenArray.length + 1 }}
            aria-label={`order-${savedChildrenArray.length + 1}`}
            data-custom-button="true"
            className="vc-chatbar-discord-button buttonElement">
                <div className="separator_aa63ab"></div>
            </div>
        );
    }
}
function LoadSaved() {
    if (saved.length > 0) {
        return(
            saved.map((html, index) => (
                <div key={index} id={"RemoveWrapperSaved"}
                dangerouslySetInnerHTML={{ __html: html }}/>
            ))
        );
    } else {
        return(
            <div className="buttonSlotContainer">
                <div className="buttonSlot"></div>
            </div>
        );
    }
}

export default function ChatBarSettings() {
    loadButtons();
    useEffect(() => {
        const ElementContainer = document.querySelector(".buttonElementContainer");
        const PlacementContainer = document.querySelector(".chatBarButtonPlacement");
        const wrappersNon = Array.from(ElementContainer?.children ?? []).filter(child =>
            child.id === "RemoveWrapperNon"
        );
        const wrappersSaved = Array.from(PlacementContainer?.children ?? []).filter(child =>
            child.id === "RemoveWrapperSaved"
        );
        for (let i=0; i<nonSaved.length; i++){
            const Wrapper = ElementContainer?.children[i];
            console.log("[chatbarlayout] wrapper", Wrapper);
            const button = Wrapper?.firstElementChild as HTMLElement;
            ElementContainer?.appendChild(button);
            button.addEventListener("mousedown", MouseClicking);
            button.addEventListener("mousemove", MouseMoving);
            button.addEventListener("mouseup", MouseRelease);
        }
        for (let j=0; j<wrappersNon.length; j++){
            wrappersNon[j].remove();
            console.log("[chatbarlayout] removing wrappers", wrappersNon[j]);
        }
        for (let i=0; i<saved.length; i++){
            const Wrapper = PlacementContainer?.children[i];
            console.log("[chatbarlayout] wrapper", Wrapper);
            const button = Wrapper?.firstElementChild as HTMLElement;
            PlacementContainer?.appendChild(button);
            if (button.classList.contains("buttonElement")){
                button.addEventListener("mousedown", MouseClicking);
                button.addEventListener("mousemove", MouseMoving);
                button.addEventListener("mouseup", MouseRelease);
            }
        }
        for (let j=0; j<wrappersSaved.length; j++){
            wrappersSaved[j].remove();
            console.log("[chatbarlayout] removing wrappers", wrappersSaved[j]);
        }
    }, [LoadNonSaved, LoadSaved]);

    return (
        <>
            <hr style={{ width: "100%" }}></hr>
            <div className="buttonContainer wrapper__72c38">
                <div className="buttonElementContainer">
                    {savedChildrenArray.map((html, index) => (
                        <div onMouseDown={MouseClicking} onMouseUp={MouseRelease}
                        onMouseMove={MouseMoving} key={index} aria-label={`order-${index}`}
                        style={{ "order": index }} id={`button-${index}`}
                        className="vc-chatbar-discord-button buttonElement"
                        data-custom-button="false"
                        dangerouslySetInnerHTML={{ __html: html }}/>
                    ))}
                    <LoadNonSaved/>
                    <SettingsButtons/>
                </div>
            </div>
            <div className="chatBarButtonPlacement wrapper__72c38">
                <LoadSaved/>
            </div>
            <div style={{ display: "flex" }}>
                <div onClick={saveLayout} className="saveButton wrapper__72c38">
                    <p>save layout</p>
                </div>
                <div onClick={resetLayout} className="resetButton wrapper__72c38">
                    <p>reset layout</p>
                </div>
            </div>
        </>
    );
}

async function saveLayout() {
    console.log("[chatbarlayout] saving layout");
    const nonSavedbuttons = document.querySelector(".buttonElementContainer")?.children;
    const savedButton = document.querySelector(".chatBarButtonPlacement")?.children;

    const nonSavedArray = Array.from(nonSavedbuttons ?? []).map(el => el.outerHTML);
    const savedArray = Array.from(savedButton ?? []).map(el => el.outerHTML);
    if (savedButton?.length === 1){
        resetLayout();
        return;
    }
    await DataStore.set("ChatBarLayout.nonSavedLayout", nonSavedArray);
    await DataStore.set("ChatBarLayout.savedLayout", savedArray);
    loadButtons();
    console.log("[ChatBarLayout] nonsaved", nonSaved.length);
    console.log("[ChatBarLayout] saved", saved.length);
}
async function resetLayout() {
    const nonSavedbuttons = document.querySelector(".buttonElementContainer")?.children as HTMLCollection;
    const savedButton = document.querySelector(".chatBarButtonPlacement")?.children as HTMLCollection;
    await DataStore.set("ChatBarLayout.nonSavedLayout", "");
    await DataStore.set("ChatBarLayout.savedLayout", "");
    for (let i=0; i< nonSavedbuttons?.length; i++){
        const Element = nonSavedbuttons[i] as HTMLElement;
        Element.remove();
    }
    for (let i=0; i< savedButton?.length; i++){
        const Element = savedButton[i] as HTMLElement;
        Element.remove();
    }
    loadButtons();
    LoadNonSaved();
    LoadSaved();
    console.log("[ChatBarLayout] removed nonsaved", nonSaved.length);
    console.log("[ChatBarLayout] remove saved", saved.length);
}

export function seperatorButton(){
    return(
        <div className="separator_aa63ab"/>
    );
}

export function LeftMessageButtonImage(){
    return(
        <img src="https://raw.githubusercontent.com/kking-blobb/discord-themes-stuff/refs/heads/main/plugins/PluginImages/Message-Button-Left.png"
        style={{ "height":"30%","width":"30%","borderRadius":"10px" }}
        className="wrapper__72c38"
        draggable={false}
        />
    );
}

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
        }
        for (let i = 0; i < slotContainer.children.length; i++){
            (slotContainer.children[i] as HTMLElement).style.order = String(i);
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
    console.log("[chatbarlayout] mouse position", e.clientX, e.clientY);

    const element = document.elementsFromPoint(e.clientX, e.clientY);
    const selectedSlot = element.find(el => el.classList.contains("buttonSlotContainer")) as HTMLElement;
    const hoverableSlot = selectedSlot?.firstElementChild as HTMLElement;
    currentButton.style.pointerEvents = "auto";
}
function MouseRelease(e) {
    foundElement = 0;
    const currentButton = selectedButton as HTMLElement;
    const element = document.elementsFromPoint(e.clientX, e.clientY);
    window.removeEventListener("mousemove", MouseMoving);
    window.removeEventListener("mouseup", MouseRelease);

    const selectedSlot = element.find(el => el.classList.contains("buttonSlotContainer")) as HTMLElement;
    const buttonContainer = document.querySelector(".buttonElementContainer") as HTMLElement;
    if (!selectedSlot?.classList.contains("buttonSlotContainer")) {
        console.log("[chatBarLayout] letting go element", selectedButton);
        currentButton.removeAttribute("style");
        buttonContainer.appendChild(currentButton);
        const orderLabel = currentButton.ariaLabel?.replace("order-", "");
        currentButton.style.order = orderLabel ?? "";
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
        (slotContainer.children[i] as HTMLElement).style.order = String(i);
    }
}
