import fs from 'fs';

export function getCommonLoginPayload(payload: any) {
  return {
    userId: payload.userId,
    username: payload.username,
    organisationId: payload.organisationId,
    organisationPublicId: payload.organisationPublicId,
    organisationLogo: payload.organisationLogo,
    organisationName: payload.organisationName,
    role: payload.role,
    roleId: payload.roleId,
    preferences: payload.preferences,
    scope: payload.scope,
    fullName: payload.fullName,
    permissions: payload.permissions || payload.permissionGroup?.permissions || {},
    organisationType: payload.organisationType,
  };
}
export function isPasswordAsPerRules(password: string) {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  return !!password.match(regex);
}

export function deleteTempFile(filePath: string) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting temporary file:', err);
    } else {
      console.log('Temporary file deleted successfully');
    }
  });
}

export function getDefaultAvatarUrl(fullName: string) {
  let nameForAvatar = '';

  if (fullName.includes(' ')) {
    const [first, last] = fullName.split(' ');
    nameForAvatar = `${first}+${last}`;
  } else {
    nameForAvatar = fullName.slice(0, 2).split('').join('+');
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&size=128&background=random`;
}

export function filterObject<T extends object, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Partial<Pick<T, K[number]>> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as keyof T)),
  ) as Partial<Pick<T, K[number]>>;
}

export const deepJsonStringify = (obj) => {
  const nObj = { ...obj };
  Object.keys(nObj).forEach((key) => {
    if (typeof nObj[key] === 'object') {
      nObj[key] = JSON.stringify(nObj[key]);
    }
  });
  return nObj;
};

export function getNormalizedIp(rawIp?: string): string {
  if (!rawIp) return 'Unknown IP';
  return rawIp.startsWith('::ffff:') ? rawIp.slice(7) : rawIp;
}

export function validateEducationArray(educationArray) {
  if (
    !Array.isArray(educationArray)
  ) {
    throw new Error('Education must be a non-empty array.');
  }

  const requiredFields = [
    'level',
    'schoolCollege',
    'address',
    'universityBoard',
    'yearOfCompletion',
    'gradePercentage',
  ];

  educationArray.forEach((edu, index) => {
    if (typeof edu !== 'object' || edu === null) {
      throw new Error(`Education entry at index ${index} must be an object.`);
    }

    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !(field in edu));
    if (missingFields.length > 0) {
      throw new Error(
        `Education entry at index ${index} is missing fields: ${missingFields.join(', ')}`,
      );
    }

    // (Optional) Ensure all fields are strings
    for (const field of requiredFields) {
      if (typeof edu[field] !== 'string') {
        throw new Error(
          `Education entry at index ${index}, field '${field}' must be a string.`,
        );
      }
    }
  });
}

export function getOrdinal(level: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = level % 100;
  return level + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export function getDateForNextWeekDayBetween(
  start: Date,
  end: Date,
  targetDayIndex: number,
): Date | null {
  const date = new Date(start);
  while (date <= end) {
    if (date.getDay() === targetDayIndex) {
      return new Date(date);
    }
    date.setDate(date.getDate() + 1);
  }
  return null;
}
