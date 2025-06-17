import pandas as pd

# 1. 读取原始 Excel 文件
file_path = 'Requirement List - 13.06.25.xlsx'  # 请根据实际文件名调整
xls = pd.ExcelFile(file_path)
df = xls.parse(xls.sheet_names[0], header=None)

# 2. 初始化结果容器
records = []

# 3. 遍历所有行并提取相关数据
for i in range(len(df)):
    row = df.iloc[i]
    
    # 找到 "WELCOME LETTER" 或 "WELCOME BACK LETTER" 分段的标题行
    if isinstance(row[1], str) and "WELCOME" in row[1] and "LETTER" in row[1]:
        # 判断类型是否是 BACK
        current_type = "BACK" if "BACK" in row[1] else ""
        
        # 往下扫描这一段的详细内容
        j = i + 1
        while j < len(df):
            r = df.iloc[j]
            description = str(r[2]).strip() if pd.notna(r[2]) else ""
            name = str(r[9]).strip() if pd.notna(r[9]) else ""
            
            if "WELCOME" in description:
                records.append({
                    "Name": name,
                    "Description": description,
                    "Type": "BACK" if "BACK" in description else ""
                })
            elif isinstance(r[1], str) and "WELCOME" in r[1]:
                break  # 下一个 section，退出当前 loop
            j += 1

# 4. 转换为 DataFrame 并保存为 Excel 文件
result_df = pd.DataFrame(records)
result_df.to_excel('filtered_welcome_letters.xlsx', index=False)

print("✅ 提取完成，文件已保存为 filtered_welcome_letters.xlsx")