<template>
  <div>
    <Header :searchQuery="searchQuery" @search="handleSearch" />

    <BookList
        :bookList="filteredBooks"
        @bookSelected="showBookDetailsOverlay"
        @toggleFavorite="toggleFavorite"
        :text="searchTitle"
        :isEmpty="filteredBooks.length === 0"
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

export default {
  data() {
    return {
      searchQuery: "",
      favoriteBooks: [],
      selectedBook: null,
      showBookDetails: false,
    };
  },
  computed: {
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
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Your Favorites" : "Search Result";
    },
    favoriteBooks() {
      return this.$store.commit('setFavorites', result);    }
  },
  methods: {
    async fetchFavoriteBooks() {
      try {
        const userId = state.userId;
        const token = state.userToken;

        const requestOptions = {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // Add the Authorization header
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
    showBookDetailsOverlay(book) {
      this.selectedBook = book;
      this.showBookDetails = true;
    },
    closeDetails() {
      this.showBookDetails = false;
    },
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
    handleSearch(query) {
      this.searchQuery = query;
    },
  },
  mounted() {
    if (this.$store.state.userId) {
      this.fetchFavoriteBooks();
    } else {
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
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, sans-serif;
}

h2{
  margin-left: 35px;
  margin-bottom: 0;
  padding: 10px;
  font-size: 28px;
}

input[type="text"] {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 30px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.action-icons i {
  font-size: 40px;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

.action-icons i:hover {
  color: red;
}

.header-icons .add-book,
.header-icons .logout,
.header-icons .favorite {
  margin-left: 20px;
  font-size: 20px;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.header-icons .icon {
  margin-left: 5px;
  font-size: 30px;
}
</style>