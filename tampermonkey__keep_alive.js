// ==UserScript==
// @name         Auto Click "Kéo dài phiên làm việc" // v2.9
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Tự động nhấn "Kéo dài phiên làm việc" khi xuất hiện popup session timeout
// @author       Bạn
// @match        https://courses.ut.edu.vn/*
// @grant        none
// @updateURL    https://github.com/nhphuc2210/chrome_active_mode1/raw/master/tampermonkey__keep_alive.js
// @downloadURL  https://github.com/nhphuc2210/chrome_active_mode1/raw/master/tampermonkey__keep_alive.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const second = 30;
    const DEBUG_MODE = true; // Đặt thành true nếu muốn debug

    // Function to generate a timestamp in Python logging format
    function getFormattedTimestamp() {
        const now = new Date();
        return now.toISOString().replace("T", " ").split(".")[0] +
               `,${now.getMilliseconds().toString().padStart(3, "0")}`;
    }

    // Custom logging function
    function logInfo(message) {
        if (DEBUG_MODE) {
            console.log(`${getFormattedTimestamp()} - [✅ Keep-Alive] - INFO: ${message}`);
        }
    }

    logInfo(`Script chạy, bắt đầu theo dõi popup session timeout mỗi ${second} giây...`);

    function showNotification() {
        const div = document.createElement("div");
        div.textContent = "Đã nhấn nút 'Kéo dài phiên làm việc'";
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "20px";
        div.style.backgroundColor = "green";
        div.style.color = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        div.style.zIndex = "9999";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000); // Tự động ẩn sau 5 giây
    }

    function closeSessionPopup() {
        const buttons = document.querySelectorAll("button.btn.btn-primary[data-action='save']");

        buttons.forEach(button => {
            if (button.innerText.trim() === "Kéo dài phiên làm việc") {
                logInfo("Đã tìm thấy popup, nhấn nút 'Kéo dài phiên làm việc'...");
                button.click(); // Nhấn nút để đóng popup
                logInfo("Đã nhấn nút 'Kéo dài phiên làm việc'");
                showNotification();
            }
        });
    }

    // Kiểm tra mỗi xx giây để đóng popup nếu xuất hiện
    setInterval(closeSessionPopup, second * 1000);
})();
