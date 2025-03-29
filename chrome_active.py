import logging
import time
import random
from Quartz import CGEventPost, kCGHIDEventTap
from Quartz.CoreGraphics import kCGEventMouseMoved
from AppKit import NSWorkspace
import subprocess

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def activate_chrome():
    """Brings Google Chrome to the foreground without affecting window focus."""
    subprocess.run(["open", "-a", "Google Chrome"], check=True)

def fake_mouse_movement():
    """Sends a mouse move event specifically to Google Chrome."""
    activate_chrome()  # Ensure Chrome is the active window
    CGEventPost(kCGHIDEventTap, kCGEventMouseMoved)
    logging.info("Mouse move event sent to Google Chrome")

# Infinite loop
while True:
    fake_mouse_movement()
    sleep_time = random.uniform(0.5, 3.0)  # Random sleep time between 0.5 and 3 seconds
    logging.info(f"Sleeping for {sleep_time:.2f} seconds")
    time.sleep(sleep_time)
