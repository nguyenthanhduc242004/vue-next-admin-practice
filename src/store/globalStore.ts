import { defineStore } from 'pinia';
import { House, Setting, List } from '@element-plus/icons-vue';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const isCollapse = ref(false);
  function toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  return { isCollapse, toggleCollapse };
});
