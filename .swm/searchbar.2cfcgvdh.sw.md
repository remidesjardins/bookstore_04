---
title: SearchBar
---
# Introduction

Path : <SwmPath>[front-end/src/components/SearchBar.vue](/front-end/src/components/SearchBar.vue)</SwmPath>

This document will walk you through the implementation of the <SwmToken path="/front-end/src/components/SearchBar.vue" pos="35:8:8" line-data="      console.log(&quot;Test SearchBar&quot;);">`SearchBar`</SwmToken> feature.

The feature allows users to search for books by title or ID.

We will cover:

1. How the search input is handled.
2. How the search query is emitted to the parent component.
3. How the list of books is filtered based on the search query.

# Handling the search input

<SwmSnippet path="/front-end/src/components/SearchBar.vue" line="5">

---

The search input is defined in the template. It binds the input value to the <SwmToken path="/front-end/src/components/SearchBar.vue" pos="9:5:5" line-data="        :value=&quot;searchQuery&quot;">`searchQuery`</SwmToken> prop and listens for input events to emit the search query.

```
<template>
  <div class="search-bar">
    <input
        type="text"
        :value="searchQuery"
        @input="emitSearch($event.target.value)"
        placeholder="Search for a book..."
    />
  </div>
</template>
```

---

</SwmSnippet>

# Emitting the search query

<SwmSnippet path="/front-end/src/components/SearchBar.vue" line="18">

---

The <SwmToken path="/front-end/src/components/SearchBar.vue" pos="18:6:6" line-data="  props: [&quot;searchQuery&quot;],">`searchQuery`</SwmToken> prop is passed to the component to keep track of the user's input.

```
  props: ["searchQuery"],
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/SearchBar.vue" line="20">

---

The <SwmToken path="/front-end/src/components/SearchBar.vue" pos="25:1:1" line-data="    emitSearch(query) {">`emitSearch`</SwmToken> method is responsible for emitting the search query to the parent component. This allows the parent component to react to the user's input.

@param {string} <SwmToken path="/front-end/src/components/SearchBar.vue" pos="25:3:3" line-data="    emitSearch(query) {">`query`</SwmToken> - The search query entered by the user.\
@returns {void}

```
    /**
     * Emit the search query to the parent component.
     * @param {string} query - The search query entered by the user.
     * @returns {void}
     */
    emitSearch(query) {
      this.$emit("search", query);
    }
```

---

</SwmSnippet>

# Filtering the list of books

<SwmSnippet path="/front-end/src/components/SearchBar.vue" line="29">

---

The <SwmToken path="/front-end/src/components/SearchBar.vue" pos="34:1:1" line-data="    filteredBooks() {">`filteredBooks`</SwmToken> computed (on continuous run) method filters the list of books based on the search query. It returns books that match the query by title or ID.

@returns {Array} - An array of books that match the search query.

```
  computed: {
    /**
     * Filter the list of books based on the search query.
     * @returns {Array} - An array of books that match the search query.
     */
    filteredBooks() {
      console.log("Test SearchBar");
      // Only return books that match the search query
      if (this.searchQuery.trim() === "") {
        return this.books;
      }
      return this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.book_id.toString().includes(this.searchQuery.toLowerCase());
      });
    },
  }
```

---

</SwmSnippet>

This concludes the walkthrough of the <SwmToken path="/front-end/src/components/SearchBar.vue" pos="35:8:8" line-data="      console.log(&quot;Test SearchBar&quot;);">`SearchBar`</SwmToken> feature. The implementation ensures that user input is captured, emitted to the parent component, and used to filter the list of books.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
