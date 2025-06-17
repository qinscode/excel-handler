import { useState, useRef } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  LinearProgress
} from "@mui/material";
import { 
  CloudUpload as CloudUploadIcon, 
  Download as DownloadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Analytics as AnalyticsIcon
} from "@mui/icons-material";
import { 
  readExcelFileLazy as readExcelFile, 
  processWelcomeLetters, 
  exportToExcelLazy as exportToExcel, 
  validateExcelFile,
  formatFileSize,
  type ExcelProcessResult
} from "../utils/excelLazy";

export const ExcelApp = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ExcelProcessResult | null>(null);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (fileToProcess: File) => {
    setIsProcessing(true);
    setError("");
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(previous => {
          if (previous >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return previous + 10;
        });
      }, 100);

      // Read Excel file
      const data = await readExcelFile(fileToProcess);
      
      // Process data
      const result = processWelcomeLetters(data);
      
      setUploadProgress(100);
      setProcessResult(result);
      
      if (result.records.length === 0) {
        setError("No data records containing 'WELCOME LETTER' were found");
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : "An error occurred while processing the file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!validateExcelFile(selectedFile)) {
      setError("Please select a valid Excel file (.xlsx, .xls or .csv)");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size cannot exceed 10MB");
      return;
    }

    setFile(selectedFile);
    setError("");
    setProcessResult(null);
    setUploadProgress(0);
    
    // Auto-start processing
    await processFile(selectedFile);
  };

  const handleDownload = () => {
    if (!processResult) return;
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `filtered_welcome_letters_${timestamp}.xlsx`;
    
    exportToExcel(processResult.records, filename);
  };

  const handleReset = () => {
    setFile(null);
    setProcessResult(null);
    setError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile && validateExcelFile(selectedFile)) {
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
          setError("File size cannot exceed 10MB");
          return;
        }
        
        setFile(selectedFile);
        setError("");
        setProcessResult(null);
        setUploadProgress(0);
        
        // Auto-start processing
        await processFile(selectedFile);
      } else {
        setError("Please select a valid Excel file (.xlsx, .xls or .csv)");
      }
    }
  };

  return (
    <Container className="!p-4 md:!p-8" maxWidth="xl">
      <Box className="mb-6 text-center">
        <Box className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-br from-green-500/5 to-emerald-500/10">
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              animation: "logoFloat 3s ease-in-out infinite",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 12px 40px rgba(16, 185, 129, 0.4)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: "10%",
                left: "10%",
                right: "10%",
                bottom: "10%",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                animation: "innerRing 4s linear infinite",
              },
              "@keyframes logoFloat": {
                "0%, 100%": {
                  transform: "translateY(0px)",
                },
                "50%": {
                  transform: "translateY(-8px)",
                },
              },
              "@keyframes innerRing": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
            }}
          >
            <AnalyticsIcon
              sx={{
                fontSize: "3.5rem",
                color: "white",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                zIndex: 1,
              }}
            />
          </Box>
        </Box>
        <Typography
          className="font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600"
          component="h1"
          variant="h2"
          sx={{
            fontWeight: "700 !important",
            fontSize: { xs: "2.5rem", md: "3.25rem" },
            textShadow:
              "0 2px 10px rgba(16,185,129,0.4), 0 0 20px rgba(5,150,105,0.12)",
            letterSpacing: "-0.5px",
            marginBottom: "0.5rem",
          }}
        >
          Excel Handler
        </Typography>
        <Typography
          color="text.secondary"
          variant="subtitle1"
          sx={{
            cursor: "default",
            fontSize: "0.9rem",
            opacity: 0.8,
            marginTop: "-0.5rem",
            marginBottom: "1rem",
          }}
        >
          Upload Excel files and intelligently extract Welcome Letter data
        </Typography>
      </Box>

      <Box
        className="max-w-8xl mx-auto"
        sx={{
          borderRadius: "16px",
          boxShadow:
            "0 10px 40px rgba(16, 185, 129, 0.13), 0 3px 12px rgba(16, 185, 129, 0.10)",
          overflow: "hidden",
          mb: 10,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(22px)",
          border: "1.5px solid rgba(255,255,255,0.7)",
          position: "relative",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Box className="p-4 md:p-6" sx={{ position: "relative", zIndex: 2 }}>
          {/* File Upload Area */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 3, 
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "2px dashed rgba(16, 185, 129, 0.3)",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                borderColor: "rgba(16, 185, 129, 0.5)",
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
              type="file"
              onChange={handleFileSelect}
            />
            
            {!file ? (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: "rgba(16, 185, 129, 0.6)", mb: 2 }} />
                <Typography sx={{ mb: 1, color: "rgba(16, 185, 129, 0.8)" }} variant="h6">
                  Click or drag to upload Excel file
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Supports .xlsx, .xls, .csv formats, max 10MB (auto-processing after upload)
                </Typography>
              </>
            ) : (
              <Box>
                <DescriptionIcon sx={{ fontSize: 48, color: "rgba(16, 185, 129, 0.8)", mb: 2 }} />
                <Typography sx={{ mb: 1, color: "rgba(16, 185, 129, 0.8)" }} variant="h6">
                  {file.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                  File size: {formatFileSize(file.size)}
                </Typography>
                {!isProcessing && (
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      handleReset();
                    }}
                  >
                    Select Again
                  </Button>
                )}
              </Box>
            )}
          </Paper>

          {/* Processing Progress */}
          {isProcessing && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "rgba(16, 185, 129, 0.05)" }}>
              <Typography sx={{ mb: 2, color: "rgba(16, 185, 129, 0.8)" }} variant="h6">
                Processing Progress
              </Typography>
              <LinearProgress 
                value={uploadProgress} 
                variant="determinate" 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  }
                }} 
              />
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                {uploadProgress}% completed
              </Typography>
            </Paper>
          )}

          {/* Error Messages */}
          {error && (
            <Alert 
              icon={<ErrorIcon />} 
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {/* Processing Results */}
          {processResult && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "rgba(16, 185, 129, 0.05)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography sx={{ color: "rgba(16, 185, 129, 0.8)" }} variant="h6">
                  Processing Results
                </Typography>
                <Button
                  startIcon={<DownloadIcon />}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    handleDownload();
                  }}
                >
                  Download Results
                </Button>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Chip 
                  color="primary" 
                  label={`Total rows: ${processResult.totalRows}`} 
                  variant="outlined" 
                />
                <Chip 
                  color="success" 
                  label={`Records found: ${processResult.records.length}`} 
                  variant="outlined" 
                />
              </Box>

              {processResult.records.length > 0 && (
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
                    backdropFilter: "blur(10px)",
                    width: "100%"
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell 
                          sx={{ 
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            color: "#047857",
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)",
                            borderBottom: "2px solid rgba(16, 185, 129, 0.2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            py: 2.5
                          }}
                        >
                          Full Name
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            color: "#047857",
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)",
                            borderBottom: "2px solid rgba(16, 185, 129, 0.2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            py: 2.5
                          }}
                        >
                          First Name
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            color: "#047857",
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)",
                            borderBottom: "2px solid rgba(16, 185, 129, 0.2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            py: 2.5
                          }}
                        >
                          Description
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processResult.records.map((record, index) => (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            "&:nth-of-type(odd)": { 
                              backgroundColor: "rgba(16, 185, 129, 0.02)" 
                            },
                            "&:nth-of-type(even)": { 
                              backgroundColor: "rgba(255, 255, 255, 0.5)" 
                            },
                            "&:hover": {
                              backgroundColor: "rgba(16, 185, 129, 0.08)",
                              transform: "translateX(4px)",
                              transition: "all 0.2s ease-in-out",
                              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.15)"
                            },
                            borderLeft: "3px solid transparent",
                            "&:hover .MuiTableCell-root": {
                              borderLeft: "3px solid rgba(16, 185, 129, 0.4)"
                            },
                            cursor: "pointer"
                          }}
                        >
                          <TableCell 
                            sx={{ 
                              minWidth: 200,
                              maxWidth: 350, 
                              wordBreak: "break-word",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              color: "#1f2937",
                              py: 2,
                              borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                              transition: "all 0.2s ease-in-out",
                              whiteSpace: "normal"
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  flexShrink: 0
                                }}
                              />
                              {record.FullName}
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              minWidth: 120,
                              maxWidth: 200, 
                              wordBreak: "break-word",
                              fontSize: "0.85rem",
                              color: "#4b5563",
                              py: 2,
                              borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                              transition: "all 0.2s ease-in-out"
                            }}
                          >
                            <Chip
                              label={record.FirstName}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                color: "#047857",
                                fontWeight: "500",
                                fontSize: "0.75rem",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                                "&:hover": {
                                  backgroundColor: "rgba(16, 185, 129, 0.15)"
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              maxWidth: 400, 
                              wordBreak: "break-word",
                              fontSize: "0.85rem",
                              color: "#6b7280",
                              py: 2,
                              borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                              transition: "all 0.2s ease-in-out"
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckCircleIcon 
                                sx={{ 
                                  fontSize: 16, 
                                  color: "#10b981",
                                  flexShrink: 0 
                                }} 
                              />
                              {record.Description}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
}; 