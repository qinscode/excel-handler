/**
 * Shift Cipher Utilities
 * Ported from Python implementation
 */

/**
 * Encrypts a message using a variable shift cipher
 * @param message - The plaintext message to encrypt
 * @param s0 - Initial shift value
 * @returns Encrypted ciphertext
 */
export function encrypt(message: string, s0: number): string {
  let ciphertext = "";
  let shift = s0;

  for (const char of message) {
    if (char.match(/[a-zA-Z]/)) {
      // Convert character to its numeric representation (a=1, b=2, ..., z=26)
      const number = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

      // Apply the shift and wrap around if necessary
      let shiftedNumber = (number + shift) % 26;
      if (shiftedNumber === 0) {
        shiftedNumber = 26;
      }

      // Convert the shifted numeric representation back to a character
      const shiftedChar = String.fromCharCode(shiftedNumber + 'a'.charCodeAt(0));

      // Preserve the case of the original character
      if (char === char.toUpperCase()) {
        ciphertext += shiftedChar.toUpperCase();
      } else {
        ciphertext += shiftedChar;
      }

      // Update the shift value for the next character
      shift = number;
    } else {
      ciphertext += char;
    }
  }

  return ciphertext;
}

/**
 * Decrypts a ciphertext using a variable shift cipher
 * @param ciphertext - The encrypted message to decrypt
 * @param s0 - Initial shift value
 * @returns Decrypted plaintext
 */
export function decrypt(ciphertext: string, s0: number): string {
  let plaintext = "";
  let shift = s0;

  for (const char of ciphertext) {
    if (char.match(/[a-zA-Z]/)) {
      // Convert character to its numeric representation (a=1, b=2, ..., z=26)
      const number = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

      // Apply the reverse shift and wrap around if necessary
      let shiftedNumber = (number - shift + 26) % 26;
      if (shiftedNumber <= 0) {
        shiftedNumber += 26;
      }

      // Convert the shifted numeric representation back to a character
      const shiftedChar = String.fromCharCode(shiftedNumber + 'a'.charCodeAt(0));

      // Preserve the case of the original character
      if (char === char.toUpperCase()) {
        plaintext += shiftedChar.toUpperCase();
      } else {
        plaintext += shiftedChar;
      }

      // Update the shift value for the next character
      shift = shiftedNumber;
    } else {
      plaintext += char;
    }
  }

  return plaintext;
} 