<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->

<template>
  <!-- Header component with search functionality -->
  <Header :searchQuery="searchQuery" @search="handleSearch" />

  <!-- Popup for displaying books in the selected category -->
  <div class="category-popup">
    <span class="close-button" @click="closePopup"><i class="fa-solid fa-xmark fa-2xl"/></span>

    <!-- Title indicating the selected category -->
    <h3>Books in {{ selectedCategory }}</h3>

    <!-- BookList component displaying books filtered by category -->
    <BookList :bookList="filteredBooks" @bookSelected="showBookDetailsOverlay"/>

    <!-- Book Details Overlay for selected book -->
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
    /**
     * Filters the list of books based on the search query and selected category.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      let booksToFilter = [];

      // Convert query param to boolean
      const fromFavorites = JSON.parse(this.$route.query.fromFavorites || 'false');

      if (fromFavorites) {
        booksToFilter = this.$store.state.favoriteBooks;
      } else {
        booksToFilter = this.books;
      }

      // Filter books by selected category and search query
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
    /**
     * Fetches the list of books from the API and updates the local state.
     */
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
            this.books = result; // Update the books array with the fetched result
          })
          .catch((error) => console.error(error));
    },

    /**
     * Updates the search query based on user input.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    },

    /**
     * Displays the details overlay for the selected book.
     * @param {Object} book - The selected book object.
     */
    showBookDetailsOverlay(book) {
      this.selectedBook = book; // Set the selected book
      this.showBookDetails = true; // Show the modal
    },
    /**
     * Closes the book details overlay.
     */
    closeDetails() {
      this.showBookDetails = false;
    },
    /**
     * Closes the category popup and navigates back to the home page.
     */
    closePopup() {
      this.$router.push('/');
    },
    /**
     * Returns the title to be displayed based on the search query.
     * @returns {string} - Title for the search results or favorites.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
  mounted() {
    this.fetchBooks(); // Fetch books when the component is mounted
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
/* Styles for the category popup container */
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

/* Styles for the close button in the popup */
.close-button {
  position: absolute;
  top: .625rem;
  right: .625rem;
  cursor: pointer;
}
</style>