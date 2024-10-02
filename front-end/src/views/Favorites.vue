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
    computed: {
      favoriteBooks() {
        return this.$store.state.favoriteBooks;
      },
    },
  },
  methods: {
    async fetchFavoriteBooks() {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;

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
    CategoryList,
    CategoryBookList,
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
  margin-left: 2rem;
  margin-bottom: 0;
  padding: 10px;
  font-size: 1.75rem;
}

input[type="text"] {
  width: 80%;
  padding: .625rem;
  border: 1px solid #ccc;
  border-radius: .313rem;
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
  font-size: 2.5rem;
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
  margin-left: 1.25rem;
  font-size: 1.25rem;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.header-icons .icon {
  margin-left: .313rem;
  font-size: 1.875rem;
}
</style>