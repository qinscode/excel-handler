// Lazy-loaded Excel utilities to reduce initial bundle size
import type { WelcomeLetterRecord } from './excel';

// Lazy load XLSX only when needed
const loadXLSX = async () => {
  const XLSX = await import('xlsx');
  return XLSX;
};

// Read Excel file with lazy-loaded XLSX
export const readExcelFileLazy = async (file: File): Promise<Array<Array<any>>> => {
  const XLSX = await loadXLSX();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          reject(new Error('File data is empty'));
          return;
        }
        
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        if (!worksheetName) {
          reject(new Error('No worksheet found in the Excel file'));
          return;
        }
        
        const worksheet = workbook.Sheets[worksheetName];
        if (!worksheet) {
          reject(new Error('Worksheet is empty'));
          return;
        }
        
        // Convert to JSON array
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        resolve(jsonData as Array<Array<any>>);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Export to Excel with lazy-loaded XLSX
export const exportToExcelLazy = async (records: Array<WelcomeLetterRecord>, filename: string = 'filtered_welcome_letters.xlsx') => {
  const XLSX = await loadXLSX();
  
  if (records.length === 0) {
    console.warn('No records to export');
    return;
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    ['Full Name', 'First Name', 'Description'], // Header row
    ...records.map(record => [record.FullName, record.FirstName, record.Description])
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Welcome Letters');

  // Export file
  XLSX.writeFile(workbook, filename);
};

// Re-export other utilities that don't depend on XLSX
export { processWelcomeLetters, validateExcelFile, formatFileSize } from './excel';
export type { WelcomeLetterRecord, ExcelProcessResult } from './excel'; 