<template>
  <div>
    <h3>Books</h3>
    <div class="book-list">
      <div v-for="book in bookList" :key="book.id" class="book" @click="selectBook(book)">
        <img :src="book.img" alt="book cover" />
        <div class="book-id">{{ book.id }}</div>
        <div class="book-title">{{ book.title }}</div>
        <div class="book-price">{{ book.price }} $</div>
        <div class="favorite-icon" :class="{ added: book.isFavorite }" @click.stop="toggleFavorite(book)">
          {{ book.isFavorite ? '★' : '☆' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['bookList'],  // Ensure bookList is passed as a prop
  methods: {
    selectBook(book) {
      this.$emit('bookSelected', book);  // Emit bookSelected event
    },
    toggleFavorite(book) {
      this.$emit('toggleFavorite', book);  // Emit favorite toggle event
    }
  }
};
</script>

<style scoped>
.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.book {
  width: 220px;
  height: 250px;
  margin: 20px;
  text-align: center;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f0f0f0;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.book img {
  width: 130px;
  height: 195px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 5px;
}

.book:hover {
  transform: scale(1.05);
}

.book-id {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  font-weight: lighter;
  color: black;
}

.book-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.book-price {
  font-size: 16px;
  text-align: left;
}

.favorite-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

.favorite-icon.added {
  color: red;
}
</style>s