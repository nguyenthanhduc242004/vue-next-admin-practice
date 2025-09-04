<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Search, FolderAdd } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import Table from '@/components/Table.vue';
import type { FormItemProps } from '@/components/FormItem.vue';
import type { TableColumnProps } from '@/components/TableColumn.vue';
import {
    addOrEditData,
    BE_URL,
    createEmptyRuleForm,
    deleteData,
    imagePlaceholder,
    isEmptyObject,
    type GenerateFormInterface,
} from '@/utils';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import TableColumn from '@/components/TableColumn.vue';
import FormDialog from '@/components/FormDialog.vue';
import FormItem from '@/components/FormItem.vue';

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
const deleteDialog = ref();
const addOrEditDialog = ref();
const deletingId = ref<string | number | null>(null);
const searchInput = ref('');
const searchedString = ref('');
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
        <el-button
            @click="
                () => {
                    addOrEditDialog.setVisible(true);
                    addOrEditDialog.setTitle('Add');
                    if (!isEmptyObject(addOrEditDialog.getEdittingObject())) {
                        addOrEditDialog.clearRuleForm();
                        addOrEditDialog.setEdittingObject({});
                    }
                }
            "
            type="success"
            :icon="FolderAdd"
            >Add</el-button
        >
    </div>

    <Table ref="tableRef" :api="BE_URL + '/api/staff'" :searched-string="searchedString">
        <TableColumn
            v-for="(item, index) in tableColumnPropsList"
            :key="index"
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :image-width="item.imageWidth"
            :image-height="item.imageHeight"
            :imageFit="item.imageFit"
            :imagePlaceholder="item.imagePlaceholder"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            @image-click="
                (src) => {
                    tableRef.previewImage(src);
                }
            "
            @edit-click="
                (rowData) => {
                    addOrEditDialog.setVisible(true);
                    addOrEditDialog.setTitle('Edit');
                    addOrEditDialog.setRuleForm(rowData);
                    addOrEditDialog.setEdittingObject(rowData);
                }
            "
            @delete-click="
                (rowData) => {
                    deleteDialog.setConfirmText(
                        `This operation will permanently delete the Staff Name: ${rowData?.Name}. Do you want to continue?`,
                    );
                    deleteDialog.setVisible(true);
                    deletingId = rowData.ID;
                }
            "
        />
    </Table>

    <!-- Delete dialog -->
    <ConfirmDialog
        ref="deleteDialog"
        title="Delete"
        @confirm="
            () => {
                deleteData(
                    deletingId!,
                    BE_URL + `/api/staff`,
                    () => {
                        tableRef.getPageData();
                    },
                    () => {
                        tableRef.setLoading(false);
                        deleteDialog.setVisible(false);
                        deletingId = null;
                    },
                );
            }
        "
    />

    <!-- Add dialog -->
    <FormDialog
        ref="addOrEditDialog"
        :form-item-props-list="formItemPropsList"
        :rule-form="ruleForm"
        :form-rules="formRules"
        @submit="
            () => {
                addOrEditData(
                    addOrEditDialog.getEdittingObject().ID,
                    ruleForm,
                    !isEmptyObject(addOrEditDialog.getEdittingObject()),
                    true,
                    BE_URL + `/api/staff`,
                    () => {
                        tableRef.getPageData();
                    },
                    () => {
                        tableRef.setLoading(false);
                        addOrEditDialog.clearRuleForm();
                        addOrEditDialog.setEdittingObject({});
                        addOrEditDialog.setVisible(false);
                    },
                );
            }
        "
    >
        <FormItem
            v-for="(item, index) in formItemPropsList"
            :key="index"
            v-model:form-item-value="ruleForm[item.prop]"
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :placeholder="item.placeholder"
            :image-fit="item.imageFit"
            :image-placeholder="item.imagePlaceholder"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            @image-click="
                (formItemValue) => {
                    tableRef.previewImage(formItemValue);
                }
            "
        />
    </FormDialog>
</template>
