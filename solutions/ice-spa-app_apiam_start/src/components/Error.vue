
<template>
  <div>
    <h1>Error</h1>
    <h2 class="hello">{{error}}</h2>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      default: 'Please return to home'
    }
  }
}
</script>
