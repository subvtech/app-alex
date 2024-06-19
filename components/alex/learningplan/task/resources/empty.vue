<template>
  <div class="d-flex flex-column align-center justify-center ga-1 text-center">
    <img class="mb-[6px]" src="/svg/NoTrails.svg" alt="No trails" />
    <p class="max-w-[250px] text-body-2 text-gray-800">
      {{
        $t('components.learningPlan.drawer.task.learningResources.emptyTitle')
      }}
    </p>
    <p class="max-w-[250px] text-body-5 text-gray-800">
      {{
        $t(
          'components.learningPlan.drawer.task.learningResources.emptySubtitle',
        )
      }}
    </p>
  </div>
</template>
