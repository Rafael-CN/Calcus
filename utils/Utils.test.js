import { toOperation, toDisplay, isOperation, isSpecial, hasOperation } from './Utils';

describe('Utils functions', () => {
  // Test toOperation
  describe('toOperation', () => {
    it('should convert display operators to JS operators', () => {
      expect(toOperation('1×2÷3−4+5^6')).toBe('1*2/3-4+5**6');
    });
    it('should convert comma to period for decimals', () => {
      expect(toOperation('123,45')).toBe('123.45');
    });
    it('should handle mixed input', () => {
      expect(toOperation('10,5×2^3')).toBe('10.5*2**3');
    });
    it('should return string for number input', () => {
      expect(toOperation(123)).toBe('123');
    });
    it('should handle empty string', () => {
      expect(toOperation('')).toBe('');
    });
  });

  // Test toDisplay
  describe('toDisplay', () => {
    it('should convert period to comma for display', () => {
      expect(toDisplay('123.45')).toBe('123,45');
    });
    it('should return string for number input', () => {
      expect(toDisplay(123.45)).toBe('123,45');
      expect(toDisplay(123)).toBe('123');
    });
    it('should handle string without period', () => {
      expect(toDisplay('12345')).toBe('12345');
    });
    it('should handle empty string', () => {
      expect(toDisplay('')).toBe('');
    });
     it('should handle negative numbers with period', () => {
      expect(toDisplay('-123.45')).toBe('−123,45'); // Expect Unicode minus sign
    });
  });

  // Test isOperation
  describe('isOperation', () => {
    it('should return true for valid operation symbols', () => {
      expect(isOperation('×')).toBe(true);
      expect(isOperation('÷')).toBe(true);
      expect(isOperation('+')).toBe(true);
      expect(isOperation('−')).toBe(true);
      expect(isOperation('^')).toBe(true);
    });
    it('should return false for non-operation symbols', () => {
      expect(isOperation(',')).toBe(false);
      expect(isOperation('1')).toBe(false);
      expect(isOperation('.')).toBe(false);
      expect(isOperation('')).toBe(false);
    });
  });

  // Test isSpecial
  describe('isSpecial', () => {
    it('should return true for valid special symbols (operations or comma)', () => {
      expect(isSpecial('×')).toBe(true);
      expect(isSpecial('÷')).toBe(true);
      expect(isSpecial('+')).toBe(true);
      expect(isSpecial('−')).toBe(true);
      expect(isSpecial('^')).toBe(true);
      expect(isSpecial(',')).toBe(true);
    });
    it('should return false for non-special symbols', () => {
      expect(isSpecial('1')).toBe(false);
      expect(isSpecial('.')).toBe(false); // Period is not "special" in display context, comma is.
      expect(isSpecial('')).toBe(false);
    });
  });
  
  // Test hasOperation
  describe('hasOperation', () => {
    it('should return true if string contains an operation', () => {
      expect(hasOperation('1+2')).toBe(true);
      expect(hasOperation('100×5')).toBe(true);
      expect(hasOperation('func^2')).toBe(true);
    });
    it('should return false if string does not contain an operation', () => {
      expect(hasOperation('123')).toBe(false);
      expect(hasOperation('1,2,3')).toBe(false);
      expect(hasOperation('')).toBe(false);
    });
  });
});
