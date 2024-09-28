<template>
  <div>
    <header class="app-header">
      <div class="logo">
        <span>BOOK</span>
        <br />
        <span>HAVEN</span>
      </div>

      <!-- Search bar -->
      <SearchBar :searchQuery="searchQuery" @search="searchBook" />

      <div class="header-icons">
        <div class="add-book" @click.stop="showAddBookForm">Add a book <span class="icon">+</span></div>
        <div class="logout">Log Out <span class="icon">➡️</span></div>
        <div class="favorite">Favorite <span class="icon">⭐</span></div>
      </div>
    </header>

    <BookList :bookList="books" @bookSelected="showBookDetailsOverlay" @toggleFavorite="toggleFavorite" text="Recent search"/>
    <CategoryList :categories="categories" @categorySelected="openCategoryPopup" />

    <!-- Category Overlay -->
    <CategoryBookList
        v-if="showCategoryPopup"
        :books="books"
        :category="selectedCategory"
        :showPopup="showCategoryPopup"
        @closePopup="closeCategoryPopup"
        @bookSelected="showBookDetailsOverlay"
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
import SearchBar from "./components/SearchBar.vue";
import CategoryList from "./components/CategoryList.vue";
import BookList from "./components/BookList.vue";
import CategoryBookList from "@/components/CategoryBookList.vue";
import BookDetails from "./components/BookDetails.vue";
import UpdateBookForm from "./components/UpdateBookForm.vue";
import AddBookForm from "./components/AddBookForm.vue";

export default {
  data() {
    return {
      searchQuery: "",
      recentBook: {
        id: "B-154-343",
        title: "A Game of Thrones",
        author: "George R. R. Martin",
        img: "https://covers.openlibrary.org/b/isbn/9780553103540-M.jpg",
        price: 20,
        category: "Science-Fiction",
        summary: "Long ago...",
        isFavorite: false
      },
      books: [
        {
          id: "B-154-343",
          title: "A Game of Thrones",
          author: "George R. R. Martin",
          img: "https://covers.openlibrary.org/b/isbn/9780553103540-M.jpg",
          price: 20,
          category: "Science-Fiction",
          summary: "Long ago...",
          isFavorite: false
        },
        {
          id: "B-123-456",
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
          price: 15,
          category: "Fantasy",
          summary: "Bilbo's adventure...",
          isFavorite: false
        },
        {
          id: "B-123-456",
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
          price: 15,
          category: "Fantasy",
          summary: "Bilbo's adventure...",
          isFavorite: false
        },
        {
          id: "B-123-456",
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
          price: 15,
          category: "Fantasy",
          summary: "Bilbo's adventure...",
          isFavorite: false
        },

        // Add more books here
      ],
      categories: ["Science-Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      selectedCategory: "",
      showCategoryPopup: false,
      showDetails: false,
      showUpdateForm: false,
      selectedBook: null,
      showBookDetails: false,
      isAddBookFormVisible: false,
    };
  },
  methods: {
    searchBook(query) {
      console.log("Searching for:", query);
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    openCategoryPopup(category) {
      this.selectedCategory = category;
      this.showCategoryPopup = true;
    },
    closeCategoryPopup() {
      this.showCategoryPopup = false;
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
      this.books.push(newBook); // Add the new book to the book list
    }
  },
  components: {
    SearchBar,
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

  .app-header {
    background-color: #d9a05b; /* Matching the background color from the image */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .logo {
    font-size: 30px;
    padding: 20px;
    font-weight: bold;
    color: black;
    line-height: 1;
  }

  .header-icons {
    display: flex;
    align-items: center;
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