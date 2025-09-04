<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Search, FolderAdd } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { TableColumnProps } from '@/components/TableColumn.vue';
import type { FormItemProps } from '@/components/FormItem.vue';
import Table from '@/components/Table.vue';
import { BE_URL, createEmptyRuleForm, type GenerateFormInterface } from '@/utils';

const tableColumnPropsList: TableColumnProps[] = [
    {
        type: 'default',
        prop: 'ID',
        label: 'ID',
    },
    {
        type: 'default',
        prop: 'Name',
        label: 'Name',
    },
    {
        type: 'default',
        prop: 'Phone',
        label: 'Phone',
    },
    {
        type: 'default',
        prop: 'Email',
        label: 'Email',
    },

    {
        type: 'default',
        prop: 'Address',
        label: 'Address',
    },
    {
        type: 'status',
        prop: 'Status',
        label: 'Status',
        activeText: 'Active',
        inactiveText: 'Inactive',
    },
    {
        type: 'operations',
    },
];
const formItemPropsList: FormItemProps[] = [
    {
        type: 'default',
        prop: 'ID',
        label: 'ID',
        placeholder: 'Please enter an ID',
        notEdittable: true,
    },
    {
        type: 'default',
        prop: 'Name',
        label: 'Name',
        placeholder: 'Please enter a Name',
    },
    {
        type: 'default',
        prop: 'Phone',
        label: 'Phone',
        placeholder: 'Please enter a Phone',
    },
    {
        type: 'default',
        prop: 'Email',
        label: 'Email',
        placeholder: 'Please enter an Email',
    },
    {
        type: 'default',
        prop: 'Address',
        label: 'Address',
        placeholder: 'Please enter an Address',
    },
    {
        type: 'status',
        prop: 'Status',
        label: 'Status',
        activeText: 'Active',
        inactiveText: 'Inactive',
    },
];

const tableRef = ref();
const tableData = ref([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletingObject = ref<any>({});

// Search
const searchInput = ref('');
const searchedString = ref('');

// Form
type RuleForm = GenerateFormInterface<typeof formItemPropsList>;
const ruleForm = reactive<RuleForm>(createEmptyRuleForm(formItemPropsList));
const formRules = reactive<FormRules<RuleForm>>({
    ID: [
        { required: true, message: 'Please input ID', trigger: 'change' },
        { max: 20, message: 'Length should be under 20', trigger: 'change' },
    ],
    Name: [
        { required: true, message: 'Please input Name', trigger: 'change' },
        { max: 200, message: 'Length should be under 200', trigger: 'change' },
    ],
    Phone: [
        { required: true, message: 'Please input Phone', trigger: 'change' },
        {
            pattern: /^\+?[0-9]{1,3}(?:[ -]?[0-9]{2,4}){2,5}$/,
            message: 'Invalid Phone format',
            trigger: 'change',
        },
        { min: 7, max: 20, message: 'Length should be 7 to 20', trigger: 'change' },
    ],
    Email: [
        { required: true, message: 'Please input Email', trigger: 'change' },
        { max: 100, message: 'Length should be under 100', trigger: 'change' },
        { type: 'email', message: 'Please enter a valid email address', trigger: 'change' },
        {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
            trigger: 'change',
        },
    ],
    Address: [
        { required: true, message: 'Please input Address', trigger: 'change' },
        { max: 255, message: 'Length should be under 255', trigger: 'change' },
    ],
});
const ruleFormRef = ref<FormInstance>();

// Perform search when input is empty
watch(searchInput, () => {
    if (!searchInput.value) {
        handleInputBtnClick();
    }
});

const handleInputBtnClick = () => {
    searchedString.value = searchInput.value.trim().toLowerCase();
};
</script>

<template>
    <div style="margin-bottom: 15px">
        <el-input
            style="width: 158px"
            @keydown.enter="handleInputBtnClick"
            placeholder="Search..."
            v-model="searchInput"
            clearable
        />
        <el-button @click="handleInputBtnClick" type="primary" :icon="Search" class="search-btn"
            >Search</el-button
        >
        <el-button @click="tableRef?.openAddModal" type="success" :icon="FolderAdd">Add</el-button>
    </div>

    <Table
        ref="tableRef"
        :table-data="tableData"
        :table-column-props-list="tableColumnPropsList"
        :api="BE_URL + '/api/supplier'"
        :form-item-props-list="formItemPropsList"
        v-model:rule-form="ruleForm"
        v-model:deleting-object="deletingObject"
        :form-rules="formRules"
        v-model:rule-form-ref="ruleFormRef"
        :searched-string="searchedString"
        :delete-confirm-text="`This operation will permanently delete the Supplier Name: ${deletingObject?.Name}. Do you want to continue?`"
        has-pagination
    />
</template>
