/**
 * Main entry point for the Automation Challenge.
 *
 * Responsibilities:
 * - Launch the Playwright browser and initialize the automation context.
 * - Authenticate the user through the LoginPage.
 * - Read and iterate through all Excel rows.
 * - Fill and submit the dynamic form for each row.
 * - Handle reCAPTCHA popups whenever they appear.
 * - Log progress clearly for debugging and evaluation.
 */

import { chromium } from "playwright";
import { LoginPage } from "./pages/login.page";
import { DynamicFormPage } from "./pages/form.page";
import { readExcelData } from "./utils/excel";
import { handleRecaptcha } from "./utils/handleRecaptcha";
import * as dotenv from "dotenv";

dotenv.config();

async function run() {
  console.log("Starting automation process");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const login = new LoginPage(page);
  const form = new DynamicFormPage(page);

  try {
    // 1. Authentication
    await login.goto();
    await login.login(process.env.EMAIL!, process.env.PASSWORD!);
    await login.clickStart();

    // 2. Load Excel data
    const rows = readExcelData();
    console.log(`Total rows to process: ${rows.length}`);

    // 3. Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      console.log(`Processing row ${i + 1} of ${rows.length}`);
      console.log(row);

      // Ensure form is ready before interacting
      await form.waitForFormReady();

      // Handle popup if it appears before filling
      await handleRecaptcha(page);

      // Fill dynamic form
      await form.fillRow(row);

      // Handle popup if it appears after filling
      await handleRecaptcha(page);

      // Submit form
      await form.submit();

      // Handle popup if it appears after submit
      await handleRecaptcha(page);

      console.log(`Row ${i + 1} submitted successfully`);
    }

    console.log("Automation process completed");
  } catch (error) {
    console.error("Unexpected error during execution");
    console.error(error);
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}

run();
