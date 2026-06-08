/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

import ChatBarSettings, { SettingsButtons } from "./chatBarSettings";

const settings = definePluginSettings({
    myToggle: {
        type: OptionType.BOOLEAN,
        description: "Enable this cool feature",
        default: true,
    },
    myText: {
        type: OptionType.STRING,
        description: "Custom message",
        default: "Hello world!",
        placeholder: "Type something..."
    },
    ChatBarButtons: {
        type: OptionType.COMPONENT,
        component: ChatBarSettings,
    }
});

export default definePlugin({
    name: "ChatBarLayout",
    description: "Customize the chatbar",
    authors: [{ name: "kkingblob_", id: 1084261061244489819n }],
    settings,
    start() {
        console.log("[ChatBarLayout] Plugin started.");
        const mutationObserver = new MutationObserver(mutations => {
            console.log(mutations);
            const chatbar = document.querySelector(".buttons__74017");
            const miniChatBar = document.querySelector("chat_ee72fa");
            if (chatbar && !miniChatBar) {
                console.log("[ChatBarLayout] Found chatbar", chatbar);
                SettingsButtons();
                console.log("[ChatBarLayout] updated Settings");
                const buttons = chatbar.children;
                const buttonsArray = Array.from(buttons ?? []).filter(button => {
                    return !button.classList.contains("separator_aa63ab") &&
                    !button.classList.contains("container_aa63ab") &&
                    button.tagName !== "SPAN";
                });
                for (let i = 0; i < buttonsArray.length; i++) {
                    buttonsArray[i].id = `button-${i}`;
                    console.log("[ChatBarLayout] Found buttons", buttonsArray);
                }
            }
        });
        const BODY = document.body;
        mutationObserver.observe(BODY, { childList: true, subtree: true });
    },
    stop() {
        console.log("[ChatBarLayout] Plugin stopped.");
    }
});
