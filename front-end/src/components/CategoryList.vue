<template>
  <div class="categories-section">
    <h3>Categories</h3>
    <div class="categories">
      <div
          class="category"
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
      >
        {{ category }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["categories", "selectedCategory"],
  methods: {
    selectCategory(category) {
      this.$emit('categorySelected', category);
    }
  }
};
</script>

<style scoped>
.categories {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories::-webkit-scrollbar {
  display: none;
}

.category {
  width: 150px;
  height: 150px;
  background-color: #e0e0e0;
  color: black;
  font-weight: bold;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  padding: 10px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.category.selected {
  background-color: orange;
}

.category.focused {
  border: 2px solid blue;
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