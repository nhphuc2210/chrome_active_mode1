// ==UserScript==
// @name         Chặn phát hiện dùng chrome dev mode // v2.10
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Ngăn chặn trang web phát hiện DevTools
// @match        https://courses.ut.edu.vn/*
// @grant        none
// @updateURL    https://github.com/nhphuc2210/chrome_active_mode1/raw/master/tampermonkey__focus_mode.js
// @downloadURL  https://github.com/nhphuc2210/chrome_active_mode1/raw/master/tampermonkey__block_dev_mode.js
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
