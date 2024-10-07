---
title: Favorites
---
# Introduction

Path : <SwmPath>[front-end/src/views/Favorites.vue](/front-end/src/views/Favorites.vue)</SwmPath>

This document will walk you through the implementation of the "Favorites" feature.

The feature allows users to manage their favorite books, search through them, and view details. It also includes category filtering and toggling favorite status.

We will cover:

1. How the UI components are structured.
2. How the data is managed and fetched.
3. How the search and filtering functionalities are implemented.
4. How the favorite status is toggled and book details are displayed.

# UI components structure

The main UI components handle the display and interaction logic.

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="5">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="7:3:3" line-data="    &lt;!-- Header component with search functionality --&gt;">`Header`</SwmToken> component includes search functionality:

```
<template>
  <div>
    <!-- Header component with search functionality -->
    <Header :searchQuery="searchQuery" @search="handleSearch" />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="10">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="10:3:3" line-data="    &lt;!-- BookList component that displays the list of filtered books --&gt;">`BookList`</SwmToken> component displays the list of filtered books:

```
    <!-- BookList component that displays the list of filtered books -->
    <BookList
        :bookList="filteredBooks"
        @bookSelected="showBookDetailsOverlay"
        @toggleFavorite="toggleFavorite"
        :text="searchTitle"
        :isEmpty="filteredBooks.length === 0"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="18">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="18:3:3" line-data="    &lt;!-- CategoryList component that displays available categories --&gt;">`CategoryList`</SwmToken> component shows available categories:

```
    <!-- CategoryList component that displays available categories -->
    <CategoryList
        :categories="categories"
        @selectCategory="openCategoryPopup"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="24">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="25:2:2" line-data="    &lt;BookDetails">`BookDetails`</SwmToken> component displays the details of a selected book:

```
    <!-- Book Details Overlay -->
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
</template>
```

---

</SwmSnippet>

# Data management

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="42">

---

The data function initializes the state variables used in the component. This includes the search query, selected book, and categories.

```
  data() {
    return {
      searchQuery: "",
      selectedBook: null,
      showBookDetails: false,
      selectedCategory: '',
      category: '',
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],


    };
  },
```

---

</SwmSnippet>

# Fetching favorite books

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="83">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="86:3:3" line-data="    async fetchFavoriteBooks() {">`fetchFavoriteBooks`</SwmToken> method fetches the user's favorite books from the API. It uses the user ID and token from the store to make an authenticated request.

```
    /**
     * Fetches the user's favorite books from the API.
     */
    async fetchFavoriteBooks() {
      try {
        const userId = this.$store.state.userId;
        const token = this.$store.state.userToken;

        const requestOptions = {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`https://bot.servhub.fr/api/favorites/${userId}`, requestOptions);
        const result = await response.json();
        console.log("Favorites from API: ", result);
        this.$store.commit('setFavorites', result);
      } catch (error) {
        console.log("Error fetching favorite books: ", error);
      }
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="151">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="151:1:1" line-data="  mounted() {">`mounted`</SwmToken> lifecycle hook ensures that favorite books are fetched when the component is mounted or when the user ID becomes available.

```
  mounted() {
    // Fetch favorite books if the user ID is available
    if (this.$store.state.userId) {
      this.fetchFavoriteBooks();
    } else {
      // Watch for changes in user ID and fetch favorites if it becomes available
      this.$store.watch(
          (state) => state.userId,
          (newUserId) => {
            if (newUserId) {
              this.fetchFavoriteBooks();
            }
          }
      );
    }
  },
  components: {
    Header,
    BookList,
    BookDetails,
    CategoryList,
    CategoryBookList,
  },
```

---

</SwmSnippet>

# Search and filtering functionalities

<SwmSnippet path="front-end/src/views/Favorites.vue" line="54">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="59:1:1" line-data="    filteredBooks() {">`filteredBooks`</SwmToken> computed (on a continious run) method filters the list of favorite books based on the search query.

@returns {Array} - Array of filtered books.

```
  computed: {
    /**
     * Filters the list of favorite books based on the search query.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        console.log("Test : ", this.$store.state.favoriteBooks);
        return this.$store.state.favoriteBooks;
      }
      return this.$store.state.favoriteBooks.filter((book) => {
        return (
            book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase())
        );
      });
    },
```

---

</SwmSnippet>

<SwmSnippet path="front-end/src/views/Favorites.vue" line="71">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="75:1:1" line-data="    searchTitle() {">`searchTitle`</SwmToken> computed property determines the title to be displayed based on the search query.

@returns {string} - Title for the search results or favorites.

```
    /**
     * Determines the title to be displayed based on the search query.
     * @returns {string} - Title for the search results or favorites.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Your Favorites" : "Search Result";
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="128">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="132:1:1" line-data="    handleSearch(query) {">`handleSearch`</SwmToken> method updates the search query when a search action is performed.

@param {string} <SwmToken path="/front-end/src/views/Favorites.vue" pos="132:3:3" line-data="    handleSearch(query) {">`query`</SwmToken> - The search query to set.

```
    /**
     * Handles the search action by updating the search query.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    },
```

---

</SwmSnippet>

# Toggling favorite status and displaying book details

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="120">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="124:1:1" line-data="    toggleFavorite(book) {">`toggleFavorite`</SwmToken> method toggles the favorite status of a selected book and displays an alert.

@param {Object} <SwmToken path="/front-end/src/views/Favorites.vue" pos="124:3:3" line-data="    toggleFavorite(book) {">`book`</SwmToken> - The book whose favorite status is being toggled.

```
    /**
     * Toggles the favorite status of the selected book.
     * @param {Object} book - The book whose favorite status is being toggled.
     */
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite; // Toggle the favorite status
      alert(`${book.title} has been ${book.isFavorite ? "added to" : "removed from"} favorites.`);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="106">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="110:1:1" line-data="    showBookDetailsOverlay(book) {">`showBookDetailsOverlay`</SwmToken> method displays the details overlay for the selected book.

@param {Object} <SwmToken path="/front-end/src/views/Favorites.vue" pos="110:3:3" line-data="    showBookDetailsOverlay(book) {">`book`</SwmToken> - The selected book object.

```
    /**
     * Displays the details overlay for the selected book.
     * @param {Object} book - The selected book object.
     */
    showBookDetailsOverlay(book) {
      this.selectedBook = book;
      this.showBookDetails = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="114">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="117:1:1" line-data="    closeDetails() {">`closeDetails`</SwmToken> method closes the book details overlay.

```
    /**
     * Closes the book details overlay.
     */
    closeDetails() {
      this.showBookDetails = false;
    },
```

---

</SwmSnippet>

# Category filtering

<SwmSnippet path="/front-end/src/views/Favorites.vue" line="135">

---

The <SwmToken path="/front-end/src/views/Favorites.vue" pos="139:1:1" line-data="    openCategoryPopup(category) {">`openCategoryPopup`</SwmToken> method opens the category popup for the selected category and adds a query parameter to indicate filtering by favorites.

@param {string} <SwmToken path="/front-end/src/views/Favorites.vue" pos="139:3:3" line-data="    openCategoryPopup(category) {">`category`</SwmToken> - The selected category.

```
    /**
     * Opens the category popup for the selected category.
     * @param {string} category - The selected category.
     */
    openCategoryPopup(category) {
      this.$router.push({
        name: 'category',
        params: {
          category,
        },
        query: {
          fromFavorites: true // Add a query param to indicate filtering by favorites
        }
      });
    },
```

---

</SwmSnippet>

# Conclusion

This document covered the main aspects of the "Favorites" feature, including UI components, data management, search and filtering functionalities, and toggling favorite status. The implementation ensures that users can efficiently manage and interact with their favorite books.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
