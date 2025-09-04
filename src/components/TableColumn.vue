<script lang="ts" setup>
// eslint-disable-next-line vue/no-dupe-keys
import { BE_URL, dateFormat, getFullImageUrlPath, imagePlaceholder } from '@/utils';
import { useDateFormat } from '@vueuse/core';
import Table from './Table.vue';

export interface TableColumnProps {
    type: 'default' | 'image' | 'date' | 'datetime' | 'status' | 'operations' | 'expand';
    prop?: string;
    label?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageFit?: string;
    imagePlaceholder?: string;
    activeText?: string;
    inactiveText?: string;
    expandHeading?: string;
    expandDataUrl?: string;
    expandTableColumnPropsList?: TableColumnProps[];
    expandTableFontSize?: string;
}
defineProps<TableColumnProps>();
const emit = defineEmits(['image-click', 'edit-click', 'delete-click']);
</script>

<template>
    <el-table-column v-if="type === 'default'" :prop="prop" :label="label" sortable />

    <el-table-column v-else-if="type === 'image'" :prop="prop" :label="label">
        <template #default="scope">
            <el-image
                :src="
                    scope.row[prop]
                        ? getFullImageUrlPath(BE_URL, scope.row[prop])
                        : imagePlaceholder
                "
                :fit="imageFit"
                alt="Image"
                :style="{
                    width: imageWidth,
                    height: imageHeight,
                    cursor: scope.row[prop] ? 'pointer' : 'default',
                }"
                @click="scope.row[prop] && emit('image-click', scope.row[prop])"
            />
        </template>
    </el-table-column>

    <el-table-column
        v-if="type === 'date'"
        :prop="prop"
        :label="label"
        sortable
        :formatter="
            (row: any, column: any, cellValue: Date, index: number) => {
                if (cellValue) {
                    if (typeof cellValue === 'string')
                        return useDateFormat(new Date(cellValue), dateFormat).value;
                    else return useDateFormat(cellValue, dateFormat).value;
                }
                return '';
            }
        "
    />

    <el-table-column
        v-if="type === 'datetime'"
        :prop="prop"
        :label="label"
        sortable
        :formatter="
            (row: any, column: any, cellValue: Date, index: number) => {
                if (cellValue) {
                    if (typeof cellValue === 'string')
                        return useDateFormat(new Date(cellValue), dateFormat).value;
                    else return useDateFormat(cellValue, dateFormat).value;
                }
                return '';
            }
        "
    />

    <el-table-column
        v-else-if="type === 'status'"
        :prop="prop"
        :label="label"
        :filter-multiple="false"
        filter-class-name="text-[#606266]"
        column-key="Status"
        :filters="[
            { text: activeText, value: true },
            { text: inactiveText, value: false },
        ]"
    >
        <template #default="scope">
            <span
                class="status-box"
                :class="{
                    'status-box--active': scope.row[prop],
                    'status-box--disabled': !scope.row[prop],
                }"
                >{{ scope.row[prop] ? activeText : inactiveText }}</span
            >
        </template>
    </el-table-column>

    <el-table-column
        v-else-if="type === 'operations'"
        label="Operations"
        width="120"
        align="center"
        header-align="center"
    >
        <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="emit('edit-click', scope.row)"
                style="margin-left: 0"
                >Edit</el-button
            >
            <el-button link type="primary" size="small" @click="emit('delete-click', scope.row)"
                >Delete</el-button
            >
        </template>
    </el-table-column>

    <el-table-column v-else-if="type === 'expand'" type="expand">
        <template #default="props">
            <div style="margin: 0 40px">
                <h3
                    style="font-size: 16px; font-weight: bold; margin-left: 4px; margin-bottom: 4px"
                >
                    {{ expandHeading }}
                </h3>
                <Table
                    ref="tableRef"
                    :table-column-props-list="expandTableColumnPropsList"
                    :api="`${expandDataUrl}/${props.row.ID}`"
                    :has-pagination="false"
                    :font-size="expandTableFontSize"
                    :has-border="true"
                />
            </div>
        </template>
    </el-table-column>
</template>

<style scoped>
.status-box {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: fit-content;
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 8px;
}

.status-box.status-box--active {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
}

.status-box.status-box--disabled {
    background-color: #ffcccc;
    border-color: #ff9999;
    color: #ff0000;
}
</style>
