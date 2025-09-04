/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormItemProps } from '@/components/FormItem.vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

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
                ? any[] | null
                : string | null;
};
export const createEmptyRuleForm = <T extends FormItemProps[]>(
    columns: T,
): GenerateFormInterface<T> => {
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

export const isEmptyObject = (obj: unknown): boolean => {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        Object.keys(obj).length === 0
    );
};

export const addOrEditData = async (
    ID: string | number,
    data: Record<string, any>,
    isEditting: boolean,
    containImage: boolean,
    api: string,
    onSuccess: () => void,
    onFinally: () => void,
) => {
    let finalData: any;
    if (containImage) {
        finalData = new FormData();
        finalData.append('ID', ID);
        for (const key in data) {
            if (data[key] instanceof Date) {
                finalData.append(key, convertToUtc0IsoString(data[key]));
            } else {
                finalData.append(key, data[key] ?? '');
            }
        }
    } else {
        finalData.ID = ID;
        for (const key in data) {
            if (data[key] instanceof Date) {
                finalData[key] = convertToUtc0IsoString(data[key]);
            } else {
                finalData[key] = data[key];
            }
        }
    }

    await axios
        .post(api + '/' + (isEditting ? 'update' : 'add'), finalData)
        .then((response) => {
            if (response.data.code === 200) {
                onSuccess();
                console.log(response.data);
                ElMessage.success(`${isEditting ? 'Edit' : 'Add'} data successfully`);
            } else ElMessage.error('Error adding data: ' + response.data.message);
        })
        .catch((error) => {
            ElMessage.error('Error adding data: ' + error);
        })
        .finally(() => {
            onFinally();
        });
};

export const deleteData = async (
    ID: string | number,
    api: string,
    onSuccess: () => void,
    onFinally: () => void,
) => {
    axios
        .post(api + '/soft-delete', {
            ID: ID,
        })
        .then((response) => {
            if (response.data.code === 200) {
                onSuccess();
                console.log(response.data);
                ElMessage.success('Delete data successfully');
            } else ElMessage.error('Error deleting data: ' + response.data.message);
        })
        .catch((error) => {
            ElMessage.error('Error deleting data: ' + error);
        })
        .finally(() => {
            onFinally();
        });
};

// const addOrEditData = async () => {
//     if (props.formItemPropsList) {
//         addAndEditDialogVisible.value = false;
//         isTableDataLoading.value = true;

//         if (props.api) {
//             let data: any;
//             if (props.formItemPropsList.some((item) => item.type === 'image' && !item.disabled)) {
//                 data = new FormData();

//                 data.append('ID', edittingObject.value.ID);
//                 props.formItemPropsList.forEach((item) => {
//                     if (item.type === 'date')
//                         data.append(item.prop, convertToUtc0IsoString(ruleForm.value[item.prop]));
//                     else data.append(item.prop, ruleForm.value[item.prop]);
//                 });
//             } else {
//                 data = { ID: edittingObject.value?.ID };
//                 props.formItemPropsList.forEach((item) => {
//                     // TODO: if use DateString: Add here
//                     if (item.type === 'date')
//                         data[item.prop] = convertToUtc0IsoString(ruleForm.value[item.prop]);
//                     else if (item.type === 'table') {
//                         data[item.prop] = ruleForm.value[item.prop].map((productBatch: any) => {
//                             const temp: Record<string, any> = {};
//                             for (const [key, value] of Object.entries(productBatch)) {
//                                 if (value instanceof Date)
//                                     temp[key] = convertToUtc0IsoString(value);
//                                 else temp[key] = value;
//                             }
//                             return temp;
//                         });
//                     } else data[item.prop] = ruleForm.value[item.prop];
//                 });
//             }

//             if (edittingObject.value) {
//                 axios
//                     .post(props.api + '/update', data)
//                     .then((response) => {
//                         if (response.data.code === 200) {
//                             getPageData();
//                             console.log(response.data);
//                             ElMessage.success('Edit data successfully');
//                         } else ElMessage.error('Error editting data: ' + response.data.message);
//                     })
//                     .catch((error) => {
//                         ElMessage.error('Error editting data: ' + error);
//                     })
//                     .finally(() => {
//                         isTableDataLoading.value = false;
//                         edittingObject.value = null;
//                     });
//             } else if (isAdding.value) {
//                 axios
//                     .post(props.api + '/add', data)
//                     .then((response) => {
//                         if (response.data.code === 200) {
//                             getPageData();
//                             console.log(response.data);
//                             isAdding.value = false;
//                             ElMessage.success('Add data successfully');
//                         } else ElMessage.error('Error adding data: ' + response.data.message);
//                     })
//                     .catch((error) => {
//                         ElMessage.error('Error adding data: ' + error);
//                     })
//                     .finally(() => {
//                         isTableDataLoading.value = false;
//                     });
//             }
//         } else {
//             indexToReplace.value = tableData.value.findIndex((tableDataItem) => {
//                 return props.primaryKey?.every((prop) => {
//                     if (tableDataItem[prop] instanceof Date) {
//                         return (
//                             tableDataItem[prop].toISOString() === ruleForm.value[prop].toISOString()
//                         );
//                     }
//                     return tableDataItem[prop] === ruleForm.value[prop];
//                 });
//             });
//             if (edittingObject.value) {
//                 indexToEdit.value = tableData.value.findIndex((tableDataItem) => {
//                     return props.primaryKey?.every((prop) => {
//                         if (tableDataItem[prop] instanceof Date) {
//                             return (
//                                 tableDataItem[prop].toISOString() ===
//                                 edittingObject.value[prop].toISOString()
//                             );
//                         }
//                         return tableDataItem[prop] === edittingObject.value[prop];
//                     });
//                 });
//                 if (indexToReplace.value === -1) {
//                     tableData.value[indexToEdit.value] = { ...ruleForm.value };
//                 } else {
//                     const hasPrimaryKeyValueChanged = props.primaryKey?.some((prop) => {
//                         if (edittingObject.value[prop] instanceof Date) {
//                             return (
//                                 edittingObject.value[prop].toISOString() !==
//                                 ruleForm.value[prop].toISOString()
//                             );
//                         }
//                         return edittingObject.value[prop] !== ruleForm.value[prop];
//                     });
//                     if (hasPrimaryKeyValueChanged) {
//                         // Hiện dialog hỏi replace
//                         replaceDialogVisible.value = true;
//                     } else {
//                         tableData.value[indexToReplace.value] = { ...ruleForm.value };
//                     }
//                 }

//                 edittingObject.value = null;
//             } else if (isAdding.value) {
//                 if (indexToReplace.value === -1) {
//                     tableData.value.push({ ...ruleForm.value });
//                 } else {
//                     // Hiện dialog hỏi replace
//                     replaceDialogVisible.value = true;
//                 }
//                 isAdding.value = false;
//             }
//             isTableDataLoading.value = false;
//         }
//     }
// };
