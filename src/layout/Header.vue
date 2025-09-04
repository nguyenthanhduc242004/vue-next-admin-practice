<script setup lang="ts">
import { useGlobalStore } from '@/store/globalStore';
import { capitalizeFirstLetter } from '@/utils';
import { ArrowDown, Fold, FullScreen } from '@element-plus/icons-vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const globalStore = useGlobalStore();

const route = useRoute();
const breadCrumbs = ref(route.path.split('/').filter((p) => p));

watch(route, (newRoute) => {
    breadCrumbs.value = newRoute.path.split('/').filter((p) => p);
});
</script>

<template>
    <div class="bg-[#fff]">
        <div class="flex justify-between border border-solid border-[#f1f2f3]">
            <div class="flex h-[50px] items-center">
                <el-button
                    @click="globalStore.toggleCollapse"
                    class="flex place-content-center cursor-pointer opacity-80 hover:opacity-100 text-[16px] w-[40px] !mx-[12px]"
                >
                    <el-icon><Fold /></el-icon>
                </el-button>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
                    <el-breadcrumb-item
                        v-for="(breadCrumb, index) in breadCrumbs"
                        :key="index"
                        :to="{
                            path: breadCrumbs
                                .filter((b, i) => i <= index)
                                .map((b) => '/' + b)
                                .join(''),
                        }"
                        >{{
                            capitalizeFirstLetter(breadCrumb.replace(/-/g, ' '))
                        }}</el-breadcrumb-item
                    >
                </el-breadcrumb>
            </div>

            <div class="flex !pr-[15px] border-b border-b-solid border-b-[#f1f2f3]">
                <ul class="h-full flex !mr-[10px]">
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                    <li>
                        <button class="nav-button">
                            <el-icon class="nav-icon"><FullScreen /></el-icon>
                        </button>
                    </li>
                </ul>

                <div class="flex items-center">
                    <img
                        class="rounded-full object-contain h-[25px] !mr-[5px]"
                        width="25"
                        height="25"
                        alt="avatar"
                        src="/imgs/avatar.jpg"
                    />
                    <span>admin</span>
                    <el-icon class="!ml-[5px]"><ArrowDown /></el-icon>
                </div>
            </div>
        </div>
        <div class="text-center h-[34px] border-b border-b-solid border-b-[#f1f2f3]">tagsview</div>
    </div>
</template>

<style scoped>
.nav-button {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 100%;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);

        .nav-icon {
            animation: logoAnimation 0.3s ease-in-out;
        }
    }
}

.nav-icon {
    font-size: 16px;
}

@keyframes logoAnimation {
    from {
        scale: 0;
    }
    to {
        scale: 1;
    }
}
</style>
