<template>
  <alex-learningplan-list
    :learning-plans="learningPlan.trails"
    :parent-learning-plan="learningPlan"
    @updated="reloadLearningPlanData"
  />

</template>

<script>

import getData from "~/mixins/getData";
import access from "~/mixins/access";

export default {
    name: "LearningPlansTrailsIndex",
    mixins: [getData, access],

}
</script>
