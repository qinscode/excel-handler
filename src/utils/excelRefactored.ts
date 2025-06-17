// Main entry point for Excel functionality - refactored version
// Re-exports all Excel related utilities from separate modules

// Type definitions
export type { WelcomeLetterRecord, ExcelProcessResult } from '../types/excel';

// Name processing utilities
export { extractFirstName, isValidPersonName, findBestNameCandidate } from './nameUtils';

// Excel I/O operations
export { readExcelFile, exportToExcel, validateExcelFile, formatFileSize } from './excelIO';

// Data processing
export { processWelcomeLetters } from './dataProcessor'; 