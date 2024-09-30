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
            <div class="favorite-icon" :class="{ added: book.isFavorite }" @click.stop="toggleFavorite(book)">
              {{ book.isFavorite ? '★' : '☆' }}
            </div>
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
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.$emit("updateBooks", result); // Emit to parent to update bookList
            result.forEach((book) => this.getBookCover(book.isbn));
          })
          .catch((error) => console.error("Error fetching books:", error));
    },
    selectBook(book) {
      this.$emit("bookSelected", book);
    },
    async toggleFavorite(book) {
      const userToken = this.$store.state.userToken;
      const userId = this.$store.state.userId;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userToken}`); // Add token to the headers

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ user_id: userId, book_id: book.book_id }),
        redirect: "follow"
      };

      try {
        if (!book.isFavorite) {
          const response = await fetch("https://bot.servhub.fr/api/favorites", requestOptions);
          if (response.ok) {
            book.isFavorite = true;
            alert(`${book.title} added to favorites.`);
          } else {
            throw new Error("Failed to add favorite");
          }
        } else {
          alert(`${book.title} is already in favorites.`);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    slideLeft() {
      this.$refs.bookSlider.scrollLeft -= 250;
    },
    slideRight() {
      this.$refs.bookSlider.scrollLeft += 250;
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
  gap: 16px;
}

.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.book {
  min-width: 250px;
  max-width: 250px;
  height: 250px;
  margin: 20px;
  text-align: center;
  padding: 10px;
  border-radius: 20px;
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
  width: 130px;
  height: 195px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 5px;
}

.book:hover {
  transform: scale(1.05);
}

.book-id {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  font-weight: lighter;
  color: black;
}

.book-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.book-price {
  font-size: 16px;
  text-align: left;
}

.favorite-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

.favorite-icon.added {
  color: red;
}

#empty-title {
  font-size: 28px;
  font-weight: bold;
}
</style>