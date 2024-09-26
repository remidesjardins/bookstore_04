<template>
  <div>
    <SearchBar :searchQuery="searchQuery" @search="searchBook" />
    <BookList :bookList="books" @bookSelected="showBookDetailsOverlay" @toggleFavorite="toggleFavorite" />
    <CategoryList :categories="categories" @categorySelected="openCategoryPopup" />
    <CategoryBookList
      v-if="showCategoryPopup"
      :books="books"
      :category="selectedCategory"
      :showPopup="showCategoryPopup"
      @closePopup="closeCategoryPopup"
      @bookSelected="showBookDetailsOverlay"
    />

    <BookDetails
        :book="selectedBook"
        :visible="showBookDetails"
        :categories="categories"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
</template>

<script>
import SearchBar from "./components/SearchBar.vue";
import CategoryList from "./components/CategoryList.vue";
import BookList from "./components/BookList.vue";
import CategoryBookList from "@/components/CategoryBookList.vue";
import BookDetails from "./components/BookDetails.vue";
import UpdateBookForm from "./components/UpdateBookForm.vue";

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
        // Add more books here
      ],
      categories: ["Science-Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      selectedCategory: "",
      showCategoryPopup: false,
      showDetails: false,
      showUpdateForm: false,
      selectedBook: null,
      showBookDetails: false

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
    closeBookDetailsOverlay() {
      this.showBookDetails = false; // Hide the modal
    },
    closeDetails() {
      this.showBookDetails = false;
    },
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
    closeUpdateForm() {
      this.showUpdateForm = false;
    },
    updateBook(book) {
      alert(`Updated ${book.title}`);
      this.showUpdateForm = false;
    },
    closeBookDetails() {
      this.showBookDetails = false; // Ensure this method is defined
    }
  },
  components: {
    SearchBar,
    CategoryList,
    CategoryBookList,
    BookList,
    BookDetails,
    UpdateBookForm
  }
};
</script>

<style>
  body {
    font-family: Arial, sans-serif;
  }

  input[type="text"] {
    width: 80%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  /* Book Details Overlay */
  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .overlay.active {
    display: flex;
  }

  .action-icons {
    position: absolute;
    bottom: 20px;
    right: 30px;
    display: flex;
    gap: 10px;
  }

  .action-icons i {
    font-size: 40px;
    cursor: pointer;
    color: black;
    transition: color 0.2s ease;
  }

  .action-icons i:hover {
    color: red; /* Hover color change */
  }

</style>