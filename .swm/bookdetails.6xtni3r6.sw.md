---
title: BookDetails
---
# Introduction

Path : <SwmPath>[front-end/src/components/BookDetails.vue](/front-end/src/components/BookDetails.vue)</SwmPath>

This document will walk you through the implementation of the BookDetails feature.

The feature displays detailed information about a book, including its cover image, author, price, and summary. It also allows users to add or remove the book from their favorites, and for admins, it provides options to update or delete the book.

We will cover:

1. How the book details are displayed.
2. How the favorite status is toggled.
3. How the book can be updated or deleted.
4. How the book cover image is fetched.

# Displaying book details

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="6">

---

The BookDetails component displays detailed information about a book. The main structure includes an overlay that can be closed by clicking outside the details area.

```
  <div class="overlay" @click.self="closeDetails">
    <div class="book-details" @click.stop>
      <span class="close-button" @click="closeDetails"><i class="fa-solid fa-xmark fa-2xl"></i></span>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="9">

---

The left content section shows the book's title, author, category, cover image, and price.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="20">

---

The right content section displays the book's summary and a button to add or remove the book from favorites.

```

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
```

---

</SwmSnippet>

# Admin actions

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="37">

---

For admin users, additional buttons are provided to update or delete the book. These buttons are conditionally rendered based on the user's admin status.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="50">

---

When the update button is clicked, an update form modal is displayed.

```
  <!-- Update Book Form Modal -->
  <div v-if="showUpdateForm" class="overlay">
    <div class="modal">
      <UpdateBookForm :bookId="book.book_id" @close="showUpdateForm = false" />
    </div>
  </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="56">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="58:2:2" line-data="  &lt;UpdateBookForm">`UpdateBookForm`</SwmToken> component is used to handle the book update process.

```

  <!-- Update Book Form -->
  <UpdateBookForm
      v-if="showUpdateForm"
      :book="book"
      :categories="categories"
      @closeForm="closeUpdateForm"
      @updateBook="updateBook"
  />
</template>
```

---

</SwmSnippet>

# Component properties and data

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="71">

---

The component receives the book details, visibility status, and categories as props. It also manages the state for showing the update form and the cover image.

```
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
```

---

</SwmSnippet>

# Deleting a book

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="87">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="96:3:3" line-data="    async deleteBook(bookId) { //Method call api to delete book from favorite table">`deleteBook`</SwmToken> method handles the deletion of a book. It prompts the user for confirmation, calls the API to delete the book, and emits a <SwmToken path="/front-end/src/components/BookDetails.vue" pos="90:8:8" line-data="     * Emits a &quot;bookDeleted&quot; event if the book is successfully deleted.">`bookDeleted`</SwmToken> event upon successful deletion.

@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="93:10:10" line-data="     * @param {string} bookId - The ID of the book to delete.">`bookId`</SwmToken> - The ID of the book to delete.\
@returns {Promise<void>} Resolves when the book is deleted or logs an error if it fails.

```
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
```

---

</SwmSnippet>

# Updating a book

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="119">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="125:1:1" line-data="    goToUpdateBook(bookId) {">`goToUpdateBook`</SwmToken> method navigates to the update book form using the router.

@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="122:10:10" line-data="     * @param {string} bookId - The ID of the book to update.">`bookId`</SwmToken> - The ID of the book to update.\
@returns {void}

```
    /**
     * Navigates to the update book form using the router.
     *
     * @param {string} bookId - The ID of the book to update.
     * @returns {void}
     */
    goToUpdateBook(bookId) {
      this.$router.push({ name: "UpdateBook", params: { bookId } });
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="128">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="133:1:1" line-data="    closeUpdateForm() { // Function to close update form">`closeUpdateForm`</SwmToken> method closes the update form.

@returns {void}

```
    /**
     * Closes the update form.
     *
     * @returns {void}
     */
    closeUpdateForm() { // Function to close update form
      this.showUpdateForm = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="136">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="143:1:1" line-data="    updateBook(updatedBook) { // Function return data to the parents">`updateBook`</SwmToken> method emits the updated book data to the parent component and closes the update form.

@param {Object} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="140:10:10" line-data="     * @param {Object} updatedBook - The updated book data.">`updatedBook`</SwmToken> - The updated book data.\
@returns {void}

```
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
```

---

</SwmSnippet>

# Closing the details view

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="147">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="152:1:1" line-data="    closeDetails() { // Function that calls the parent&#39;s close function">`closeDetails`</SwmToken> method emits the 'close' event to notify the parent component to close the details view.

@returns {void}

```
    /**
     * Emits the 'close' event to notify the parent component to close the details view.
     *
     * @returns {void}
     */
    closeDetails() { // Function that calls the parent's close function
      this.$emit('close');
    },
```

---

</SwmSnippet>

# Managing favorites

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="155">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="161:1:1" line-data="    isFavorite(bookId) { // Function return if books is already in favorites">`isFavorite`</SwmToken> method checks if a book is in the user's favorites.

@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="158:10:10" line-data="     * @param {string} bookId - The ID of the book to check.">`bookId`</SwmToken> - The ID of the book to check.\
@returns {boolean} Returns true if the book is in the favorites, otherwise false.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="165">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="173:3:3" line-data="    async toggleFavorite(bookId) {">`toggleFavorite`</SwmToken> method toggles the favorite status of a book by calling the appropriate API methods to add or remove the book from favorites.

@async\
@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="170:10:10" line-data="     * @param {string} bookId - The ID of the book to toggle as favorite.">`bookId`</SwmToken> - The ID of the book to toggle as favorite.\
@returns {Promise<void>} Resolves when the favorite status is toggled.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="182">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="189:3:3" line-data="    async favoriteBook(bookId) {">`favoriteBook`</SwmToken> method adds a book to the user's favorites by calling the API.

@async\
@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="186:10:10" line-data="     * @param {string} bookId - The ID of the book to add to favorites.">`bookId`</SwmToken> - The ID of the book to add to favorites.\
@returns {Promise<void>} Resolves when the book is added to favorites or logs an error if it fails.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="213">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="220:3:3" line-data="    async unfavoriteBook(bookId) {">`unfavoriteBook`</SwmToken> method removes a book from the user's favorites by calling the API.

@async\
@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="217:10:10" line-data="     * @param {string} bookId - The ID of the book to remove from favorites.">`bookId`</SwmToken> - The ID of the book to remove from favorites.\
@returns {Promise<void>} Resolves when the book is removed from favorites or logs an error if it fails.

```
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
```

---

</SwmSnippet>

# Fetching the book cover image

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="242">

---

The <SwmToken path="/front-end/src/components/BookDetails.vue" pos="249:1:1" line-data="    getBookCover(isbn) {">`getBookCover`</SwmToken> method fetches the book cover image using the book's ISBN from the Google Books API. It updates the cover image if available, otherwise uses a placeholder image.

@param {string} <SwmToken path="/front-end/src/components/BookDetails.vue" pos="246:10:10" line-data="     * @param {string} isbn - The ISBN of the book to fetch the cover for.">`isbn`</SwmToken> - The ISBN of the book to fetch the cover for.\
@returns {void}

```
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
```

---

</SwmSnippet>

# Component lifecycle

<SwmSnippet path="/front-end/src/components/BookDetails.vue" line="274">

---

The component fetches the book cover image and checks if the book is already a favorite when it is mounted.

```
  components: {
    UpdateBookForm
  },
  mounted() {
    this.getBookCover(this.book.isbn);
    this.book.isFavorite = this.isFavorite(this.book.book_id); // Initial check if the book is already a favorite

  }
```

---

</SwmSnippet>

This concludes the walkthrough of the BookDetails feature. The implementation ensures that users can view detailed information about a book, manage their favorites, and for admins, update or delete the book.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
