<template>
  <v-container fluid>
    <span>
      <div class="container" width="100%" height="47">
        <div class="inner-container">
          <v-checkbox id="checkboxes" :model-value="true" color="#00B7CC" />
        </div>
        <div class="inner-text">
          <span class="title">{{ label }}</span>
          <span class="hint">{{ hint }}</span>
        </div>
      </div>
    </span>
    <span>
      <div class="container" width="100%" height="47">
        <div class="inner-container">
          <v-checkbox :model-value="false" />
        </div>
        <div class="inner-text">
          <span>{{ label }}</span>
          <span class="hint">{{ hint }}</span>
        </div>
      </div>
    </span>
    <span>
      <div class="container" width="100%" height="47">
        <div class="inner-container">
          <v-checkbox indeterminate color="#00B7CC" value="#00B7CC" />
        </div>
        <div class="inner-text">
          <span>{{ label }}</span>
          <span class="hint">{{ hint }}</span>
        </div>
      </div>
    </span>
    <span>
      <div class="container" width="100%" height="47">
        <div class="inner-container">
          <v-checkbox :model-value="true" disabled />
        </div>
        <div class="inner-text">
          <span>{{ label }}</span>
          <span class="hint">{{ hint }}</span>
        </div>
      </div>
    </span>
    <span>
      <div class="container" width="100%" height="47">
        <div class="inner-container">
          <v-checkbox :model-value="false" disabled />
        </div>
        <div class="inner-text">
          <span>{{ label }}</span>
          <span class="hint">{{ hint }}</span>
        </div>
      </div>
    </span>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';

const label = ref('Text value');
const hint = ref('Hint');
</script>
<style scoped>
v-container {
  font-family: Sen !important;
}

.container {
  display: flex;
  align-items: center;
  margin-top: 16px;
  width: 113px;
  height: 47px;
  justify-content: flex-start;
}

.title {
  font-size: 16px;
  font-weight: 400;
  line-height: 21.6px;
  letter-spacing: 2%;
}

.inner-text {
  display: flex;
  flex-direction: column;
  min-width: 81px;
  margin-left: 16px;
}

.hint {
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  letter-spacing: 2%;
  color: #6e7a87;
}
</style>
