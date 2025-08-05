<script setup lang="ts">
import { RouterView } from 'vue-router';
import Aside from './layout/Aside.vue';
import Header from './layout/Header.vue';
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="fit-content">
        <Aside />
      </el-aside>
      <el-container class="bg-[#f7f7f7]">
        <el-header style="--el-header-padding: 0; --el-header-height: auto">
          <Header />
        </el-header>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>
