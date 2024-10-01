<template>
  <div class="categories-section">
    <h2>Categories</h2>
    <div class="categories">
      <div
          class="category"
          v-for="category in categories"
          :key="category"
          @click="$emit('selectCategory', category)"
      >
        <h2>{{ category }}</h2>
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
  .categories-section{
    margin: 15px;
  }
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
    min-width: 250px;
    max-width: 250px;
    height: 250px;
    background-color: #e0e0e0;
    color: black;
    font-weight: bold;
    border-radius: 20px;
    display: flex;
    cursor: pointer;
    margin: 20px;
    font-size: 18px;
    text-align: center;
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
  .categories h2{
    font-size: 32px;
    text-align: left;
    font-weight: bold;
  }
</style>