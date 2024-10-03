<template>
  <Header :searchQuery="searchQuery" @search="handleSearch" />
  <div class="category-popup">
    <span class="close-button" @click="closePopup"><i class="fa-solid fa-xmark fa-2xl"/></span>
    <h3>Books in {{ selectedCategory }}</h3>
    <BookList :bookList="filteredBooks" @bookSelected="showBookDetailsOverlay"/>
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        :categories="categories"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import BookList from '../components/BookList.vue';
import CategoryList from "@/components/CategoryList.vue";
import BookDetails from "@/components/BookDetails.vue";

export default {
  data() {
    return {
      books: [],
      searchQuery: "",
      selectedCategory: this.$route.params.category, // Get category from route params
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      showDetails: false,
      selectedBook: null,
      showBookDetails: false,
    };
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    fromFavorites: Boolean,
  },
  computed: {
    filteredBooks() {
      let booksToFilter = [];

      // Convert query param to boolean
      const fromFavorites = JSON.parse(this.$route.query.fromFavorites || 'false');

      if (fromFavorites) {
        booksToFilter = this.$store.state.favoriteBooks;
      } else {
        booksToFilter = this.books;
      }

      if (this.searchQuery.trim() === "") {
        return booksToFilter.filter(book => book.category === this.$route.params.category);
      }
      return booksToFilter.filter(book =>
          book.category === this.$route.params.category &&
          (book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              book.book_id.toString().includes(this.searchQuery.toLowerCase()))
      );
    },
  },
  methods: {
    fetchBooks() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("Result: ", result);
            this.books = result;
          })
          .catch((error) => console.error(error));
    },
    handleSearch(query) {
      this.searchQuery = query;
    },
    showBookDetailsOverlay(book) {
      this.selectedBook = book; // Set the selected book
      this.showBookDetails = true; // Show the modal
    },
    closeDetails() {
      this.showBookDetails = false;
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
    BookDetails,
    CategoryList,
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
  padding: 1.25rem;
  top: auto;
  left: 0;
  right: 0;
  z-index: 8;
  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: .625rem;
  right: .625rem;
  cursor: pointer;
}
</style>