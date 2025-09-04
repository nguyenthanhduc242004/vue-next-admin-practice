<script lang="ts" setup>
import {
    BE_URL,
    createEmptyRuleForm,
    createObjectURL,
    downloadBlobFromUrlOrFile,
    getFullImageUrlPath,
    INT_MAX,
    splitCamelCase,
    type GenerateFormInterface,
} from '@/utils';
import {
    ElMessage,
    genFileId,
    type FormInstance,
    type FormRules,
    type UploadInstance,
    type UploadProps,
    type UploadRawFile,
} from 'element-plus';
import { Plus, ZoomIn, Download, Delete, Right } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import type { TableColumnProps } from './TableColumn.vue';
import Table from './Table.vue';
import { useDateFormat } from '@vueuse/core';

export interface FormItemProps {
    type: 'default' | 'image' | 'date' | 'status' | 'number' | 'autocomplete' | 'table' | 'select';
    prop: string;
    label?: string;
    placeholder?: string;
    imageFit?: string;
    imagePlaceholder?: string;
    activeText?: string;
    inactiveText?: string;
    isEditting?: boolean;
    notEdittable?: boolean;
    disabled?: boolean;
    numberSuffix?: string;

    // AUTOCOMPLETE
    autocompleteDataUrl?: string;
    autocompleteProps?: string[];
    autocompleteFilledProps?: string[];

    // TABLE
    tableFetchIdProp?: string;
    tableFetchUrl?: string;
    tableFetchId?: string | number | null | undefined;
    tableDataName?: string;
    tableColumnPropsList?: TableColumnProps[];
    tableFormItemPropsList?: FormItemProps[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableFormRules?: FormRules<any>;
    tablePrimaryKey?: string[];

    // autocompleteIdProp?: string;
    // autocompleteId?: string | number | null;
    // tablePrimaryKey?: string[];
}
const props = defineProps<FormItemProps>();
const emit = defineEmits([
    'image-click',
    'autocomplete-select',
    'autocomplete-clear',
    'autocomplete-id-change',
]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formItemValue = defineModel<any>('formItemValue');

watch(
    () => props.tableFetchId,
    () => {
        if (
            props.tableFetchId &&
            (props.tableFetchId + '').length > (props.tableFetchId + '').trim().length
        ) {
            return;
        }
        Object.keys(ruleForm).forEach((key) => (ruleForm[key] = null));
        emit('autocomplete-id-change');
    },
);

const upload = ref<UploadInstance>();
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
};

const acceptFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const handleImageBeforeUpload: UploadProps['beforeUpload'] = (uploadRawFile) => {
    if (!acceptFileTypes.includes(uploadRawFile.type)) {
        ElMessage.error('Image picture must be JPG, PNG, GIF or WEBP format!');
        return false;
    } else if (uploadRawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Image picture size can not exceed 2MB!');
        return false;
    }

    formItemValue.value = uploadRawFile;
    return true;
};

// Table
const tableRef = ref();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletingObject = ref<any>({});
type RuleForm = GenerateFormInterface<NonNullable<typeof props.tableFormItemPropsList>>;
const ruleForm = reactive<RuleForm>(createEmptyRuleForm(props.tableFormItemPropsList!));
const ruleFormRef = ref<FormInstance>();

onMounted(() => {
    getAutocompleteData();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const autocompleteData = ref<Record<string, any>[]>([]);
const getAutocompleteData = () => {
    if (props.autocompleteDataUrl) {
        let url = props.autocompleteDataUrl;
        if (props.tableFetchId) url = props.autocompleteDataUrl + '/' + props.tableFetchId;
        axios
            .get(url)
            .then((response) => {
                if (response.data.code === 200) {
                    console.log(response.data);
                    autocompleteData.value = response.data.result;
                } else
                    ElMessage.error('Error fetching autocomplete data: ' + response.data.message);
            })
            .catch((error) => {
                ElMessage.error('Error fetching autocomplete data: ' + error);
            });
    }
};

const handleCheckId = () => {
    if (props.tableFetchId) {
        axios.get(props.tableFetchUrl + '/' + props.tableFetchId).then((response) => {
            if (response.data.code === 200) {
                if (response.data.result.length >= 1) {
                    tableRef.value.openAddModal();
                } else {
                    ElMessage.error(
                        splitCamelCase(props.tableFetchIdProp ?? '') +
                            " does not exist or doesn't supply any products!",
                    );
                }
            } else {
                ElMessage.error('Error fetching data: ' + response.data.error);
            }
        });
    } else {
        ElMessage.error(splitCamelCase(props.tableFetchIdProp ?? '') + ' cannot be empty!');
    }
};

// Autocomplete
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const autocompleteQuerySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? autocompleteData.value.filter(autocompleteFilter(queryString))
        : autocompleteData.value;
    // call callback function to return suggestions
    cb(results);
};
const autocompleteFilter = (queryString: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data: any) => {
        if (props.type === 'select') return false;
        if (!props.autocompleteProps) {
            return data.ID.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
        } else {
            return props.autocompleteProps.some(
                (prop) =>
                    data[prop] && data[prop].toLowerCase().indexOf(queryString.toLowerCase()) === 0,
            );
        }
    };
};
</script>

<template>
    <el-form-item v-if="type === 'image'" :label="label" :prop="prop" class="form-item">
        <el-upload
            ref="upload"
            :class="`avatar-uploader ${disabled ? 'disabled' : ''}`"
            :show-file-list="false"
            :before-upload="handleImageBeforeUpload"
            :limit="1"
            :on-exceed="handleExceed"
            accept=".png,.jpeg,.jpg,.gif,.webp"
            :disabled="disabled || (isEditting && notEdittable)"
        >
            <el-image
                v-if="formItemValue"
                :src="
                    typeof formItemValue === 'string'
                        ? getFullImageUrlPath(BE_URL, formItemValue)
                        : createObjectURL(formItemValue)
                "
                class="avatar"
                :fit="imageFit"
            />
            <el-icon v-else-if="!disabled" class="avatar-uploader-icon"><Plus /></el-icon>
            <el-image v-else :src="imagePlaceholder" class="avatar" :fit="imageFit" />
        </el-upload>
        <div
            v-show="formItemValue"
            style="
                display: flex;
                height: 100px;
                flex-direction: column;
                justify-content: space-around;
                margin-left: 8px;
            "
        >
            <el-icon
                @click="emit('image-click', formItemValue)"
                :size="20"
                color="#48c2fb"
                class="image-action-icon"
            >
                <ZoomIn />
            </el-icon>
            <el-icon
                @click="
                    downloadBlobFromUrlOrFile(
                        typeof formItemValue === 'string'
                            ? getFullImageUrlPath(BE_URL, formItemValue)
                            : (formItemValue as File),
                    )
                "
                :size="20"
                color="#81bd08"
                class="image-action-icon"
            >
                <Download />
            </el-icon>
            <el-icon
                v-if="!disabled"
                @click="formItemValue = null"
                :size="20"
                color="#ff0808"
                class="image-action-icon"
            >
                <Delete />
            </el-icon>
        </div>
    </el-form-item>

    <el-form-item v-else-if="type === 'default'" :label="label" :prop="prop" class="form-item">
        <el-input
            clearable
            :placeholder="placeholder"
            v-model="formItemValue"
            :disabled="disabled || (isEditting && notEdittable)"
        />
    </el-form-item>
    <el-form-item v-else-if="type === 'date'" :label="label" :prop="prop" class="form-item">
        <el-date-picker
            v-model="formItemValue"
            type="date"
            :placeholder="placeholder"
            :disabled="disabled || (isEditting && notEdittable)"
        />
    </el-form-item>
    <el-form-item v-else-if="type === 'status'" :label="label" :prop="prop" class="form-item"
        ><el-switch
            v-model="formItemValue"
            inline-prompt
            :active-text="activeText"
            :inactive-text="inactiveText"
            :disabled="disabled || (isEditting && notEdittable)"
        />
    </el-form-item>

    <el-form-item
        v-else-if="type === 'number'"
        :label="label"
        :prop="prop"
        class="form-item"
        :style="{
            width: numberSuffix ? '400px' : 'auto',
        }"
    >
        <el-input-number
            :class="{
                'el-input-number--has-suffix': !!numberSuffix,
            }"
            v-model="formItemValue"
            :min="0"
            :max="INT_MAX"
            :disabled="disabled"
        >
            <template #suffix v-if="numberSuffix">
                <span>{{ numberSuffix }}</span>
            </template>
        </el-input-number>
    </el-form-item>
    <el-form-item v-else-if="type === 'autocomplete'" :label="label" :prop="prop" class="form-item">
        <el-autocomplete
            v-model="formItemValue"
            :fetch-suggestions="autocompleteQuerySearch"
            clearable
            value-key="ID"
            class="inline-input w-50"
            :placeholder="placeholder"
            @select="
                (item: Record<string, any>) => {
                    emit('autocomplete-select', autocompleteFilledProps, item);
                }
            "
            @clear="emit('autocomplete-clear', autocompleteFilledProps)"
        />
    </el-form-item>
    <el-form-item v-else-if="type === 'select'" :label="label" :prop="prop" class="form-item">
        <el-select
            v-model="formItemValue"
            :placeholder="placeholder"
            @change="
                (value: any) => {
                    emit('autocomplete-select', autocompleteFilledProps, value, prop);
                }
            "
        >
            <div
                style="display: flex; padding-right: 32px; padding-left: 20px; padding-bottom: 4px"
            >
                <h4
                    v-for="prop in autocompleteProps"
                    :key="prop"
                    style="flex: 1; text-align: center; color: #606226; font-weight: bold"
                >
                    {{ splitCamelCase(prop) }}
                </h4>
            </div>
            <el-option
                style="color: #606226"
                v-for="item in autocompleteData"
                :key="item.ID"
                :value="item"
            >
                <div style="display: flex">
                    <template v-if="autocompleteProps">
                        <span
                            v-for="prop in autocompleteProps"
                            :key="prop"
                            style="flex: 1; text-align: center"
                        >
                            {{ item[prop] }}
                        </span>
                    </template>
                    <span v-else> {{ item.ID }} </span>
                </div>
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item
        v-else-if="type === 'table'"
        :label="label"
        :prop="prop"
        class="form-item"
        style="margin-bottom: 0"
    >
        <Table
            ref="tableRef"
            :autocomplete-data-url="autocompleteDataUrl"
            :table-column-props-list="tableColumnPropsList ?? []"
            v-model:table-data="formItemValue"
            :form-item-props-list="tableFormItemPropsList!"
            v-model:rule-form="ruleForm"
            :form-rules="tableFormRules"
            v-model:rule-form-ref="ruleFormRef"
            v-model:deleting-object="deletingObject"
            :has-pagination="false"
            :has-border="true"
            :height="'320px'"
            :fetch-id-prop="tableFetchIdProp"
            :fetch-id="tableFetchId"
            :fetch-url="tableFetchUrl"
            :primary-key="tablePrimaryKey"
            :delete-confirm-text="`This operation will permanently delete the ${tablePrimaryKey?.map((key) => splitCamelCase(key) + ': ' + (deletingObject[key] instanceof Date ? useDateFormat(deletingObject[key], 'YYYY-MM-DD').value : deletingObject[key])).join(', ')}. Do you want to continue?`"
            :replace-confirm-text="`The ${tableDataName} with ${tablePrimaryKey?.map((key) => splitCamelCase(key) + ': ' + (deletingObject[key] instanceof Date ? useDateFormat(deletingObject[key], 'YYYY-MM-DD').value : deletingObject[key])).join(', ')} already existed. Do you want to replace it?`"
        />
        <el-button
            type="success"
            :icon="Plus"
            style="margin-top: 12px; margin-left: 0px"
            @click="handleCheckId()"
            >Add {{ tableDataName }}</el-button
        >
    </el-form-item>
</template>

<style scoped>
.form-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.form-item .form-item {
    margin-bottom: 20px;
}

.avatar-uploader {
    height: 100px;
}

.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
}

.image-action-icon {
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
}

.el-input-number {
    min-width: 150px;
}
.el-input-number.el-input-number--has-suffix {
    min-width: 220px;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.avatar-uploader.disabled .el-upload:hover {
    border-color: var(--el-border-color);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>
