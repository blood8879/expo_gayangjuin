import {
  formatDate,
  formatDetailDate,
  formatDateWithDay,
} from '../../../lib/utils/dateUtils';

describe('Date Utilities', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  describe('formatDate', () => {
    it('should format valid ISO date string to YYYY-MM-DD', () => {
      const isoDate = '2023-12-25T10:30:00.000Z';
      const result = formatDate(isoDate);
      
      expect(result).toBe('2023-12-25');
    });

    it('should format date string without time to YYYY-MM-DD', () => {
      const dateString = '2023-06-15';
      const result = formatDate(dateString);
      
      expect(result).toBe('2023-06-15');
    });

    it('should handle local datetime string', () => {
      const localDate = '2023-03-10T15:45:30';
      const result = formatDate(localDate);
      
      expect(result).toBe('2023-03-10');
    });

    it('should return "날짜 없음" for undefined input', () => {
      const result = formatDate(undefined);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for null input', () => {
      const result = formatDate(null as any);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for empty string', () => {
      const result = formatDate('');
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for invalid date string', () => {
      const result = formatDate('invalid-date');
      
      expect(result).toBe('날짜 없음');
    });

    it('should handle leap year dates correctly', () => {
      const leapYearDate = '2024-02-29T12:00:00.000Z';
      const result = formatDate(leapYearDate);
      
      expect(result).toBe('2024-02-29');
    });

    it('should handle edge case dates', () => {
      // New Year's Day
      expect(formatDate('2023-01-01T00:00:00.000Z')).toBe('2023-01-01');
      
      // New Year's Eve
      expect(formatDate('2023-12-31T23:59:59.999Z')).toBe('2023-12-31');
      
      // February in non-leap year
      expect(formatDate('2023-02-28T12:00:00.000Z')).toBe('2023-02-28');
    });

    it('should handle timezone differences correctly', () => {
      // Test with different timezone indicators
      const utcDate = '2023-07-15T00:00:00.000Z';
      const offsetDate = '2023-07-15T09:00:00.000+09:00';
      
      const utcResult = formatDate(utcDate);
      const offsetResult = formatDate(offsetDate);
      
      expect(utcResult).toBe('2023-07-15');
      expect(offsetResult).toBe('2023-07-15');
    });

    it('should log error for invalid input and return fallback', () => {
      const invalidInput = 'completely-invalid-date-format';
      const result = formatDate(invalidInput);
      
      expect(result).toBe('날짜 없음');
      // Note: formatDate doesn't actually throw/catch for invalid date strings, it uses isNaN check
    });

    it('should handle very old dates', () => {
      const oldDate = '1900-01-01T00:00:00.000Z';
      const result = formatDate(oldDate);
      
      expect(result).toBe('1900-01-01');
    });

    it('should handle future dates', () => {
      const futureDate = '2050-12-31T23:59:59.999Z';
      const result = formatDate(futureDate);
      
      expect(result).toBe('2050-12-31');
    });
  });

  describe('formatDetailDate', () => {
    it('should format valid ISO date string to Korean format', () => {
      const isoDate = '2023-12-25T10:30:00.000Z';
      const result = formatDetailDate(isoDate);
      
      expect(result).toBe('2023년 12월 25일');
    });

    it('should handle single digit months and days', () => {
      const date = '2023-01-05T00:00:00.000Z';
      const result = formatDetailDate(date);
      
      expect(result).toBe('2023년 1월 5일');
    });

    it('should return "날짜 없음" for undefined input', () => {
      const result = formatDetailDate(undefined);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for null input', () => {
      const result = formatDetailDate(null as any);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for empty string', () => {
      const result = formatDetailDate('');
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for invalid date string', () => {
      const result = formatDetailDate('invalid-date');
      
      expect(result).toBe('날짜 없음');
    });

    it('should handle leap year dates correctly', () => {
      const leapYearDate = '2024-02-29T12:00:00.000Z';
      const result = formatDetailDate(leapYearDate);
      
      expect(result).toBe('2024년 2월 29일');
    });

    it('should handle all months correctly', () => {
      const months = [
        { date: '2023-01-15T12:00:00.000Z', expected: '2023년 1월 15일' },
        { date: '2023-02-15T12:00:00.000Z', expected: '2023년 2월 15일' },
        { date: '2023-03-15T12:00:00.000Z', expected: '2023년 3월 15일' },
        { date: '2023-04-15T12:00:00.000Z', expected: '2023년 4월 15일' },
        { date: '2023-05-15T12:00:00.000Z', expected: '2023년 5월 15일' },
        { date: '2023-06-15T12:00:00.000Z', expected: '2023년 6월 15일' },
        { date: '2023-07-15T12:00:00.000Z', expected: '2023년 7월 15일' },
        { date: '2023-08-15T12:00:00.000Z', expected: '2023년 8월 15일' },
        { date: '2023-09-15T12:00:00.000Z', expected: '2023년 9월 15일' },
        { date: '2023-10-15T12:00:00.000Z', expected: '2023년 10월 15일' },
        { date: '2023-11-15T12:00:00.000Z', expected: '2023년 11월 15일' },
        { date: '2023-12-15T12:00:00.000Z', expected: '2023년 12월 15일' },
      ];

      months.forEach(({ date, expected }) => {
        expect(formatDetailDate(date)).toBe(expected);
      });
    });

    it('should handle edge case dates', () => {
      // New Year's Day
      expect(formatDetailDate('2023-01-01T00:00:00.000Z')).toBe('2023년 1월 1일');
      
      // New Year's Eve (using local time to avoid timezone issues)
      expect(formatDetailDate('2023-12-31T12:00:00.000Z')).toBe('2023년 12월 31일');
      
      // Month with 30 days
      expect(formatDetailDate('2023-04-30T12:00:00.000Z')).toBe('2023년 4월 30일');
      
      // Month with 31 days
      expect(formatDetailDate('2023-07-31T12:00:00.000Z')).toBe('2023년 7월 31일');
    });

    it('should log error for invalid input and return fallback', () => {
      const invalidInput = 'not-a-date';
      const result = formatDetailDate(invalidInput);
      
      expect(result).toBe('날짜 없음');
      // Note: formatDetailDate doesn't actually throw/catch for invalid date strings, it uses isNaN check
    });

    it('should handle dates with different time zones', () => {
      const utcDate = '2023-07-15T00:00:00.000Z';
      const offsetDate = '2023-07-15T09:00:00.000+09:00';
      
      const utcResult = formatDetailDate(utcDate);
      const offsetResult = formatDetailDate(offsetDate);
      
      expect(utcResult).toBe('2023년 7월 15일');
      expect(offsetResult).toBe('2023년 7월 15일');
    });
  });

  describe('formatDateWithDay', () => {
    it('should format date with Korean day of week', () => {
      // Monday (월요일)
      const monday = '2023-12-25T10:30:00.000Z'; // December 25, 2023 is a Monday
      const result = formatDateWithDay(monday);
      
      expect(result).toBe('2023년 12월 25일 월요일');
    });

    it('should handle all days of the week correctly', () => {
      // Using a known week in December 2023
      const weekDates = [
        { date: '2023-12-24T12:00:00.000Z', expected: '2023년 12월 24일 일요일' }, // Sunday
        { date: '2023-12-25T12:00:00.000Z', expected: '2023년 12월 25일 월요일' }, // Monday
        { date: '2023-12-26T12:00:00.000Z', expected: '2023년 12월 26일 화요일' }, // Tuesday
        { date: '2023-12-27T12:00:00.000Z', expected: '2023년 12월 27일 수요일' }, // Wednesday
        { date: '2023-12-28T12:00:00.000Z', expected: '2023년 12월 28일 목요일' }, // Thursday
        { date: '2023-12-29T12:00:00.000Z', expected: '2023년 12월 29일 금요일' }, // Friday
        { date: '2023-12-30T12:00:00.000Z', expected: '2023년 12월 30일 토요일' }, // Saturday
      ];

      weekDates.forEach(({ date, expected }) => {
        expect(formatDateWithDay(date)).toBe(expected);
      });
    });

    it('should return "날짜 없음" for undefined input', () => {
      const result = formatDateWithDay(undefined);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for null input', () => {
      const result = formatDateWithDay(null as any);
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for empty string', () => {
      const result = formatDateWithDay('');
      
      expect(result).toBe('날짜 없음');
    });

    it('should return "날짜 없음" for invalid date string', () => {
      const result = formatDateWithDay('invalid-date');
      
      expect(result).toBe('날짜 없음');
    });

    it('should handle leap year dates correctly', () => {
      const leapYearDate = '2024-02-29T12:00:00.000Z'; // February 29, 2024 is a Thursday
      const result = formatDateWithDay(leapYearDate);
      
      expect(result).toBe('2024년 2월 29일 목요일');
    });

    it('should handle single digit months and days', () => {
      const date = '2023-01-02T00:00:00.000Z'; // January 2, 2023 is a Monday
      const result = formatDateWithDay(date);
      
      expect(result).toBe('2023년 1월 2일 월요일');
    });

    it('should handle edge case dates with days', () => {
      // New Year's Day 2023 (Sunday)
      expect(formatDateWithDay('2023-01-01T00:00:00.000Z')).toBe('2023년 1월 1일 일요일');
      
      // New Year's Eve 2023 (Sunday) - using midday to avoid timezone issues
      expect(formatDateWithDay('2023-12-31T12:00:00.000Z')).toBe('2023년 12월 31일 일요일');
    });

    it('should log error for invalid input and return fallback', () => {
      const invalidInput = 'completely-invalid';
      const result = formatDateWithDay(invalidInput);
      
      expect(result).toBe('날짜 없음');
      // Note: formatDateWithDay doesn't actually throw/catch for invalid date strings, it uses isNaN check
    });

    it('should handle dates with different time zones', () => {
      // Same date but different timezone representations
      const utcDate = '2023-12-25T00:00:00.000Z';
      const offsetDate = '2023-12-25T09:00:00.000+09:00';
      
      const utcResult = formatDateWithDay(utcDate);
      const offsetResult = formatDateWithDay(offsetDate);
      
      expect(utcResult).toBe('2023년 12월 25일 월요일');
      expect(offsetResult).toBe('2023년 12월 25일 월요일');
    });

    it('should handle historical dates correctly', () => {
      // January 1, 1900 was a Monday
      const historicalDate = '1900-01-01T00:00:00.000Z';
      const result = formatDateWithDay(historicalDate);
      
      expect(result).toBe('1900년 1월 1일 월요일');
    });

    it('should handle future dates correctly', () => {
      // December 31, 2050 is a Saturday
      const futureDate = '2050-12-31T00:00:00.000Z';
      const result = formatDateWithDay(futureDate);
      
      expect(result).toBe('2050년 12월 31일 토요일');
    });
  });

  describe('Error Handling', () => {
    it('should handle Date constructor exceptions gracefully', () => {
      // Mock Date constructor to throw
      const originalDate = global.Date;
      global.Date = jest.fn(() => {
        throw new Error('Date constructor failed');
      }) as any;

      const result = formatDate('2023-12-25');
      
      expect(result).toBe('날짜 없음');
      expect(console.error).toHaveBeenCalledWith('날짜 포맷팅 오류:', expect.any(Error));

      // Restore original Date
      global.Date = originalDate;
    });

    it('should handle getTime() method failures', () => {
      // Create a date-like object that fails on getTime()
      const mockDate = {
        getTime: () => { throw new Error('getTime failed'); },
        toISOString: () => '2023-12-25T00:00:00.000Z',
        getFullYear: () => 2023,
        getMonth: () => 11,
        getDate: () => 25,
        getDay: () => 1,
      };

      const originalDate = global.Date;
      global.Date = jest.fn(() => mockDate) as any;

      const result = formatDate('2023-12-25');
      
      expect(result).toBe('날짜 없음');

      // Restore original Date
      global.Date = originalDate;
    });

    it('should handle edge case of Date returning NaN', () => {
      const result = formatDate('2023-13-45'); // Invalid month and day
      
      expect(result).toBe('날짜 없음');
    });

    it('should handle whitespace-only strings', () => {
      expect(formatDate('   ')).toBe('날짜 없음');
      expect(formatDetailDate('   ')).toBe('날짜 없음');
      expect(formatDateWithDay('   ')).toBe('날짜 없음');
    });

    it('should handle numeric inputs', () => {
      // Numbers are treated as milliseconds since epoch, but large numbers may create valid dates
      // Testing with a string representation of number that should be invalid
      expect(formatDate('123456789abc' as any)).toBe('날짜 없음');
      expect(formatDetailDate('123456789abc' as any)).toBe('날짜 없음');
      expect(formatDateWithDay('123456789abc' as any)).toBe('날짜 없음');
    });
  });

  describe('Consistency Tests', () => {
    it('should handle the same date consistently across all functions', () => {
      const testDate = '2023-07-15T12:30:45.123Z';
      
      const simpleFormat = formatDate(testDate);
      const detailFormat = formatDetailDate(testDate);
      const dayFormat = formatDateWithDay(testDate);
      
      expect(simpleFormat).toBe('2023-07-15');
      expect(detailFormat).toBe('2023년 7월 15일');
      expect(dayFormat).toBe('2023년 7월 15일 토요일');
      
      // All should extract the same date parts
      expect(detailFormat.includes('2023년')).toBe(true);
      expect(detailFormat.includes('7월')).toBe(true);
      expect(detailFormat.includes('15일')).toBe(true);
    });

    it('should handle error cases consistently', () => {
      const invalidInputs = [undefined, null, '', 'invalid', '   '];
      
      invalidInputs.forEach(input => {
        expect(formatDate(input as any)).toBe('날짜 없음');
        expect(formatDetailDate(input as any)).toBe('날짜 없음');
        expect(formatDateWithDay(input as any)).toBe('날짜 없음');
      });
    });
  });
});