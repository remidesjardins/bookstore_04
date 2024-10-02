<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="emitSearch($event.target.value)"
        placeholder="Search for a book..."
    />
  </div>
</template>

<script>
export default {
  props: ["searchQuery"],
  methods: {
    emitSearch(query) {
      this.$emit("search", query);
    }
  },
  computed: {
    filteredBooks() {
      console.log("Test SearchBar");
      // Only return books that match the search query
      if (this.searchQuery.trim() === "") {
        return this.books;
      }
      return this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase());
      });
    },
  }
};
</script>

<style scoped>
.search-bar {
  flex-grow: 1;
  margin: 0 1.25rem;
}
.search-bar input {
  width: 90%;
  padding: .625rem;
  font-size: 1rem;
  border: .125rem solid black;
  border-radius: 1.875rem;
  background: #d9a05b;
}
.search-bar input::placeholder {
  color: black;
}

</style>