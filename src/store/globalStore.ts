import { defineStore } from 'pinia';
import { House, Setting, List } from '@element-plus/icons-vue';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const isCollapse = ref(false);
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value;
  }

  return { isCollapse, toggleCollapse };
});
