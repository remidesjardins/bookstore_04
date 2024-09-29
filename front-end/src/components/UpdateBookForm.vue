<template>
  <div class="add-book-form">
    <div class="form-header">
      <h2>Update Book</h2>
      <button @click="$emit('close')" class="close-btn">✖</button>
    </div>

    <form @submit.prevent="updateBook">
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
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" v-model="book.isbn" placeholder="Enter ISBN" required />
        </div>

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

      <!-- Larger Summary text area -->
      <div class="form-group">
        <label for="summary">Summary</label>
        <textarea id="summary" v-model="book.summary" placeholder="Enter book summary" required></textarea>
      </div>

      <!-- Hidden input for cover_image -->
      <input type="hidden" v-model="book.cover_image" />

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
    // Fetch the current book details
    this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      try {
        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`);
        const data = await response.json();

        if (data && data[0]) {
          this.book = { ...this.book, ...data[0] }; // Merge the fetched data into the form fields
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    },
    async updateBook() {
      try {
        // Ensure all required fields are populated
        if (!this.book.title || !this.book.author || !this.book.cover_image || !this.book.category || !this.book.summary || !this.book.isbn) {
          alert("All fields must be filled out.");
          return;
        }

        const response = await fetch(`https://bot.servhub.fr/api/books/${this.bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
</script>s

<style scoped>
.add-book-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: gray;
}

/* Flexbox for rows */
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-right: 15px;
}

.form-group:last-child {
  margin-right: 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 95%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 25px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #a6a5a5;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>