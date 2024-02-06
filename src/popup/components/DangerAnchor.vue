<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits<{
  confirm: []
}>()

const firstClick = ref(false)
const clickHandler = () => {
  if (!firstClick.value) {
    firstClick.value = true
  } else {
    emits('confirm')
  }
}
</script>

<template>
  <div
    class="action-anchor"
    :class="{ 'wait-to-confirm': firstClick }"
    @click="clickHandler"
    @mouseleave="firstClick = false"
  >
    <slot />
  </div>
</template>

<style scoped>
.action-anchor {
  cursor: pointer;
  transition: background-color .3s, color .3s;
  text-align: center;
  color: #f56c6c;
}
.action-anchor:hover {
  text-decoration: underline;
  background-color: #99999922;
}

.action-anchor.wait-to-confirm {
  color: #000;
  background-color: #f56c6c;
}
.action-anchor.wait-to-confirm:hover {
  background-color: #f56c6c;
}
</style>