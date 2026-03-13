<script setup>
defineProps({
  path: { type: String, required: true },
  size: { type: [String, Number], default: 24 },
  viewbox: { type: String, default: '0 0 24 24' },
  spinning: { type: Boolean, default: false }
});
</script>

<template>
  <svg
    :class="['icon', { 'icon-spinning': spinning }]"
    :height="size"
    :viewBox="viewbox"
    :width="size"
  >
    <path :d="path" fill="inherit" />
  </svg>
</template>

<style scoped>
.icon {
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.2s;
}

.icon-spinning {
  animation: icon-spin 1s infinite linear;
}

@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
