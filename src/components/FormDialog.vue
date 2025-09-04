<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormItemProps } from './FormItem.vue';
import type { FormInstance, FormRules } from 'element-plus';

const dialogVisible = ref(false);
const title = ref('Add');

interface FormDialogProps {
    formItemPropsList: FormItemProps[];
    ruleForm?: Record<string, any>;
    formRules?: FormRules<any>;
    destroyOnClose?: boolean;
    width?: string;
}
const props = withDefaults(defineProps<FormDialogProps>(), {
    destroyOnClose: true,
    width: '50%',
});
const emit = defineEmits(['submit']);

// FORM
const ruleFormRef = ref<FormInstance>();

const handleSubmitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('submit');
        } else {
            return;
        }
    });
};

const edittingObject = ref<Record<string, any>>({});

defineExpose({
    setVisible: (visible: boolean) => {
        dialogVisible.value = visible;
    },
    setTitle: (newTitle: string) => {
        title.value = newTitle;
    },
    clearRuleForm: () => {
        if (props.ruleForm) {
            Object.keys(props.ruleForm).forEach((key) => {
                props.ruleForm![key] = '';
            });
        }
    },
    setRuleForm: (newRuleForm: Record<string, any>) => {
        if (props.ruleForm) {
            Object.keys(props.ruleForm).forEach((key) => {
                props.ruleForm![key] = newRuleForm[key];
            });
        }
    },
    setEdittingObject: (obj: Record<string, any>) => {
        edittingObject.value = obj;
    },
    getEdittingObject: () => edittingObject.value,
});
</script>
<template>
    <!-- Add and Edit dialog -->
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        :width="width"
        align-center
        :destroy-on-close="destroyOnClose"
    >
        <el-form
            ref="ruleFormRef"
            style="width: 100%; padding: 0 4px 14px"
            :model="ruleForm"
            :rules="formRules"
            label-width="auto"
        >
            <slot></slot>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleSubmitForm(ruleFormRef)">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
