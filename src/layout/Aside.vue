<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { House, Setting, List } from '@element-plus/icons-vue';
import { useGlobalStore } from '@/store/globalStore';

const globalStore = useGlobalStore();

const router = useRouter();

const handleMenuSelect = (key: string) => {
  switch (key) {
    case '1':
      router.push('/');
      break;
    case '2-1':
      router.push('/system/menu');
      break;
    case '2-2':
      router.push('/system/system-2');
      break;
    case '2-3':
      router.push('/system/system-3');
      break;
  }
};
</script>

<template>
  <el-menu
    class="el-menu-vertical h-[100vh] border-0! w-[220px]"
    :collapse="globalStore.isCollapse"
    background-color="#545c64"
    text-color="#eaeaea"
    active-text-color="#409eff"
    default-active="1"
    @select="handleMenuSelect"
  >
    <el-menu-item index="1">
      <el-icon><House /></el-icon>
      <template #title>Home</template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>System</span>
      </template>
      <el-menu-item index="2-1">
        <el-icon><List /></el-icon>
        Menu
      </el-menu-item>
      <el-menu-item index="2-2">
        <el-icon><Setting /></el-icon>
        Setting 2
      </el-menu-item>
      <el-menu-item index="2-3">
        <el-icon><Setting /></el-icon>
        Setting 3
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
