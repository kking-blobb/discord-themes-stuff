/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { DataStore } from "@api/index";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

import ChatBarSettings, { LeftMessageButtonImage, seperatorButton ,SettingsButtons } from "./chatBarSettings";

const settings = definePluginSettings({
    ToggleLeftSideMessageButton: {
        type: OptionType.BOOLEAN,
        description: "Places the message button to the left side of the chatbar buttons",
        default: false,
    },
    LeftSideMessageButtonImage: {
        type: OptionType.COMPONENT,
        component: LeftMessageButtonImage,
    },
    chatBarButtons: {
        type: OptionType.COMPONENT,
        component: ChatBarSettings,
    }
});

export let nonSaved: string[] = [];
export let saved: string[] = [];
export let OriginalArray: string[];
let CurrentArray: Element[] = [];
let savedChatbarLength: number;
const customIds: string[] = [];
const customElements: Element[] = [];

export async function loadButtons() {
    const nonSavedButtons = await DataStore.get("ChatBarLayout.nonSavedLayout") ?? [];
    const savedButtons = await DataStore.get("ChatBarLayout.savedLayout") ?? [];
    console.log("[loading] nonsaved", nonSavedButtons.length);
    console.log("[loading] saved", savedButtons.length);
    nonSaved = nonSavedButtons;
    saved = savedButtons;
}

function SettingOptions(){
    const LeftMessageToggle = settings.store.ToggleLeftSideMessageButton;

    const messageButton = document.querySelector(".container_aa63ab") as HTMLElement;
    if (messageButton) {
        const seperator = messageButton.previousElementSibling as HTMLElement;
        if (LeftMessageToggle === true) {
            seperator.style.order = "-19";
            messageButton.style.order = "-20";
        } else {
            seperator.style.order = "500";
            messageButton.style.order = "501";
        }
    }
}

export default definePlugin({
    name: "ChatBarLayout",
    description: "Customize the chatbar",
    authors: [{ name: "kkingblob_", id: 1084261061244489819n }],
    settings,
    start() {
        console.log("[ChatBarLayout] Plugin started.");
        loadButtons();
        const mutationObserver = new MutationObserver(mutations => {
            const chatbar = document.querySelector(".buttons__74017");
            const miniChatBar = document.querySelector(".chat_ee72fa");
            if (chatbar && !miniChatBar) {
                console.log("[ChatBarLayout] Found chatbar", chatbar);
                const buttonsArray = Array.from(chatbar.children ?? []).filter(button =>
                    !button.classList.contains("separator_aa63ab") &&
                    !button.classList.contains("container_aa63ab") &&
                    button.getAttribute("aria-label") !== "custom-button" &&
                    button.tagName !== "SPAN"
                );
                if (OriginalArray?.length !== buttonsArray?.length){
                    OriginalArray = buttonsArray.map(child => (child.cloneNode(true) as Element).outerHTML);
                }
                const combinedArray: Element[] = [...buttonsArray, ...customElements];
                CurrentArray = combinedArray;
                for (let i = 0; i < buttonsArray.length; i++){
                    console.log("[chatbarlayout] placing id", buttonsArray[i]);
                    buttonsArray[i].id = `button-${i}`;
                    if (saved.length < 1){
                        (buttonsArray[i] as HTMLElement).style.display = "";
                    }
                }
                SettingOptions();
                SettingsButtons();
                if (saved.length < 1) { console.log("[chatbarlayout] no saved layout"); return; }
                let c = 0;
                let s = 0;
                while(c < CurrentArray?.length){
                    const Element = CurrentArray[c] as HTMLElement;
                    const savedDiv = document.createElement("div");
                    savedDiv.innerHTML = saved[s];
                    const savedElement = savedDiv.firstElementChild as HTMLElement;

                    if (s >= saved.length){
                        console.log("[chatbarlayout] all ids didnt match");
                        Element.style.display = "none";
                        if (Element.ariaLabel === "custom-button") {
                            console.log("[chatbarlayout] removing custom button", Element.id);
                            removeChatBarButton(Element.id);
                            const IdIndex = customIds.indexOf(Element.id);
                            const ElementIndex = customElements.indexOf(Element);
                            if (IdIndex !== -1) customIds.splice(IdIndex, 1);
                            if (ElementIndex !== -1) customElements.splice(ElementIndex, 1);
                        }
                        c++;
                        s = 0;
                        continue;
                    }
                    if (savedElement.getAttribute("data-custom-button") === "true" && !customIds.includes(savedElement.id)) {
                        console.log("[chatbarlayout] Found custom button", savedElement);
                        addChatBarButton(savedElement.id, seperatorButton(savedElement.id, savedElement.style.order));
                        const customButton = document.getElementById(savedElement.id);
                        console.log("[chatbarlayout] added custom button", customButton as HTMLElement);
                        if (customButton && !CurrentArray?.includes(customButton)) {
                            customElements.push(customButton);
                            customIds.push(savedElement.id);
                        }
                    }

                    console.log("[chatbarlayout] c", c, "s", s);
                    console.log("[chatbarlayout] Chatbar Element [c]", Element);
                    console.log("[chatbarlayout] Saved Element [s]", savedElement);
                    console.log("[chatbarlayout] data-custom-button", savedElement.getAttribute("data-custom-button"));

                    if (Element.id === savedElement.id) {
                        Element.style.order = savedElement.style.order;
                        console.log("[chatbarlayout] found matching id", Element.id, "order", Element.style.order);
                        console.log("[chatbarlayout] ----------------- new button -----------------");
                        c++;
                        s = 0;
                    } else {
                        console.log("[chatbarlayout] id didnt match");
                        console.log("[chatbarlayout] ----------------- new button -----------------");
                        s++;
                    }
                }
                console.log("[ChatBarLayout] reached end");
            }
        });
        const BODY = document.body;
        mutationObserver.observe(BODY, { childList: true, subtree: true });
    },
    stop() {
        console.log("[ChatBarLayout] Plugin stopped.");
    }
});
