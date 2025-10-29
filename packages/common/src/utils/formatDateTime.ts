import { formatDistance, intlFormat } from 'date-fns';
import { enUS } from 'date-fns/locale';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Helper function to calculate difference in days between two dates
export const diffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get the month name
export const getMonthName = (monthIndex: number) => {
  return monthNames[monthIndex];
};

export const formatDateWithOrdinal = (date: Date): string => {
  const getOrdinalSuffix = (day: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = day < 30 ? day % 20 : day % 30;
    return suffixes[relevantDigits <= 3 ? relevantDigits : 0];
  };

  const dayOfWeekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayOfWeek = dayOfWeekNames[date.getDay()];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${dayOfWeek}, ${monthNames[monthIndex]} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

// Helper function to format the date with an ordinal suffix
export const getOrdinalDate = (date: number) => {
  const j = date % 10;
  const k = date % 100;
  if (j === 1 && k !== 11) {
    return `${date}st`;
  }
  if (j === 2 && k !== 12) {
    return `${date}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${date}rd`;
  }
  return `${date}th`;
};

export const isValidDateString = (value: string) => {
  const regex = /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/;

  if (!regex.test(value)) {
    return false;
  }

  const date = new Date(value);
  return date;
};

export const getFormattedDateTimeString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('en-CA', options)
    .format(date)
    .replace(',', '');
};

export function formatDateTime(
  date?: Date | string | undefined | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: options?.year ?? 'numeric',
    month: options?.month ?? 'numeric',
    day: options?.day ?? 'numeric',
  };

  if (options?.weekday) {
    dateOptions.weekday = options?.weekday ?? 'long';
  }
  if (options?.hour) {
    dateOptions.hour = options?.hour ?? 'numeric';
  }
  if (options?.minute) {
    dateOptions.minute = options?.minute ?? 'numeric';
  }
  if (options?.second) {
    dateOptions.second = options?.second ?? 'numeric';
  }
  if (options?.hour12) {
    dateOptions.hour12 = options?.hour12 ?? true;
  }
  let dateData: Date;
  if (typeof date === 'string') {
    dateData = new Date(date);
  } else if (date instanceof Date) {
    dateData = date;
  } else {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', dateOptions).format(dateData);
}

export function getDateBefore(days: number): Date {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return today;
}

export function getDateAfter(days: number): Date {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
}

export const convertDateString = (dateString: string) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return intlFormat(
    date,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    {
      locale: 'en',
    },
  );
};

export const convertDateTimeString = (dateString: string) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return intlFormat(
    date,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    {
      locale: 'en',
    },
  );
};

export const convertDateTimeStringShort = (dateString: string) => {
  if (!dateString) {
    return dateString;
  }
  const date = new Date(dateString);
  return intlFormat(
    date,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    {
      locale: 'en',
    },
  );
};

export const convertTimeString = (dateString: string) => {
  const date = new Date(dateString);
  return intlFormat(
    date,
    {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    },
    {
      locale: 'en',
    },
  );
};

const getLocaleForTimeSince = (locale: string) => {
  switch (locale) {
    case 'en_US':
      return enUS;
  }
};

export const timeSince = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: getLocaleForTimeSince(locale),
  });
};

export const timeSinceDate = (date: Date) => {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  });
};

export const formatDate = (date: Date) => {
  return intlFormat(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTodaysDateFormatted = (seperator: string) => {
  const date = new Date();
  const formattedDate = date
    .toISOString()
    .split('T')[0]
    .split('-')
    .join(seperator);

  return formattedDate;
};

export const getTodaysDateTimeFormatted = (operator: string) => {
  const date = new Date();
  const formattedDate = date
    .toISOString()
    .split('T')[0]
    .split('-')
    .join(operator);
  const formattedTime = date
    .toTimeString()
    .split(' ')[0]
    .split(':')
    .join(operator);

  return [formattedDate, formattedTime].join(operator);
};

export const convertDatesInObject = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Return if obj is not an object
  }
  if (Array.isArray(obj)) {
    // Handle arrays by mapping each element through the function
    return obj.map((item) => convertDatesInObject(item)) as unknown as T;
  }
  const newObj: any = {};
  for (const key in obj) {
    if (
      (key === 'createdAt' || key === 'updatedAt') &&
      typeof obj[key] === 'string' &&
      !Number.isNaN(Date.parse(obj[key] as unknown as string))
    ) {
      newObj[key] = new Date(obj[key] as unknown as string);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      newObj[key] = convertDatesInObject(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const result: string[] = [];
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}min`);
  if (seconds > 0 || result.length === 0) result.push(`${seconds}sec`);

  return result.join(' ');
}

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(
  value: string,
  { max, min = 0, loop = false }: GetValidNumberConfig,
) {
  let numericValue = Number.parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, '0');
  }

  return '00';
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

export function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
  min: number;
  max: number;
  step: number;
};

export function getValidArrowNumber(
  value: string,
  { min, max, step }: GetValidArrowNumberConfig,
) {
  let numericValue = Number.parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return '00';
}

export function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

export function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(Number.parseInt(minutes, 10));
  return date;
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(Number.parseInt(seconds, 10));
  return date;
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(Number.parseInt(hours, 10));
  return date;
}

export function set12Hours(date: Date, value: string, period: Period) {
  const hours = Number.parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

export type TimePickerType = 'minutes' | 'seconds' | 'hours' | '12hours';
export type Period = 'AM' | 'PM';

export function setDateByType(
  date: Date,
  value: string,
  type: TimePickerType,
  period?: Period,
) {
  switch (type) {
    case 'minutes':
      return setMinutes(date, value);
    case 'seconds':
      return setSeconds(date, value);
    case 'hours':
      return setHours(date, value);
    case '12hours': {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case 'hours':
      return getValidHour(String(date.getHours()));
    case '12hours': {
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    }
    default:
      return '00';
  }
}

export function getArrowByType(
  value: string,
  step: number,
  type: TimePickerType,
) {
  switch (type) {
    case 'minutes':
      return getValidArrowMinuteOrSecond(value, step);
    case 'seconds':
      return getValidArrowMinuteOrSecond(value, step);
    case 'hours':
      return getValidArrowHour(value, step);
    case '12hours':
      return getValidArrow12Hour(value, step);
    default:
      return '00';
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
export function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === 'PM') {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === 'AM') {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return '12';
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}
