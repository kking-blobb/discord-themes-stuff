/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import React from "react";

export default function ChatBarSettings() {
    return (
        <div>
            <div className="buttonContainer wrapper__72c38 ">
                <div className="buttonElementContainer" id="gift-button">
                        <img className="buttonElement" src="https://media.discordapp.net/attachments/1155655043433893989/1504268019038163106/Discord-Gift.png?ex=6a065e43&is=6a050cc3&hm=aa4c397fb352d7065ef6ff29dc7f263900f292c5c625ac8acb0c4c328800a2da&=&format=webp&quality=lossless" alt="" />
                    </div>
                    <div className="buttonElementContainer" id="gif-button">
                        <img className="buttonElement" src="https://media.discordapp.net/attachments/1155655043433893989/1504268018405085235/Discord-Gif.png?ex=6a065e43&is=6a050cc3&hm=32729837c303ea33db0c72e262d0de828fc5faea7f6e082be51d951fab7b10aa&=&format=webp&quality=lossless" alt="" />
                    </div>
                    <div className="buttonElementContainer" id="sticker-button">
                        <img className="buttonElement" src="https://media.discordapp.net/attachments/1155655043433893989/1504268019298471986/Discord-Sticker.png?ex=6a065e43&is=6a050cc3&hm=3c77d9a8ba3f8268f341c1fec305f481a26018f9263813116e92d982a96b1298&=&format=webp&quality=lossless" alt="" />
                    </div>
                    <div className="buttonElementContainer" id="emoji-button">
                       <img className="buttonElement" src="https://media.discordapp.net/attachments/1155655043433893989/1504268018706808903/Discord-Emoji.png?ex=6a065e43&is=6a050cc3&hm=0e2899f58dd35ef727253695abae5adc1e457dc3f27ac23d3d0db504b6693432&=&format=webp&quality=lossless" alt="" />
                    </div>
                    <div className="buttonElementContainer" id="app-button">
                      <img className="buttonElement" src="https://media.discordapp.net/attachments/1155655043433893989/1504268018140581999/Discord-App.png?ex=6a065e43&is=6a050cc3&hm=77221dbb88e881d85b05c27d211cf80a1882fdd159cfe72a73a43629984948ad&=&format=webp&quality=lossless" alt="" />
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
