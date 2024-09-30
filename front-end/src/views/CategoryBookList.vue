<template>
  <Header :searchQuery="searchQuery" @search="handleSearch" />
  <div class="category-popup">
    <span class="close-button" @click="closePopup">❌</span>
    <h3>Books in {{ category }}</h3>
    <BookList :bookList="filteredBooks" @bookSelected="showBookDetailsOverlay"/>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import BookList from '../components/BookList.vue';

export default {
  data() {
    return {
      books: [],
      filteredBooks: [],
      searchQuery: "",
      selectedCategory: this.$route.params.category, // Get category from route params
    };
  },
  computed: {
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        return this.books.filter(book => book.category === this.selectedCategory);
      }
      return this.books.filter(book =>
          book.category === this.selectedCategory &&
          (book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || book.book_id.toString().includes(this.searchQuery.toLowerCase()))
      );
    },
  },
  methods: {
    fetchBooks() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.books = result;
          })
          .catch((error) => console.error(error));
    },
    handleSearch(query) {
      this.searchQuery = query;
    },
    showBookDetailsOverlay(book) {
      // Handle the display of the book details
      this.$emit('bookSelected', book);
    },
    closePopup() {
      this.$router.push('/');
    },
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
  mounted() {
    this.fetchBooks();
  },
  components: {
    Header,
    BookList
  },
};
</script>

<style scoped>
.category-popup {
  position: fixed;
  width: 100%;
  height: auto;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 999;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>