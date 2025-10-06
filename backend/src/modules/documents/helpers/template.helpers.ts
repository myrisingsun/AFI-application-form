import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Handlebars helpers for PDF template generation
 */
export const templateHelpers = {
  /**
   * Format date with custom format
   * Usage: {{formatDate date "DD.MM.YYYY"}}
   */
  formatDate: (date: string | Date, formatStr: string = 'DD.MM.YYYY'): string => {
    if (!date) return 'Не указано';

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;

      // Convert Java SimpleDateFormat to date-fns format
      const formatMap: Record<string, string> = {
        'DD.MM.YYYY': 'dd.MM.yyyy',
        'DD.MM.YY': 'dd.MM.yy',
        'MM.YYYY': 'MM.yyyy',
        'YYYY': 'yyyy',
        'DD.MM.YYYY HH:mm:ss': 'dd.MM.yyyy HH:mm:ss',
        'DD.MM.YYYY HH:mm': 'dd.MM.yyyy HH:mm',
      };

      const dateFormat = formatMap[formatStr] || formatStr;
      return format(dateObj, dateFormat, { locale: ru });
    } catch (error) {
      return 'Неверная дата';
    }
  },

  /**
   * Default value if the value is empty
   * Usage: {{defaultValue value "Default text"}}
   */
  defaultValue: (value: any, defaultText: string = 'Не указано'): string => {
    return value && value.toString().trim() ? value : defaultText;
  },

  /**
   * Increment number (for array indexes)
   * Usage: {{increment @index}}
   */
  increment: (value: number): number => {
    return value + 1;
  },

  /**
   * Get first letter of a string
   * Usage: {{firstLetter name}}
   */
  firstLetter: (str: string): string => {
    return str && str.length > 0 ? str.charAt(0).toUpperCase() : '';
  },

  /**
   * Check if array has items
   * Usage: {{#if (arrayLength array)}}...{{/if}}
   */
  arrayLength: (array: any[]): number => {
    return array && Array.isArray(array) ? array.length : 0;
  },

  /**
   * Format phone number
   * Usage: {{formatPhone phone}}
   */
  formatPhone: (phone: string): string => {
    if (!phone) return 'Не указано';

    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Format as +7 (XXX) XXX-XX-XX
    if (digits.length === 11 && digits.startsWith('7')) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
    }

    return phone;
  },

  /**
   * Format full name from parts
   * Usage: {{fullName lastName firstName middleName}}
   */
  fullName: (lastName: string, firstName: string, middleName: string): string => {
    const parts = [lastName, firstName, middleName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Не указано';
  },

  /**
   * Get initials from first and middle name
   * Usage: {{initials firstName middleName}}
   */
  initials: (firstName: string, middleName: string): string => {
    const parts = [];
    if (firstName) parts.push(firstName.charAt(0).toUpperCase() + '.');
    if (middleName) parts.push(middleName.charAt(0).toUpperCase() + '.');
    return parts.join('');
  },

  /**
   * Format passport series and number
   * Usage: {{formatPassport series number}}
   */
  formatPassport: (series: string, number: string): string => {
    if (!series || !number) return 'Не указано';
    return `${series} ${number}`;
  },

  /**
   * Format passport issuer code
   * Usage: {{formatIssuerCode code}}
   */
  formatIssuerCode: (code: string): string => {
    if (!code) return 'Не указано';

    // Remove all non-digits
    const digits = code.replace(/\D/g, '');

    // Format as XXX-XXX
    if (digits.length === 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return code;
  },

  /**
   * Uppercase first letter
   * Usage: {{capitalize text}}
   */
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Uppercase all words
   * Usage: {{titleCase text}}
   */
  titleCase: (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Join array items
   * Usage: {{join array ", "}}
   */
  join: (array: any[], separator: string = ', '): string => {
    if (!array || !Array.isArray(array)) return '';
    return array.join(separator);
  },

  /**
   * Conditional equal
   * Usage: {{#if (eq value1 value2)}}...{{/if}}
   */
  eq: (v1: any, v2: any): boolean => {
    return v1 === v2;
  },

  /**
   * Conditional not equal
   * Usage: {{#if (neq value1 value2)}}...{{/if}}
   */
  neq: (v1: any, v2: any): boolean => {
    return v1 !== v2;
  },

  /**
   * Conditional greater than
   * Usage: {{#if (gt value1 value2)}}...{{/if}}
   */
  gt: (v1: number, v2: number): boolean => {
    return v1 > v2;
  },

  /**
   * Conditional less than
   * Usage: {{#if (lt value1 value2)}}...{{/if}}
   */
  lt: (v1: number, v2: number): boolean => {
    return v1 < v2;
  },

  /**
   * Logical AND
   * Usage: {{#if (and condition1 condition2)}}...{{/if}}
   */
  and: (...args: any[]): boolean => {
    // Remove the last argument (Handlebars options object)
    const conditions = args.slice(0, -1);
    return conditions.every(Boolean);
  },

  /**
   * Logical OR
   * Usage: {{#if (or condition1 condition2)}}...{{/if}}
   */
  or: (...args: any[]): boolean => {
    // Remove the last argument (Handlebars options object)
    const conditions = args.slice(0, -1);
    return conditions.some(Boolean);
  },

  /**
   * Format boolean as Yes/No
   * Usage: {{yesNo value}}
   */
  yesNo: (value: boolean): string => {
    return value ? 'Да' : 'Нет';
  },

  /**
   * Truncate text
   * Usage: {{truncate text 50}}
   */
  truncate: (str: string, length: number = 100): string => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Calculate age from birth date
   * Usage: {{age birthDate}}
   */
  age: (birthDate: string | Date): number => {
    if (!birthDate) return 0;

    try {
      const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
      const today = new Date();
      let age = today.getFullYear() - dateObj.getFullYear();
      const monthDiff = today.getMonth() - dateObj.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Calculate work experience duration in months
   * Usage: {{workDuration startDate endDate}}
   */
  workDuration: (startDate: string | Date, endDate: string | Date): string => {
    if (!startDate) return 'Не указано';

    try {
      const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
      const end = endDate
        ? (typeof endDate === 'string' ? parseISO(endDate) : endDate)
        : new Date();

      const months = (end.getFullYear() - start.getFullYear()) * 12 +
                     (end.getMonth() - start.getMonth());

      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      const parts = [];
      if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`);
      }
      if (remainingMonths > 0) {
        parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'месяц' : remainingMonths < 5 ? 'месяца' : 'месяцев'}`);
      }

      return parts.length > 0 ? parts.join(' ') : '0 месяцев';
    } catch (error) {
      return 'Неверная дата';
    }
  },

  /**
   * Get education level translation
   * Usage: {{educationLevel degree}}
   */
  educationLevel: (degree: string): string => {
    const levels: Record<string, string> = {
      'high_school': 'Среднее общее',
      'vocational': 'Среднее профессиональное',
      'bachelor': 'Бакалавриат',
      'specialist': 'Специалитет',
      'master': 'Магистратура',
      'phd': 'Аспирантура',
    };

    return levels[degree] || degree;
  },
};
