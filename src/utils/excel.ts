import * as XLSX from 'xlsx';

// Extract first name from full name
const extractFirstName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }
  
  const trimmed = fullName.trim();
  
  // Handle common name formats
  // Format 1: "Firstname Lastname" - return the first part directly
  // Format 2: "Lastname, Firstname" - return the part after comma
  // Format 3: "Firstname Middle Lastname" - return the first part
  
  if (trimmed.includes(',')) {
    // Handle "Lastname, Firstname" format
    const parts = trimmed.split(',');
    return parts.length > 1 ? (parts[1] || '').trim() : (parts[0] || '').trim();
  } else {
    // Handle "Firstname Lastname" or "Firstname Middle Lastname" format
    const parts = trimmed.split(/\s+/);
    return parts[0] || '';
  }
};

export interface WelcomeLetterRecord {
  FullName: string;
  FirstName: string;
  Description: string;
}

export interface ExcelProcessResult {
  records: Array<WelcomeLetterRecord>;
  totalRows: number;
  processedRows: number;
}

// Read Excel file
export const readExcelFile = (file: File): Promise<Array<Array<any>>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('File data is empty'));
          return;
        }
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error('Worksheet is empty'));
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject(new Error('Worksheet content is empty'));
          return;
        }
        
        // Convert worksheet to 2D array, maintain original format
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          defval: '' 
        });
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    
    reader.readAsArrayBuffer(file);
  });
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
    
    // 确保row存在且是数组
    if (!row || !Array.isArray(row)) {
      continue;
    }
    
    let hasWelcomeLetter = false;
    let description = '';
    let name = '';
    
    // Check if it's a header row (skip header rows)
    const isHeaderRow = row.some((cell, index) => {
      if (cell && typeof cell === 'string') {
        const cellTrimmed = cell.trim();
        if (cellTrimmed === 'WELCOME BACK LETTER' || cellTrimmed === 'WELCOME LETTER') {
          // Check the number of non-empty columns in this row, if few then it might be a header row
          const nonEmptyCount = row.filter(c => c && typeof c === 'string' && c.trim()).length;
          // If it's column 2 and has few non-empty columns, consider it a header row
          return index === 1 && nonEmptyCount <= 3;
        }
      }
      return false;
    });
    
    if (isHeaderRow) {
      // This is a header row, skip it
      if (isDevelopment) {
        console.log(`📋 Skipping header row ${index + 1}:`, row.slice(0, 5));
      }
      continue;
    }
    
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
          hasWelcomeLetter = true;
          description = String(cell).trim();
          
          if (isDevelopment) {
            console.log(`✅ Found WELCOME LETTER row ${index + 1}:`, cell);
            console.log(`🔍 Full row data:`, row);
            console.log(`🔍 Row columns (first 15):`, row.slice(0, 15).map((cell, index_) => `Col${index_}: "${cell}"`));
          }
          
          // Enhanced name detection logic
          // First, let's check all columns to find potential names
          const potentialNames: Array<{ index: number; value: string }> = [];
          for (let nameIndex = 0; nameIndex < row.length; nameIndex++) {
            const nameCell = row[nameIndex];
            if (nameCell && typeof nameCell === 'string') {
              const trimmed = nameCell.trim();
                             // Skip if it's empty, numeric, or matches excluded patterns
               if (trimmed && 
                   !['Outstanding', 'Completed', '0', '0.00', 'ghuang', 'irasanen', 'kdaengrungrot', 'sjbailey'].includes(trimmed) &&
                   trimmed.length > 2 &&
                   !/^\d+[A-Z]*\s*-\s*\d+$/.test(trimmed) && // Exclude room number format
                   !/^\d+$/.test(trimmed) && // Exclude pure numbers
                   !/^[\d.]+$/.test(trimmed) && // Exclude decimal numbers
                   !trimmed.includes('WELCOME') && // Exclude descriptions
                   !trimmed.includes('LETTER') &&
                   !trimmed.includes('REQUIREMENT') &&
                   !/^[A-Z]{1,3}\d+[A-Z]*$/.test(trimmed) && // Exclude codes like "A1", "BC123"
                   !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(trimmed) && // Exclude date formats
                   !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) { // Exclude date formats like 2025-06-13
                potentialNames.push({ index: nameIndex, value: trimmed });
              }
            }
          }
          
          if (isDevelopment) {
            console.log(`🔍 Potential names found:`, potentialNames);
          }
          
          // Strategy 1: Try column 7 first (original logic)
          if (row[7] && typeof row[7] === 'string' && row[7].trim()) {
            const candidate = row[7].trim();
            if (!['Outstanding', 'Completed', '0', '0.00'].includes(candidate) &&
                !/^\d+[A-Z]*\s*-\s*\d+$/.test(candidate) &&
                !/^\d+$/.test(candidate)) {
              name = candidate;
            }
          }
          
          // Strategy 2: If column 7 didn't work, try column 9 (index 8)
          if (!name && row[8] && typeof row[8] === 'string' && row[8].trim()) {
            const candidate = row[8].trim();
            if (!['Outstanding', 'Completed', '0', '0.00'].includes(candidate) &&
                !/^\d+[A-Z]*\s*-\s*\d+$/.test(candidate) &&
                !/^\d+$/.test(candidate) &&
                !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(candidate)) {
              name = candidate;
            }
          }
          
          // Strategy 3: Prefer column 9 (index 9) if it contains a valid name
          if (!name && row[9] && typeof row[9] === 'string' && row[9].trim()) {
            const candidate = row[9].trim();
            if (!['Outstanding', 'Completed', '0', '0.00'].includes(candidate) &&
                !/^\d+[A-Z]*\s*-\s*\d+$/.test(candidate) &&
                !/^\d+$/.test(candidate) &&
                !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(candidate)) {
              name = candidate;
              if (isDevelopment) {
                console.log(`🎯 Selected name from column 9: "${candidate}"`);
              }
            }
          }
          
          // Strategy 4: If still no name, look for the most likely candidate from potential names
          if (!name && potentialNames.length > 0) {
            // Filter out obvious non-names and prefer realistic name patterns
            const filteredCandidates = potentialNames.filter(p => 
              !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(p.value) && // No dates
              !/^\d{4}-\d{2}-\d{2}$/.test(p.value) && // No ISO dates
              p.value.length > 3 && // Reasonable length
              !/^\d+$/.test(p.value) // Not just numbers
            );
            
            // Prefer names that look like real person names
            const bestCandidate = filteredCandidates.find(p => 
              /^[A-Z][a-z]+ [A-Z][a-z]+/.test(p.value) || // "First Last" pattern
              /^[A-Z][a-z]+, [A-Z][a-z]+/.test(p.value) || // "Last, First" pattern  
              /^[A-Z]+ [A-Z]+/.test(p.value) || // "FIRST LAST" pattern
              (p.value.includes(' ') && p.value.length > 5 && p.index >= 7) // Has space, reasonable length, and from later columns
            ) || filteredCandidates[0]; // Fallback to first filtered candidate
            
            if (bestCandidate) {
              name = bestCandidate.value;
              if (isDevelopment) {
                console.log(`🎯 Selected name from column ${bestCandidate.index}: "${bestCandidate.value}"`);
              }
            }
          }
          
          break;
        }
      }
    }
    
    if (hasWelcomeLetter && name) {
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
    } else if (hasWelcomeLetter && !name) {
      if (isDevelopment) {
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

// Export processing results to Excel file
export const exportToExcel = (records: Array<WelcomeLetterRecord>, filename: string = 'filtered_welcome_letters.xlsx') => {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(records);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Welcome Letters');
  
  // Download file
  XLSX.writeFile(workbook, filename);
};

// Validate file type
export const validateExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv
  ];
  
  return validTypes.includes(file.type) || 
         file.name.toLowerCase().endsWith('.xlsx') || 
         file.name.toLowerCase().endsWith('.xls') ||
         file.name.toLowerCase().endsWith('.csv');
};

// Format file size display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, index)).toFixed(2)) + ' ' + sizes[index];
};