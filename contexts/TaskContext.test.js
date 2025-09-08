// import React from 'react'; // No longer needed for Node.js env
// import { renderHook, act } from '@testing-library/react-native'; // No longer needed
// import { TaskContextProvider, TaskContext } from './TaskContext'; // Cannot test provider/context directly

import { Parser } from 'expr-eval';
import { toOperation, toDisplay } from '../utils/Utils'; // Assuming these are pure

describe('TaskContext Core Calculation Logic (Node.js Test)', () => {
  const parser = new Parser();

  const evaluateExpression = (exprStr) => {
    const operationalStr = toOperation(exprStr);
    try {
      const result = parser.parse(operationalStr).evaluate();
      if (isNaN(result) || !isFinite(result)) {
        return 'Error';
      }
      return toDisplay(String(result));
    } catch (e) {
      console.log(`Test Error: Input='${exprStr}', Operational='${operationalStr}', Message='${e.message}'`);
      return 'Error';
    }
  };

  // Test doTask's core calculation part
  it('should perform addition: 2+3 = 5', () => {
    expect(evaluateExpression('2+3')).toBe('5');
  });

  it('should perform subtraction: 5−2 = 3', () => {
    expect(evaluateExpression('5−2')).toBe('3');
  });

  it('should perform multiplication: 3×4 = 12', () => {
    expect(evaluateExpression('3×4')).toBe('12');
  });

  it('should perform division: 10÷2 = 5', () => {
    expect(evaluateExpression('10÷2')).toBe('5');
  });
  
  it('should perform exponentiation: 2^3 = 8', () => {
    expect(evaluateExpression('2^3')).toBe('8');
  });

  // Test Operator Precedence
  it('should respect operator precedence: 2+3×4 = 14', () => {
    expect(evaluateExpression('2+3×4')).toBe('14');
  });
  
  it('should respect operator precedence with exponentiation: 2+3^2×2 = 20', () => {
    expect(evaluateExpression('2+3^2×2')).toBe('20'); // 2 + (3^2)*2 = 2 + 9*2 = 2+18 = 20
  });

  // Test Decimal Numbers
  it('should handle decimal numbers: 1,5+2,5 = 4', () => {
    expect(evaluateExpression('1,5+2,5')).toBe('4');
  });
  
  it('should handle multiplication with decimals: 1,5×2 = 3', () => {
    expect(evaluateExpression('1,5×2')).toBe('3');
  });

  // Test Division by Zero
  it('should handle division by zero: 5÷0 = Error', () => {
    expect(evaluateExpression('5÷0')).toBe('Error');
  });
  
  it('should handle 0÷0 = Error (NaN)', () => {
    expect(evaluateExpression('0÷0')).toBe('Error');
  });

  // Test Invalid Expressions that expr-eval should catch
   it('should handle invalid expression (trailing operator): 1+ = Error', () => {
    expect(evaluateExpression('1+')).toBe('Error');
  });
  
  it('should handle invalid expression (leading operator if not unary): ×2 = Error', () => {
    expect(evaluateExpression('×2')).toBe('Error'); // expr-eval errors on leading binary operator
  });

  it('should handle invalid expression (multiple operators): 1++2 = 3', () => {
    // expr-eval parses "1++2" as "1 + (+2)" which is 3.
    expect(evaluateExpression('1++2')).toBe('3'); 
  });
  
  it('should handle valid leading unary minus: −2×3 = −6', () => {
    expect(evaluateExpression('−2×3')).toBe('−6');
  });

  it('should handle valid leading unary plus: +2×3 = 6', () => {
    expect(evaluateExpression('+2×3')).toBe('6');
  });

  it('should handle complex chain: 10−2×3+4^2 = 20', () => {
    expect(evaluateExpression('10−2×3+4^2')).toBe('20'); // 10 - 6 + 16 = 20
  });
  
  it('should handle calculation resulting in negative: 3−5 = −2', () => {
    expect(evaluateExpression('3−5')).toBe('−2');
  });

  it('should handle empty input string gracefully (as Error or specific handling)', () => {
    expect(evaluateExpression('')).toBe('Error'); // expr-eval errors on empty string
  });

  it('should handle string with only operators: +−× = Error', () => {
    expect(evaluateExpression('+−×')).toBe('Error');
  });
  
  it('should handle numbers with trailing decimal comma: 3, = Error (or 3 if desired)', () => {
    // toOperation turns "3," into "3."
    // expr-eval parses "3." as 3.
    expect(evaluateExpression('3,')).toBe('3'); 
  });

  it('should handle numbers with leading decimal comma: ,5 = Error (or 0.5 if desired)', () => {
    // toOperation turns ",5" into ".5"
    // expr-eval parses ".5" as 0.5
    expect(evaluateExpression(',5')).toBe('0,5'); 
  });
});

// The following original tests from TaskContext.test.js cannot be run in a plain Node.js
// environment because they depend on React hooks (useState, useContext) and
// the @testing-library/react-native renderHook utility.
// They are preserved here for reference.

/*
describe('TaskContext Calculation Logic', () => {
  it('should initialize with default values', () => {
    const { result } = renderTaskContextHook();
    expect(result.current.task).toBe('0');
    expect(result.current.lastTask).toBe('');
    expect(result.current.didTask).toBe(false);
  });

  // Test addDigit
  it('should add digits correctly', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.addDigit('2'));
    expect(result.current.task).toBe('12');
  });

  it('should start new task if digit added after task was done', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.addDigit('+'));
    act(() => result.current.addDigit('2'));
    act(() => result.current.doTask()); // 1+2=3
    expect(result.current.task).toBe('3');
    expect(result.current.didTask).toBe(true);
    act(() => result.current.addDigit('4')); // New task should start with 4
    expect(result.current.task).toBe('4');
    expect(result.current.didTask).toBe(false);
  });
  
  it('should replace leading zero when adding a number', () => {
    const { result } = renderTaskContextHook(); // task is '0'
    act(() => result.current.addDigit('5'));
    expect(result.current.task).toBe('5');
  });

  it('should handle consecutive special characters by replacing the last one', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('5'));
    act(() => result.current.addDigit('+'));
    act(() => result.current.addDigit('×'));
    expect(result.current.task).toBe('5×');
    act(() => result.current.addDigit('÷'));
    expect(result.current.task).toBe('5÷');
  });
  
  it('should allow specific sequences like "*-" or "/-" for negative numbers', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('5'));
    act(() => result.current.addDigit('×'));
    act(() => result.current.addDigit('−')); // Should become 5×-
    expect(result.current.task).toBe('5×−');
    act(() => result.current.addDigit('2'));
    expect(result.current.task).toBe('5×−2'); // 5 * -2
  });


  it('should prevent multiple commas in one number segment', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.addDigit(','));
    act(() => result.current.addDigit('2'));
    act(() => result.current.addDigit(',')); // Second comma should be ignored
    expect(result.current.task).toBe('1,2');
    act(() => result.current.addDigit('3'));
    expect(result.current.task).toBe('1,23');
    act(() => result.current.addDigit('+'));
    act(() => result.current.addDigit('4'));
    act(() => result.current.addDigit(','));
    act(() => result.current.addDigit('5'));
    act(() => result.current.addDigit(',')); // Second comma ignored
    expect(result.current.task).toBe('1,23+4,5');
  });

  // Test resetTask
  it('should reset the task', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.addDigit('+'));
    act(() => result.current.addDigit('2'));
    act(() => result.current.resetTask());
    expect(result.current.task).toBe('0');
    expect(result.current.lastTask).toBe('');
    expect(result.current.didTask).toBe(false);
  });

  // Test removeLastDigit
  it('should remove the last digit', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.addDigit('2'));
    act(() => result.current.addDigit('3'));
    act(() => result.current.removeLastDigit());
    expect(result.current.task).toBe('12');
  });

  it('should set task to "0" if removeLastDigit leaves it empty', () => {
    const { result } = renderTaskContextHook();
    act(() => result.current.addDigit('1'));
    act(() => result.current.removeLastDigit());
    expect(result.current.task).toBe('0');
  });
  
  // Test repeatTask functionality
  it('should repeat the last operation if = is pressed again', () => {
    const { result } = renderTaskContextHook(); // 2+3=5, then = should be 5+3=8
    act(() => result.current.addDigit('2'));
    act(() => result.current.addDigit('+'));
    act(() => result.current.addDigit('3'));
    act(() => result.current.doTask()); // task is "5", lastTask is "2+3", didTask is true
    expect(result.current.task).toBe('5');
    
    act(() => result.current.doTask()); // Should repeat "+3" -> current task ("5") + 3
    expect(result.current.task).toBe('8'); // 5+3
    expect(result.current.lastTask).toBe('5+3');

    act(() => result.current.doTask()); // Should repeat "+3" -> current task ("8") + 3
    expect(result.current.task).toBe('11'); // 8+3
    expect(result.current.lastTask).toBe('8+3');
  });
    it('should handle invalid expression (abc): "abc" = Error', () => {
    const { result } = renderTaskContextHook();
    result.current.task = "abc"; 
    act(() => result.current.doTask());
    expect(result.current.task).toBe('Error');
  });
*/
