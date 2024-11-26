import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContent from '@/app/components/interview/main_content';
import { SessionProvider } from '@/app/utils/session_provider';

describe('MainContent Component', () => {
  test('renders code editor', () => {
    render(
      <SessionProvider>
        <MainContent />
      </SessionProvider>
    );
    // Check if the code editor is rendered
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
  });

  test('runs test cases and displays output', async () => {
    render(
      <SessionProvider>
        <MainContent />
      </SessionProvider>
    );

    // Type code into the code editor
    const codeEditor = screen.getByTestId('code-editor');
    fireEvent.change(codeEditor, {
      target: {
        value: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    `,
      },
    });

    // Click the 'Run Tests' button
    const runTestsButton = screen.getByText('Run All Tests');
    fireEvent.click(runTestsButton);

    await waitFor(() => {
      expect(screen.getByText(/Running all test cases/)).toBeInTheDocument();
      expect(screen.getByText(/Test Case 1:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/✅ Passed/)).toBeInTheDocument();
  });
});