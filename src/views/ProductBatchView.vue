<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Search, FolderAdd } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { BE_URL, createEmptyRuleForm, imagePlaceholder, type GenerateFormInterface } from '@/utils';
import type { TableColumnProps } from '@/components/TableColumn.vue';
import type { FormItemProps } from '@/components/FormItem.vue';
import Table from '@/components/Table.vue';

const tableColumnPropsList: TableColumnProps[] = [
    {
        type: 'image',
        prop: 'ImageUrl',
        label: 'Image',
        imageWidth: '50px',
        imageHeight: '50px',
        imageFit: 'cover',
        imagePlaceholder: imagePlaceholder,
    },
    {
        type: 'default',
        prop: 'ProductID',
        label: 'Product ID',
    },
    {
        type: 'default',
        prop: 'Name',
        label: 'Name',
    },
    {
        type: 'default',
        prop: 'UnitOfMeasurement',
        label: 'Unit',
    },
    {
        type: 'date',
        prop: 'ExpiryDate',
        label: 'Expiry Date',
    },
    {
        type: 'default',
        prop: 'CostPrice',
        label: 'Cost Price',
    },
    {
        type: 'default',
        prop: 'Stock',
        label: 'Stock',
    },
    {
        type: 'operations',
    },
];
const formItemPropsList: FormItemProps[] = [
    {
        type: 'autocomplete',
        prop: 'ProductID',
        label: 'Product ID',
        placeholder: 'Please enter a Product ID',
        autocompleteDataUrl: BE_URL + '/product-data',
        autocompleteFilledProps: ['ImageUrl', 'Name', 'UnitOfMeasurement'],
    },
    {
        type: 'image',
        prop: 'ImageUrl',
        label: 'Image',
        imageFit: 'contain',
        imagePlaceholder: imagePlaceholder,
        disabled: true,
    },
    {
        type: 'default',
        prop: 'Name',
        label: 'Name',
        placeholder: 'Not found',
        disabled: true,
    },
    {
        type: 'default',
        prop: 'UnitOfMeasurement',
        label: 'Unit',
        placeholder: 'Not found',
        disabled: true,
    },
    {
        type: 'date',
        prop: 'ExpiryDate',
        label: 'Expiry Date',
    },
    {
        type: 'number',
        prop: 'CostPrice',
        label: 'Cost Price',
        numberSuffix: 'VND',
    },
    {
        type: 'number',
        prop: 'Stock',
        label: 'Stock',
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
    ProductID: [
        { required: true, message: 'Please input Product ID', trigger: 'change' },
        { max: 64, message: 'Length should be under 64', trigger: 'change' },
    ],
    ExpiryDate: [{ required: true, message: 'Please input Expiry Date', trigger: 'change' }],
    CostPrice: [{ required: true, message: 'Please input Cost Price', trigger: 'change' }],
    Stock: [{ required: true, message: 'Please input Stock', trigger: 'change' }],
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
        :api="BE_URL + '/api/product-batch'"
        :form-item-props-list="formItemPropsList"
        v-model:rule-form="ruleForm"
        :form-rules="formRules"
        v-model:rule-form-ref="ruleFormRef"
        v-model:deleting-object="deletingObject"
        :searched-string="searchedString"
        :delete-confirm-text="`This operation will permanently delete the Product Name: ${deletingObject?.Name}. Do you want to continue?`"
        has-pagination
    />
</template>
