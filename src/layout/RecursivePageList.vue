<script lang="ts" setup>
defineProps(['pages']);
</script>

<template>
    <template v-for="page in pages" :key="page.path">
        <el-menu-item v-if="!page.children" :index="page.path">
            <el-icon>
                <component :is="page.icon" />
            </el-icon>
            <template #title>{{ page.name }}</template>
        </el-menu-item>

        <el-sub-menu v-else :index="page.path">
            <template #title>
                <el-icon> <component :is="page.icon" /></el-icon>
                <span class="sub-menu-title">{{ page.name }}</span>
            </template>
            <RecursivePageList :pages="page.children" />
        </el-sub-menu>
    </template>
</template>
