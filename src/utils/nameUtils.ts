// Name processing utilities

// Extract first name from full name
export const extractFirstName = (fullName: string): string => {
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

// Validate if a string looks like a person's name
export const isValidPersonName = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  const trimmed = value.trim();
  
  // Skip if it's empty, numeric, or matches excluded patterns
  return trimmed.length > 0 && 
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
    !/^\d{4}-\d{2}-\d{2}$/.test(trimmed); // Exclude date formats like 2025-06-13
};

// Find the best name candidate from a row
export const findBestNameCandidate = (row: Array<any>): string => {
  const potentialNames: Array<{ index: number; value: string }> = [];
  
  // Collect all potential names
  for (let nameIndex = 0; nameIndex < row.length; nameIndex++) {
    const nameCell = row[nameIndex];
    if (nameCell && typeof nameCell === 'string') {
      const trimmed = nameCell.trim();
      if (isValidPersonName(trimmed)) {
        potentialNames.push({ index: nameIndex, value: trimmed });
      }
    }
  }
  
  // Strategy 1: Try column 7 first (original logic)
  if (row[7] && typeof row[7] === 'string' && row[7].trim()) {
    const candidate = row[7].trim();
    if (isValidPersonName(candidate)) {
      return candidate;
    }
  }
  
  // Strategy 2: If column 7 didn't work, try column 9 (index 8)
  if (row[8] && typeof row[8] === 'string' && row[8].trim()) {
    const candidate = row[8].trim();
    if (isValidPersonName(candidate) && 
        !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(candidate)) {
      return candidate;
    }
  }
  
  // Strategy 3: Prefer column 9 (index 9) if it contains a valid name
  if (row[9] && typeof row[9] === 'string' && row[9].trim()) {
    const candidate = row[9].trim();
    if (isValidPersonName(candidate) && 
        !/^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(candidate)) {
      return candidate;
    }
  }
  
  // Strategy 4: If still no name, look for the most likely candidate from potential names
  if (potentialNames.length > 0) {
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
      return bestCandidate.value;
    }
  }
  
  return '';
}; 