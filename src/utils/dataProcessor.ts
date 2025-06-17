// Data processing logic for Welcome Letters
import type { WelcomeLetterRecord, ExcelProcessResult } from '../types/excel';
import { extractFirstName, findBestNameCandidate } from './nameUtils';

// Check if a row is a header row
const isHeaderRow = (row: Array<any>): boolean => {
  return row.some((cell, cellIndex) => {
    if (cell && typeof cell === 'string') {
      const cellTrimmed = cell.trim();
      if (cellTrimmed === 'WELCOME BACK LETTER' || cellTrimmed === 'WELCOME LETTER') {
        // Check the number of non-empty columns in this row, if few then it might be a header row
        const nonEmptyCount = row.filter(c => c && typeof c === 'string' && c.trim()).length;
        // If it's column 2 and has few non-empty columns, consider it a header row
        return cellIndex === 1 && nonEmptyCount <= 3;
      }
    }
    return false;
  });
};

// Check if a row contains welcome letter data
const containsWelcomeLetter = (row: Array<any>): { hasWelcomeLetter: boolean; description: string } => {
  // Check if data row contains WELCOME LETTER
  // Usually in the Requirement column (might be column 2 or 3, depending on specific format)
  for (let colIndex = 1; colIndex < Math.min(row.length, 5); colIndex++) {
    const cell = row[colIndex];
    if (cell && typeof cell === 'string' && 
        cell.includes('WELCOME') && cell.includes('LETTER')) {
      
      // Ensure this is a data row and not a header
      const hasOtherData = row.some((c, index_) => {
        return index_ > colIndex && c && 
               (typeof c === 'string' && c.trim() || typeof c === 'number');
      });
      
      if (hasOtherData) {
        return {
          hasWelcomeLetter: true,
          description: String(cell).trim()
        };
      }
    }
  }
  
  return { hasWelcomeLetter: false, description: '' };
};

// Process Excel data and extract Welcome Letter related records
export const processWelcomeLetters = (data: Array<Array<any>>): ExcelProcessResult => {
  const records: Array<WelcomeLetterRecord> = [];
  const totalRows = data.length;
  let processedRows = 0;
  
  // Debug information in development mode
  const isDevelopment = import.meta.env?.DEV;
  if (isDevelopment) {
    console.log('🔍 Starting Excel data processing:', { totalRows, firstRowLength: data[0]?.length });
  }
  
  for (let index = 0; index < data.length; index++) {
    const row = data[index];
    
    // Ensure row exists and is an array
    if (!row || !Array.isArray(row)) {
      continue;
    }
    
    // Check if it's a header row (skip header rows)
    if (isHeaderRow(row)) {
      if (isDevelopment) {
        console.log(`📋 Skipping header row ${index + 1}:`, row.slice(0, 5));
      }
      continue;
    }
    
    // Check if row contains welcome letter data
    const { hasWelcomeLetter, description } = containsWelcomeLetter(row);
    
    if (hasWelcomeLetter) {
      if (isDevelopment) {
        console.log(`✅ Found WELCOME LETTER row ${index + 1}:`, description);
        console.log(`🔍 Full row data:`, row);
        console.log(`🔍 Row columns (first 15):`, row.slice(0, 15).map((cellValue, cellIndex_) => `Col${cellIndex_}: "${String(cellValue ?? '')}"`));
      }
      
      // Find the best name candidate
      const name = findBestNameCandidate(row);
      
      if (isDevelopment) {
        console.log(`🔍 Selected name: "${name}"`);
      }
      
      if (name) {
        const record = {
          FullName: name,
          FirstName: extractFirstName(name),
          Description: description
        };
        records.push(record);
        processedRows++;
        
        if (isDevelopment) {
          console.log(`📝 Adding record ${processedRows}:`, record);
        }
      } else if (isDevelopment) {
        console.log(`❌ Row ${index + 1} has WELCOME LETTER but no name:`, { description, row: row.slice(0, 10) });
      }
    }
  }
  
  if (isDevelopment) {
    console.log('🎯 Processing completed:', { 
      totalRows, 
      processedRows, 
      foundRecords: records.length
    });
  }
  
  return {
    records,
    totalRows,
    processedRows
  };
}; 