<template>
  <Header v-model:searchQuery="searchQuery" @search="updateSearchQuery" @showAddBookForm="showAddBookForm" />
  <div class="category-popup">
    <span class="close-button" @click="closePopup">❌</span>
    <h3>Books in {{ category }}</h3>
    <BookList :bookList="filteredBook" @bookSelected="showBookDetailsOverlay" @toggleFavorite="toggleFavorite" />
  </div>
</template>

<script>
import BookList from '../components/BookList.vue';  // Ensure BookList is imported correctly
import Header from '../components/Header.vue';

export default {
  props: ['category'],
  data() {
    return {
      filteredBooks: [],
      searchQuery: "",
    };
  },
  watch: {
    category: 'filterBooksByCategory',
    books: 'filterBooksByCategory'
  },
  mounted() {
    this.filterBooksByCategory();
  },
  methods: {
    filterBooksByCategory() {
      console.log("All Books:", this.books);
      console.log("Selected Category:", this.category);
      if (this.books && Array.isArray(this.books)) {
        this.filteredBooks = this.books.filter(book => book.category === this.category);
        console.log("Filtered Books:", this.filteredBooks);
      }
    },
    closePopup() {
      this.$router.push('/');
    },
    showBookDetailsOverlay(book) {
      this.$emit('bookSelected', book);  // Emit the bookSelected event when a book is clicked
    }
  },
  computed: {
    books(){
      return this.$store.getters.getBooks;
    },
    filteredBook() {
      if (this.searchQuery.trim() === "") {
        return this.filteredBooks;
      }
      return this.filteredBooks.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  components: {
    BookList,
    Header
  }
};
</script>

<style scoped>
.category-popup {
  position: fixed;
  width: 100%;
  height: auto;
  background-color: rgba(255, 255, 255, 1);
  color: black;
  z-index: 998;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 24px;
  background: white;
  color: black;
  padding: 5px 10px;
  border-radius: 50%;
}
</style>