/**
 * Excel utilities for the Automation Challenge.
 *
 * Responsibilities:
 * - Load the Excel workbook from the configured file path.
 * - Convert the target sheet into a JSON array.
 * - Return the number of rows required by the challenge.
 *
 * The sheet_to_json utility from XLSX normalizes the data into a
 * consistent structure, ensuring that empty cells are returned as
 * empty strings instead of undefined values.
 */

import * as XLSX from "xlsx";
import { EXCEL_PATH, SHEET_NAME, MAX_ROWS } from "../config";

/**
 * Represents a single row of data extracted from the Excel sheet.
 * Each key corresponds to a column header, and each value is the
 * cell content for that row.
 */
export type RowData = Record<string, string | number | boolean>;

/**
 * Reads the Excel file, extracts the target sheet, converts it to JSON,
 * and returns the first MAX_ROWS rows.
 *
 * This function assumes:
 * - The Excel file exists at EXCEL_PATH.
 * - The sheet name is defined in SHEET_NAME.
 * - The sheet contains at least MAX_ROWS rows.
 */
export function readExcelData(): RowData[] {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[SHEET_NAME];

  // Convert the sheet to JSON. The defval option ensures empty cells
  // are returned as empty strings instead of undefined.
  const json: RowData[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // Return only the number of rows required by the challenge.
  return json.slice(0, MAX_ROWS);
}
