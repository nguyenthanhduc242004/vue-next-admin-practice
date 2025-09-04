<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import TableColumn, { type TableColumnProps } from './TableColumn.vue';
import axios from 'axios';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { WarningFilled } from '@element-plus/icons-vue';
import FormItem, { type FormItemProps } from './FormItem.vue';
import {
    BE_URL,
    convertToUtc0IsoString,
    createObjectURL,
    getFullImageUrlPath,
    removeItemByIndex,
    splitCamelCase,
} from '@/utils';

interface TableProps {
    tableColumnPropsList: TableColumnProps[];
    api?: string;
    searchedString?: string;

    formItemPropsList?: FormItemProps[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formRules?: FormRules<any>;
    deleteConfirmText?: string;
    replaceConfirmText?: string;
    hasPagination?: boolean;
    hasBorder?: boolean;
    fontSize?: string;
    primaryKey?: string[];
    formWidth?: string;

    autocompleteDataUrl?: string;

    fetchIdProp?: string;
    fetchId?: string | number | null;
    fetchUrl?: string;

    height?: string;
    preventDestroyDialogOnClose?: boolean;
}
const props = defineProps<TableProps>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ruleForm = defineModel<any>('ruleForm');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletingObject = defineModel<any>('deletingObject');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableData = defineModel<any[]>('tableData', {
    default: () => [],
});
if (tableData.value === undefined || tableData.value === null) {
    tableData.value = [];
}
const ruleFormRef = defineModel<FormInstance | undefined>('ruleFormRef');

// Table
const isTableDataLoading = ref(!!props.api);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const sortingField = ref<string | null>(null);
const sortingOrder = ref<string | null>(null);
const filteredStatus = ref<boolean | null>(null);

const indexToReplace = ref<number | null>(null);
const indexToEdit = ref<number | null>(null);

const title = ref('Add');

const getData = () => {
    if (props.hasPagination) {
        getPageData();
    } else {
        getFullData();
    }
};

const getPageData = () => {
    isTableDataLoading.value = true;
    axios
        .post(props.api + '/page', {
            page: currentPage.value,
            pageSize: pageSize.value,
            field: sortingField.value,
            order: sortingOrder.value,
            search: props.searchedString,
            status: filteredStatus.value,
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.code === 200) {
                tableData.value = response.data.result.records;
                total.value = response.data.result.total;
            } else ElMessage.error('Error fetching page data: ' + response.data.message);
        })
        .catch((error) => {
            ElMessage.error('Error fetching page data: ' + error);
        })
        .finally(() => {
            isTableDataLoading.value = false;
        });
};
const getFullData = () => {
    isTableDataLoading.value = true;
    axios
        .get(props.api + '/data')
        .then((response) => {
            console.log(response.data);
            if (response.data.code === 200) {
                tableData.value = response.data.result;
            } else ElMessage.error('Error fetching full data: ' + response.data.message);
        })
        .catch((error) => {
            ElMessage.error('Error fetching full data: ' + error);
        })
        .finally(() => {
            isTableDataLoading.value = false;
        });
};

onMounted(() => {
    if (props.api) {
        getData();
    }
});

// Get page data when these values change
watch([currentPage, pageSize, total, sortingField, sortingOrder, filteredStatus], () => {
    if (props.api && props.hasPagination) {
        if ((currentPage.value - 1) * pageSize.value + 1 > total.value && total.value > 0) {
            return;
        }
        getPageData();
    }
});

watch(
    () => props.searchedString,
    () => {
        if (props.api && props.hasPagination) {
            getPageData();
        }
    },
);

// Form
const isAdding = ref(false);
const addAndEditDialogVisible = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const edittingObject = ref<any>(null);
const deleteDialogVisible = ref(false);
const replaceDialogVisible = ref(false);

// Image Preview
const imagePreviewDialogVisible = ref(false);
const imagePreviewSrc = ref<string | File | null>(null);
const previewImage = (src: string | File) => {
    if (src) {
        imagePreviewDialogVisible.value = true;
        imagePreviewSrc.value = src;
    }
};

// Add/Edit/Delete
const openAddModal = () => {
    if (props.fetchUrl) {
        if (props.fetchId) {
            axios.get(props.fetchUrl + '/' + props.fetchId).then((response) => {
                if (response.data.code === 200) {
                    if (response.data.result.length >= 1) {
                        handleOpenAddModalLogic();
                    } else {
                        ElMessage.error(
                            splitCamelCase(props.fetchIdProp ?? '') +
                                " does not exist or doesn't supply any products!",
                        );
                    }
                } else {
                    ElMessage.error('Error fetching data: ' + response.data.error);
                }
            });
        } else {
            ElMessage.error(splitCamelCase(props.fetchIdProp ?? '') + ' cannot be empty!');
        }
    } else {
        handleOpenAddModalLogic();
    }
};

const handleOpenAddModalLogic = () => {
    if (props.formItemPropsList) {
        addAndEditDialogVisible.value = true;
        edittingObject.value = null;
        title.value = 'Add';

        if (!isAdding.value) {
            props.formItemPropsList.forEach((item) => {
                ruleForm.value[item.prop] = item.type === 'status' ? true : null;
            });
        }

        isAdding.value = true;
    }
};

const handleSubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            const tableFormItemProps = props.formItemPropsList?.find(
                (item) => item.type === 'table',
            );
            if (tableFormItemProps && ruleForm.value[tableFormItemProps.prop].length === 0) {
                ElMessage.error('Please add a ' + tableFormItemProps.tableDataName);
                return;
            }
            addOrEditData();
        } else {
            return;
        }
    });
};

const addOrEditData = async () => {
    if (props.formItemPropsList) {
        addAndEditDialogVisible.value = false;
        isTableDataLoading.value = true;

        if (props.api) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            if (props.formItemPropsList.some((item) => item.type === 'image' && !item.disabled)) {
                data = new FormData();

                data.append('ID', edittingObject.value.ID);
                props.formItemPropsList.forEach((item) => {
                    if (item.type === 'date')
                        data.append(item.prop, convertToUtc0IsoString(ruleForm.value[item.prop]));
                    else data.append(item.prop, ruleForm.value[item.prop]);
                });
            } else {
                data = { ID: edittingObject.value?.ID };
                props.formItemPropsList.forEach((item) => {
                    // TODO: if use DateString: Add here
                    if (item.type === 'date')
                        data[item.prop] = convertToUtc0IsoString(ruleForm.value[item.prop]);
                    else if (item.type === 'table') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data[item.prop] = ruleForm.value[item.prop].map((productBatch: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const temp: Record<string, any> = {};
                            for (const [key, value] of Object.entries(productBatch)) {
                                if (value instanceof Date)
                                    temp[key] = convertToUtc0IsoString(value);
                                else temp[key] = value;
                            }
                            return temp;
                        });
                    } else data[item.prop] = ruleForm.value[item.prop];
                });
            }

            if (edittingObject.value) {
                axios
                    .post(props.api + '/update', data)
                    .then((response) => {
                        if (response.data.code === 200) {
                            getPageData();
                            console.log(response.data);
                            ElMessage.success('Edit data successfully');
                        } else ElMessage.error('Error editting data: ' + response.data.message);
                    })
                    .catch((error) => {
                        ElMessage.error('Error editting data: ' + error);
                    })
                    .finally(() => {
                        isTableDataLoading.value = false;
                        edittingObject.value = null;
                    });
            } else if (isAdding.value) {
                axios
                    .post(props.api + '/add', data)
                    .then((response) => {
                        if (response.data.code === 200) {
                            getPageData();
                            console.log(response.data);
                            isAdding.value = false;
                            ElMessage.success('Add data successfully');
                        } else ElMessage.error('Error adding data: ' + response.data.message);
                    })
                    .catch((error) => {
                        ElMessage.error('Error adding data: ' + error);
                    })
                    .finally(() => {
                        isTableDataLoading.value = false;
                    });
            }
        } else {
            indexToReplace.value = tableData.value.findIndex((tableDataItem) => {
                return props.primaryKey?.every((prop) => {
                    if (tableDataItem[prop] instanceof Date) {
                        return (
                            tableDataItem[prop].toISOString() === ruleForm.value[prop].toISOString()
                        );
                    }
                    return tableDataItem[prop] === ruleForm.value[prop];
                });
            });
            if (edittingObject.value) {
                indexToEdit.value = tableData.value.findIndex((tableDataItem) => {
                    return props.primaryKey?.every((prop) => {
                        if (tableDataItem[prop] instanceof Date) {
                            return (
                                tableDataItem[prop].toISOString() ===
                                edittingObject.value[prop].toISOString()
                            );
                        }
                        return tableDataItem[prop] === edittingObject.value[prop];
                    });
                });
                if (indexToReplace.value === -1) {
                    tableData.value[indexToEdit.value] = { ...ruleForm.value };
                } else {
                    const hasPrimaryKeyValueChanged = props.primaryKey?.some((prop) => {
                        if (edittingObject.value[prop] instanceof Date) {
                            return (
                                edittingObject.value[prop].toISOString() !==
                                ruleForm.value[prop].toISOString()
                            );
                        }
                        return edittingObject.value[prop] !== ruleForm.value[prop];
                    });
                    if (hasPrimaryKeyValueChanged) {
                        // Hiện dialog hỏi replace
                        replaceDialogVisible.value = true;
                    } else {
                        tableData.value[indexToReplace.value] = { ...ruleForm.value };
                    }
                }

                edittingObject.value = null;
            } else if (isAdding.value) {
                if (indexToReplace.value === -1) {
                    tableData.value.push({ ...ruleForm.value });
                } else {
                    // Hiện dialog hỏi replace
                    replaceDialogVisible.value = true;
                }
                isAdding.value = false;
            }
            isTableDataLoading.value = false;
        }
    }
};

const handleDeleteConfirmBtnClick = () => {
    deleteDialogVisible.value = false;
    isTableDataLoading.value = true;
    deleteData();
};

const handleReplaceConfirmBtnClick = () => {
    replaceDialogVisible.value = false;
    isTableDataLoading.value = true;

    if (indexToReplace.value !== null && indexToReplace.value >= 0) {
        tableData.value[indexToReplace.value] = { ...ruleForm.value };
        indexToReplace.value = null;
    }
    if (indexToEdit.value !== null && indexToEdit.value >= 0) {
        removeItemByIndex(tableData.value, indexToEdit.value);
        indexToEdit.value = null;
    }

    isTableDataLoading.value = false;
};

const deleteData = () => {
    if (props.api) {
        axios
            .post(props.api + '/soft-delete', {
                ID: deletingObject.value.ID,
            })
            .then((response) => {
                if (response.data.code === 200) {
                    getPageData();
                    console.log(response.data);
                    ElMessage.success('Delete data successfully');
                } else ElMessage.error('Error deleting data: ' + response.data.message);
            })
            .catch((error) => {
                ElMessage.error('Error deleting data: ' + error);
            })
            .finally(() => {
                isTableDataLoading.value = false;
                deletingObject.value = null;
            });
    } else {
        const indexToRemove = tableData.value.findIndex((tableDataItem) => {
            return props.primaryKey?.every((prop) => {
                if (tableDataItem[prop] instanceof Date) {
                    return (
                        tableDataItem[prop].toISOString() ===
                        deletingObject.value[prop].toISOString()
                    );
                }
                return tableDataItem[prop] === deletingObject.value[prop];
            });
        });
        removeItemByIndex(tableData.value, indexToRemove);
        isTableDataLoading.value = false;
    }
};

defineExpose({
    openAddModal,
});
</script>

<template>
    <el-table
        v-loading="isTableDataLoading"
        :data="tableData"
        size="large"
        :height="height ? height : '100%'"
        stripe
        :border="hasBorder"
        :style="{
            'font-size': fontSize,
        }"
        @sort-change="
            ({
                prop,
                order,
            }: {
                prop: string | null;
                order: 'ascending' | 'descending' | null;
            }) => {
                sortingField = prop;
                sortingOrder = order;
            }
        "
        @filter-change="
            (newFilters: any) => {
                filteredStatus = newFilters.Status[0];
            }
        "
    >
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
            :expand-heading="item.expandHeading"
            :expand-data-url="item.expandDataUrl"
            :expand-table-column-props-list="item.expandTableColumnPropsList"
            :expand-table-font-size="item.expandTableFontSize"
            @image-click="
                (src) => {
                    previewImage(src);
                }
            "
            @edit-click="
                (rowData) => {
                    edittingObject = rowData;
                    title = 'Edit';
                    isAdding = false;
                    addAndEditDialogVisible = true;

                    formItemPropsList?.forEach((item) => {
                        ruleForm[item.prop] = rowData[item.prop];
                    });
                }
            "
            @delete-click="
                (rowData) => {
                    deletingObject = rowData;
                    deleteDialogVisible = true;
                }
            "
        />
    </el-table>

    <!-- pagination-wrapper -->
    <div v-if="hasPagination" style="margin-top: 15px">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        />
    </div>

    <!-- Add and Edit dialog -->
    <el-dialog
        v-model="addAndEditDialogVisible"
        :title="title"
        :width="formWidth ?? '50%'"
        align-center
        :destroy-on-close="!preventDestroyDialogOnClose"
    >
        <el-form
            ref="ruleFormRef"
            style="width: 100%; padding: 0 4px 14px"
            :model="ruleForm"
            :rules="formRules"
            label-width="auto"
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
                :is-editting="!!edittingObject"
                :not-edittable="item.notEdittable"
                :disabled="item.disabled"
                :number-suffix="item.numberSuffix"
                :autocomplete-data-url="item.autocompleteDataUrl"
                :autocomplete-props="item.autocompleteProps"
                :autocomplete-filled-props="item.autocompleteFilledProps"
                :table-fetch-id-prop="item.tableFetchIdProp"
                :table-fetch-url="item.tableFetchUrl"
                :table-fetch-id="ruleForm[item.tableFetchIdProp ?? ''] ?? fetchId"
                :table-data-name="item.tableDataName"
                :table-column-props-list="item.tableColumnPropsList"
                :table-form-item-props-list="item.tableFormItemPropsList"
                :table-form-rules="item.tableFormRules"
                :table-primary-key="item.tablePrimaryKey"
                @image-click="
                    (formItemValue) => {
                        previewImage(formItemValue);
                    }
                "
                @autocomplete-select="
                    (
                        autocompleteFilledProps: string[],
                        value: Record<string, any>,
                        prop: string,
                    ) => {
                        ruleForm[prop] = value[prop] ?? value.ID;

                        autocompleteFilledProps.forEach((prop) => {
                            ruleForm[prop] = value[prop];
                        });
                    }
                "
                @autocomplete-clear="
                    (autocompleteFilledProps: string[]) => {
                        autocompleteFilledProps.forEach((prop) => {
                            ruleForm[prop] = null;
                        });
                    }
                "
                @autocomplete-id-change="
                    ruleForm[formItemPropsList?.find((item) => item.type === 'table')?.prop ?? ''] =
                        []
                "
            />
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addAndEditDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleSubmitForm(ruleFormRef)">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- Delete dialog -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="Delete"
        align-center
        width="500"
        :after-close="
            () => {
                deletingObject = null;
                deleteDialogVisible = false;
            }
        "
    >
        <div style="display: flex; align-items: center">
            <el-icon size="24" color="#e6a23c"><WarningFilled /></el-icon>
            <span style="margin: 0 12px">{{ deleteConfirmText }}</span>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleDeleteConfirmBtnClick"> Confirm </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- Replace Dialog -->
    <el-dialog v-model="replaceDialogVisible" title="Replace" align-center width="500">
        <div style="display: flex; align-items: center">
            <el-icon size="24" color="#e6a23c"><WarningFilled /></el-icon>
            <span style="margin: 0 12px">{{ replaceConfirmText }}</span>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="replaceDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleReplaceConfirmBtnClick">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- Image preview dialog -->
    <el-dialog
        v-model="imagePreviewDialogVisible"
        align-center
        header-class="imagePreviewDialogHeader"
        body-class="imagePreviewDialogBody"
        style="width: fit-content; height: fit-content"
        append-to-body
        close-on-press-escape
    >
        <el-image
            :src="
                typeof imagePreviewSrc === 'string'
                    ? getFullImageUrlPath(BE_URL, imagePreviewSrc)
                    : createObjectURL(imagePreviewSrc as File)
            "
            alt="Preview Image"
            style="margin: 0 auto; width: 100%; height: 100%"
            fit="contain"
        />
    </el-dialog>
</template>

<style>
.imagePreviewDialogHeader {
    display: none;
}

.imagePreviewDialogBody {
    height: 70vh;
    width: 40vw;
}
</style>
