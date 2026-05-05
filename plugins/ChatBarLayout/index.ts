/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin from "@utils/types";

const settings = definePluginSettings({
    // Define your plugin settings here
});

export default definePlugin({
    name: "ChatBarLayout",
    description: "Custom Chat bar",
    authors: [{ name: "kkingblob_", id: 1084261061244489819n }],
    settings,
    start() {
        console.log("[ChatBarLayout] Plugin started.");
        const mutationObserver = new MutationObserver(mutations => {
            console.log(mutations);
            const chatbar = document.getElementsByClassName("buttons__74017");
            if (chatbar && chatbar.length > 0) {
                console.log("[ChatBarLayout] Found Element", chatbar);
                const GiftButton = document.querySelector('[aria-label="Send a gift"]');
                const AppButton = document.getElementsByClassName("buttonContainer_e6e74f");
                if (GiftButton && AppButton) {
                    console.log("[ChatBarLayout] Found Gift Button and App Button", GiftButton, AppButton);
                    GiftButton.id = "gift-button";
                    AppButton[0].id = "app-button";
                }
                const ReactionElements = document.getElementsByClassName("expression-picker-chat-input-button");
                if (ReactionElements) {
                    console.log("[ChatBarLayout] Found Reaction Button", ReactionElements);
                    const GifButton = document.querySelector('[aria-label="Open GIF picker"]')?.parentElement;
                    const StickerButton = document.querySelector('[aria-label="Open sticker picker"]')?.parentElement;
                    const EmojiButton = document.querySelector('[aria-label="Add Emoji"]')?.parentElement;
                    if (GifButton && StickerButton && EmojiButton) {
                        console.log("[ChatBarLayout] Found Reaction Button Elements", GifButton, StickerButton, EmojiButton);
                        GifButton.id = "gif-button";
                        StickerButton.id = "sticker-button";
                        EmojiButton.id = "emoji-button";
                    }
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
