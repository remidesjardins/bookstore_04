<template>
  <div class="overlay" @click.self="closeDetails">
    <div class="book-details" @click.stop>
      <span class="close-button" @click="closeDetails">❌</span>

      <!-- Left content: Image, Category, Price, Buttons -->
      <div class="left-content">
        <h1 class="book-title">{{ book.title }}</h1>
        <h3>By {{ book.author }}</h3>
        <span class="category-label">{{ book.category }}</span>
        <img :src="book.img" alt="Book cover" />
        <div class="price-button-container">
          <p class="price">{{ book.price }} $</p>
          <p
              class="add-favorite"
              :class="{ 'favorite-added': book.isFavorite }"
              @click="toggleFavorite"
          >
            {{ book.isFavorite ? '★ Remove from Favorite' : '☆ Add to Favorite' }}
          </p>
        </div>
      </div>

      <!-- Right content: Summary -->
      <div class="summary">
        <h3>Summary</h3>
        <p>{{ book.summary }}</p>
      </div>

      <!-- Action icons (Modify and Delete) -->
      <div class="action-icons">
        <i @click="openUpdateForm">♻️</i> <!-- Modify icon -->
        <i @click="deleteBook">🗑️</i> <!-- Delete icon -->
      </div>
    </div>
  </div>

  <!-- Update Book Form -->
  <UpdateBookForm
      v-if="showUpdateForm"
      :book="book"
      :categories="categories"
      @closeForm="closeUpdateForm"
      @updateBook="updateBook"
  />
</template>

<script>
import UpdateBookForm from "./UpdateBookForm.vue";

export default {
  props: {
    book: Object,
    visible: Boolean,
    categories: Array
  },
  emits: ['close', 'favoriteToggled'], // Declare the events that the component emits
  data() {
    return {
      showUpdateForm: false
    };
  },
  methods: {
    openUpdateForm() {
      this.showUpdateForm = true;
     },
    closeUpdateForm() {
      this.showUpdateForm = false;
    },
    updateBook(updatedBook) {
      this.$emit("updateBook", updatedBook);
      this.closeUpdateForm();
    },
    deleteBook() {
      this.$emit("deleteBook", this.book);
      this.closeDetails();
    },
    closeDetails() {
      this.$emit('close'); // Emit close event
    },
    toggleFavorite() {
      this.$emit('favoriteToggled', this.book); // Emit favorite toggled event
    }
  },
  components: {
    UpdateBookForm
  }
};
</script>

<style scoped>
/* Overlay Styles */
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.book-details {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 900px;
  max-height: 90vh;
  width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 10;
}

.left-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.left-content img {
  width: 150px;
  margin-bottom: 10px;
}

.left-content .book-title {
  text-align: left;
  font-size: 25px;
}

.price-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.price {
  font-size: 24px;
  margin-bottom: 10px;
}

.add-favorite {
  display: inline-block;
  padding: 10px;
  background-color: lightgray;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  width: 200px;
}

.favorite-added {
  background-color: gold;
  color: black;
}

.summary {
  width: 55%;
  padding-left: 30px;
}

.summary h3 {
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
}

.category-label {
  background-color: orange;
  border-radius: 10px;
  padding: 5px 10px;
  margin-bottom: 20px;
  color: white;
  font-weight: bold;
  font-size: 16px;
}
</style>