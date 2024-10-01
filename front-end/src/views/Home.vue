<template>
  <div>
    <Header :searchQuery="searchQuery" @search="handleSearch" @showAddBookForm="showAddBookForm" />

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
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        return this.books; // If no search query, return all books
      }
      return this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase());
      });
    },
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
  methods: {
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
    showBookDetailsOverlay(book) {
      this.selectedBook = book; // Set the selected book
      this.showBookDetails = true; // Show the modal
    },
    closeDetails() {
      this.showBookDetails = false;
    },
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
    updateBook(book) {
      alert(`Updated ${book.title}`);
      this.showUpdateForm = false;
    },
    showAddBookForm(){
      this.isAddBookFormVisible = true;
    },
    hideAddBookForm() {
      this.isAddBookFormVisible = false;
    },
    addBook(newBook) {
      this.books.push(newBook);
    },
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    handleSearch(query) {
      this.searchQuery = query;
    }
  },
  mounted() {
    this.fetchBooks();
    this.polling = setInterval(() => {
      this.fetchBooks();
    }, 5000);
    this.$store.dispatch('initFavorites');
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
.header-icons .favorite
.header-icons .home {
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