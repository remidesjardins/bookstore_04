<template>
  <div class="add-book-form">
    <div class="form-header">
      <h2>Add Book</h2>
      <button @click="$emit('close-form')" class="close-btn">✖</button>
    </div>

    <form @submit.prevent="submitForm">
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
          <input type="text" id="isbn" v-model="book.isbn" @blur="fetchBookDetails" placeholder="Enter ISBN" required />
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
        cover_image: 'https://via.placeholder.com/150?text=No+Cover'
      },
      categories: ["Science Fiction", "Mystery & Thriller", "Children's books", "Historical", "Educational"]
    };
  },
  methods: {
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
    async submitForm() {
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
.add-book-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 70%;
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

/* Inputs and select fields with rounded corners */
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

.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder {
  color: #434343;
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