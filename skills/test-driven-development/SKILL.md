---
name: "test-driven-development"
description: "Follows test-driven development methodology for robust code creation"
version: "1.0.0"
safety_level: "high"
---

# Test-Driven Development

## Purpose
This skill implements the test-driven development (TDD) methodology, where tests are written before code implementation. This approach ensures code quality, reduces bugs, and promotes better design.

## Context
Use this skill when developing new features, fixing bugs, or refactoring code. TDD is particularly valuable for critical systems, complex algorithms, and collaborative development environments.

## Input Requirements
- Clear specification of functionality to implement
- Understanding of expected behavior and edge cases
- Access to testing framework and tools

## Execution Steps
1. Understand requirements
   - Analyze the functionality to be implemented
   - Identify expected inputs, outputs, and behaviors
   - Consider edge cases and error conditions

2. Write failing tests
   - Create tests that cover the expected functionality
   - Include tests for edge cases and error conditions
   - Ensure tests are specific and deterministic

3. Implement minimal code
   - Write just enough code to make tests pass
   - Focus on functionality, not optimization
   - Keep code simple and readable

4. Run tests and verify
   - Execute all tests to confirm they pass
   - Verify no existing functionality was broken
   - Address any test failures immediately

5. Refactor and optimize
   - Improve code structure and readability
   - Optimize performance where needed
   - Ensure all tests continue to pass

6. Repeat cycle
   - Add additional tests for new functionality
   - Implement incrementally
   - Maintain passing test suite

## Safety Guidelines
- Ensure tests don't contain destructive operations
- Validate that test data is properly isolated
- Protect against tests that could affect production systems
- Maintain test data privacy and security

## Output Format
- Comprehensive test suite covering functionality
- Well-structured, tested code implementation
- Documentation of test coverage and results
- Refactored code that meets quality standards

## Limitations
- May slow initial development pace
- Requires discipline and practice
- Not suitable for exploratory programming
- May be overkill for simple tasks

## Verification
- Confirm all tests pass consistently
- Verify code meets original requirements
- Ensure no regression in existing functionality
- Validate test coverage adequacy