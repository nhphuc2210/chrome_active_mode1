// ==UserScript==
// @name         tampermonkey__session_check
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tự động kiểm tra và giữ phiên Moodle hoạt động
// @author       Bạn
// @match        https://courses.ut.edu.vn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = false;  // Đặt thành true nếu muốn debug

    // Function to generate a timestamp in Python logging format
    function getFormattedTimestamp() {
        const now = new Date();
        return now.toISOString().replace("T", " ").split(".")[0] +
               `,${now.getMilliseconds().toString().padStart(3, "0")}`;
    }

    // Custom logging function
    function logInfo(message) {
        if (DEBUG_MODE) {
            console.log(`${getFormattedTimestamp()} - [🔵 Session Check] - INFO: ${message}`);
        }
    }

    logInfo("[Session Check] Script đang đợi Moodle...");

    function waitForMoodleConfig(callback) {
        let checkInterval = setInterval(() => {
            if (typeof M !== "undefined" && M.cfg && M.cfg.sesskey) {
                clearInterval(checkInterval);
                logInfo("Moodle đã sẵn sàng, bắt đầu kiểm tra session.");
                callback();
            }
        }, 500); // Kiểm tra mỗi 500ms
    }

    function checkNextSession() {
        const sesskey = M.cfg.sesskey;
        const url = `/lib/ajax/service.php?sesskey=${sesskey}&info=core_session_time_remaining`;

        const bodyData = JSON.stringify([{
            "index": 0,
            "methodname": "core_session_time_remaining",
            "args": {}
        }]);

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: bodyData,
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data && data[0] && data[0].data && typeof data[0].data.timeremaining !== "undefined") {
                const timeRemaining = data[0].data.timeremaining;
                logInfo(`Thời gian còn lại: ${timeRemaining} giây`);
            }
        })
        .catch(error => console.error("[Session Check] Lỗi:", error));
    }

    waitForMoodleConfig(() => {
        setInterval(checkNextSession, 3000);
    });

})();
