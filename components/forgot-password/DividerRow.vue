<template>
  <div id="orRow" class="mb-10">
    <div class="orLine"></div>
    <div id="orText">{{ $t('components.sendResetPassword.divider') }}</div>
    <div class="orLine"></div>
  </div>
</template>

<style>
#orRow {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.orLine {
  width: 100%;
  height: 1px;
  background-color: #fff;
}

#orText {
  margin: 0 10px;
  color: #fff;
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
}
</style>
