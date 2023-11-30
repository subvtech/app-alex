import { ref } from 'vue';

export function useDragDrop() {
  const over = ref(-1);
  const dragFrom = ref({});
  const dragging = ref(false);

  const startDrag = (item, e, dragGhost?) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
    dragging.value = true;
    dragFrom.value = item;
    if (dragGhost) e.dataTransfer.setDragImage(dragGhost, 10, 10);
  };

  const finishDrag = (item, pos, list) => {
    if (over.value < 0 || pos < 0) return;
    list.splice(pos, 1);
    list.splice(over.value, 0, item);
    over.value = -1;
    dragging.value = false;
  };

  const onDragOver = (pos, e) => {
    over.value = pos;
    e.dataTransfer.dropEffect = 'move';
    e.preventDefault();
  };

  return {
    over,
    dragFrom,
    dragging,
    startDrag,
    finishDrag,
    onDragOver,
  };
}
