<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>
  <div class="add-book-form">
    <div class="form-header">
      <h2>Add Book</h2>
      <!-- Emit event to close the form when the button is clicked -->
      <button @click="$emit('close-form')" class="close-btn"><i class="fa-solid fa-xmark fa-xl"></i></button>
    </div>

    <!-- Handle form submission -->
    <form @submit.prevent="submitForm">
      <!-- ISBN on one line -->
      <div class="form-row">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" @blur="fetchBookDetails" placeholder="Enter ISBN" required />
        </div>
      </div>

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

      <!-- Larger Summary text area -->
      <div class="form-group">
        <label for="summary">Summary</label>
        <textarea id="summary" v-model="book.summary" placeholder="Enter book summary" required></textarea>
      </div>

      <!-- Submit button -->
      <button type="submit" class="submit-btn">Add Book</button>
    </form>
  </div>
</template>

<script>
export default {
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
  methods: {
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
  }
};
</script>

<style scoped>

/* Styling for the add book form container */
.add-book-form {
  background: white;
  padding: .5rem 1.25rem 0 1.25rem;
  border-radius: 1.875rem;
  width: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  top: auto;
  overflow: hidden;
  z-index: 10;
}

/* Heading styles */
h2 {
  margin: 0;
}

/* Header for the form with close button */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Styling for the close button */
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gray;
}

/* Flexbox for rows in the form */
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: .938rem;
}

/* Styling for form groups */
.form-group {
  flex: 1;
}

/* Removes margin from the last form group */
.form-group:last-child {
  margin-right: 0;
}

/* Label styling for form fields */
.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

/* Input, select, and textarea styles */
.form-group input,
.form-group select,
.form-group textarea {
  padding: .625rem;
  border: .063rem solid black;
  border-radius: 1.563rem;
  font-size: 1rem;
}

/* Specific width adjustments for inputs */
[id="author"] {
  width: 92%;
}

[id="title"], [id="price"] {
  width: 80%;
}

/* Margin for the textarea */
.form-group textarea, [id="isbn"] {
  width: 96%;
}

/* Margin for the textarea */
.form-group textarea {
  margin-bottom: .4rem;
}

/* Select field styling */
.form-group select {
  width: 100%;
  color: #434343;
}

/* Placeholder text styles */
.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder,
[id="category_placeholder"] {
  color: #434343;
  font-family: Arial, sans-serif;
}

/* Submit button styling */
.submit-btn {
  padding: .625rem 1.25rem;
  background-color: #a6a5a5;
  color: white;
  border: none;
  border-radius: 1.563rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: .7rem;
}

/* Submit button hover effect */
.submit-btn:hover {
  background-color: #45a049;
}

/* Media query for screens smaller than 540px */
@media (max-width: 540px) {
  h2 {
    padding: .1rem 0 .625rem 0;
  }

  /* Stack form rows vertically on smaller screens */
  .form-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }

  /* Margin for form groups on smaller screens */
  .form-group {
    margin-bottom: 0.4rem;
  }

  /* Adjust font size for inputs, selects, and textareas */
  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: .9rem;
  }

  /* Specific width adjustments for inputs on mobile */
  .form-group textarea,
  [id="isbn"],
  [id="title"],
  [id="price"],
  [id="author"] {
    width: 92%;
  }

  /* Adjusts textarea size for mobile */
  .form-group textarea {
    margin-bottom: 0;
    height: 1.1rem;
  }

  /* Adjusts submit button padding and font size for mobile */
  .submit-btn {
    padding: .5rem 1rem;
    font-size: .9rem;
  }
}
</style>