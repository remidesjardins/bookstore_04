---
title: UpdateBookForm
---
# Introduction

Path : <SwmPath>[front-end/src/components/UpdateBookForm.vue](/front-end/src/components/UpdateBookForm.vue)</SwmPath>

This document will walk you through the implementation of the UpdateBookForm feature.

The feature allows users to update book details through a form. We will cover:

1. How the form is structured.
2. How book details are fetched and populated.
3. How the form submission updates the book details.

# Form structure

The form includes fields for ISBN, title, author, price, category, and summary. The form also has a submit button to update the book details.

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="5">

---

The main container and header are defined as follows:

```
<template>

  <!-- Main container for the add/update book form -->
  <div class="add-book-form">
    <div class="form-header">
      <h2>Update Book</h2>
      <button @click="$emit('close')" class="close-btn"><i class="fa-solid fa-xmark fa-xl"></i></button>
    </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="13">

---

The form itself is structured with various input fields:

```

    <!-- Form for updating book details -->
    <form @submit.prevent="updateBook">
      <!-- Row for ISBN input -->
      <div class="form-row">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" placeholder="Enter ISBN" required />
        </div>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="23">

---

The title and author fields are defined here:

```

      <!-- Row for Title and Author inputs -->
      <div class="form-row">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="book.title" placeholder="Enter book title" required />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="30">

---

The price and category fields are defined here:

```

        <div class="form-group">
          <label for="author">Author</label>
          <input type="text" id="author" v-model="book.author" placeholder="Enter author name" required />
        </div>
      </div>

      <!-- Row for Price and Category inputs -->
      <div class="form-row">
        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="book.price" placeholder="Enter price" required />
        </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="51">

---

The summary field and a hidden input for the cover image are defined here:

```

      <!-- Summary text area for book description -->
      <div class="form-group">
        <label for="summary">Summary</label>
        <textarea id="summary" v-model="book.summary" placeholder="Enter book summary" required></textarea>
      </div>

      <!-- Hidden input for cover_image -->
      <input type="hidden" v-model="book.cover_image" />
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="60">

---

Finally, the submit button is defined here:

```

      <!-- Submit button for updating the book -->
      <button type="submit" class="submit-btn">Update Book</button>
    </form>
  </div>
</template>
```

---

</SwmSnippet>

# Data and props

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="69">

---

The component uses a <SwmToken path="/front-end/src/components/UpdateBookForm.vue" pos="69:6:6" line-data="  props: [&#39;bookId&#39;],">`bookId`</SwmToken> prop to identify which book to update. It also initializes the <SwmToken path="/front-end/src/components/UpdateBookForm.vue" pos="72:1:1" line-data="      book: {">`book`</SwmToken> data object with default values and a list of categories.

```
  props: ['bookId'],
  data() {
    return {
      book: {
        title: '',
        author: '',
        isbn: '',
        price: '',
        category: '',
        summary: '',
        cover_image: 'https://via.placeholder.com/150?text=No+Cover'
      },
      categories: ["Science-Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"]
    };
  },
```

---

</SwmSnippet>

# Fetching book details

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="84">

---

When the component is mounted, it fetches the current book details using the <SwmToken path="/front-end/src/components/UpdateBookForm.vue" pos="86:3:3" line-data="    this.fetchBookDetails();">`fetchBookDetails`</SwmToken> method. This ensures the form is populated with the existing data for the book.

```
  mounted() {
    // Lifecycle hook to fetch the current book details when the component is mounted
    this.fetchBookDetails();
  },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="89">

---

The <SwmToken path="/front-end/src/components/UpdateBookForm.vue" pos="92:3:3" line-data="    async fetchBookDetails() {">`fetchBookDetails`</SwmToken> method is defined as follows:

```
    /**
     * Fetches the details of the book based on the provided bookId.
     */
    async fetchBookDetails() {
      try {
        const token = this.$store.state.userToken; // Get the token from the Vuex store
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="95">

---

It makes an API call to fetch the book details:

```

        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        });
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="103">

---

The fetched data is then merged into the form fields:

```

        const data = await response.json();

        if (data && data[0]) {
          this.book = { ...this.book, ...data[0] }; // Merge the fetched data into the form fields
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    },
```

---

</SwmSnippet>

# Updating book details

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="114">

---

The <SwmToken path="/front-end/src/components/UpdateBookForm.vue" pos="117:3:3" line-data="    async updateBook() {">`updateBook`</SwmToken> method is responsible for sending the updated book details to the API. It first checks that all required fields are filled out.

```
    /**
     * Updates the book details by sending the updated data to the API.
     */
    async updateBook() {
      try {
        // Ensure all required fields are populated
        if (!this.book.title || !this.book.author || !this.book.cover_image || !this.book.category || !this.book.summary || !this.book.isbn) {
          alert("All fields must be filled out.");
          return;
        }
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="124">

---

It then makes an API call to update the book details:

```

        const token = this.$store.state.userToken;
        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(this.book),
        });
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/UpdateBookForm.vue" line="134">

---

If the update is successful, a success message is shown and the form is closed:

```

        const result = await response.json();
        if (response.ok) {
          alert(`Book "${this.book.title}" updated successfully!`);
          this.$emit('close');  // Close the form after submission
        } else {
          alert("Error updating book: " + result.message);
        }
      } catch (error) {
        console.error("Error updating book:", error);
      }
    }
  }
};
```

---

</SwmSnippet>

# Conclusion

This document covered the structure of the UpdateBookForm, how it fetches and populates book details, and how it updates the book details upon form submission. The use of JSDoc comments helps describe the methods for better understanding and maintenance.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
