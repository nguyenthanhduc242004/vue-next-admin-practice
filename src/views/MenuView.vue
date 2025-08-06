<script setup lang="ts">
import { Search, FolderAdd, WarningFilled } from '@element-plus/icons-vue';
import { reactive, ref, watch } from 'vue';
import { useDateFormat, useNow } from '@vueuse/core';
import type { FormInstance, FormRules } from 'element-plus';

type Data = {
  no: number;
  name: string;
  role: string;
  type: number;
  status: number;
  description: string;
  date: string;
};

const tableData: Data[] = [
  {
    no: 1,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 0,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 2,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 1,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 3,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 2,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 4,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 3,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 5,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 4,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 6,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 5,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 7,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 6,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 8,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 7,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 9,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 8,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 10,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 9,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 11,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 10,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 12,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 11,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 13,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 12,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 14,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 13,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 15,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 14,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 16,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 15,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 17,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 16,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 18,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 17,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 19,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 18,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 20,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 19,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 21,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 20,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 22,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 21,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 23,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 22,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 24,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 23,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 25,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 24,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 26,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 25,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 27,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 26,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 28,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 27,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 29,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 28,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 30,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 29,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 31,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 30,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 32,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 31,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 33,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 32,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 34,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 33,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 35,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 34,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 36,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 35,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
  {
    no: 37,
    name: 'Alice Johnson',
    role: 'Project Manager',
    type: 36,
    status: 1,
    description: 'Project Manager 1',
    date: '2025-08-01',
  },
  {
    no: 38,
    name: 'Bob Williams',
    role: 'Software Engineer',
    type: 37,
    status: 1,
    description: 'Software Engineer 2',
    date: '2025-08-03',
  },
  {
    no: 39,
    name: 'Charlie Brown',
    role: 'UX Designer',
    type: 38,
    status: 1,
    description: 'UX Designer 3',
    date: '2025-07-28',
  },
  {
    no: 40,
    name: 'Diana Prince',
    role: 'QA Tester',
    type: 39,
    status: 0,
    description: 'QA Tester 4',
    date: '2025-08-02',
  },
];
let nextNo = tableData.length + 1;

// Search
const filteredTableData = ref(tableData);
const searchInput = ref('');
watch(searchInput, () => {
  if (!searchInput.value) {
    handleInputBtnClick();
  }
});
const handleInputBtnClick = () => {
  const input = searchInput.value.trim().toLowerCase();
  filteredTableData.value = tableData.filter((data) => {
    return (
      String(data.no).toLowerCase().includes(input) ||
      data.name.toLowerCase().includes(input) ||
      data.role.toLowerCase().includes(input) ||
      String(data.type).toLowerCase().includes(input) ||
      (data.status === 1 && 'active'.includes(input)) ||
      (data.status === 0 && 'disabled'.includes(input)) ||
      data.description.toLowerCase().includes(input) ||
      data.date.toLowerCase().includes(input)
    );
  });
};

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

// Dialog
const optionsInput = ref();
const optionsData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
];

// Add and Edit Dialog
const addAndEditDialogVisible = ref(false);

interface RuleForm {
  name: string;
  role: string;
  type: number;
  status: boolean;
  description: string;
}
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: '',
  role: '',
  type: 0,
  status: true,
  description: '',
});
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input name', trigger: 'blur' },
    { required: true, message: 'Please input name', trigger: 'change' },
  ],
  role: [
    { required: true, message: 'Please input role', trigger: 'blur' },
    { required: true, message: 'Please input role', trigger: 'change' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      addOrEditData();
    } else {
      return;
    }
  });
};

const addOrEditData = () => {
  addAndEditDialogVisible.value = false;

  if (edittingNo.value >= 0) {
    const edittingData = tableData.find((data) => data.no === edittingNo.value);
    if (!edittingData) {
      console.log('No data found!');
      return;
    }
    edittingData.name = ruleForm.name;
    edittingData.role = ruleForm.role;
    edittingData.type = ruleForm.type;
    edittingData.status = ruleForm.status ? 1 : 0;
    edittingData.description = ruleForm.description;

    edittingNo.value = -1;
    ruleForm.name = '';
    ruleForm.role = '';
    ruleForm.type = 0;
    ruleForm.status = true;
    ruleForm.description = '';
  } else if (isAdding) {
    const newData: Data = {
      no: nextNo++,
      name: ruleForm.name,
      role: ruleForm.role,
      type: ruleForm.type,
      status: ruleForm.status ? 1 : 0,
      description: ruleForm.description,
      date: useDateFormat(useNow(), 'YYYY-MM-DD').value,
    };

    tableData.push(newData);

    isAdding.value = false;
  }

  handleInputBtnClick();
};

//// Add
const isAdding = ref(false);
const handleAddBtnClick = () => {
  addAndEditDialogVisible.value = true;
  edittingNo.value = -1;

  if (!isAdding.value) {
    ruleForm.name = '';
    ruleForm.role = '';
    ruleForm.type = 0;
    ruleForm.status = true;
    ruleForm.description = '';
  }
  isAdding.value = true;
};

//// Edit
const edittingNo = ref(-1);
const handleEditBtnClick = (data: Data) => {
  addAndEditDialogVisible.value = true;
  isAdding.value = false;

  edittingNo.value = data.no;

  ruleForm.name = data.name;
  ruleForm.role = data.role;
  ruleForm.type = data.type;
  ruleForm.status = data.status === 1 ? true : false;
  ruleForm.description = data.description;
};

//// Delete
const deleteDialogVisible = ref(false);
const deletingNo = ref(-1);
const deletingName = ref('');

const handleDeleteBtnClick = (data: Data) => {
  deleteDialogVisible.value = true;
  deletingNo.value = data.no;
  deletingName.value = data.name;
};

const handleCloseDeleteDialog = () => {
  deletingNo.value = -1;
  deleteDialogVisible.value = false;
};

const handleDeleteConfirmBtnClick = () => {
  deleteDialogVisible.value = false;

  if (deletingNo.value < 0) {
    console.log('No data found!');
    return;
  }
  tableData.splice(
    tableData.findIndex((data) => data.no === deletingNo.value),
    1,
  );

  handleInputBtnClick();
};
</script>

<template>
  <div class="wrapper">
    <div class="!mb-[15px]">
      <el-input
        class="!w-[158px]"
        @keydown.enter="handleInputBtnClick"
        placeholder="Search..."
        v-model="searchInput"
        clearable
      />
      <el-button @click="handleInputBtnClick" type="primary" :icon="Search" class="!ml-[10px]">Search</el-button>
      <el-button @click="handleAddBtnClick" type="success" :icon="FolderAdd">Add</el-button>
    </div>

    <el-table :data="filteredTableData" size="large" height="100%">
      <el-table-column prop="no" label="No." width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="role" label="Role" />
      <el-table-column prop="type" label="Type" />
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
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEditBtnClick(scope.row)">Edit</el-button>
          <el-button link type="primary" size="small" @click="handleDeleteBtnClick(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper !mt-[15px]">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      />
    </div>
  </div>

  <!-- Add and Edit dialog -->
  <el-dialog
    v-model="addAndEditDialogVisible"
    :title="edittingNo >= 0 ? 'Edit' : 'Add'"
    width="729"
    align-center
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      style="width: 100%; padding: 0 4px 14px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="Name" prop="name" class="form-item">
            <el-input clearable placeholder="Please enter a name" v-model="ruleForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Role" prop="role" class="form-item">
            <el-input clearable placeholder="Please enter a role" v-model="ruleForm.role" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Type" prop="type" class="form-item">
            <el-input-number v-model="ruleForm.type" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" prop="status" class="form-item">
            <el-switch v-model="ruleForm.status" inline-prompt active-text="Active " inactive-text="Disabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="Description" prop="description" class="form-item">
            <el-input
              v-model="ruleForm.description"
              :rows="2"
              type="textarea"
              placeholder="Please enter a description..."
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="Options" class="form-item">
            <el-tree-select
              v-model="optionsInput"
              :data="optionsData"
              multiple
              :render-after-expand="false"
              show-checkbox
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Delete dialog -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="Delete"
    align-center
    width="440"
    :after-close="handleCloseDeleteDialog"
  >
    <div class="flex items-center">
      <el-icon size="24" color="#e6a23c"><WarningFilled /></el-icon>
      <span class="!mx-[12px]"
        >This operation will permanently delete the name: "{{ deletingName }}". Do you want to continue?</span
      >
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDeleteConfirmBtnClick"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
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
}

.el-button + .el-button {
  margin-left: 10px;
}

.form-item {
  margin-bottom: 20px;
}
</style>
