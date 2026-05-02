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
                const GiftButton = document.getElementsByClassName("button__74017 button__24af7");
                if (GiftButton) {
                    console.log("[ChatBarLayout] Found Gift Button", GiftButton);
                }
                console.log("[ChatBarLayout] Passes Gift Button Check");
            }
        });
       const BODY = document.body;
       mutationObserver.observe(BODY, { childList: true, subtree: true });
    },
    stop() {
        console.log("[ChatBarLayout] Plugin stopped.");
    }
});
