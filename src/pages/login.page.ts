/**
 * LoginPage
 *
 * This class encapsulates all interactions required to authenticate the user.
 * It abstracts navigation, login form handling, and validation of successful login.
 *
 * Responsibilities:
 * - Navigate to the base URL.
 * - Open the login flow from the landing page.
 * - Fill in credentials and submit the login form.
 * - Confirm that the login was successful.
 */

import { Page, expect } from "@playwright/test";
import { BASE_URL } from "../config";

export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigates to the application entry point.
   * The waitUntil option ensures the page is fully loaded before continuing.
   */
  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: "networkidle" });
  }

  /**
   * Clicks the initial Start button on the landing page.
   * This is required before accessing the login or signup flow.
   */
  async clickStart() {
    await this.page.getByRole("button", { name: /start/i }).click();
  }

  /**
   * Performs the full login sequence:
   * - Opens the login form from the signup screen.
   * - Fills in email and password.
   * - Submits the login form.
   * - Validates successful login by ensuring the
   *   "SIGN UP OR LOGIN" button is no longer visible.
   */
  async login(email: string, password: string) {
    // Open the signup screen
    await this.page.getByRole("button", { name: /start/i }).click();
    await expect(this.page.getByRole("heading", { name: /sign up/i })).toBeVisible();

    // Switch to login mode
    await this.page.getByRole("button", { name: "OR LOGIN", exact: true }).click();
    await expect(this.page.getByRole("heading", { name: /log in/i })).toBeVisible();

    // Fill credentials
    await this.page.getByPlaceholder("Email").first().fill(email);
    await this.page.getByPlaceholder("Password").first().fill(password);

    // Submit login form
    await this.page.getByRole("button", { name: /log in/i }).click();

    // Validate login by ensuring the pre-login button disappears
    const preLoginButton = this.page.getByRole("button", { name: "SIGN UP OR LOGIN" });

    await expect(preLoginButton).toBeHidden({
      timeout: 10000
    });
  }
}
