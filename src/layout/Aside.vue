<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/globalStore';
import pages from './pages';
import RecursivePageList from './RecursivePageList.vue';

const globalStore = useGlobalStore();
const router = useRouter();
const route = useRoute();

const handleMenuSelect = (key: string) => {
    router.push(key);
};
</script>

<template>
    <el-menu
        class="el-menu-vertical h-[100vh] border-0! w-[220px]"
        :collapse="globalStore.isCollapse"
        background-color="#545c64"
        text-color="#eaeaea"
        active-text-color="#409eff"
        :default-active="route.path"
        @select="handleMenuSelect"
    >
        <RecursivePageList :pages="pages" />
    </el-menu>
</template>

<style scoped>
.el-menu-vertical.el-menu--collapse .sub-menu-title {
    display: none;
}
</style>
