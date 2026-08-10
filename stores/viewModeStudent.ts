import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewModeStudentStore = defineStore('view-mode-student', () => {
  const viewAsStudent = ref(false);

  const toggle = () => {
    viewAsStudent.value = !viewAsStudent.value;
  };

  const enable = () => {
    viewAsStudent.value = true;
  };

  const disable = () => {
    viewAsStudent.value = false;
  };

  return {
    viewAsStudent,
    toggle,
    enable,
    disable,
  };
});
