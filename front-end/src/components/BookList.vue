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
    selectBook(book) {
      this.$emit("bookSelected", book);
    },
    isFavorite(bookId) {
      const favorites = this.$store.state.favoriteBooks;
      if (Array.isArray(favorites)) {
        return favorites.some(favBook => favBook.book_id === bookId);
      } else {
        return false; // Default to not a favorite if the favorites list is not an array
      }
    },
    async toggleFavorite(bookId) {
      if (this.isFavorite(bookId)) {
        // If the book is already a favorite, unfavorite it
        await this.unfavoriteBook(bookId);
      } else {
        // Otherwise, favorite the book
        await this.favoriteBook(bookId);
      }
    },
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
    slideLeft() {
      this.$refs.bookSlider.scrollLeft -= 325;
    },
    slideRight() {
      this.$refs.bookSlider.scrollLeft += 325;
    },
    getBookCover(isbn) {
      if (!isbn) {
        return "https://via.placeholder.com/150?text=No+Cover";
      }

      if (this.coverCache[isbn]) {
        return this.coverCache[isbn]; // Use cached cover if available
      }

      const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
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

      return "https://via.placeholder.com/150?text=No+Cover"; // Return placeholder while fetching
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>

.book-list-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.book-slider {
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 1rem;
}

.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

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

.book img {
  width: 7.5rem;
  height: 11.563rem;
  object-fit: cover;
  border-radius: 0.625rem;
  margin-bottom: 0.313rem;
}

.book:hover {
  transform: scale(1.05);
}

.book-title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.book-price {
  font-size: 1rem;
  text-align: left;
}

#empty-title {
  font-size: 1.75rem;
  font-weight: bold;
}

.star-icon {
  cursor: pointer;
  font-size: 24px; /* Larger font size for better visibility */
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: color 0.3s ease;
}

.star-icon.favorite {
  color: black;
}

.star-icon.not-favorite {
  color: grey;
}
</style>