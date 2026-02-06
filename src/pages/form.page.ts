/**
 * DynamicFormPage
 *
 * This class encapsulates all interactions with the dynamic Bubble form.
 * The form regenerates its DOM structure after each submission, and each
 * input field receives a dynamic ID. However, every ID contains a stable
 * prefix, which allows us to reliably locate the correct input.
 *
 * Responsibilities:
 * - Map Excel column names to stable ID prefixes.
 * - Locate visible input fields using prefix-based selectors.
 * - Fill each row of data into the dynamic form.
 * - Submit the form and wait for it to regenerate.
 */

import { Page, Locator } from "@playwright/test";
import { RowData } from "../utils/excel";

export class DynamicFormPage {
  constructor(private page: Page) {}

  /**
   * Maps each Excel column to the stable prefix of its corresponding input ID.
   * Bubble generates IDs such as:
   *   ein_input_field_2
   *   ein_input_field_9
   *   company_name_input_field_14
   *
   * These prefixes remain stable even though the numeric suffix changes.
   */
  private idPatterns: Record<string, string> = {
    employer_identification_number: "ein_input_field_",
    company_name: "company_name_input_field_",
    sector: "sector_input_field_",
    company_address: "address_input_field_",
    automation_tool: "automation_tool_input_field_",
    annual_automation_saving: "annual_saving_input_field_",
    date_of_first_project: "date_input_field_",
  };

  /**
   * Returns the first visible input whose ID begins with the given prefix.
   * Bubble frequently keeps hidden duplicate inputs in the DOM, so the
   * :visible filter ensures we interact only with the active field.
   */
  private async getInputByIdPrefix(prefix: string): Promise<Locator> {
    const locator = this.page.locator(`[id^="${prefix}"]:visible`).first();
    await locator.waitFor({ state: "visible" });
    return locator;
  }

  /**
   * Fills all fields for a single Excel row.
   * Each column is matched to its corresponding input using the ID prefix map.
   * If a field is not present in the current form instance, it is safely skipped.
   */
  async fillRow(row: RowData) {
    for (const [column, value] of Object.entries(row)) {
      const prefix = this.idPatterns[column];

      // Skip columns that do not map to a known input prefix
      if (!prefix) {
        console.log(`No ID pattern found for column: ${column}`);
        continue;
      }

      const locator = this.page.locator(`[id^="${prefix}"]:visible`);

      // Skip fields that are not present in this form instance
      if (await locator.count() === 0) {
        console.log(`Field not present in this form: ${column}`);
        continue;
      }

      const input = locator.first();
      await input.waitFor({ state: "visible" });

      // Ensure the element is a valid input-like element
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());
      const validTags = ["input", "textarea", "select"];

      if (!validTags.includes(tagName)) {
        console.log(`Field ${column} is not a valid input element (found ${tagName}). Skipping.`);
        continue;
      }

      await input.fill(String(value ?? ""));
    }
  }

  /**
   * Clicks the Submit button.
   * The button is consistently identifiable by its accessible role and label.
   */
  async submit() {
    await this.page.getByRole("button", { name: /submit/i }).click();
  }

  /**
   * Waits for the form to be ready after regeneration.
   * Bubble rebuilds the form after each submission, so we wait for:
   * - The Submit button to be visible.
   * - At least one visible input field.
   * - A short delay to allow Bubble to finish rendering animations.
   */
  async waitForFormReady() {
    await this.page.getByRole("button", { name: /submit/i }).waitFor({
      state: "visible",
      timeout: 10000
    });

    await this.page.waitForSelector("input:visible", {
      state: "visible",
      timeout: 10000
    });

    // Small delay to ensure Bubble finishes rendering
    await this.page.waitForTimeout(150);
  }
}
