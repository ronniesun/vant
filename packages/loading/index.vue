<template>
  <div class="van-loading" :class="['van-loading--' + type, 'van-loading--' + color]" :style="style">
    <span class="van-loading__spinner" :class="'van-loading__spinner--' + type">
      <i v-for="item in (type === 'spinner' ? 12 : 0)" />
      <svg v-if="type === 'circular'" class="van-loading__circular" viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none"/>
      </svg>
    </span>
  </div>
</template>

<script>
import install from '../utils/install';

export default {
  install,

  name: 'van-loading',

  props: {
    size: String,
    type: {
      type: String,
      default: 'circular'
    },
    color: {
      type: String,
      default: 'black'
    }
  },

  computed: {
    style() {
      return this.size ? {
        width: this.size,
        height: this.size
      } : {};
    }
  }
};
</script>
