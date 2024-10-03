<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>

  <!-- Main container for the add/update book form -->
  <div class="add-book-form">
    <div class="form-header">
      <h2>Update Book</h2>
      <button @click="$emit('close')" class="close-btn"><i class="fa-solid fa-xmark fa-xl"></i></button>
    </div>

    <!-- Form for updating book details -->
    <form @submit.prevent="updateBook">
      <!-- Row for ISBN input -->
      <div class="form-row">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" placeholder="Enter ISBN" required />
        </div>
      </div>

      <!-- Row for Title and Author inputs -->
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

      <!-- Row for Price and Category inputs -->
      <div class="form-row">
        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="book.price" placeholder="Enter price" required />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" v-model="book.category" required>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>

      <!-- Summary text area for book description -->
      <div class="form-group">
        <label for="summary">Summary</label>
        <textarea id="summary" v-model="book.summary" placeholder="Enter book summary" required></textarea>
      </div>

      <!-- Hidden input for cover_image -->
      <input type="hidden" v-model="book.cover_image" />

      <!-- Submit button for updating the book -->
      <button type="submit" class="submit-btn">Update Book</button>
    </form>
  </div>
</template>

<script>
export default {
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
  mounted() {
    // Lifecycle hook to fetch the current book details when the component is mounted
    this.fetchBookDetails();
  },
  methods: {
    /**
     * Fetches the details of the book based on the provided bookId.
     */
    async fetchBookDetails() {
      try {
        const token = this.$store.state.userToken; // Get the token from the Vuex store

        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data && data[0]) {
          this.book = { ...this.book, ...data[0] }; // Merge the fetched data into the form fields
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    },

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

        const token = this.$store.state.userToken;
        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(this.book),
        });

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
</script>

<style scoped>
/* Styles for the add/update book form container */
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

/* Styles for the heading of the form */
h2 {
  margin: 0;
}

/* Header styles containing the title and close button */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Styles for the close button */
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: gray;
}

/* Flexbox styles for form rows */
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: .938rem;
}

/* Styles for individual form groups */
.form-group {
  flex: 1;
}

/* Remove right margin for the last form group */
.form-group:last-child {
  margin-right: 0;
}

/* Styles for labels within form groups */
.form-group label {
  display: block;
  margin-bottom: .313rem;
  font-weight: bold;
}

/* Styles for input fields, select dropdowns, and text areas */
.form-group input,
.form-group select,
.form-group textarea {
  padding: .625rem;
  border: 1px solid black;
  border-radius: 1.563rem;
  font-size: 1rem;
}

/* Specific width adjustments for different input types */
[id="author"] {
  width: 92%;
}
[id="title"], [id="price"] {
  width: 80%;
}
.form-group textarea, [id="isbn"] {
  width: 96%;
}

/* Margin for the textarea */
.form-group textarea {
  margin-bottom: .4rem;
}

/* Styles for select dropdowns */
.form-group select {
  width: 100%;
  color: #434343;
}

/* Placeholder styles for inputs */
.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder,
[id="category_placeholder"] {
  color: #434343;
  font-family: Arial, sans-serif;
}

/* Styles for the submit button */
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

/* Hover effect for the submit button */
.submit-btn:hover {
  background-color: #45a049;
}

/* Responsive styles for mobile devices */
@media (max-width: 540px) {
  /* Adjust heading padding on smaller screens */
  h2 {
    padding: .1rem 0 .625rem 0;
  }

  /* Adjust form row layout for mobile */
  .form-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }

  /* Styles for form groups on mobile */
  .form-group {
    margin-bottom: 0.4rem;
  }

  /* Adjust input styles for mobile */
  .form-group input,
  .form-group select,
  .form-group textarea {
    border: .063rem solid black;
    font-size: .9rem;
  }

  /* Width adjustments for various inputs */
  .form-group textarea,
  [id="isbn"],
  [id="title"],
  [id="price"],
  [id="author"] {
    width: 92%;
  }

  /* Adjust height for textarea */
  .form-group textarea {
    margin-bottom: 0;
    height: 1.1rem;
  }

  /* Adjust padding and font size for submit button */
  .submit-btn {
    padding: .5rem 1rem;
    font-size: .9rem;
  }
}
</style>