<template>
  <alex-learningplan-page
    :learning-plan="learningPlan"
    :has-permission="hasAccess('trail', 'update')"
  />
</template>

<script>

import getData from "~/mixins/getData";
import access from "~/mixins/access";

export default {
    name: "LearningPlansTrailIdIndex",
    mixins: [getData, access],

}
</script>
