import { test, expect } from "@playwright/test";

test.describe("Code Execution Flow", () => {
  test("should execute code and display results", async ({ page }) => {
    // Navigate to the interview page with a specific question
    await page.goto(
      "http://localhost:3000/dashboard/interview?title=Two%20Sum"
    );

    // Wait for monaco code editor to load
    await page.waitForSelector(".monaco-editor");

    // Click inside the monaco to focus
    await page.click(".monaco-editor");

    // Type code into monaco
    await page.keyboard.type(`def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    `);

    // Click 'Run Tests' button
    await page.click('button:text("Run Tests")');

    // Wait for console output to appear
    await page.waitForSelector(".console-output");

    // Check console output for test results
    const consoleOutput = await page.textContent(".console-output");

    // Assertions
    expect(consoleOutput).toContain("Running all test cases");
    expect(consoleOutput).toContain("✅ Passed");
  });
});
