<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search for a book..."
    />
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
  flex-grow: 1;
  margin: 0 20px;
}
.search-bar input {
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 30px;
  background: #d9a05b;
}
.search-bar input::placeholder {
  color: black;
}

</style>