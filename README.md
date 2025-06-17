<h1 align="center">🔐 Shift Cipher Processor</h1>

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
</p>

<p align="center">
  A modern web-based shift cipher encryption and decryption tool built with React and TypeScript. 
  This application demonstrates a variable shift cipher algorithm where the shift value changes 
  based on the previous character's position in the alphabet.
</p>

## ✨ Features

- **Variable Shift Cipher**: Implements a cipher where the shift value changes based on the previous character
- **Real-time Processing**: Instant encryption and decryption as you type
- **Modern UI**: Beautiful, responsive interface with Material-UI components
- **Keyboard Shortcuts**: Ctrl/Cmd + Enter to quickly process text
- **Two-Step Demonstration**: Shows both encryption (shift=3) and decryption (shift=6) results
- **Mobile Friendly**: Responsive design that works on all devices

## 🧮 How the Cipher Works

The shift cipher in this application uses a variable shift algorithm:

1. **Encryption Phase**: 
   - Initial shift starts at 3
   - For each alphabetic character, apply the current shift
   - Update the shift to the numeric value of the original character (a=1, b=2, ..., z=26)
   - Non-alphabetic characters are preserved unchanged

2. **Decryption Phase**:
   - Takes the encrypted text and applies reverse shift starting at 6
   - For each character, subtract the shift and wrap around if necessary
   - Update the shift to the numeric value of the decrypted character

## 🛠️ Tech Stack

- **React 18** with TypeScript for the frontend
- **Material-UI** for beautiful, accessible UI components
- **Vite** for fast development and optimized builds
- **TanStack Router** for routing
- **Tailwind CSS** for additional styling
- **TypeScript** for type safety

## 🚀 Getting Started

### Prerequisites
- Node.js (latest LTS version)
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/qinscode/ShiftCipherProcessor.git
cd shift-cipher-processor
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

1. **Enter Text**: Type or paste your plaintext in the input area
2. **Process**: Click the "PROCESS" button or use Ctrl/Cmd + Enter
3. **View Results**: 
   - See the encrypted text (using shift=3)
   - See the decrypted text (encrypted text decrypted with shift=6)
4. **Clear**: Use "Clear All" to reset all fields

## 🎮 Example

**Input**: `Hello World`

**Encrypted** (shift=3): `Kfrly Xnrzr`

**Decrypted** (shift=6): `Czjfi Qeklf`

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
├── pages/              # Page components
├── routes/             # Routing configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (cipher algorithms)
├── styles/             # Global styles
└── main.tsx           # Application entry point
```

## 🔧 Core Algorithm

The cipher implementation can be found in `src/utils/cipher.ts`:

- `encrypt(message: string, s0: number)` - Encrypts text with variable shift
- `decrypt(ciphertext: string, s0: number)` - Decrypts text with variable shift

## 🎨 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Built with Material-UI for better accessibility
- **Error Handling**: Graceful error handling with user-friendly messages
- **Modern UX**: Smooth animations and intuitive interface

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

**Author**: Fudong Qin

For questions or suggestions, please open an issue on GitHub.

# Excel Handler

一个基于 React 和 TypeScript 构建的Web Excel处理工具，用于提取和过滤包含"Welcome Letter"的数据记录。

## 功能特性

- 📊 **Excel文件处理**: 支持上传和处理 .xlsx, .xls, .csv 格式文件
- 🔍 **智能数据提取**: 自动识别和提取包含"WELCOME LETTER"的相关数据
- 📋 **数据预览**: 实时预览处理结果，包含Name、Description和Type字段
- 💾 **结果导出**: 将处理结果导出为新的Excel文件
- 🎨 **现代化UI**: 美观的用户界面，支持拖拽上传
- ⚡ **实时处理**: 文件上传后即时处理，无需等待

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Material-UI (MUI)
- **样式方案**: TailwindCSS
- **路由管理**: TanStack Router
- **Excel处理**: SheetJS (xlsx)
- **状态管理**: React Hooks

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9 (推荐)

### 安装

```bash
# 克隆项目
git clone <your-repository>
cd excel-handler

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173 查看应用。

### 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 使用说明

1. **上传文件**: 点击或拖拽Excel文件到上传区域
2. **开始处理**: 选择文件后点击"开始处理"按钮
3. **查看结果**: 处理完成后查看提取的数据记录
4. **下载结果**: 点击"下载结果"按钮保存处理后的Excel文件

## 数据处理逻辑

应用使用智能识别算法扫描Excel文件，能够处理以下两种情况：

### 1. 标题行识别
- 自动跳过作为标题的"WELCOME LETTER"和"WELCOME BACK LETTER"行
- 这些通常显示为蓝色背景的节标题

### 2. 数据行提取
- 在数据行中查找包含"WELCOME LETTER"的记录
- 智能定位姓名字段（通常在Requirement列之后的Name列）
- 自动区分"WELCOME LETTER"和"WELCOME BACK LETTER"类型
- 生成包含Name、Description、Type三个字段的结果数据

### 3. 灵活处理
- 能够处理不同的Excel格式和列结构
- 自动过滤掉无效的数据行
- 支持文件中只包含其中一种类型或两种类型都不存在的情况

## 开发指南

### 项目结构

```
src/
├── components/         # 可复用组件
├── pages/             # 页面组件
│   └── ExcelApp.tsx   # 主要的Excel处理页面
├── utils/             # 工具函数
│   └── excel.ts       # Excel处理相关工具
├── routes/            # 路由配置
├── styles/            # 样式文件
└── types/             # TypeScript类型定义
```

### 核心功能

- `readExcelFile()`: 读取Excel文件并转换为二维数组
- `processWelcomeLetters()`: 处理数据，提取Welcome Letter记录
- `exportToExcel()`: 将结果导出为Excel文件
- `validateExcelFile()`: 验证文件类型

## 代码质量

项目使用以下工具确保代码质量：

- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **TypeScript**: 静态类型检查

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 部署

项目可以部署到任何静态网站托管服务：

- Vercel
- Netlify
- GitHub Pages
- 或其他静态托管服务

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
