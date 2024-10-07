---
title: Home
---
# Introduction

Path : <SwmPath>[front-end/src/views/Home.vue](/front-end/src/views/Home.vue)</SwmPath>

This document will walk you through the implementation of the Home feature in the front-end of our application.

The feature allows users to:

1. Search for books.
2. View book details.
3. Add new books.
4. Filter books by categories.
5. Toggle favorite status for books.

We will cover:

1. How the UI components are structured.
2. How data is managed and fetched.
3. How user interactions are handled.

# UI components structure

The Home view template is structured to include several key components: Header, <SwmToken path="/front-end/src/views/Home.vue" pos="10:2:2" line-data="    &lt;BookList">`BookList`</SwmToken>, <SwmToken path="/front-end/src/views/Home.vue" pos="18:2:2" line-data="    &lt;CategoryList">`CategoryList`</SwmToken>, <SwmToken path="/front-end/src/views/Home.vue" pos="23:2:2" line-data="    &lt;BookDetails">`BookDetails`</SwmToken>, and <SwmToken path="/front-end/src/views/Home.vue" pos="32:2:2" line-data="    &lt;AddBookForm @close-form=&quot;hideAddBookForm&quot; @add-book=&quot;addBook&quot; /&gt;">`AddBookForm`</SwmToken>. Each component has specific props and event handlers.

<SwmSnippet path="/front-end/src/views/Home.vue" line="6">

---

The Header component is responsible for handling search queries and showing the form to add a new book.

```
<template>
  <div>
    <Header :searchQuery="searchQuery" @search="handleSearch" @showAddBookForm="showAddBookForm" />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="9">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="10:2:2" line-data="    &lt;BookList">`BookList`</SwmToken> component displays the list of books filtered by the search query.

```
    <!-- Display book list -->
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

<SwmSnippet path="/front-end/src/views/Home.vue" line="17">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="18:2:2" line-data="    &lt;CategoryList">`CategoryList`</SwmToken> component displays the list of all categories and handles category selection.

```
    <!-- Display the list of all categories -->
    <CategoryList
        :categories="categories"
        @selectCategory="openCategoryPopup"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="22">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="23:2:2" line-data="    &lt;BookDetails">`BookDetails`</SwmToken> component shows the details of a selected book in an overlay.

```
    <!-- Book Details Overlay -->
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        :categories="categories"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="31">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="32:2:2" line-data="    &lt;AddBookForm @close-form=&quot;hideAddBookForm&quot; @add-book=&quot;addBook&quot; /&gt;">`AddBookForm`</SwmToken> component is displayed in an overlay when the user wants to add a new book.

```
  <div v-if="isAddBookFormVisible" class="overlay">
    <AddBookForm @close-form="hideAddBookForm" @add-book="addBook" />
  </div>
</template>
```

---

</SwmSnippet>

# Data management

<SwmSnippet path="/front-end/src/views/Home.vue" line="46">

---

The data function initializes the state variables used in the Home view. This includes the search query, books array, categories, and various flags for UI state management.

```
  data() {
    return {
      searchQuery: "",
      books: [],
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      selectedCategory: "",
      showCategoryPopup: false,
      showDetails: false,
      showUpdateForm: false,
      selectedBook: null,
      showBookDetails: false,
      isAddBookFormVisible: false,
      isEmpty: true,
    };
  },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="61">

---

The computed method <SwmToken path="/front-end/src/views/Home.vue" pos="66:1:1" line-data="    filteredBooks() {">`filteredBooks`</SwmToken> filters the list of books based on the search query.

returns {Array} - Array of filtered books.

```
  computed: {
    /**
     * Filters the list of books based on the search query.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      if (this.searchQuery.trim() === "") {
        return this.books; // If no search query, return all books
      }
      return this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase());
      });
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="75">

---

The computed method <SwmToken path="/front-end/src/views/Home.vue" pos="79:1:1" line-data="    searchTitle() {">`searchTitle`</SwmToken> returns the title to be displayed based on the search query.

@returns {string} - Title for the search results or recent search.

```
    /**
     * Returns the title to be displayed based on the search query.
     * @returns {string} - Title for the search results or recent search.
     */
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="84">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="87:1:1" line-data="    fetchBooks() {">`fetchBooks`</SwmToken> method fetches books from the API and updates the local books array.

```
    /**
     * Fetches books from the API and updates the local books array.
     */
    fetchBooks() {
      console.log(this.$store.state.userId);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {console.log(result)
            this.books = result;
          })
          .catch((error) => console.error(error));
    },
```

---

</SwmSnippet>

# User interactions

<SwmSnippet path="/front-end/src/views/Home.vue" line="106">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="110:1:1" line-data="    openCategoryPopup(category) {">`openCategoryPopup`</SwmToken> method opens the category popup for the selected category.

@param {string} <SwmToken path="/front-end/src/views/Home.vue" pos="110:3:3" line-data="    openCategoryPopup(category) {">`category`</SwmToken> - The selected category.

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
          fromFavorites: false
        }
      });
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="121">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="125:1:1" line-data="    showBookDetailsOverlay(book) {">`showBookDetailsOverlay`</SwmToken> method displays the details overlay for the selected book.

@param {Object} <SwmToken path="/front-end/src/views/Home.vue" pos="125:3:3" line-data="    showBookDetailsOverlay(book) {">`book`</SwmToken> - The selected book object.

```
    /**
     * Displays the details overlay for the selected book.
     * @param {Object} book - The selected book object.
     */
    showBookDetailsOverlay(book) {
      this.selectedBook = book; // Set the selected book
      this.showBookDetails = true; // Show the modal
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="129">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="132:1:1" line-data="    closeDetails() {">`closeDetails`</SwmToken> method closes the book details overlay.

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

<SwmSnippet path="/front-end/src/views/Home.vue" line="136">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="140:1:1" line-data="    toggleFavorite(book) {">`toggleFavorite`</SwmToken> method toggles the favorite status of the selected book.

@param {Object} <SwmToken path="/front-end/src/views/Home.vue" pos="140:3:3" line-data="    toggleFavorite(book) {">`book`</SwmToken> - The book whose favorite status is being toggled.

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

<SwmSnippet path="/front-end/src/views/Home.vue" line="144">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="148:1:1" line-data="    updateBook(book) {">`updateBook`</SwmToken> method updates the specified book and hides the update form.

@param {Object} <SwmToken path="/front-end/src/views/Home.vue" pos="148:3:3" line-data="    updateBook(book) {">`book`</SwmToken> - The book to be updated.

```
    /**
     * Updates the specified book and hides the update form.
     * @param {Object} book - The book to be updated.
     */
    updateBook(book) {
      alert(`Updated ${book.title}`);
      this.showUpdateForm = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="152">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="155:1:1" line-data="    showAddBookForm(){">`showAddBookForm`</SwmToken> method shows the form to add a new book.

```
    /**
     * Shows the form to add a new book.
     */
    showAddBookForm(){
      this.isAddBookFormVisible = true;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="158">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="161:1:1" line-data="    hideAddBookForm() {">`hideAddBookForm`</SwmToken> method hides the add book form.

```
    /**
     * Hides the add book form.
     */
    hideAddBookForm() {
      this.isAddBookFormVisible = false;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="164">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="168:1:1" line-data="    addBook(newBook) {">`addBook`</SwmToken> method adds a new book to the books array.

@param {Object} <SwmToken path="/front-end/src/views/Home.vue" pos="168:3:3" line-data="    addBook(newBook) {">`newBook`</SwmToken> - The new book to be added.

```
    /**
     * Adds a new book to the books array.
     * @param {Object} newBook - The new book to be added.
     */
    addBook(newBook) {
      this.books.push(newBook);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="171">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="175:1:1" line-data="    updateSearchQuery(query) {">`updateSearchQuery`</SwmToken> method updates the search query based on user input.

@param {string} <SwmToken path="/front-end/src/views/Home.vue" pos="175:3:3" line-data="    updateSearchQuery(query) {">`query`</SwmToken> - The search query to update.

```
    /**
     * Updates the search query based on user input.
     * @param {string} query - The search query to update.
     */
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/Home.vue" line="178">

---

The <SwmToken path="/front-end/src/views/Home.vue" pos="182:1:1" line-data="    handleSearch(query) {">`handleSearch`</SwmToken> method handles the search action by updating the search query.

@param {string} <SwmToken path="/front-end/src/views/Home.vue" pos="182:3:3" line-data="    handleSearch(query) {">`query`</SwmToken> - The search query to set.

```
    /**
     * Handles the search action by updating the search query.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    }
  },
```

---

</SwmSnippet>

# Initialization

<SwmSnippet path="/front-end/src/views/Home.vue" line="186">

---

The mounted lifecycle hook fetches books on component mount and sets up polling to fetch new books every 5 seconds. It also initializes favorites from the store.

```
  mounted() {
    this.fetchBooks();  // Fetch books on component mount
    this.polling = setInterval(() => {
      this.fetchBooks(); // Poll for new books every 5 seconds
    }, 5000);
    this.$store.dispatch('initFavorites'); // Initialize favorites from the store
  },
  components: {
    Header,
    CategoryList,
    CategoryBookList,
    BookList,
    BookDetails,
    UpdateBookForm,
    AddBookForm
  }
```

---

</SwmSnippet>

# Conclusion

This document has walked you through the implementation of the Home feature, covering the UI components structure, data management, and user interactions. The design decisions were made to ensure a clear separation of concerns and efficient data handling.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
