import { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { encrypt, decrypt } from "../utils/cipher";

const ENCRYPT_SHIFT = 3;
const DECRYPT_SHIFT = 6;

export const CipherApp = () => {
	const [plaintext, setPlaintext] = useState("");
	const [encrypted, setEncrypted] = useState("");
	const [decrypted, setDecrypted] = useState("");
	const [hasProcessed, setHasProcessed] = useState(false);

	// 实时处理函数
	const processRealTime = (text: string) => {
		if (text.trim()) {
			try {
				// Step 1: Encrypt the plaintext
				const encryptedResult = encrypt(text, ENCRYPT_SHIFT);
				
				// Step 2: Decrypt the encrypted text
				const decryptedResult = decrypt(encryptedResult, DECRYPT_SHIFT);
				
				setEncrypted(encryptedResult);
				setDecrypted(decryptedResult);
			} catch (error) {
				console.error("Error during real-time processing:", error);
				setEncrypted("");
				setDecrypted("");
			}
		} else {
			setEncrypted("");
			setDecrypted("");
		}
	};

	// 使用 useEffect 监听 plaintext 变化，实现实时转换
	useEffect(() => {
		processRealTime(plaintext);
	}, [plaintext]);



	const handleClear = () => {
		setPlaintext("");
		setEncrypted("");
		setDecrypted("");
		setHasProcessed(false);
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Backspace" || event.key === "Delete") {
			// 按下删除键时清空所有内容
			setPlaintext("");
			setEncrypted("");
			setDecrypted("");
			setHasProcessed(false);
			event.preventDefault(); // 阻止默认的删除行为
		}
	};

	return (
		<Container className="!p-4 md:!p-8" maxWidth="xl">
			<Box className="mb-6 text-center">
				<Box className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/10">
					<Box
						sx={{
							width: 150,
							height: 150,
							borderRadius: "50%",
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
							position: "relative",
							overflow: "hidden",
							cursor: "pointer",
							transition: "all 0.3s ease-in-out",
							animation: "logoFloat 3s ease-in-out infinite",
							"&:hover": {
								transform: "scale(1.05)",
								boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
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
						<Box
							sx={{
								fontSize: "3.5rem",
								background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
								backgroundClip: "text",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								textShadow: "0 2px 4px rgba(0,0,0,0.1)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: "bold",
								letterSpacing: "2px",
								zIndex: 1,
							}}
						>
							⚡C⚡
						</Box>
					</Box>
				</Box>
				<Typography
					className="font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
					component="h1"
					variant="h2"
					sx={{
						fontWeight: "700 !important",
						fontSize: { xs: "2.5rem", md: "3.25rem" },
						textShadow:
							"0 2px 10px rgba(79,70,229,0.4), 0 0 20px rgba(59,130,246,0.12)",
						letterSpacing: "-0.5px",
						marginBottom: "0.5rem",
					}}
				>
					Shift Cipher Processor
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
					Enter plaintext and see real-time encrypted and decrypted results
				</Typography>
			</Box>

			<Box
				className="max-w-8xl mx-auto"
				sx={{
					borderRadius: "16px",
					boxShadow:
						"0 10px 40px rgba(59, 130, 246, 0.13), 0 3px 12px rgba(59, 130, 246, 0.10)",
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
					{/* Plaintext Input */}
					<Paper elevation={0} sx={{ 
						p: 3, 
						mb: 3, 
						backgroundColor: "rgba(102, 126, 234, 0.08)",
						border: "1px solid rgba(102, 126, 234, 0.2)",
						borderRadius: "12px",
					}}>
						<Typography variant="h6" sx={{ 
							mb: 2, 
							fontWeight: 600,
							color: "rgba(102, 126, 234, 0.9)",
						}}>
							Plaintext Input:
						</Typography>
						<TextField
							multiline
							rows={4}
							fullWidth
							value={plaintext}
							onFocus={() => {
								if (hasProcessed) {
									// 当用户点击输入框时，如果已经执行过操作，清空所有内容
									setPlaintext("");
									setEncrypted("");
									setDecrypted("");
									setHasProcessed(false);
								}
							}}
							onChange={(event) => {
								setPlaintext(event.target.value.toUpperCase());
							}}
							onKeyDown={handleKeyPress}
							placeholder="Enter your plaintext here..."
							variant="outlined"
							sx={{
								"& .MuiOutlinedInput-root": {
									backgroundColor: "rgba(102, 126, 234, 0.05)",
									borderRadius: "8px",
									"& fieldset": {
										borderColor: "rgba(102, 126, 234, 0.3)",
									},
									"&:hover fieldset": {
										borderColor: "rgba(102, 126, 234, 0.5)",
									},
									"&.Mui-focused fieldset": {
										borderColor: "rgba(102, 126, 234, 0.7)",
									},
								},
								"& .MuiInputBase-input": {
									color: "rgba(55, 65, 81, 0.9)",
								},
								"& .MuiInputBase-input::placeholder": {
									color: "rgba(102, 126, 234, 0.6)",
									opacity: 1,
								},
							}}
						/>
					</Paper>

					{/* Real-time processing indicator */}
					<Box sx={{ textAlign: "center", mb: 3 }}>
						<Typography variant="body2" sx={{ 
							color: "rgba(102, 126, 234, 0.8)",
							fontStyle: "italic",
							fontSize: "0.9rem"
						}}>
							✨ Real-time encryption and decryption active
						</Typography>
					</Box>

					{/* Results Section */}
					<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
						{/* Encrypted Output */}
						<Paper elevation={0} sx={{ 
							flex: 1, 
							p: 3, 
							backgroundColor: "rgba(102, 126, 234, 0.12)",
							border: "1px solid rgba(102, 126, 234, 0.25)",
							borderRadius: "12px",
							transition: "all 0.3s ease-in-out",
							animation: encrypted ? "slideInLeft 0.5s ease-out" : "none",
							"&:hover": {
								transform: "translateY(-2px)",
								boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
								backgroundColor: "rgba(102, 126, 234, 0.15)",
							},
							"@keyframes slideInLeft": {
								"0%": {
									opacity: 0,
									transform: "translateX(-30px)",
								},
								"100%": {
									opacity: 1,
									transform: "translateX(0)",
								},
							},
						}}>
							<Typography variant="h6" sx={{ 
								mb: 2, 
								fontWeight: 600,
								color: "rgba(102, 126, 234, 0.9)",
							}}>
								Encrypted (using shift={ENCRYPT_SHIFT}):
							</Typography>
							<TextField
								multiline
								rows={3}
								fullWidth
								value={encrypted}
								InputProps={{
									readOnly: true,
								}}
								variant="outlined"
								sx={{
									"& .MuiOutlinedInput-root": {
										backgroundColor: "rgba(102, 126, 234, 0.08)",
										borderRadius: "8px",
										"& fieldset": {
											borderColor: "rgba(102, 126, 234, 0.3)",
										},
									},
									"& .MuiInputBase-input": {
										color: "rgba(55, 65, 81, 0.9)",
									},
								}}
							/>
						</Paper>

						{/* Decrypted Output */}
						<Paper elevation={0} sx={{ 
							flex: 1, 
							p: 3, 
							backgroundColor: "rgba(118, 75, 162, 0.12)",
							border: "1px solid rgba(118, 75, 162, 0.25)",
							borderRadius: "12px",
							transition: "all 0.3s ease-in-out",
							animation: decrypted ? "slideInRight 0.5s ease-out 0.2s both" : "none",
							"&:hover": {
								transform: "translateY(-2px)",
								boxShadow: "0 8px 25px rgba(118, 75, 162, 0.2)",
								backgroundColor: "rgba(118, 75, 162, 0.15)",
							},
							"@keyframes slideInRight": {
								"0%": {
									opacity: 0,
									transform: "translateX(30px)",
								},
								"100%": {
									opacity: 1,
									transform: "translateX(0)",
								},
							},
						}}>
							<Typography variant="h6" sx={{ 
								mb: 2, 
								fontWeight: 600,
								color: "rgba(118, 75, 162, 0.9)",
							}}>
								Decrypted (encrypted text decrypted with shift={DECRYPT_SHIFT}):
							</Typography>
							<TextField
								multiline
								rows={3}
								fullWidth
								value={decrypted}
								InputProps={{
									readOnly: true,
								}}
								variant="outlined"
								sx={{
									"& .MuiOutlinedInput-root": {
										backgroundColor: "rgba(118, 75, 162, 0.08)",
										borderRadius: "8px",
										"& fieldset": {
											borderColor: "rgba(118, 75, 162, 0.3)",
										},
									},
									"& .MuiInputBase-input": {
										color: "rgba(55, 65, 81, 0.9)",
									},
								}}
							/>
						</Paper>
					</Box>

					{/* Clear Button */}
					<Box sx={{ textAlign: "center", mt: 3 }}>
						<Button
							onClick={handleClear}
							variant="outlined"
							sx={{
								px: 3,
								py: 1,
								fontWeight: 600,
								borderRadius: "12px",
								borderColor: "rgba(102, 126, 234, 0.4)",
								color: "rgba(102, 126, 234, 0.8)",
								transition: "all 0.3s ease-in-out",
								"&:hover": {
									borderColor: "rgba(102, 126, 234, 0.6)",
									backgroundColor: "rgba(102, 126, 234, 0.05)",
									transform: "translateY(-1px)",
									boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
								},
								"&:active": {
									transform: "translateY(0px)",
								},
							}}
						>
							Clear All
						</Button>
					</Box>

					{/* Info Footer */}
					<Paper elevation={0} sx={{ 
						mt: 3, 
						p: 2, 
						backgroundColor: "rgba(102, 126, 234, 0.06)",
						border: "1px solid rgba(102, 126, 234, 0.15)",
						borderRadius: "8px",
					}}>
						<Typography variant="body2" sx={{ 
							textAlign: "center", 
							color: "rgba(102, 126, 234, 0.8)",
						}}>
							Real-time processing: The plaintext is encrypted with shift=3, then the encrypted result is decrypted with shift=6
						</Typography>
						<Typography variant="caption" sx={{ 
							textAlign: "center", 
							display: "block", 
							mt: 1, 
							color: "rgba(102, 126, 234, 0.7)",
						}}>
							Results update automatically as you type • Press Backspace/Delete to clear all
						</Typography>
					</Paper>
				</Box>
			</Box>
		</Container>
	);
};
