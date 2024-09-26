<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search for a book..."
    />
    <button @click="searchBook">🔍</button>
  </div>
</template>

<script>
export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    }
  },
  methods: {
    searchBook() {
      this.$emit('search-book');
    }
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}
</style>s