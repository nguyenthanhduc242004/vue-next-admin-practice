<script lang="ts" setup>
import { ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

interface ConfirmDialogProps {
    title: string;
    width?: string;
}

withDefaults(defineProps<ConfirmDialogProps>(), {
    width: '500px',
});

const emit = defineEmits(['confirm', 'after-close']);

const dialogVisible = ref(false);
const confirmText = ref('Are you sure you want to proceed?');

defineExpose({
    setVisible: (visible: boolean) => {
        dialogVisible.value = visible;
    },
    setConfirmText: (text: string) => {
        confirmText.value = text;
    },
});
</script>

<template>
    <el-dialog v-model="dialogVisible" :title="title" align-center :width="width">
        <div style="display: flex; align-items: center">
            <el-icon size="24" color="#e6a23c"><WarningFilled /></el-icon>
            <span style="margin: 0 12px">{{ confirmText }}</span>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="emit('confirm')"> Confirm </el-button>
            </div>
        </template>
    </el-dialog>
</template>
