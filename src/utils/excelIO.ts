// Excel file I/O operations
import * as XLSX from 'xlsx';
import type { WelcomeLetterRecord } from '../types/excel';

// Read Excel file
export const readExcelFile = (file: File): Promise<Array<Array<any>>> => {
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