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
        prop: 'Price',
        label: 'Price',
    },
    {
        type: 'default',
        prop: 'UnitOfMeasurement',
        label: 'Unit',
    },
    {
        type: 'default',
        prop: 'Stock',
        label: 'Stock',
    },
    {
        type: 'default',
        prop: 'ReorderPoint',
        label: 'Reorder',
    },
    {
        type: 'default',
        prop: 'SupplierID',
        label: 'Supplier ID',
    },
    {
        type: 'default',
        prop: 'PromoCode',
        label: 'Promo',
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
        type: 'number',
        prop: 'Price',
        label: 'Price',
        numberSuffix: 'VND',
    },
    {
        type: 'default',
        prop: 'UnitOfMeasurement',
        label: 'Unit',
        placeholder: 'Please enter a Unit of Measurement',
    },
    {
        type: 'number',
        prop: 'Stock',
        label: 'Stock',
    },
    {
        type: 'number',
        prop: 'ReorderPoint',
        label: 'Reorder Point',
    },
    {
        type: 'autocomplete',
        prop: 'SupplierID',
        label: 'Supplier ID',
        placeholder: 'Please enter a Supplier ID',
        autocompleteDataUrl: BE_URL + '/supplier-data',
        autocompleteFilledProps: [],
    },
    {
        type: 'default',
        prop: 'PromoCode',
        label: 'Promo Code',
        placeholder: 'Please enter a Promo Code',
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
        { max: 64, message: 'Length should be under 64', trigger: 'change' },
    ],
    Name: [
        { required: true, message: 'Please input Name', trigger: 'change' },
        { max: 200, message: 'Length should be under 200', trigger: 'change' },
    ],
    UnitOfMeasurement: [
        { required: true, message: 'Please input Unit of Measurement', trigger: 'change' },
        { max: 64, message: 'Length should be under 64', trigger: 'change' },
    ],
    PromoCode: [{ max: 64, message: 'Length should be under 64', trigger: 'change' }],
    Price: [{ required: true, message: 'Please input Price', trigger: 'change' }],
    Stock: [{ required: true, message: 'Please input Stock', trigger: 'change' }],
    ReorderPoint: [{ required: true, message: 'Please input Reorder Point', trigger: 'change' }],
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
        :table-data="tableData"
        :table-column-props-list="tableColumnPropsList"
        :api="BE_URL + '/api/product-information'"
        :form-item-props-list="formItemPropsList"
        v-model:rule-form="ruleForm"
        v-model:deleting-object="deletingObject"
        :form-rules="formRules"
        v-model:rule-form-ref="ruleFormRef"
        :searched-string="searchedString"
        :delete-confirm-text="`This operation will permanently delete the Product Name: ${deletingObject?.Name}. Do you want to continue?`"
        has-pagination
    />
</template>
