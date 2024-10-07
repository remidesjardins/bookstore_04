---
title: AddBookForm
---
# Introduction

Path : <SwmPath>[front-end/src/components/AddBookForm.vue](/front-end/src/components/AddBookForm.vue)</SwmPath>

This document will walk you through the implementation of the AddBookForm feature.

The feature allows users to add new books to the system by filling out a form. It includes automatic fetching of book details using the Google Books API based on the ISBN, and submission of the form data to a backend API.

We will cover:

1. How the form is structured.
2. How book details are fetched using the Google Books API.
3. How the form data is submitted to the backend.
4. How the form is reset after submission.

# Form structure

The form is structured to collect various details about the book, including ISBN, title, author, price, category, and summary.

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="14">

---

The form starts with an ISBN input field. When the user enters an ISBN and moves out of the field, the <SwmToken path="/front-end/src/components/AddBookForm.vue" pos="19:30:30" line-data="          &lt;input type=&quot;text&quot; id=&quot;isbn&quot; v-model=&quot;book.isbn&quot; @blur=&quot;fetchBookDetails&quot; placeholder=&quot;Enter ISBN&quot; required /&gt;">`fetchBookDetails`</SwmToken> method is triggered to fetch book details from the Google Books API.

```
    <form @submit.prevent="submitForm">
      <!-- ISBN on one line -->
      <div class="form-row">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" @blur="fetchBookDetails" placeholder="Enter ISBN" required />
        </div>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="22">

---

Next, we have input fields for the title and author of the book.

```

      <!-- Title and Author on the same line -->
      <div class="form-row">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="book.title" placeholder="Enter book title" required />
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input type="text" id="author" v-model="book.author" placeholder="Enter author name" required />
        </div>
      </div>

      <!-- ISBN, Price, and Category on the same line -->
      <div class="form-row">
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="38">

---

Following that, there are input fields for the price and a dropdown for selecting the category of the book.

```

        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="book.price" placeholder="Enter price" required />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" v-model="book.category" required>
            <option value="" disabled selected hidden>Choose a category</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="52">

---

A larger text area is provided for entering the book summary. Finally, a submit button is included to submit the form.

```

      <!-- Larger Summary text area -->
      <div class="form-group">
        <label for="summary">Summary</label>
        <textarea id="summary" v-model="book.summary" placeholder="Enter book summary" required></textarea>
      </div>

      <!-- Submit button -->
      <button type="submit" class="submit-btn">Add Book</button>
    </form>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="7">

---

The form header includes a title and a button to close the form.

```
    <div class="form-header">
      <h2>Add Book</h2>
      <!-- Emit event to close the form when the button is clicked -->
      <button @click="$emit('close-form')" class="close-btn"><i class="fa-solid fa-xmark fa-xl"></i></button>
    </div>
```

---

</SwmSnippet>

# Data initialization

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="67">

---

The <SwmToken path="/front-end/src/components/AddBookForm.vue" pos="67:1:1" line-data="  data() {">`data`</SwmToken> method initializes the form data and the list of categories.

```
  data() {
    return {
      book: {
        title: '',
        author: '',
        isbn: '',
        price: '',
        category: '',
        summary: '',
        cover_image: 'https://via.placeholder.com/150?text=No+Cover' // Placeholder image for the book cover
      },
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"]
    };
  },
```

---

</SwmSnippet>

# Fetching book details

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="82">

---

The <SwmToken path="/front-end/src/components/AddBookForm.vue" pos="90:3:3" line-data="    async fetchBookDetails() {">`fetchBookDetails`</SwmToken> method fetches book details from the Google Books API using the ISBN entered by the user. It automatically populates the form with the retrieved details like title, author, category, summary, and cover image. If no details are found or if there's an error, it logs the error in the console.

@async\
@returns {Promise<void>} Resolves when the book details are fetched and the form is updated.

```
    /**
     * Fetches book details from the Google Books API using the book's ISBN.
     * Automatically populates the book form with the retrieved details like title, author, category, summary, and cover image.
     * If no details are found or if there's an error, it logs the error in the console.
     *
     * @async
     * @returns {Promise<void>} Resolves when the book details are fetched and the form is updated.
     */
    async fetchBookDetails() {
      const isbn = this.book.isbn;
      if (isbn) {
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const bookInfo = data.items[0].volumeInfo;

            // Automatically fill the form
            this.book.title = bookInfo.title || '';
            this.book.author = bookInfo.authors ? bookInfo.authors.join(', ') : '';
            this.book.category = bookInfo.categories ? bookInfo.categories[0] : '';
            this.book.summary = bookInfo.description || '';
            this.book.cover_image = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : this.book.cover_image;
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
        }
      }
    },
```

---

</SwmSnippet>

# Submitting the form

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="111">

---

The <SwmToken path="/front-end/src/components/AddBookForm.vue" pos="120:3:3" line-data="    async submitForm() { // Submit form data to the backend API">`submitForm`</SwmToken> method submits the book form data to the backend API to add a new book. It sends a POST request to the backend with the book details and the user's authorization token. If successful, an alert confirms the book was added, the form is reset, and the form is closed. If there's an error, an alert displays the error message.

@async\
@returns {Promise<void>} Resolves when the form data is submitted successfully.

```
    /**
     * Submits the book form data to the backend API to add a new book.
     * Sends a POST request to the backend with the book details and the user's authorization token.
     * If successful, an alert confirms the book was added, the form is reset, and the form is closed.
     * If there's an error, an alert displays the error message.
     *
     * @async
     * @returns {Promise<void>} Resolves when the form data is submitted successfully.
     */
    async submitForm() { // Submit form data to the backend API
      try {
        console.log(this.book);
        const token = this.$store.state.userToken;
        console.log(token);
        const response = await fetch("https://bot.servhub.fr/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(this.book),
        });

        const result = await response.json();
        if (response.ok) {
          alert(`Book "${this.book.title}" added successfully!`);
          this.resetForm();
          this.$emit('close-form');  // Close the form after submission
        } else {
          alert("Error adding book: " + result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
```

---

</SwmSnippet>

# Resetting the form

<SwmSnippet path="/front-end/src/components/AddBookForm.vue" line="146">

---

The <SwmToken path="/front-end/src/components/AddBookForm.vue" pos="152:1:1" line-data="    resetForm() {">`resetForm`</SwmToken> method resets the book form to its initial state, clearing all input fields and setting a default cover image.

```
    /**
     * Resets the book form to its initial state, clearing all input fields.
     * Resets the book object to an empty form with a default cover image.
     *
     * @returns {void} No return value.
     */
    resetForm() {
      this.book = {
        title: '',
        author: '',
        isbn: '',
        price: '',
        category: '',
        summary: '',
        cover_image: 'https://via.placeholder.com/150?text=No+Cover'
      };
    }
```

---

</SwmSnippet>

# Conclusion

This document explained the structure and functionality of the AddBookForm feature, including how book details are fetched and how the form data is submitted and reset.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
