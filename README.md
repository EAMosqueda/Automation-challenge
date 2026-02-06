# Automation Challenge -- Playwright + TypeScript

This project automates the complete workflow of submitting **50 rows of
data** into a dynamic web form hosted at **The Automation Challenge**.

It uses **Playwright + TypeScript + Excel parsing** to reliably complete
the task while handling:

-   Dynamic DOM changes
-   Hidden/duplicated inputs
-   Changing element IDs
-   Bubble.io rendering delays
-   Simulated reCAPTCHA popups

The solution is designed to be **clean, maintainable, well documented,
and performant**, completing all submissions in **under four minutes**,
meeting the challenge requirements.

------------------------------------------------------------------------

## Project Overview

The automation performs the following steps:

1.  Launches a Chromium browser
2.  Logs into the challenge website using credentials stored in
    environment variables
3.  Reads the first 50 rows from an Excel file
4.  For each row:
    -   Waits for the dynamic form to be ready
    -   Handles simulated reCAPTCHA popups
    -   Fills all visible fields using stable ID prefixes
    -   Submits the form
5.  Closes the browser after all rows are processed

The script is resilient to:

-   Dynamic field regeneration
-   Hidden duplicate inputs
-   Changing input IDs
-   Bubble.io rendering delays
-   Simulated reCAPTCHA popups

------------------------------------------------------------------------

## Tech Stack

-   Playwright
-   TypeScript
-   Node.js
-   XLSX / Excel parsing
-   dotenv (environment variables)

------------------------------------------------------------------------

## Project Structure

    project-root/
    │
    ├─ src/
    │  ├─ pages/            # Page Objects
    │  ├─ utils/            # Helpers (excel, captcha, selectors)
    │  ├─ config/           # Environment & constants
    │  └─ index.ts          # Main automation flow
    │
    ├─ data/
    │  └─ challenge.xlsx    # Input file
    │
    ├─ .env                 # Credentials
    ├─ package.json
    ├─ tsconfig.json
    └─ README.md

------------------------------------------------------------------------

## Setup Instructions

### 1. Install dependencies

``` bash
npm install
```

### 2. Create environment file

Create a `.env` file in the project root:

    CHALLENGE_EMAIL=your_email
    CHALLENGE_PASSWORD=your_password

### 3. Build the project

``` bash
npm run build
```

### 4. Run the automation

``` bash
npm start
```

------------------------------------------------------------------------

## Excel File Requirements

-   The file must be located at:

```{=html}
    /data/challenge.xlsx

-   The sheet name must be:

```{=html}
    data

-   The script processes 50 rows as required by the
    challenge.

### Column headers must match:

    employer_identification_number
    company_name
    sector
    company_address
    automation_tool
    annual_automation_saving
    date_of_first_project

------------------------------------------------------------------------

## Key Features

### Dynamic Field Handling

Bubble.io generates dynamic input IDs such as:

    ein_input_field_2
    ein_input_field_9

The script uses **stable ID prefixes** to reliably locate each field.

------------------------------------------------------------------------

### Visibility-Based Selectors

Bubble often keeps hidden duplicate inputs in the DOM.

The script interacts **only with visible elements**, preventing flaky
behavior.

------------------------------------------------------------------------

### Automatic reCAPTCHA Handling

The challenge includes a simulated popup.

The script:

-   Detects the visible popup
-   Clicks the confirmation button
-   Waits for the overlay to disappear

------------------------------------------------------------------------

### Performance Optimization

-   Minimal waiting
-   Efficient selectors
-   Linear, predictable flow
-   Designed to complete all 50 rows in under four minutes

------------------------------------------------------------------------

### Clean, Maintainable Code

-   Fully documented
-   Clear separation of responsibilities
-   Intent-focused comments
-   No hard-coded user-specific values

------------------------------------------------------------------------

## Notes

-   The browser runs in non-headless mode for transparency during evaluation.
-   You may switch to headless mode for faster execution if needed.
-   The script is safe to run multiple times.

------------------------------------------------------------------------

## Author

Edgar Mosqueda
