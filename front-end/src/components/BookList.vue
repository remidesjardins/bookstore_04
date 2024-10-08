<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>
  <div>
    <h2>{{ this.text }}</h2>
    <div class="book-list">
      <div class="book-list-container">
        <button @click="slideLeft">‹</button>
        <div v-if="!isEmpty" class="book-slider" ref="bookSlider">
          <div v-for="book in bookList" :key="book.book_id" class="book" @click="selectBook(book)">
            <img :src="book.coverImage || getBookCover(book.isbn)" alt="book cover" />
            <div class="book-id">{{ book.id }}</div>
            <div class="book-title">{{ book.title }}</div>
            <div class="book-price">{{ book.price }} $</div>
            <i
                :class="isFavorite(book.book_id) ? 'fa-solid fa-star favorite' : 'fa-regular fa-star not-favorite'"
                @click.stop="toggleFavorite(book.book_id)"
                class="star-icon"
            ></i>
          </div>
        </div>
        <div v-else>
          <div class="book">
            <div class="book-title" id="empty-title">Oups… <br/>Nothing here yet</div>
          </div>
        </div>
        <button @click="slideRight">›</button>
      </div>
    </div>
  </div>
</template>

<script>

import LogIn from "@/views/LogIn.vue";

export default {
  props: {
    bookList: Array,
    text: String,
    isEmpty: Boolean,
  },
  data() {
    return {
      coverCache: {}, // Cache to store fetched cover images
    };
  },
  methods: {
    /**
     * Fetches the list of books from the API and updates the book list.
     * It also fetches book cover images for each book.
     */
    fetchBooks() {
      console.log(this.$store.state.userToken);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);
      const userToken = this.$store.state.userToken;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        redirect: "follow",
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.$emit("updateBooks", result); // Emit to parent to update bookList
            result.forEach((book) => this.getBookCover(book.isbn));
          })
          .catch((error) => console.log("ICI :", error));
    },
    /**
     * Emits the selected book to the parent component.
     * @param {Object} book - The book object selected by the user.
     */
    selectBook(book) {
      this.$emit("bookSelected", book);
    },
    /**
     * Checks if a book is in the user's favorites.
     * @param {String} bookId - The ID of the book to check.
     * @returns {Boolean} - True if the book is a favorite, false otherwise.
     */
    isFavorite(bookId) {
      const favorites = this.$store.state.favoriteBooks;
      if (Array.isArray(favorites)) {
        return favorites.some(favBook => favBook.book_id === bookId);
      } else {
        return false; // Default to not a favorite if the favorites list is not an array
      }
    },
    /**
     * Toggles the favorite status of a book.
     * If the book is a favorite, it unfavorites it; otherwise, it adds it to favorites.
     * @param {String} bookId - The ID of the book to toggle favorite status.
     */
    async toggleFavorite(bookId) {
      if (this.isFavorite(bookId)) {
        // If the book is already a favorite, unfavorite it
        await this.unfavoriteBook(bookId);
      } else {
        // Otherwise, favorite the book
        await this.favoriteBook(bookId);
      }
    },
    /**
     * Adds a book to the user's favorites.
     * @param {String} bookId - The ID of the book to be added to favorites.
     */
    async favoriteBook(bookId) {
      try {
        const userId = this.$store.state.userId;

        // Ensure userId and bookId are not undefined or null
        console.log("UserID : ", userId);
        console.log("Book ID : ", bookId);
        const token = this.$store.state.userToken;
        if (!userId || !bookId) {
          throw new Error('Missing userId or bookId EHEOHEOFEJHF');
        }

        const response = await fetch(`https://bot.servhub.fr/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$store.state.userToken}`, // Include token for auth
          },
          body: JSON.stringify({ book_id: bookId, user_id: userId }), // Proper payload format
        });

        if (!response.ok) {
          throw new Error('Error favoriting the book');
        }

        const result = await response.json();
        this.$store.commit('addFavorite', { book_id: bookId }); // Add to the Vuex store

      } catch (error) {
        console.error('Error:', error);
      }
    },
    /**
     * Removes a book from the user's favorites.
     * @param {String} bookId - The ID of the book to be removed from favorites.
     */
    async unfavoriteBook(bookId) {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;
        console.log("EHOHJESUISLA");
        console.log("UserID : ", userId);
        console.log("Book ID : ", bookId);
        // Ensure both userId and bookId are valid
        if (!userId || !bookId) {
          throw new Error('Missing userId or bookId');
        }

        // Make the DELETE request, including userId in the body if necessary
        const response = await fetch(`https://bot.servhub.fr/api/favorites/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          this.$store.commit('removeFavorite', bookId);  // Remove the book from the Vuex store
        } else {
          console.error('Error unfavoriting the book: BLABLABLA', await response.text());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    /**
     * Scrolls the book slider to the left.
     */
    slideLeft() {
      this.$refs.bookSlider.scrollLeft -= 325;
    },
    /**
     * Scrolls the book slider to the right.
     */
    slideRight() {
      this.$refs.bookSlider.scrollLeft += 325;
    },
    /**
     * Fetches the book cover from the Google Books API.
     * If the cover is not available, it uses a placeholder image.
     * @param {String} isbn - The ISBN of the book to get the cover image for.
     * @returns {String} - The URL of the book cover image or a placeholder image.
     */
    getBookCover(isbn) {
      if (!isbn) {
        return "https://via.placeholder.com/150?text=No+Cover";
      }

      if (this.coverCache[isbn]) {
        return this.coverCache[isbn]; // Use cached cover if available
      }

      const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyB7cwO5XxLItxOpqno3sq4kt9_qpebT6Js`;

      // Add a delay between each API call
      setTimeout(() => {
        fetch(googleBooksAPI)
            .then((response) => response.json())
            .then((data) => {
              if (data.totalItems > 0 && data.items[0].volumeInfo.imageLinks) {
                const imageUrl =
                    data.items[0].volumeInfo.imageLinks.thumbnail ||
                    data.items[0].volumeInfo.imageLinks.smallThumbnail;
                this.coverCache[isbn] = imageUrl; // Cache the fetched cover image
                const book = this.bookList.find((b) => b.isbn === isbn);
                if (book) {
                  book.coverImage = imageUrl; // Update the book with the cover
                }
              } else {
                this.coverCache[isbn] = "https://via.placeholder.com/150?text=No+Cover";
                const book = this.bookList.find((b) => b.isbn === isbn);
                if (book) {
                  book.coverImage = "https://via.placeholder.com/150?text=No+Cover";
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching the book cover:", error);
              this.coverCache[isbn] = "https://via.placeholder.com/150?text=No+Cover";
            });
      }, 1000); // Throttle API requests by 1 second between each call

      return "https://via.placeholder.com/150?text=No+Cover"; // Return placeholder while fetching
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
/* Container for the entire book list, aligns items at the center and hides overflow */
.book-list-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}
/* Styles for the book slider, allowing horizontal scrolling with smooth behavior */
.book-slider {
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 1rem;
}

/* Defines the structure for the book list, supporting wrapping and spacing */
.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

/* Individual book styling, including dimensions, margin, and other visual properties */
.book {
  min-width: 15.625rem;
  max-width: 15.625rem;
  height: 15.625rem;
  margin: 1.25rem;
  text-align: center;
  padding: 0.625rem;
  border-radius: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #d9d9d9;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

/* Styling for the book image, ensuring it fits well within the card */
.book img {
  width: 7.5rem;
  height: 11.563rem;
  object-fit: cover;
  border-radius: 0.625rem;
  margin-bottom: 0.313rem;
}

/* Enlarges the book card slightly when hovered for a dynamic effect */
.book:hover {
  transform: scale(1.05);
}

/* Book title styling, including font size, weight, and text behavior */
.book-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* Book price styling, similar to the title but smaller */
.book-price {
  font-size: 1rem;
  text-align: left;
}

/* Styling for an empty state title, making it large and bold */
#empty-title {
  font-size: 1.75rem;
  font-weight: bold;
}

/* Styles for the star icon, positioned in the corner and interactive */
.star-icon {
  cursor: pointer;
  font-size: 24px; /* Larger font size for better visibility */
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: color 0.3s ease;
}

/* Black color when the star icon indicates a favorite */
.star-icon.favorite {
  color: black;
}

/* Grey color when the star icon indicates it's not a favorite */
.star-icon.not-favorite {
  color: grey;
}
</style>