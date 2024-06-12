interface dragItemType {
  list: string;
  id: number;
  index: number;
  position?: 'top' | 'bottom';
}

export function useMultipleDragDrop() {
  const over = ref<dragItemType>({ list: '', id: -1, index: -1 });
  const dragFrom = ref(-1);
  const dragging = ref(false);
  const acceptedGroups = ref<string[]>([]);
  const dragoverTimeout = ref<NodeJS.Timeout | null>(null);

  const startDrag = (
    id: number,
    e: DragEvent,
    dropTo?: string[],
    dragGhost?: string,
  ) => {
    if (dragGhost && e.target instanceof Element && e.dataTransfer) {
      const closestElement = e.target.closest(dragGhost);
      if (closestElement) e.dataTransfer.setDragImage(closestElement, 0, 0);
    }

    if (dropTo) {
      acceptedGroups.value = dropTo;
    }
    dragging.value = true;
    dragFrom.value = id;
  };

  const onDragOver = (
    list: string,
    id: number,
    index: number,
    e: DragEvent,
  ) => {
    clearTimeout(dragoverTimeout.value as NodeJS.Timeout);

    const handleDragOver = () => {
      if (dragFrom.value !== id) over.value = { list, id, index, position };
      else {
        onDragLeave(e);
      }
    };

    let position;
    if (!acceptedGroups.value.length || acceptedGroups.value.includes(list)) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (e.clientY < midpoint) position = 'top';
      else position = 'bottom';
      if (over.value.id === id && over.value.position === position) {
        return;
      }
      if (over.value.id === -1) {
        dragoverTimeout.value = setTimeout(handleDragOver, 0);
      } else {
        handleDragOver();
      }
    } else if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'none';
    }
    e.preventDefault();
  };

  const dragEnd = () => {
    over.value = { list: '', id: -1, index: -1 };
    dragFrom.value = -1;
    dragging.value = false;
    clearTimeout(dragoverTimeout.value as NodeJS.Timeout);
  };

  const onDragLeave = (event: DragEvent) => {
    const mouseIsOutSideViewport =
      !event.relatedTarget || (event.clientX === 0 && event.clientY === 0);

    if (mouseIsOutSideViewport) {
      over.value = { list: '', id: -1, index: -1 };

      clearTimeout(dragoverTimeout.value as NodeJS.Timeout);
      return true;
    }

    const rect = (event.currentTarget as any).getBoundingClientRect();
    const withinX = event.clientX >= rect.left && event.clientX <= rect.right;
    const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom;
    const mouseIsOutSideCurrentTarget = !(withinX && withinY);

    if (mouseIsOutSideCurrentTarget) {
      over.value = { list: '', id: -1, index: -1 };
      clearTimeout(dragoverTimeout.value as NodeJS.Timeout);
    }

    return mouseIsOutSideCurrentTarget;
  };

  return {
    over,
    dragFrom,
    dragging,
    startDrag,
    dragEnd,
    onDragOver,
    onDragLeave,
  };
}
