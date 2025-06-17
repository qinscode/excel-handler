// Excel processing related types and interfaces

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