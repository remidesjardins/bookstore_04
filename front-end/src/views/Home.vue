<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->

<template>
  <div>
    <Header :searchQuery="searchQuery" @search="handleSearch" @showAddBookForm="showAddBookForm" />
    <!-- Display book list -->
    <BookList
        :bookList="filteredBooks"
        @bookSelected="showBookDetailsOverlay"
        @toggleFavorite="toggleFavorite"
        :text="searchTitle"
        :isEmpty="filteredBooks.length === 0"
    />
    <!-- Display the list of all categories -->
    <CategoryList
        :categories="categories"
        @selectCategory="openCategoryPopup"
    />
    <!-- Book Details Overlay -->
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        :categories="categories"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
  <div v-if="isAddBookFormVisible" class="overlay">
    <AddBookForm @close-form="hideAddBookForm" @add-book="addBook" />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import CategoryList from "../components/CategoryList.vue";
import BookList from "../components/BookList.vue";
import CategoryBookList from "../views/CategoryBookList.vue";
import BookDetails from "../components/BookDetails.vue";
import UpdateBookForm from "../components/UpdateBookForm.vue";
import AddBookForm from "../components/AddBookForm.vue";

export default {
  data() {
    return {
      searchQuery: "",
      books: [],
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      selectedCategory: "",
      showCategoryPopup: false,
      showDetails: false,
      showUpdateForm: false,
      selectedBook: null,
      showBookDetails: false,
      isAddBookFormVisible: false,
      isEmpty: true,
    };
  },
  computed: {
    /**
     * Filters the list of books based on the search query.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        return this.books; // If no search query, return all books
      }
      return this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase());
      });
    },
    /**
     * Returns the title to be displayed based on the search query.
     * @returns {string} - Title for the search results or recent search.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
  methods: {
    /**
     * Fetches books from the API and updates the local books array.
     */
    fetchBooks() {
      console.log(this.$store.state.userId);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {console.log(result)
            this.books = result;
          })
          .catch((error) => console.error(error));
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
          fromFavorites: false
        }
      });
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
     * Toggles the favorite status of the selected book.
     * @param {Object} book - The book whose favorite status is being toggled.
     */
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
    /**
     * Updates the specified book and hides the update form.
     * @param {Object} book - The book to be updated.
     */
    updateBook(book) {
      alert(`Updated ${book.title}`);
      this.showUpdateForm = false;
    },
    /**
     * Shows the form to add a new book.
     */
    showAddBookForm(){
      this.isAddBookFormVisible = true;
    },
    /**
     * Hides the add book form.
     */
    hideAddBookForm() {
      this.isAddBookFormVisible = false;
    },
    /**
     * Adds a new book to the books array.
     * @param {Object} newBook - The new book to be added.
     */
    addBook(newBook) {
      this.books.push(newBook);
    },
    /**
     * Updates the search query based on user input.
     * @param {string} query - The search query to update.
     */
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    /**
     * Handles the search action by updating the search query.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    }
  },
  mounted() {
    this.fetchBooks();  // Fetch books on component mount
    this.polling = setInterval(() => {
      this.fetchBooks(); // Poll for new books every 5 seconds
    }, 5000);
    this.$store.dispatch('initFavorites'); // Initialize favorites from the store
  },
  components: {
    Header,
    CategoryList,
    CategoryBookList,
    BookList,
    BookDetails,
    UpdateBookForm,
    AddBookForm
  }
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
  margin-left: 2.188rem;
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
/* Overlay styles for forms and modals */
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 1.875rem;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
.header-icons .favorite
.header-icons .home {
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