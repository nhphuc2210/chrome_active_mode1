// ==UserScript==
// @name         MAIN Chrome Active
// @namespace    https://courses.ut.edu.vn/
// @version      2.1
// @description  Prevent visibility detection and simulate activity
// @author       You
// @match        https://courses.ut.edu.vn/*
// @match        https://www.tiktok.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/nhphuc2210/chrome_active_mode1/master/tampermonkey__focus_mode.js
// @downloadURL  https://raw.githubusercontent.com/nhphuc2210/chrome_active_mode1/master/tampermonkey__focus_mode.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    //     ✅ Fix & Cải Tiến
    // ✔ Fix document.hasFocus để luôn trả về true
    // ✔ Fix getDisplayMedia để không bị lỗi trên trình duyệt không hỗ trợ WebRTC
    // ✔ Fix getFormattedTimestamp() để đảm bảo gọi trước khi sử dụng
    // ✔ Fix simulateActivity() để không bị phát hiện do thời gian lặp đều đặn
    // ✔ Fix document.visibilityState & hidden với configurable: true để tăng tính tương thích

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
            console.log(`${getFormattedTimestamp()} - [🟢 Protect Mode ON] - INFO: ${message}`);
        }
    }

    // Override visibilityState and hidden with logging
    Object.defineProperty(document, "visibilityState", {
        get: () => "visible",
        configurable: true
    });

    Object.defineProperty(document, "hidden", {
        get: () => false,
        configurable: true
    });

    // Chặn sự kiện visibilitychange & blur
    document.addEventListener('visibilitychange', function(event) {
        logInfo("✅ Protected visibilityState event!");
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('blur', function(event) {
        logInfo("✅ Protected blur event!");
        event.stopImmediatePropagation();
    }, true);

    // Khai báo biến lastTime bên ngoài để đảm bảo nó có sẵn cho toàn bộ scope
    let lastTime = performance.now();

    const realRAF = window.requestAnimationFrame;

    window.requestAnimationFrame = function(callback) {
        return realRAF(() => {
            // Đảm bảo luôn trả về true cho document.hasFocus
            document.hasFocus = () => true;
            const now = performance.now();
            if (now - lastTime > 100) {
                console.log("⚠️ Web có thể phát hiện bạn rời app!");
            }
            lastTime = now;
            callback();
        });
    };

    // Chặn addEventListener để tránh bị phát hiện
    const realAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === "visibilitychange" || type === "blur") {
            return; // Không cho trang web đăng ký sự kiện này
        }
        return realAddEventListener.call(this, type, listener, options);
    };

    // Chặn WebRTC screen tracking nếu có
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = () => Promise.reject(new Error("Blocked"));
    }

    // Function to generate a random interval between 5-15 seconds
    function getRandomTime() {
        return Math.floor(Math.random() * 10000) + 5000; // 5000ms (5s) đến 15000ms (15s)
    }

    // Simulate mouse movement & key press at random intervals
    function simulateActivity() {
        const mouseEvent = new MouseEvent("mousemove", {
            bubbles: true, cancelable: true, view: window,
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        });
        document.documentElement.dispatchEvent(mouseEvent);

        const keyEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true });
        document.documentElement.dispatchEvent(keyEvent);

        setTimeout(simulateActivity, getRandomTime());
    }

    // Start the loop with a random interval
    simulateActivity();
    logInfo("Simulating mouse movement & key pressed...");
    logInfo("Anti-visibility script is running with random intervals!");
    // alert("✅ Focus Mode is active. You are protected!");

    function showPopup(message, index) {
        const div = document.createElement("div");
        div.textContent = message;
        div.style.position = "fixed";
        div.style.bottom = `${20 + index * 53}px`; // Cách nhau 60px theo chiều dọc
        div.style.right = "20px";
        div.style.backgroundColor = "rgba(0, 128, 0, 0.8)"; // Màu xanh lá với 80% độ mờ
        div.style.color = "white";
        div.style.padding = "10px 20px";
        div.style.borderRadius = "5px";
        div.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
        div.style.zIndex = "9999";
        div.style.opacity = "0";
        div.style.transition = "opacity 0.5s ease-in-out";

        document.body.appendChild(div);

        // Hiển thị với hiệu ứng mờ dần
        setTimeout(() => {
            div.style.opacity = "1";
        }, 100 * index); // Mỗi popup xuất hiện trễ hơn popup trước 100ms

        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 500);
        }, 1500 + 100 * index);
    }

    // Hiển thị 5 popup liên tiếp từ dưới lên
    for (let i = 0; i < 7; i++) {
        showPopup(`✅ Focus Mode is active. You are protected!`, i);
    }
})();
