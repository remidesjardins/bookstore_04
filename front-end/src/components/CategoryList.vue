<template>
  <div class="categories-section">
    <!--<h2>Categories</h2>-->
    <button @click="slideLeft">‹</button>
    <div class="categories" ref="categorieSlider">
      <div
          class="category"
          v-for="category in categories"
          :key="category"
          @click="$emit('selectCategory', category)"
      >
        <h2>{{ category }}</h2>
      </div>
    </div>
    <button @click="slideRight">›</button>
  </div>

</template>

<script>
export default {
  props: ["categories", "selectedCategory"],
  methods: {
    selectCategory(category) {
      this.$emit('categorySelected', category);
    },
    slideLeft() {
      this.$refs.categorieSlider.scrollLeft -= 325;
    },
    slideRight() {
      this.$refs.categorieSlider.scrollLeft += 325;
    },
  }
};
</script>

<style scoped>
  .categories-section{
    //margin: .938rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .categories {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 1rem;
  }

  .category {
    min-width: 16.875rem;
    max-width: 16.875rem;
    height: 16.875rem;
    background-color: #e0e0e0;
    color: black;
    font-weight: bold;
    border-radius: 1.25rem;
    display: flex;
    cursor: pointer;
    margin: 1.25rem;
    font-size: 1.125rem;
    text-align: center;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .category.selected {
    background-color: orange;
  }

  .category.focused {
    border: .125rem solid blue;
  }

  .category-label {
    background-color: orange;
    border-radius: .625rem;
    padding: .313rem .625rem;
    margin-bottom: 1.25rem;
    color: white;
    font-weight: bold;
    font-size: 1rem;
  }
  .categories h2{
    font-size: 2rem;
    text-align: left;
    font-weight: bold;
  }

</style>