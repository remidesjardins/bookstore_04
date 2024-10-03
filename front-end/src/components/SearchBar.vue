<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
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
    /**
     * Emit the search query to the parent component.
     * @param {string} query - The search query entered by the user.
     * @returns {void}
     */
    emitSearch(query) {
      this.$emit("search", query);
    }
  },
  computed: {
    /**
     * Filter the list of books based on the search query.
     * @returns {Array} - An array of books that match the search query.
     */
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
/* Styling for the search bar container */
.search-bar {
  flex-grow: 1;
  margin: 0 1.25rem;
}

/* Styling for the input field inside the search bar */
.search-bar input {
  width: 90%;
  padding: .625rem;
  font-size: 1rem;
  border: .125rem solid black;
  border-radius: 1.875rem;
  background: #d9a05b;
}

/* Styling for the placeholder text inside the input field */
.search-bar input::placeholder {
  color: black;
}

</style>