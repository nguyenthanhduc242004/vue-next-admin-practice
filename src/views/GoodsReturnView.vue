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
        type: 'expand',
        expandHeading: 'Goods Return Details: ',
        expandDataUrl: `${BE_URL}/api/goods-return-detail`,
        expandTableFontSize: '13px',
        expandTableColumnPropsList: [
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
                prop: 'Quantity',
                label: 'Quantity',
            },
        ],
    },
    {
        type: 'default',
        prop: 'ID',
        label: 'ID',
    },
    {
        type: 'default',
        prop: 'SupplierID',
        label: 'Supplier ID',
    },
    {
        type: 'default',
        prop: 'StaffName',
        label: 'Staff Name',
    },
    {
        type: 'default',
        prop: 'StaffPhone',
        label: 'Staff Phone',
    },
    {
        type: 'default',
        prop: 'TotalAmount',
        label: 'Total Amount',
    },
    {
        type: 'default',
        prop: 'TotalCost',
        label: 'Total Cost',
    },
    {
        type: 'date',
        prop: 'CreatedDate',
        label: 'Receipt Date',
    },
];
const formItemPropsList: FormItemProps[] = [
    {
        type: 'autocomplete',
        prop: 'SupplierID',
        label: 'Supplier ID',
        placeholder: 'Please enter a Supplier ID',
        autocompleteDataUrl: BE_URL + '/supplier-data',
        autocompleteFilledProps: [],
    },
    {
        type: 'table',
        prop: 'GoodsReceiptDetails',
        label: 'Batches',
        tableFetchIdProp: 'SupplierID',
        tableFetchUrl: BE_URL + '/product-data-by-supplier-id',
        tableDataName: 'Product Batch',
        tablePrimaryKey: ['ProductID', 'ExpiryDate', 'CostPrice'],
        tableColumnPropsList: [
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
                prop: 'Quantity',
                label: 'Quantity',
            },
            {
                type: 'operations',
            },
        ],
        tableFormItemPropsList: [
            {
                type: 'select',
                prop: 'ProductID',
                label: 'Product Batch',
                placeholder: 'Please select a Product Batch',
                autocompleteDataUrl: BE_URL + '/batch-data-by-supplier-id',
                autocompleteProps: ['ProductID', 'ExpiryDate', 'CostPrice', 'Stock'],
                autocompleteFilledProps: [
                    'ImageUrl',
                    'Name',
                    'UnitOfMeasurement',
                    'ExpiryDate',
                    'CostPrice',
                    'Stock',
                ],
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
                disabled: true,
            },
            {
                type: 'number',
                prop: 'CostPrice',
                label: 'Cost Price',
                numberSuffix: 'VND',
                disabled: true,
            },
            {
                type: 'number',
                prop: 'Stock',
                label: 'Stock',
                disabled: true,
            },
            {
                type: 'number',
                prop: 'Quantity',
                label: 'Quantity',
            },
        ],
        tableFormRules: {
            ProductID: [{ required: true, message: 'Please select Product ID', trigger: 'change' }],
            Quantity: [{ required: true, message: 'Please input Quantity', trigger: 'change' }],
        },
    },
];

const tableRef = ref();

// Search
const searchInput = ref('');
const searchedString = ref('');

type RuleForm = GenerateFormInterface<typeof formItemPropsList>;
const ruleForm = reactive<RuleForm>(createEmptyRuleForm(formItemPropsList));
const formRules = reactive<FormRules<RuleForm>>({
    SupplierID: [
        { required: true, message: 'Please input Supplier ID', trigger: 'change' },
        { max: 20, message: 'Length should be under 20', trigger: 'change' },
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
        :table-column-props-list="tableColumnPropsList"
        :api="BE_URL + '/api/goods-return'"
        :form-item-props-list="formItemPropsList"
        v-model:rule-form="ruleForm"
        :form-rules="formRules"
        v-model:rule-form-ref="ruleFormRef"
        has-pagination
        form-width="68%"
        :searched-string="searchedString"
        prevent-destroy-dialog-on-close
    />
</template>
