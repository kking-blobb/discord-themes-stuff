/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

import ChatBarSettings, { LeftMessageButtonImage, SettingsButtons } from "./chatBarSettings";

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

export async function loadButtons() {
    const nonSavedButtons = await DataStore.get("ChatBarLayout.nonSavedLayout") ?? [];
    const savedButtons = await DataStore.get("ChatBarLayout.savedLayout") ?? [];
    console.log("[loading] saved", nonSavedButtons.length);
    console.log("[loading] nonsaved", savedButtons.length);
    nonSaved = nonSavedButtons;
    saved = savedButtons;
}

function SettingOptions(){
    const LeftMessageToggle = settings.store.ToggleLeftSideMessageButton;
    const seperator = document.querySelector(".separator_aa63ab") as HTMLElement;
    const messageButton = document.querySelector(".container_aa63ab") as HTMLElement;

    if (LeftMessageToggle === true) {
        seperator.style.order = "-19";
        messageButton.style.order = "-20";
    } else {
        seperator.style.order = "500";
        messageButton.style.order = "501";
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
                const buttons = chatbar.children;
                const buttonsArray = Array.from(buttons ?? []).filter(button => {
                    return !button.classList.contains("separator_aa63ab") &&
                    !button.classList.contains("container_aa63ab") &&
                    button.tagName !== "SPAN";
                });
                for (let i = 0; i < buttonsArray.length; i++){
                    console.log("[chatbarlayout] placing id", buttonsArray[i]);
                    buttonsArray[i].id = `button-${i}`;
                }
                SettingOptions();
                if (saved.length < 1){
                    console.log("[chatbarlayout] no saved buttons");
                    SettingsButtons();
                    return;
                }
                let c = 0;
                let s = 0;
                while(c < buttonsArray.length){
                    const Element = buttonsArray[c] as HTMLElement;
                    if (s >= saved.length){
                        console.log("[chatbarlayout] all ids didnt match");
                        Element.style.display = "none";
                        Element.ariaLabel = "notSelected";
                        c++;
                        s = 0;
                    }
                    const savedDiv = document.createElement("div");
                    savedDiv.innerHTML = saved[s];
                    const savedElement = savedDiv.firstElementChild as HTMLElement;

                    console.log("[chatbarlayout] c", c, "s", s);
                    console.log("[chatbarlayout] Chatbar Element [c]", Element);
                    console.log("[chatbarlayout] Saved Element [s]", savedElement);

                    if (Element.getAttribute("aria-label")) {
                        console.log("[chatbarlayout] found arialabel");
                        c++;
                        s = 0;
                    }
                    // above should skip certain buttons and keeps its styles
                    // below should only apply styles and attributes once
                    if (Element.id === savedElement.id) {
                        Element.style.order = savedElement.style.order;
                        Element.ariaLabel = "selected";
                        console.log("[chatbarlayout] found matching id");
                        c++;
                        s = 0;
                    } else {
                        console.log("[chatbarlayout] id didnt match");
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
