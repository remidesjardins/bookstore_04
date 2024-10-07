---
title: Header
---
# Introduction

Path : <SwmPath>[front-end/src/components/Header.vue](/front-end/src/components/Header.vue)</SwmPath>

This document will walk you through the implementation of the header component in our front-end application.

The header component provides navigation and search functionalities. It includes a logo, a hamburger menu for mobile view, and various navigation icons.

We will cover:

1. The structure of the header component.
2. The state management and props used.
3. The methods implemented for navigation and interaction.

# Structure of the header component

The header includes a logo, a hamburger menu, a search bar, and navigation icons.

<SwmSnippet path="/front-end/src/components/Header.vue" line="5">

---

The template structure is as follows:

```
<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK HAVEN</span>
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

    <SearchBar :searchQuery="searchQuery" @search="emitSearchQuery" />

    <div class="header-icons" :class="{ 'mobile-menu': isMenuOpen }">
      <div class="home"  @click="goToHome">
        Home <span class="icon"></span><i class="fa-solid fa-house fa-1x"></i>
      </div>
      <div class="add-book" @click.stop="showAddBookForm" v-if="this.$store.state.isAdmin">
        Add a book <span class="icon"><i class="fa-solid fa-plus fa-sm"></i></span>
      </div>
      <div class="favorite" @click="goToFavorites">
        Favorite <span class="icon"> <i class="fa-solid fa-star fa-xs"></i> </span>
      </div>
      <div class="logout" @click="logOut">
        Log Out <span class="icon"></span><i class="fa-solid fa-right-from-bracket fa-lg"></i></div>
    </div>
  </header>
</template>
```

---

</SwmSnippet>

# State management and props

<SwmSnippet path="/front-end/src/components/Header.vue" line="39">

---

The component uses a prop to receive the search query and maintains local state for the menu visibility.

```
  props: ['searchQuery'],
  data() {
    return {
      isMenuOpen: false,
      books: [],
    };
  },
```

---

</SwmSnippet>

# Methods for navigation and interaction

The component includes several methods to handle navigation and user interactions. These methods are documented using JSDoc comments.

## Navigate to favorites

<SwmSnippet path="/front-end/src/components/Header.vue" line="47">

---

This method navigates the user to the favorites page.

@returns {void}

```
    /**
     * Navigate to the favorites page.
     * @returns {void}
     */
    goToFavorites() {
      this.$router.push("/favorites");
    },
```

---

</SwmSnippet>

## Navigate to home

<SwmSnippet path="/front-end/src/components/Header.vue" line="54">

---

This method navigates the user to the home page.

@returns {void}

```
    /**
     * Navigate to the home page.
     * @returns {void}
     */
    goToHome(){
      this.$router.push("/");
    },
```

---

</SwmSnippet>

## Emit search query

<SwmSnippet path="/front-end/src/components/Header.vue" line="61">

---

This method emits the search query to the parent component for handling.

param {string} <SwmToken path="/front-end/src/components/Header.vue" pos="66:3:3" line-data="    searchBook(query) {">`query`</SwmToken> - The search query entered by the user.\
@returns {void}

```
    /**
     * Emit the search query to the parent component.
     * @param {string} query - The search query entered by the user.
     * @returns {void}
     */
    searchBook(query) {
      this.$emit("update:searchQuery", query);
    },
```

---

</SwmSnippet>

## Show add book form

<SwmSnippet path="/front-end/src/components/Header.vue" line="69">

---

This method emits an event to show the add book form, available only to admin users.

@returns {void}

```
    /**
     * Emit an event to show the add book form.
     * @returns {void}
     */
    showAddBookForm() {
      this.$emit("showAddBookForm");
    },
```

---

</SwmSnippet>

## Toggle menu visibility

<SwmSnippet path="/front-end/src/components/Header.vue" line="76">

---

This method toggles the visibility of the mobile menu.

@returns {void}

```
    /**
     * Toggle the visibility of the menu.
     * @returns {void}
     */
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
```

---

</SwmSnippet>

## Emit search query for external handling

<SwmSnippet path="/front-end/src/components/Header.vue" line="83">

---

This method emits the search query for external handling.

@param {string} <SwmToken path="/front-end/src/components/Header.vue" pos="88:3:3" line-data="    emitSearchQuery(query) {">`query`</SwmToken> - The search query to emit.\
@returns {void}

```
    /**
     * Emit the search query for external handling.
     * @param {string} query - The search query to emit.
     * @returns {void}
     */
    emitSearchQuery(query) {
      this.$emit("search", query);
    },
```

---

</SwmSnippet>

## Log out

<SwmSnippet path="/front-end/src/components/Header.vue" line="91">

---

This method dispatches the logout action to the Vuex store.

@returns {void}

```
    /**
     * Dispatch the logout action to the Vuex store.
     * @returns {void}
     */

    logOut(){
      this.$store.dispatch("logout");
    }
```

---

</SwmSnippet>

# Search bar component

<SwmSnippet path="/front-end/src/components/Header.vue" line="100">

---

The header component includes a <SwmToken path="/front-end/src/components/Header.vue" pos="101:1:1" line-data="    SearchBar">`SearchBar`</SwmToken> component, which is registered locally.

```
  components: {
    SearchBar
  }
```

---

</SwmSnippet>

This concludes the walkthrough of the header component implementation. The design decisions focus on providing clear navigation and search functionalities while maintaining a responsive layout.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
