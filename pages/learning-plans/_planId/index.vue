<template>
  <alex-learningplan-page
    :learning-plan="learningPlan"
    :has-permission="hasAccess('learningplan', 'update')"
    @updated="reloadLearningPlanData"
  />
</template>

<script>

import getData from "~/mixins/getData";
import access from "~/mixins/access";

export default {
  name: "LearningPlansPlanIdIndex",
  mixins: [getData, access],
}
</script>
