<!--
  Project: Book Haven
  Created by: Rémi Desjardins, Alexandre Borny, Laura Donato, and Maël Castellan
-->
<template>
  <div class="overlay" @click.self="closeDetails">
    <div class="book-details" @click.stop>
      <span class="close-button" @click="closeDetails"><i class="fa-solid fa-xmark fa-2xl"></i></span>

      <!-- Left content: Image, Category, Price, Buttons -->
      <div class="left-content">
        <h1 class="book-title">{{ book.title }}</h1>
        <h3 class="book-author">By {{ book.author }}</h3>
        <span class="category-label">{{ book.category }}</span>
        <img :src="coverImage" alt="Book cover" />
        <div class="price-container">
          <p class="price">{{ book.price }} $</p>
        </div>
      </div>

      <!-- Right content: Summary -->
      <div class="summary-button">
        <div>
          <h3>Summary</h3>
          <p>{{ book.summary }}</p>
        </div>
        <div>
          <button
              class="add-favorite"
              @click="toggleFavorite(book.book_id)"
              :class="book.isFavorite ? 'favorite-added' : ''"
          >
            {{ book.isFavorite ? "Remove from Favorites" : "Add to Favorites" }}
          </button>
        </div>
      </div>

      <!-- Action icons (Modify and Delete) -->
      <div class="bottom-right-buttons" v-if="this.$store.state.isAdmin">
        <button @click="showUpdateForm = true" class="icon-button">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button @click="deleteBook(book.book_id)" class="icon-button delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Update Book Form Modal -->
  <div v-if="showUpdateForm" class="overlay">
    <div class="modal">
      <UpdateBookForm :bookId="book.book_id" @close="showUpdateForm = false" />
    </div>
  </div>

  <!-- Update Book Form -->
  <UpdateBookForm
      v-if="showUpdateForm"
      :book="book"
      :categories="categories"
      @closeForm="closeUpdateForm"
      @updateBook="updateBook"
  />
</template>

<script>
import UpdateBookForm from "./UpdateBookForm.vue";

export default {
  props: {
    book: Object,
    visible: Boolean,
    categories: Array,
    showUpdateForm: false

  },
  emits: ['close', 'favoriteToggled'],
  data() {
    return {
      showUpdateForm: false,
      coverImage: "https://via.placeholder.com/150?text=No+Cover", // Default cover image

    };
  },
  methods: {
    /**
     * Deletes the book from the favorite table by calling the API.
     * Prompts the user for confirmation before proceeding with the deletion.
     * Emits a "bookDeleted" event if the book is successfully deleted.
     *
     * @async
     * @param {string} bookId - The ID of the book to delete.
     * @returns {Promise<void>} Resolves when the book is deleted or logs an error if it fails.
     */
    async deleteBook(bookId) { //Method call api to delete book from favorite table
      if (confirm("Are you sure you want to delete this book?")) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
        };

        try {
          const response = await fetch(`https://bot.servhub.fr/api/books/${bookId}`, requestOptions);
          const result = await response.text();
          console.log(result);
          alert("Book deleted successfully!");
          this.$emit("bookDeleted", bookId);
        } catch (error) {
          console.error("Error deleting book:", error);
          alert("Error deleting book.");
        }
      }
    },
    /**
     * Navigates to the update book form using the router.
     *
     * @param {string} bookId - The ID of the book to update.
     * @returns {void}
     */
    goToUpdateBook(bookId) {
      this.$router.push({ name: "UpdateBook", params: { bookId } });
    },
    /**
     * Closes the update form.
     *
     * @returns {void}
     */
    closeUpdateForm() { // Function to close update form
      this.showUpdateForm = false;
    },
    /**
     * Emits the updated book data to the parent component.
     * Closes the update form after emitting the update.
     *
     * @param {Object} updatedBook - The updated book data.
     * @returns {void}
     */
    updateBook(updatedBook) { // Function return data to the parents
      this.$emit("updateBook", updatedBook);
      this.closeUpdateForm();
    },
    /**
     * Emits the 'close' event to notify the parent component to close the details view.
     *
     * @returns {void}
     */
    closeDetails() { // Function that calls the parent's close function
      this.$emit('close');
    },
    /**
     * Checks if a book is in the user's favorites.
     *
     * @param {string} bookId - The ID of the book to check.
     * @returns {boolean} Returns true if the book is in the favorites, otherwise false.
     */
    isFavorite(bookId) { // Function return if books is already in favorites
      const favorites = this.$store.state.favoriteBooks;
      return favorites.some(favBook => favBook.book_id === bookId);
    },
    /**
     * Toggles the favorite status of a book.
     * Adds the book to favorites if it is not a favorite, otherwise removes it from favorites.
     *
     * @async
     * @param {string} bookId - The ID of the book to toggle as favorite.
     * @returns {Promise<void>} Resolves when the favorite status is toggled.
     */
    async toggleFavorite(bookId) {
      if (this.isFavorite(bookId)) {
        await this.unfavoriteBook(bookId);
        this.book.isFavorite = false;
      } else {
        await this.favoriteBook(bookId);
        this.book.isFavorite = true;
      }
    },
    /**
     * Adds a book to the user's favorites by calling the API.
     *
     * @async
     * @param {string} bookId - The ID of the book to add to favorites.
     * @returns {Promise<void>} Resolves when the book is added to favorites or logs an error if it fails.
     */
    async favoriteBook(bookId) {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;
        if (!userId || !bookId) throw new Error('Missing userId or bookId');

        const response = await fetch(`https://bot.servhub.fr/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId, book_id: bookId }),
        });

        if (response.ok) {
          this.$store.commit('addFavorite', { book_id: bookId });
        } else {
          throw new Error('Error favoriting the book');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    /**
     * Removes a book from the user's favorites by calling the API.
     *
     * @async
     * @param {string} bookId - The ID of the book to remove from favorites.
     * @returns {Promise<void>} Resolves when the book is removed from favorites or logs an error if it fails.
     */
    async unfavoriteBook(bookId) {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;
        if (!userId || !bookId) throw new Error('Missing userId or bookId');

        const response = await fetch(`https://bot.servhub.fr/api/favorites/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          this.$store.commit('removeFavorite', bookId);
        } else {
          throw new Error('Error unfavoriting the book');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    /**
     * Fetches the book cover image using the book's ISBN from the Google Books API.
     * Updates the cover image if available, otherwise uses a placeholder image.
     *
     * @param {string} isbn - The ISBN of the book to fetch the cover for.
     * @returns {void}
     */
    getBookCover(isbn) {
      if (isbn) {
        const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        console.log(googleBooksAPI);
        fetch(googleBooksAPI)
            .then((response) => response.json())
            .then((data) => {
              if (data.totalItems > 0 && data.items[0].volumeInfo.imageLinks) {
                // Get the thumbnail or small thumbnail from the response
                const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail || data.items[0].volumeInfo.imageLinks.smallThumbnail;
                this.coverImage = imageUrl; // Update cover image in the data
              } else {
                // If no cover image is available, use a placeholder
                this.coverImage = "https://via.placeholder.com/150?text=No+Cover";
              }
            })
            .catch((error) => {
              console.error("Error fetching the book cover:", error);
              this.coverImage = "https://via.placeholder.com/150?text=No+Cover"; // Fallback on error
            });
      } else {
        this.coverImage = "https://via.placeholder.com/150?text=No+Cover";
      }
    },
  },
  components: {
    UpdateBookForm
  },
  mounted() {
    this.getBookCover(this.book.isbn);
    this.book.isFavorite = this.isFavorite(this.book.book_id); // Initial check if the book is already a favorite

  }
};
</script>

<style scoped>
/* Overlay Styles */
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

/* Styles for the book details box */
.book-details {
  background-color: white;
  border-radius: 1.875rem; /* Increase the border-radius to round the corners more */
  padding: 1rem;
  max-width: 500vw;
  max-height: 85vh;
  width: 90vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  top: auto;
  z-index: 10;
  overflow: hidden; /* Ensure content stays inside the rounded borders */
}

/* Styles for the left content area */
.left-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%;
  padding: .5rem 0 0 2rem;
}

/* Image styles within the left content */
.left-content img {
  width: 9.375rem;
  margin-bottom: .625rem;
  border-radius: .625rem;
}

/* Styles for the book title */
.left-content .book-title {
  text-align: left;
  font-size: 1.563rem;
  margin: 0;
  text-overflow: ellipsis;
  height: auto;
  width: 38rem;
  white-space: nowrap;
  overflow: hidden;
}

/* Styles for the book author */
.left-content .book-author {
  margin-top: .5rem;
  margin-bottom: 1rem;
}

/* Price container styles */
.price-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* Styles for price text */
.price {
  font-size: 1.17rem;
  font-weight: bold;
  margin: .625rem 0;
}

/* Styles for the add to favorite button */
.add-favorite {
  width: 40%;
  padding: .938rem;
  border: none;
  border-radius: 1.563rem;
  background-color: #d3d3d3;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  color: black;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: .625rem;
}

/* Summary button styles */
.summary-button {
  width: 70%;
  padding-right: 2rem;
  height: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Paragraph styles within the summary button */
.summary-button p {
  overflow: auto;
  text-overflow: ellipsis;
  max-height: 14rem;
}

/* Header styles within the summary button */
.summary-button h3 {
  margin: 4rem 0 .625rem 0;
}

/* Styles for the close button */
.close-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  cursor: pointer;
}

/* Styles for category label */
.category-label {
  background-color: orange;
  border-radius: .625rem;
  padding: .313rem .625rem;
  margin-bottom: 1.25rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

/* Styles for buttons at the bottom right */
.bottom-right-buttons {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  gap: .625rem;
}

/* Styles for icon buttons */
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #007bff;
}

/* Hover effect for icon buttons */
.icon-button:hover {
  color: #0056b3;
}

/* Styles for delete button */
.delete-button {
  color: red;
}

/* Hover effect for delete button */
.delete-button:hover {
  color: darkred;
}

/* Media query for screens smaller than 680px */
@media (max-width: 680px) {

  .left-content {
    padding: 0;
  }

  /* Adjust book title styles */
  .left-content .book-title {
    font-size: 1.1rem;
    width: 15rem;
  }

  /* Adjust author name styles */
  .left-content .book-author {
    margin-bottom: .5rem;
    font-size: .9rem;
    width: 15rem;
  }

  /* Adjust image styles */
  .left-content img {
    width: 7rem;
    margin-top: 1rem;
  }

  /* Adjust category label styles */
  .category-label {
    padding: .2rem .5rem;
    margin-bottom: .9rem;
    font-size: .9rem;
  }

  /* Adjust summary button header styles */
  .summary-button h3 {
    font-size: .9rem;
  }

  /* Adjust summary button padding and height */
  .summary-button {
    padding-right: 1rem;
    padding-left: 3rem;
    height: 25rem;
  }

  /* Adjust paragraph font size */
  .summary-button p {
    font-size: .9rem;
  }

  /* Adjust add favorite button styles */
  .add-favorite {
    width: 60%;
    padding: .313rem;
    border-radius: .938rem;
    font-size: .9rem;
  }

  /* Adjust icon button font size */
  .icon-button {
    font-size: 1.3rem;
  }

  /* Adjust bottom right buttons layout */
  .bottom-right-buttons {
    gap: 0;
    display: flex;
    flex-direction: row;
  }
}

</style>