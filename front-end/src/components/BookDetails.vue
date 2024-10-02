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
        <h3>Summary</h3>
        <p>{{ book.summary }}</p>
        <button
            class="add-favorite"
            @click="toggleFavorite(book.book_id)"
            :class="book.isFavorite ? 'favorite-added' : ''"
        >
          {{ book.isFavorite ? "Remove from Favorites" : "Add to Favorites" }}
        </button>
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
    async deleteBook(bookId) {
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
    goToUpdateBook(bookId) {
      this.$router.push({ name: "UpdateBook", params: { bookId } });
    },
    closeUpdateForm() {
      this.showUpdateForm = false;
    },
    updateBook(updatedBook) {
      this.$emit("updateBook", updatedBook);
      this.closeUpdateForm();
    },
    closeDetails() {
      this.$emit('close');
    },

    isFavorite(bookId) {
      const favorites = this.$store.state.favoriteBooks;
      return favorites.some(favBook => favBook.book_id === bookId);
    },

    async toggleFavorite(bookId) {
      if (this.isFavorite(bookId)) {
        await this.unfavoriteBook(bookId);
        this.book.isFavorite = false;
      } else {
        await this.favoriteBook(bookId);
        this.book.isFavorite = true;
      }
    },

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

.left-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%;
  padding: .5rem 0 0 2rem;
}

.left-content img {
  width: 9.375rem;
  margin-bottom: .625rem;
  border-radius: .625rem;
}

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

.left-content .book-author {
  margin-top: .5rem;
  margin-bottom: 1rem;
}

.price-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.price {
  font-size: 1.17rem;
  font-weight: bold;
  margin: .625rem 0;
}

.add-favorite {
  width: 40%;
  padding: .938rem;
  border: none;
  border-radius: 25px;
  background-color: #d3d3d3;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  color: black;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.favorite-added {
  background-color: #d9a05b;
  color: black;
}

.summary-button {
  width: 70%;
  padding-right: 2rem;
}

.summary-button p {
  overflow: auto;
  text-overflow: ellipsis;
  max-height: 14rem;
}

.summary-button h3 {
  margin: 4rem 0 .625rem 0;
}

.close-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  cursor: pointer;
}

.category-label {
  background-color: orange;
  border-radius: .625rem;
  padding: .313rem .625rem;
  margin-bottom: 1.25rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.bottom-right-buttons {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  gap: .625rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #007bff;
}

.icon-button:hover {
  color: #0056b3;
}

.delete-button {
  color: red;
}

.delete-button:hover {
  color: darkred;
}

@media (max-width: 600px) {

  .left-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 30%;
    padding: 0;
  }

  .left-content .book-title {
    text-align: left;
    font-size: 1.1rem;
    margin: 0;
    text-overflow: ellipsis;
    height: auto;
    width: 15rem;
    white-space: nowrap;
    overflow: hidden;
  }

  .left-content .book-author {
    margin-top: .5rem;
    margin-bottom: .5rem;
    font-size: .9rem;
    width: 15rem;
  }

  .left-content img {
    width: 7rem;
    margin-bottom: .625rem;
    margin-top: 1rem;
    border-radius: .625rem;
  }

  .category-label {
    background-color: orange;
    border-radius: .625rem;
    padding: .2rem .5rem;
    margin-bottom: .9rem;
    color: white;
    font-weight: bold;
    font-size: .9rem;
  }

  .summary-button h3 {
    margin: 4rem 0 .625rem 0;
    font-size: .9rem;
  }

  .summary-button {
    width: 70%;
    padding-left: 2rem;
    padding-right: 1rem;
  }

  .summary-button p {
    overflow: auto;
    text-overflow: ellipsis;
    max-height: 14rem;
    font-size: .9rem;
  }

  .add-favorite {
    width: 60%;
    padding: .313rem;
    border: none;
    border-radius: .938rem;
    background-color: #d3d3d3;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    color: black;
    font-size: .9rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: .625rem;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.3rem;
    color: #007bff;
  }

  .icon-button:hover {
    color: #0056b3;
  }

  .delete-button {
    color: red;
  }

  .delete-button:hover {
    color: darkred;
  }
}

</style>