/**
 * Global configuration values for the Automation Challenge.
 *
 * These constants centralize all environment‑independent settings used
 * throughout the project.
 */

/**
 * Base URL of the challenge application.
 */
export const BASE_URL = "https://www.theautomationchallenge.com/";

/**
 * Path to the Excel file containing the input data.
 * This path is relative to the project root.
 */
export const EXCEL_PATH = "src/data/challenge.xlsx";

/**
 * Name of the sheet inside the Excel workbook that contains the data.
 */
export const SHEET_NAME = "data";

/**
 * Maximum number of rows to process from the Excel sheet.
 * The challenge requires exactly 50 rows.
 */
export const MAX_ROWS = 50;
