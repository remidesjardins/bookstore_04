<template>
  <div class="overlay" v-if="book" @click.self="closeForm">
    <div class="update-details" @click.stop>
      <span class="close-button" @click="closeForm">❌</span>
      <div class="update-form">
        <h1>Update Book</h1>
        <input type="text" placeholder="Title" v-model="book.title" />
        <input type="text" placeholder="Author" v-model="book.author" />
        <input type="text" placeholder="Reference" v-model="book.id" />
        <input type="text" placeholder="Price in $" v-model="book.price" />

        <!-- Drop-down for selecting one category -->
        <label for="category">Category</label>
        <select v-model="book.category" id="category">
          <option disabled value="">Please select a category</option>
          <!-- Dynamically render categories as options with proper key and value bindings -->
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>


        <button @click="updateBook">Update Book</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["book", "categories"],
  methods: {
    closeForm() {
      this.$emit("closeForm");
    },
    updateBook() {
      this.$emit("updateBook", this.book);
    }
  }
};
</script>

<style scoped>
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

.update-details {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 900px;
  max-height: 90vh;
  width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 20;
}

.update-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.update-form input[type="text"],
.update-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.update-form label {
  margin-bottom: 5px;
  font-weight: bold;
}

.update-form button {
  background-color: lightgray;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
}

.update-form select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  font-family: Arial, sans-serif;
  border-radius: 5px;
  cursor: pointer;
}

.update-form select:focus {
  border-color: blue;
  outline: none;
}

/* Add arrow icon to the select dropdown */
.update-form select {
  background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http://www.w3.org/2000/svg%22 fill%3D%22%23000000%22 height%3D%2224px%22 viewBox%3D%220 0 24 24%22 width%3D%2224px%22%3E%3Cpath d%3D%22M0 0h24v24H0V0z%22 fill%3D%22none%22/%3E%3Cpath d%3D%22M7 10l5 5 5-5H7z%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}
</style>