<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>
  <div>
    <!-- Header component with search functionality -->
    <Header :searchQuery="searchQuery" @search="handleSearch" />

    <!-- BookList component that displays the list of filtered books -->
    <BookList
        :bookList="filteredBooks"
        @bookSelected="showBookDetailsOverlay"
        @toggleFavorite="toggleFavorite"
        :text="searchTitle"
        :isEmpty="filteredBooks.length === 0"
    />
    <!-- CategoryList component that displays available categories -->
    <CategoryList
        :categories="categories"
        @selectCategory="openCategoryPopup"
    />

    <!-- Book Details Overlay -->
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import BookList from "../components/BookList.vue";
import BookDetails from "../components/BookDetails.vue";
import CategoryList  from "@/components/CategoryList.vue";
import CategoryBookList from "../views/CategoryBookList.vue";

export default {
  data() {
    return {
      searchQuery: "",
      selectedBook: null,
      showBookDetails: false,
      selectedCategory: '',
      category: '',
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],


    };
  },
  computed: {
    /**
     * Filters the list of favorite books based on the search query.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        console.log("Test : ", this.$store.state.favoriteBooks);
        return this.$store.state.favoriteBooks;
      }
      return this.$store.state.favoriteBooks.filter((book) => {
        return (
            book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    /**
     * Determines the title to be displayed based on the search query.
     * @returns {string} - Title for the search results or favorites.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Your Favorites" : "Search Result";
    },
    favoriteBooks() {
      return this.$store.state.favoriteBooks;
    },
  },
  methods: {
    /**
     * Fetches the user's favorite books from the API.
     */
    async fetchFavoriteBooks() {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;

        const requestOptions = {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`https://bot.servhub.fr/api/favorites/${userId}`, requestOptions);
        const result = await response.json();
        console.log("Favorites from API: ", result);
        this.$store.commit('setFavorites', result);
      } catch (error) {
        console.log("Error fetching favorite books: ", error);
      }
    },
    /**
     * Displays the details overlay for the selected book.
     * @param {Object} book - The selected book object.
     */
    showBookDetailsOverlay(book) {
      this.selectedBook = book;
      this.showBookDetails = true;
    },
    /**
     * Closes the book details overlay.
     */
    closeDetails() {
      this.showBookDetails = false;
    },
    /**
     * Toggles the favorite status of the selected book.
     * @param {Object} book - The book whose favorite status is being toggled.
     */
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
    /**
     * Handles the search action by updating the search query.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    },
    /**
     * Opens the category popup for the selected category.
     * @param {string} category - The selected category.
     */
    openCategoryPopup(category) {
      this.$router.push({
        name: 'category',
        params: {
          category,
        },
        query: {
          fromFavorites: true // Add a query param to indicate filtering by favorites
        }
      });
    },
  },
  mounted() {
    // Fetch favorite books if the user ID is available
    if (this.$store.state.userId) {
      this.fetchFavoriteBooks();
    } else {
      // Watch for changes in user ID and fetch favorites if it becomes available
      this.$store.watch(
          (state) => state.userId,
          (newUserId) => {
            if (newUserId) {
              this.fetchFavoriteBooks();
            }
          }
      );
    }
  },
  components: {
    Header,
    BookList,
    BookDetails,
    CategoryList,
    CategoryBookList,
  },
};
</script>

<style>
/* Reset margins and paddings for html and body elements */

html, body {
  margin: 0;
  padding: 0;
}
/* Set default font for the body */
body {
  font-family: Arial, sans-serif;
}
/* Styles for the main heading (h2) */
h2{
  margin-left: 2rem;
  margin-bottom: 0;
  padding: .625rem;
  font-size: 1.75rem;
}
/* Styles for text input fields */
input[type="text"] {
  width: 80%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: .313rem;
}

/* Styles for action icons (e.g., add, delete) */
.action-icons i {
  font-size: 2.5rem;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

/* Hover effect for action icons */
.action-icons i:hover {
  color: red;
}

/* Styles for header icons (add book, logout, favorite, home) */
.header-icons .add-book,
.header-icons .logout,
.header-icons .favorite {
  margin-left: 1.25rem;
  font-size: 1.25rem;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Additional icon styles within header */
.header-icons .icon {
  margin-left: .313rem;
  font-size: 1.875rem;
}
</style>