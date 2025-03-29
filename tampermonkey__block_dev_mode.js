// ==UserScript==
// @name         Chặn phát hiện dùng chrome dev mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ngăn chặn trang web phát hiện DevTools
// @match        https://courses.ut.edu.vn/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/nhphuc2210/chrome_active_mode1/refs/heads/master/tampermonkey__focus_mode.js
// @downloadURL  https://raw.githubusercontent.com/nhphuc2210/chrome_active_mode1/refs/heads/master/tampermonkey__focus_mode.js
// @run-at       document-start
// ==/UserScript==

(function() {
    Object.defineProperty(window, 'outerWidth', { get: () => window.innerWidth });
    Object.defineProperty(window, 'outerHeight', { get: () => window.innerHeight });

    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    performance.now = () => 0;

    window.devtools = { open: false };
    Object.defineProperty(window, 'devtools', { get: () => ({ open: false }) });
})();
