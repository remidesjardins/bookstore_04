---
title: CategoryBookList
---
# Introduction

Path : <SwmPath>[front-end/src/views/CategoryBookList.vue](/front-end/src/views/CategoryBookList.vue)</SwmPath>

This document will walk you through the implementation of the `CategoryBookList` feature.

The feature displays a list of books filtered by category and search query, with additional functionalities like viewing book details and handling favorites.

We will cover:

1. How the component initializes and fetches data.
2. How the books are filtered based on category and search query.
3. How user interactions are handled, including searching and viewing book details.

# Component initialization and data fetching

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="38">

---

The component initializes with a set of data properties and fetches the list of books from an API when mounted. This ensures that the component has the necessary data to display the books.

```
  data() {
    return {
      books: [],
      searchQuery: "",
      selectedCategory: this.$route.params.category, // Get category from route params
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"],
      showDetails: false,
      selectedBook: null,
      showBookDetails: false,
    };
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    fromFavorites: Boolean,
  },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="87">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="90:1:1" line-data="    fetchBooks() {">`fetchBooks`</SwmToken> method is responsible for fetching the list of books from the API and updating the local state. This method is called when the component is mounted.

```
    /**
     * Fetches the list of books from the API and updates the local state.
     */
    fetchBooks() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://bot.servhub.fr/api/books", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("Result: ", result);
            this.books = result; // Update the books array with the fetched result
          })
          .catch((error) => console.error(error));
    },
```

---

</SwmSnippet>

# Filtering books by category and search query

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="56">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="61:1:1" line-data="    filteredBooks() {">`filteredBooks`</SwmToken> computed property filters the list of books based on the search query and selected category. This ensures that only the relevant books are displayed to the user.

@returns {Array} - Array of filtered books.

```
  computed: {
    /**
     * Filters the list of books based on the search query and selected category.
     * @returns {Array} - Array of filtered books.
     */
    filteredBooks() {
      let booksToFilter = [];

      // Convert query param to boolean
      const fromFavorites = JSON.parse(this.$route.query.fromFavorites || 'false');

      if (fromFavorites) {
        booksToFilter = this.$store.state.favoriteBooks;
      } else {
        booksToFilter = this.books;
      }

      // Filter books by selected category and search query
      if (this.searchQuery.trim() === "") {
        return booksToFilter.filter(book => book.category === this.$route.params.category);
      }


      return booksToFilter.filter(book =>
          book.category === this.$route.params.category &&
          (book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              book.book_id.toString().includes(this.searchQuery.toLowerCase()))
      );
    },
  },
```

---

</SwmSnippet>

# User interactions

## Handling search queries

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="110">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="114:1:1" line-data="    handleSearch(query) {">`handleSearch`</SwmToken> method updates the search query based on user input. This allows the user to search for books within the selected category.

@param {string} <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="114:3:3" line-data="    handleSearch(query) {">`query`</SwmToken> - The search query to set.

```
    /**
     * Updates the search query based on user input.
     * @param {string} query - The search query to set.
     */
    handleSearch(query) {
      this.searchQuery = query;
    },
```

---

</SwmSnippet>

## Displaying book details

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="118">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="122:1:1" line-data="    showBookDetailsOverlay(book) {">`showBookDetailsOverlay`</SwmToken> method displays the details overlay for the selected book. This provides the user with more information about the selected book.

@param {Object} <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="122:3:3" line-data="    showBookDetailsOverlay(book) {">`book`</SwmToken> - The selected book object.

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

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="126">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="129:1:1" line-data="    closeDetails() {">`closeDetails`</SwmToken> method closes the book details overlay.

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

## Closing the category popup

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="132">

---

The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="135:1:1" line-data="    closePopup() {">`closePopup`</SwmToken> method closes the category popup and navigates back to the home page.

```
    /**
     * Closes the category popup and navigates back to the home page.
     */
    closePopup() {
      this.$router.push('/');
    },
```

---

</SwmSnippet>

# Additional components and template structure

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="6">

---

The template includes various components and elements to display the books and handle user interactions. The <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="7:3:3" line-data="  &lt;!-- Header component with search functionality --&gt;">`Header`</SwmToken> component provides search functionality, while the <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="17:3:3" line-data="    &lt;!-- BookList component displaying books filtered by category --&gt;">`BookList`</SwmToken> and <SwmToken path="/front-end/src/views/CategoryBookList.vue" pos="21:2:2" line-data="    &lt;BookDetails">`BookDetails`</SwmToken> components display the list of books and book details, respectively.

```
<template>
  <!-- Header component with search functionality -->
  <Header :searchQuery="searchQuery" @search="handleSearch" />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/CategoryBookList.vue" line="10">

---

```
  <!-- Popup for displaying books in the selected category -->
  <div class="category-popup">
    <span class="close-button" @click="closePopup"><i class="fa-solid fa-xmark fa-2xl"/></span>

    <!-- Title indicating the selected category -->
    <h3>Books in {{ selectedCategory }}</h3>

    <!-- BookList component displaying books filtered by category -->
    <BookList :bookList="filteredBooks" @bookSelected="showBookDetailsOverlay"/>

    <!-- Book Details Overlay for selected book -->
    <BookDetails
        v-if="showBookDetails"
        :book="selectedBook"
        :categories="categories"
        @close="closeDetails"
        @favoriteToggled="toggleFavorite"
    />
  </div>
</template>
```

---

</SwmSnippet>

# Conclusion

This document covered the main aspects of the `CategoryBookList` feature, including data fetching, filtering books, and handling user interactions. The implementation ensures that users can easily view and search for books within a selected category.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
