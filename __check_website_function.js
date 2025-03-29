// allow pasting

["visibilitychange", "focus", "blur"].forEach(evt => {
    window.addEventListener(evt, () => {
        const now = new Date();
        const timestamp = now.toISOString().replace("T", " ").split(".")[0] +
                          `,${now.getMilliseconds().toString().padStart(3, "0")}`;
        console.log(`%c[${timestamp}] INFO: ${evt} triggered`, "color: white; background: rgba(255, 0, 0, 0.8); padding: 2px 4px; border-radius: 3px; font-weight: bold;");
        // console.trace(); // Print the call stack
    }, true);
});
