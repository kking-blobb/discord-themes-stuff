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
let selectedButton: HTMLElement | null = null;
let NonSavedValue = 0;
let SavedValue = 0;

const SlotHoverable = document.createElement("div");
    SlotHoverable.className = "buttonSlotContainer";
    SlotHoverable.innerHTML = "<div class='slotHoverable'></div>";

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
    }
    if (savedChildrenArray.length === 0) {
        return (
            <p style={{ color:"azure" }}>Please load chatbar buttons.</p>
        );
    } else {
        return(
            savedChildrenArray.map((html, index) => (
                <div onMouseDown={MouseClicking} key={index} aria-label={`order-${index}`}
                style={{ "order": index }} id={`button-${index}`}
                className="vc-chatbar-discord-button buttonElement"
                data-custom-button="false"
                dangerouslySetInnerHTML={{ __html: html }}/>
            ))
        );
    }
}

function LoadNonSaved() {
    if (nonSaved.length > 0) {
        return(
            nonSaved.map((html, index) => (
                <div key={index} id={"Wrapper"}
                dangerouslySetInnerHTML={{ __html: html }}/>
            ))
        );
    } else if (savedChildrenArray.length === 0) {
        return(
            <div onMouseDown={MouseClicking} id={`button-${savedChildrenArray.length + 1}`}
            style={{ "order": savedChildrenArray.length + 1 }} data-custom-button="true"
            aria-label={`order-${savedChildrenArray.length + 1}`}
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
                <div key={index} id={"Wrapper"}
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

function updateContainers(){
    const NonSavedContainer = document.querySelector(".buttonElementContainer") as HTMLElement;
    const SavedContainer = document.querySelector(".chatBarButtonPlacement") as HTMLElement;
    if (NonSavedValue && SavedValue === 0){
        console.log("[chatbarlayout] updating containers");
        NonSavedValue = NonSavedContainer.children.length;
        SavedValue = SavedContainer.children.length;
    }
    if (NonSavedValue !== NonSavedContainer.children.length){
        console.log("[chatbarlayout] updating non saved container");
        NonSavedContainer.querySelectorAll(".buttonElement").forEach((el, index) => {
            const orderLabel = (el as HTMLElement).ariaLabel?.replace("order-", "");
            (el as HTMLElement).style.order = String(orderLabel);
        });
    }
    if (SavedValue !== SavedContainer.children.length){
        console.log("[chatbarlayout] updating saved container");
        Array.from(SavedContainer.children).forEach((child, index) => {
            if (child.classList.contains("buttonSlotContainer") && child.nextElementSibling?.classList.contains("buttonSlotContainer")){
                console.log("[chatbarlayout] removing slot container", child.nextElementSibling);
                child.nextElementSibling.remove();
            } else if (child.classList.contains("buttonElement") && child.nextElementSibling?.classList.contains("buttonElement")){
                child.after(SlotHoverable.cloneNode(true));
                console.log("[chatbarlayout] adding slot container", child.nextElementSibling);
            }
            if (SavedContainer.children.length < 2){
                SavedContainer.appendChild(SlotHoverable.cloneNode(true));
                SavedContainer.firstElementChild?.classList.replace("slotHoverable", "buttonSlot");
            }
        });
        for (let i = 0; i < SavedContainer.children.length; i++){
            (SavedContainer.children[i] as HTMLElement).style.order = String(i);
        }
    }
}

export default function ChatBarSettings() {
    loadButtons();
    useEffect(() => {
        const Wrappers = Array.from(document.querySelectorAll("#Wrapper"));
        for (let i = 0; i < Wrappers.length; i++){
            const Parent = Wrappers[i].parentElement as HTMLElement;
            const button = Wrappers[i].firstElementChild as HTMLElement;
            Parent.appendChild(button);
            button.addEventListener("mousedown", MouseClicking);
            Wrappers[i].remove();
            console.log("[chatbarlayout] removing wrappers", Wrappers[i]);
            if (Parent.classList.contains("chatBarButtonPlacement")){
                if (!button.previousElementSibling?.classList.contains("buttonSlotContainer")) {
                    Parent.insertBefore(SlotHoverable.cloneNode(true), button);
                }
                button.after(SlotHoverable.cloneNode(true));
            }
        }
        updateContainers();
        console.log("[chatbarlayout] updated containers (ChatBarSettings)");
    }, [LoadNonSaved, LoadSaved]);

    return (
        <>
            <hr style={{ width: "100%" }}></hr>
            <div className="buttonContainer wrapper__72c38">
                <div className="buttonElementContainer">
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
    const savedArray = Array.from(savedButton ?? []).filter(child =>
        !child.classList.contains("buttonSlotContainer")).map(el => el.outerHTML);
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
    const nonSavedbuttons = document.querySelector(".buttonElementContainer") as HTMLElement;
    const savedButton = document.querySelector(".chatBarButtonPlacement") as HTMLElement;
    await DataStore.set("ChatBarLayout.nonSavedLayout", "");
    await DataStore.set("ChatBarLayout.savedLayout", "");
    savedButton.querySelectorAll(".buttonElement").forEach(el =>
        nonSavedbuttons.appendChild(el)
    );
    updateContainers();
    console.log("[chatbarlayout] updating containers (resetLayout)");
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

let Offset = { x: 0, y: 0 };
function MouseClicking(e) {
    const selectedElement = (e.target as HTMLElement).closest(".buttonElement") as HTMLElement;
    const rect = selectedElement.getBoundingClientRect();
    selectedButton = selectedElement;
    const container = document.querySelector(".layer_bc663c:not([class*=' '])") as HTMLElement;
    container.appendChild(selectedElement);
    Offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    window.addEventListener("mousemove", MouseMoving);
    window.addEventListener("mouseup", MouseRelease);
    console.log("[chatBarLayout] grabbing Element", selectedElement);

    MouseMoving(e);
    updateContainers();
    console.log("[chatbarlayout] updating containers (MouseClicking)");
}
function MouseMoving(e) {
    const currentButton = selectedButton as HTMLElement;
    currentButton?.setAttribute("style", `position: fixed;
    Left: ${e.clientX - Offset.x}px;
    Top: ${e.clientY - Offset.y}px;`);
    const MousePoint = document.elementsFromPoint(e.clientX, e.clientY);
    const Slot = MousePoint.find(el => el.classList.contains("buttonSlotContainer")) as HTMLElement;
    if (Slot.classList.contains("buttonSlotContainer")) {
        currentButton.style.pointerEvents = "none";
    } else { currentButton.style.pointerEvents = "auto"; }
}
function MouseRelease(e) {
    const currentButton = selectedButton as HTMLElement;
    window.removeEventListener("mousemove", MouseMoving);
    window.removeEventListener("mouseup", MouseRelease);

    const selectedSlot = (e.target as HTMLElement).closest(".buttonSlotContainer") as HTMLElement;
    const buttonContainer = document.querySelector(".buttonElementContainer") as HTMLElement;
    if (!selectedSlot?.classList.contains("buttonSlotContainer")) {
        console.log("[chatBarLayout] letting go element", selectedButton);
        currentButton.removeAttribute("style");
        buttonContainer.appendChild(currentButton);
        updateContainers();
        console.log("[chatbarlayout] updating containers (MouseRelease 1)");
        return;
    } else if (selectedSlot.firstElementChild?.classList.contains("buttonSlot")) {
        (selectedSlot.firstElementChild as HTMLElement).className = "slotHoverable";
    }

    console.log("[chatbarlayout] found slot for selected button");
    selectedSlot.after(currentButton);
    currentButton.removeAttribute("style");
    updateContainers();
    console.log("[chatbarlayout] updating containers (MouseRelease 2)");
}
