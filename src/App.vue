<script setup lang="ts">
import { RouterView } from 'vue-router';
import Aside from './layout/Aside.vue';
import Header from './layout/Header.vue';
import 'element-plus/dist/index.css';
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="fit-content">
                <Aside />
            </el-aside>
            <el-container style="background-color: #f7f7f7">
                <el-header style="--el-header-padding: 0; --el-header-height: auto">
                    <Header />
                </el-header>
                <el-main style="--el-main-padding: 15px; height: calc(100vh - 126px)">
                    <div class="wrapper">
                        <RouterView />
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style>
.wrapper {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    background: #fff;
    padding: 15px;
    height: 100%;

    .el-button {
        margin-left: 10px;
    }

    .el-button + .el-button {
        margin-left: 10px;
    }
}
</style>
