<template>
  <div v-if="showPopup" class="category-popup">
    <span class="close-button" @click="closePopup">❌</span>
    <h3>Books in {{ category }}</h3>
    <BookList :bookList="filteredBooks" @bookSelected="showBookDetailsOverlay" @toggleFavorite="toggleFavorite" />
  </div>
</template>

<script>
import BookList from './BookList.vue';  // Ensure BookList is imported correctly

export default {
  props: ['books', 'category', 'showPopup'],
  data() {
    return {
      filteredBooks: []
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
      this.$emit('closePopup');
    },
    showBookDetailsOverlay(book) {
      this.$emit('bookSelected', book);  // Emit the bookSelected event when a book is clicked
    }
  },
  components: {
    BookList
  }
};
</script>

<style scoped>
.category-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  color: black;
  z-index: 1000;
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