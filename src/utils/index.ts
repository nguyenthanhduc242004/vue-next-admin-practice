import type { FormItemProps } from '@/components/FormItem.vue';

export const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const fileToBase64 = (file: unknown | string) => {
    if (typeof file === 'string') {
        return Promise.resolve(file); // If it's already a string, return it as is
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file as Blob);
    });
};

export const downloadFileFromBase64 = (base64String: string, filename: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = base64String;
    link.download = filename;

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link
    document.body.removeChild(link);
};

export const convertToUtcZero = (date: Date) => {
    // Use the UTC getter methods to get the components of the date
    // in the UTC-0 timezone.
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // getUTCMonth() is 0-indexed (0 for January)
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    // Create a new Date object using these UTC components.
    // The Date.UTC() method returns the number of milliseconds since the epoch,
    // which is then used to create a new Date object.
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
};

export const createObjectURL = (file: File | string) => {
    if (typeof file === 'string') {
        return file; // If it's already a string, return it as is
    }
    return URL.createObjectURL(file);
};

export const downloadBlobFromUrlOrFile = (urlOrFile: string | File, filename = 'image') => {
    if (typeof urlOrFile === 'string') {
        // Download from URL
        const link = document.createElement('a');
        link.href = urlOrFile;
        link.download = filename;
        link.target = '_blank';

        // If the URL is not a data URL or blob, fetch and download as blob
        if (!/^data:|^blob:/.test(urlOrFile)) {
            fetch(urlOrFile)
                .then((response) => response.blob())
                .then((blob) => {
                    const blobUrl = URL.createObjectURL(blob);
                    link.href = blobUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                });
        } else {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } else {
        // Download from File object
        const url = URL.createObjectURL(urlOrFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

export const getFullImageUrlPath = (BE_URL: string, uri: string) => {
    return BE_URL + `/images\\${encodeURIComponent(uri)}`;
};

export const INT_MAX = 2147483647;

export const convertToUtc0IsoString = (stringOrDate: string | Date | null) => {
    let dobString;
    if (typeof stringOrDate === 'string') {
        dobString = new Date(stringOrDate).toISOString();
    } else if (stringOrDate) {
        const year = stringOrDate?.getFullYear();
        const month =
            stringOrDate!.getMonth() + 1 >= 10
                ? stringOrDate!.getMonth() + 1 + ''
                : '0' + (stringOrDate!.getMonth() + 1);
        const date =
            stringOrDate!.getDate() >= 10 ? stringOrDate?.getDate() : '0' + stringOrDate?.getDate();
        dobString = new Date(`${year}-${month}-${date}`).toISOString();
    } else {
        dobString = '';
    }
    return dobString;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeItemByIndex = (array: any[], index: number) => {
    if (index > -1 && index < array.length) {
        array.splice(index, 1);
    }
    return array;
};

export const datetimeFormat = 'YYYY-MM-DD HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
export const BE_URL = 'http://127.0.0.1:5000';
export const imagePlaceholder = 'https://placehold.co/100?text=Image&font=roboto';

export type GenerateFormInterface<T extends FormItemProps[]> = {
    [K in T[number] as K['prop'] extends string ? K['prop'] : never]: K['dataType'] extends 'number'
        ? number | null
        : K['dataType'] extends 'date'
          ? Date | null
          : K['dataType'] extends 'boolean'
            ? boolean | null
            : K['dataType'] extends 'image'
              ? string | File | null
              : K['dataType'] extends 'table'
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  any[] | null
                : string | null;
};
export const createEmptyRuleForm = <T extends FormItemProps[]>(
    columns: T,
): GenerateFormInterface<T> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form: any = {};
    if (columns) {
        columns.forEach((column) => {
            if (column.prop) {
                form[column.prop] = null;
            }
        });
    }

    return form as GenerateFormInterface<T>;
};

type SpecialCases = {
    ID: string;
    UoM: string;
    URL: string;
    API: string;
    HTML: string;
    XML: string;
};

export const splitCamelCase = (str: string): string => {
    if (!str) return '';

    const specialCases: SpecialCases = {
        ID: 'ID',
        UoM: 'UoM',
        URL: 'URL',
        API: 'API',
        HTML: 'HTML',
        XML: 'XML',
    };

    const specialCasePatterns = Object.keys(specialCases).join('|');
    const specialCaseRegex = new RegExp(`(${specialCasePatterns})`, 'g');

    // First, split by special cases
    const parts = str.split(specialCaseRegex).filter((part) => part !== '');

    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If it's a special case, add the formatted version
        if (isSpecialCase(part)) {
            result.push(specialCases[part]);
            continue;
        }

        // Otherwise, split camelCase normally
        const words = part
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        result.push(...words);
    }

    return result.join(' ').trim();
};

// Helper function để check key
const isSpecialCase = (key: string): key is keyof SpecialCases => {
    return (
        key in
        {
            ID: true,
            UoM: true,
            URL: true,
            API: true,
            HTML: true,
            XML: true,
        }
    );
};
