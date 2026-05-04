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
                if (GiftButton) {
                    console.log("[ChatBarLayout] Found Gift Button", GiftButton);
                    GiftButton.id = "gift-button";
                }
                console.log("[ChatBarLayout] Passes Gift Button Check");
                const ReactionElements = document.getElementsByClassName("expression-picker-chat-input-button");
                if (ReactionElements) {
                    console.log("[ChatBarLayout] Found Reaction Button", ReactionElements);
                    const GifButton = document.querySelector('[aria-label="Open GIF picker"]');
                    const StickerButton = document.querySelector('[aria-label="Open sticker picker"]');
                    const EmojiButton = document.querySelector('[aria-label="Add Emoji"]');
                    if (GifButton) {
                        console.log("[ChatBarLayout] Found GIF Button", GifButton);
                        GifButton.id = "gif-button";
                    }
                    if (StickerButton) {
                        console.log("[ChatBarLayout] Found Sticker Button", StickerButton);
                        StickerButton.id = "sticker-button";
                    }
                    if (EmojiButton) {
                        console.log("[ChatBarLayout] Found Emoji Button", EmojiButton);
                        EmojiButton.id = "emoji-button";
                    }
                }
                const AppButton = document.getElementsByClassName("buttonContainer_e6e74f");
                if (AppButton) {
                    console.log("[ChatBarLayout] Found App Button", AppButton);
                    AppButton[0].id = "app-button";
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
