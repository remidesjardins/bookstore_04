---
title: BookList
---
# Introduction

Path : <SwmPath>[front-end/src/components/BookList.vue](/front-end/src/components/BookList.vue)</SwmPath>

This document will walk you through the implementation of the <SwmToken path="/front-end/src/components/BookList.vue" pos="12:13:13" line-data="          &lt;div v-for=&quot;book in bookList&quot; :key=&quot;book.book_id&quot; class=&quot;book&quot; @click=&quot;selectBook(book)&quot;&gt;">`bookList`</SwmToken> feature.

The feature displays a list of books, allows users to mark books as favorites, and fetches book cover images.

We will cover:

1. How the book list is displayed.
2. How books are fetched from the API.
3. How favorite books are managed.
4. How book cover images are fetched and cached.

# Displaying the book list

<SwmSnippet path="/front-end/src/components/BookList.vue" line="5">

---

The book list is displayed using a Vue component. The template defines the structure and behavior of the book list, including buttons for sliding through the list and handling empty states.

```
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
```

---

</SwmSnippet>

# Component properties and data

<SwmSnippet path="/front-end/src/components/BookList.vue" line="40">

---

The component accepts three props: <SwmToken path="/front-end/src/components/BookList.vue" pos="41:1:1" line-data="    bookList: Array,">`bookList`</SwmToken>, <SwmToken path="/front-end/src/components/BookList.vue" pos="42:1:1" line-data="    text: String,">`text`</SwmToken>, and <SwmToken path="/front-end/src/components/BookList.vue" pos="43:1:1" line-data="    isEmpty: Boolean,">`isEmpty`</SwmToken>. It also initializes a <SwmToken path="/front-end/src/components/BookList.vue" pos="47:1:1" line-data="      coverCache: {}, // Cache to store fetched cover images">`coverCache`</SwmToken> to store fetched cover images.

```
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
```

---

</SwmSnippet>

# Fetching books from the API

<SwmSnippet path="/front-end/src/components/BookList.vue" line="51">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="55:1:1" line-data="    fetchBooks() {">`fetchBooks`</SwmToken> method fetches the list of books from the API and updates the book list. It also fetches book cover images for each book.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookList.vue" line="61">

---

The request options for the API call are defined here.

```

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        redirect: "follow",
      };
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookList.vue" line="70">

---

The API call is made, and the result is processed. The book list is updated, and cover images are fetched.

```

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.$emit("updateBooks", result); // Emit to parent to update bookList
            result.forEach((book) => this.getBookCover(book.isbn));
          })
          .catch((error) => console.log("ICI :", error));
    },
```

---

</SwmSnippet>

# Selecting a book

<SwmSnippet path="/front-end/src/components/BookList.vue" line="80">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="84:1:1" line-data="    selectBook(book) {">`selectBook`</SwmToken> method emits the selected book to the parent component.

@param {Object} <SwmToken path="/front-end/src/components/BookList.vue" pos="84:3:3" line-data="    selectBook(book) {">`book`</SwmToken> - The book object selected by the user.

```
    /**
     * Emits the selected book to the parent component.
     * @param {Object} book - The book object selected by the user.
     */
    selectBook(book) {
      this.$emit("bookSelected", book);
    },
```

---

</SwmSnippet>

# Checking if a book is a favorite

<SwmSnippet path="/front-end/src/components/BookList.vue" line="87">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="92:1:1" line-data="    isFavorite(bookId) {">`isFavorite`</SwmToken> method checks if a book is in the user's favorites.

@param {String} <SwmToken path="/front-end/src/components/BookList.vue" pos="92:3:3" line-data="    isFavorite(bookId) {">`bookId`</SwmToken> - The ID of the book to check.\
@returns {Boolean} - True if the book is a favorite, false otherwise.

```
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
```

---

</SwmSnippet>

# Toggling favorite status

<SwmSnippet path="/front-end/src/components/BookList.vue" line="100">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="105:3:3" line-data="    async toggleFavorite(bookId) {">`toggleFavorite`</SwmToken> method toggles the favorite status of a book. It calls either <SwmToken path="/front-end/src/components/BookList.vue" pos="111:5:5" line-data="        await this.favoriteBook(bookId);">`favoriteBook`</SwmToken> or <SwmToken path="/front-end/src/components/BookList.vue" pos="108:5:5" line-data="        await this.unfavoriteBook(bookId);">`unfavoriteBook`</SwmToken> based on the current status.

@param {String} <SwmToken path="/front-end/src/components/BookList.vue" pos="105:5:5" line-data="    async toggleFavorite(bookId) {">`bookId`</SwmToken> - The ID of the book to toggle favorite status.

```
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
```

---

</SwmSnippet>

# Adding a book to favorites

<SwmSnippet path="/front-end/src/components/BookList.vue" line="114">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="118:3:3" line-data="    async favoriteBook(bookId) {">`favoriteBook`</SwmToken> method adds a book to the user's favorites. It makes a POST request to the API and updates the Vuex store.

@param {String} <SwmToken path="/front-end/src/components/BookList.vue" pos="118:5:5" line-data="    async favoriteBook(bookId) {">`bookId`</SwmToken> - The ID of the book to be added to favorites.

```
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
```

---

</SwmSnippet>

# Removing a book from favorites

<SwmSnippet path="/front-end/src/components/BookList.vue" line="150">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="154:3:3" line-data="    async unfavoriteBook(bookId) {">`unfavoriteBook`</SwmToken> method removes a book from the user's favorites. It makes a DELETE request to the API and updates the Vuex store.

@param {String} <SwmToken path="/front-end/src/components/BookList.vue" pos="154:5:5" line-data="    async unfavoriteBook(bookId) {">`bookId`</SwmToken> - The ID of the book to be removed from favorites.

```
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
```

---

</SwmSnippet>

# Scrolling the book slider

<SwmSnippet path="/front-end/src/components/BookList.vue" line="183">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="186:1:1" line-data="    slideLeft() {">`slideLeft`</SwmToken> and <SwmToken path="/front-end/src/components/BookList.vue" pos="192:1:1" line-data="    slideRight() {">`slideRight`</SwmToken> methods handle scrolling the book slider left and right.

```
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
```

---

</SwmSnippet>

# Fetching book cover images

<SwmSnippet path="/front-end/src/components/BookList.vue" line="195">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="201:1:1" line-data="    getBookCover(isbn) {">`getBookCover`</SwmToken> method fetches the book cover from the Google Books API. It uses a placeholder image if the cover is not available and caches fetched images.

@param {String} <SwmToken path="/front-end/src/components/BookList.vue" pos="201:3:3" line-data="    getBookCover(isbn) {">`isbn`</SwmToken> - The ISBN of the book to get the cover image for.\
@returns {String} - The URL of the book cover image or a placeholder image.

```
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
```

---

</SwmSnippet>

# Initializing the component

<SwmSnippet path="/front-end/src/components/BookList.vue" line="239">

---

The <SwmToken path="/front-end/src/components/BookList.vue" pos="239:1:1" line-data="  mounted() {">`mounted`</SwmToken> lifecycle hook calls <SwmToken path="/front-end/src/components/BookList.vue" pos="240:3:3" line-data="    this.fetchBooks();">`fetchBooks`</SwmToken> to initialize the book list when the component is mounted.

```
  mounted() {
    this.fetchBooks();
  },
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/front-end/src/components/BookList.vue" pos="12:13:13" line-data="          &lt;div v-for=&quot;book in bookList&quot; :key=&quot;book.book_id&quot; class=&quot;book&quot; @click=&quot;selectBook(book)&quot;&gt;">`bookList`</SwmToken> feature. The implementation ensures that books are fetched, displayed, and managed efficiently, with support for user favorites and cover image caching.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
