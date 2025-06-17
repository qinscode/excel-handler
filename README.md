<h1 align="center">📊 Excel Handler</h1>

<p align="center">
  <a href="#license">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite" alt="Vite">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  </a>
  <a href="https://mui.com/">
    <img src="https://img.shields.io/badge/Material_UI-7.1-007FFF?style=flat-square&logo=mui" alt="Material-UI">
  </a>
</p>

<p align="center">
  A modern web-based Excel processing tool for extracting Welcome Letter data built with React and TypeScript. 
  This application provides an intuitive interface for uploading Excel files, processing Welcome Letter records, 
  and exporting filtered results with advanced name detection and data validation.
</p>

## ✨ Features

- **Excel File Processing**: Upload and process .xlsx, .xls, and .csv files
- **Welcome Letter Detection**: Automatically identify and extract Welcome Letter records
- **Smart Name Extraction**: Advanced algorithms to detect and extract person names from various column formats
- **Real-time Processing**: Instant file processing with progress indicators
- **Data Export**: Export filtered results to Excel format with timestamp
- **Drag & Drop Upload**: Modern file upload interface with drag-and-drop support
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **File Validation**: Built-in file type and size validation (10MB limit)

## 🧮 How It Works

The Excel Handler processes files through several stages:

1. **File Upload**: 
   - Accepts Excel files (.xlsx, .xls) and CSV files
   - Validates file type and size (max 10MB)
   - Supports drag-and-drop and click-to-browse

2. **Data Processing**:
   - Reads Excel worksheets and converts to structured data
   - Identifies rows containing "WELCOME LETTER" keywords
   - Filters out header rows and invalid data entries
   - Applies advanced name detection algorithms

3. **Name Extraction**:
   - Uses multiple strategies to find person names in various column positions
   - Validates potential names against common patterns
   - Extracts first names from full names automatically
   - Handles different name formats (First Last, Last, First, etc.)

4. **Export Results**:
   - Generates clean Excel files with extracted data
   - Includes Full Name, First Name, and Description columns
   - Adds timestamp to filename for organization

## 🛠️ Tech Stack

- **React 18** with TypeScript for the frontend
- **Material-UI** for beautiful, accessible UI components
- **Vite** for fast development and optimized builds
- **TanStack Router** for client-side routing
- **TanStack Query** for data fetching and caching
- **XLSX** library for Excel file processing
- **Tailwind CSS** for additional styling
- **TypeScript** for type safety and better development experience

## 🚀 Getting Started

### Prerequisites
- Node.js (latest LTS version)
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/qinscode/excelhandler.git
cd excelhandler
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:1420](http://localhost:1420) to view the application in your browser.

### Building for Production

```bash
npm run build
# or
pnpm build
```

## 📝 Usage

1. **Upload File**: 
   - Click "Choose File" or drag and drop an Excel file onto the upload area
   - Supported formats: .xlsx, .xls, .csv (max 10MB)

2. **Automatic Processing**: 
   - File is automatically processed upon upload
   - Progress indicator shows processing status
   - Results appear in a table below

3. **Review Results**:
   - View extracted Welcome Letter records
   - Check Full Name, First Name, and Description columns
   - See processing statistics (total rows, processed rows, found records)

4. **Export Data**:
   - Click "Download Filtered Data" to export results
   - File is saved with timestamp: `filtered_welcome_letters_YYYYMMDDHHMMSS.xlsx`

5. **Reset**: Use "Clear All" to reset and process a new file

## 🎮 Example Processing

**Input Excel File**: Contains various data with some rows having "WELCOME LETTER" in description column

**Processing Results**:
- **Total Rows**: 150
- **Processed Rows**: 12
- **Welcome Letter Records Found**: 8

**Output**: Clean Excel file with extracted records containing:
- Full Name: "John Smith"
- First Name: "John" 
- Description: "WELCOME LETTER - New Student Orientation"

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── components/          # React components
│   └── layout/         # Layout components
├── pages/              # Page components
│   └── ExcelApp.tsx    # Main Excel processing application
├── routes/             # TanStack Router configuration
├── types/              # TypeScript type definitions
│   ├── index.ts        # Common types
│   └── excel.ts        # Excel-specific types
├── utils/              # Utility functions
│   ├── nameUtils.ts    # Name processing utilities
│   ├── excelIO.ts      # Excel I/O operations
│   ├── dataProcessor.ts # Data processing logic
│   ├── excelRefactored.ts # Main Excel utilities entry point
│   ├── excelLazy.ts    # Lazy-loaded Excel utilities
│   └── README.md       # Utils documentation
├── styles/             # Global styles
└── main.tsx           # Application entry point
```

## 🏗️ Architecture

### Bundle Optimization
The application is highly optimized for performance:
- **Main app**: 4.82 kB (2.36 kB gzipped)
- **ExcelApp component**: 13.22 kB (4.52 kB gzipped) - lazy loaded
- **Excel processing**: 429.50 kB (143.09 kB gzipped) - lazy loaded
- **Material-UI**: 306.68 kB (97.04 kB gzipped) - separate chunk

### Code Splitting
- Lazy loading for heavy components and libraries
- Manual chunking for vendor libraries
- Dynamic imports for Excel processing functionality

### Modular Design
Excel processing functionality is split into focused modules:
- **Types**: Interface definitions
- **Name Utils**: Name processing and validation
- **Excel I/O**: File reading and writing operations
- **Data Processor**: Core business logic

## 🔧 Core Algorithms

The Excel processing implementation includes:

- **File Reading**: `readExcelFile()` - Converts Excel files to structured data
- **Data Processing**: `processWelcomeLetters()` - Identifies and extracts Welcome Letter records
- **Name Detection**: `findBestNameCandidate()` - Advanced name detection from various column formats
- **Data Export**: `exportToExcel()` - Generates clean Excel output files

## 🎨 Features

- **Modern UI**: Beautiful Material-UI components with custom styling
- **Responsive Design**: Works seamlessly across all device sizes
- **Accessibility**: Built with accessibility best practices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **File Validation**: Robust validation for file types and sizes
- **Progress Indicators**: Real-time processing feedback
- **Data Visualization**: Clear presentation of processing results

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

**Author**: Fudong Qin

For questions or suggestions, please open an issue on GitHub.
