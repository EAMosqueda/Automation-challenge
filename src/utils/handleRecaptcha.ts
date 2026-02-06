/**
 * handleRecaptcha
 *
 * This utility detects and resolves the simulated reCAPTCHA popup used
 * in the challenge application. Bubble renders multiple popup elements
 * in the DOM, but only one is visible at any given time. The visible
 * popup is always the last one in the DOM order.
 *
 * Responsibilities:
 * - Detect whether a reCAPTCHA popup is currently visible.
 * - Click the confirmation button inside the popup.
 * - Wait for the popup to become hidden.
 * - Wait for the grey overlay to disappear.
 *
 * This function is safe to call at any point in the workflow. If no
 * popup is present or visible, it returns immediately.
 */

import { Page } from "playwright";

export async function handleRecaptcha(page: Page) {
  // Locate all popup elements rendered by Bubble
  const allPopups = page.locator(".bubble-element.Popup");
  const count = await allPopups.count();

  // If no popups exist, there is nothing to handle
  if (count === 0) return;

  // The visible popup is always the last one in the DOM
  const popup = allPopups.nth(count - 1);

  // If the popup is not visible, exit early
  if (!(await popup.isVisible())) return;

  console.log("Recaptcha popup detected. Attempting to resolve");

  // Locate the confirmation button inside the visible popup
  const captchaButton = popup.locator("button.bubble-element.Button.clickable-element");

  // Wait for the button to be visible before interacting
  await captchaButton.waitFor({ state: "visible" });

  // Click the button to dismiss the popup
  await captchaButton.click({ force: true });

  // Wait for the popup to become hidden (Bubble does not remove it from the DOM)
  await popup.waitFor({ state: "hidden" });

  // Bubble renders multiple grey overlays; only one is visible at a time
  const greyoutVisible = page.locator(".greyout:visible");

  // If a visible overlay exists, wait for it to disappear
  if (await greyoutVisible.count() > 0) {
    await greyoutVisible.waitFor({ state: "hidden" });
  }

  console.log("Recaptcha popup resolved");
}
