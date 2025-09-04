<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Search, FolderAdd } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import Table from '@/components/Table.vue';
import type { FormItemProps } from '@/components/FormItem.vue';
import type { TableColumnProps } from '@/components/TableColumn.vue';
import { BE_URL, createEmptyRuleForm, imagePlaceholder, type GenerateFormInterface } from '@/utils';

const tableColumnPropsList: TableColumnProps[] = [
    {
        type: 'image',
        prop: 'ImageUrl',
        label: 'Image',
        imageWidth: '100px',
        imageHeight: '100px',
        imageFit: 'cover',
        imagePlaceholder: imagePlaceholder,
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
        prop: 'Role',
        label: 'Role',
    },
    {
        type: 'date',
        prop: 'Dob',
        label: 'Dob',
    },
    {
        type: 'status',
        prop: 'IsWorking',
        label: 'Status',
        activeText: 'Working',
        inactiveText: 'Terminated',
    },
    {
        type: 'datetime',
        prop: 'CreatedTime',
        label: 'Created Time',
    },
    {
        type: 'operations',
    },
];
const formItemPropsList: FormItemProps[] = [
    {
        type: 'image',
        prop: 'ImageUrl',
        label: 'Image',
        imageFit: 'contain',
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
        prop: 'Role',
        label: 'Role',
        placeholder: 'Please enter a Role',
    },
    {
        type: 'date',
        prop: 'Dob',
        label: 'Dob',
        placeholder: 'Please select a Date of Birth',
    },
    {
        type: 'status',
        prop: 'IsWorking',
        label: 'Status',
        activeText: 'Working',
        inactiveText: 'Terminated',
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
    Role: [{ max: 50, message: 'Length should be under 50', trigger: 'change' }],
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
        :api="BE_URL + '/api/staff'"
        :form-item-props-list="formItemPropsList"
        v-model:rule-form="ruleForm"
        v-model:deleting-object="deletingObject"
        :form-rules="formRules"
        v-model:rule-form-ref="ruleFormRef"
        :searched-string="searchedString"
        :delete-confirm-text="`This operation will permanently delete the Staff Name: ${deletingObject?.Name}. Do you want to continue?`"
        has-pagination
    />
</template>
