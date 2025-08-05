<script setup lang="ts">
import { Search, FolderAdd } from '@element-plus/icons-vue';
import { ref } from 'vue';
import type { ComponentSize } from 'element-plus';

const currentPage = ref(1);
const pageSize = ref(10);
const disabled = ref(false);
const background = ref(true);
const size = ref<ComponentSize>('default');

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

const tableData = [
  {
    no: 1,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 0,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 2,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 1,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 3,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 2,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 4,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 3,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 5,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 4,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 6,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 5,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 7,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 6,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 8,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 7,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 9,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 8,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 10,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 9,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 11,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 10,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 12,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 11,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 13,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 12,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 14,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 13,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 15,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 14,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 16,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 15,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 17,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 16,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 18,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 17,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 19,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 18,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 20,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 19,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 21,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 20,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 22,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 21,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 23,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 22,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 24,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 23,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 25,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 24,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 26,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 25,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 27,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 26,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 28,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 27,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 29,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 28,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 30,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 29,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 31,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 30,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 32,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 31,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 33,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 32,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 34,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 33,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 35,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 34,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 36,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 35,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 37,
    name: 'Alice Johnson',
    role: 'Project Manager',
    sequence: 36,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 38,
    name: 'Bob Williams',
    role: 'Software Engineer',
    sequence: 37,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 39,
    name: 'Charlie Brown',
    role: 'UX Designer',
    sequence: 38,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 40,
    name: 'Diana Prince',
    role: 'QA Tester',
    sequence: 39,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
];
</script>

<template>
  <div class="wrapper">
    <div class="!mb-[15px]">
      <el-input class="!w-[158px]" placeholder="Search..." />
      <el-button type="primary" :icon="Search" class="!ml-[10px]">Search</el-button>
      <el-button type="success" :icon="FolderAdd">Upload</el-button>
    </div>

    <el-table :data="tableData" size="large">
      <el-table-column prop="no" label="No." width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="role" label="Role" />
      <el-table-column prop="sequence" label="Sequence" />
      <el-table-column prop="status" label="Status">
        <template #default="scope">
          <span
            class="flex items-center justify-center text-center w-[fit-content] h-[32px] border border-solid rounded-[4px] !px-[8px]"
            :class="{
              'bg-[#f0f9eb] border-[#e1f3d8] text-[#67c23a]': scope.row.status,
              'bg-[#ffcccc] border-[#ff9999] text-[#ff0000]': !scope.row.status,
            }"
            >{{ scope.row.status ? 'Active' : 'Disabled' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="date" label="Date" />
      <el-table-column label="Operations" width="110">
        <template #default>
          <el-button link type="primary" size="small">Edit</el-button>
          <el-button link type="primary" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper !mt-[15px]">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="30"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  background: #fff;
  padding: 15px;
  height: calc(100vh - 126px);
  overflow: hidden;
}

.el-button + .el-button {
  margin-left: 10px;
}
</style>
