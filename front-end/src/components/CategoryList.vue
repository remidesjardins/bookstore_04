<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>
  <div>
    <h2>Categories</h2>
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
  </div>

</template>

<script>
export default {
  props: ["categories", "selectedCategory"],
  methods: {
    /**
     * Emits the selected category to the parent component.
     * @param {Object} category - The category selected by the user.
     */
    selectCategory(category) {
      this.$emit('categorySelected', category);
    },
    /**
     * Scrolls the category slider to the left.
     */
    slideLeft() {
      this.$refs.categorieSlider.scrollLeft -= 325;
    },
    /**
     * Scrolls the category slider to the right.
     */
    slideRight() {
      this.$refs.categorieSlider.scrollLeft += 325;
    },
  }
};
</script>

<style scoped>
/* Section containing categories, aligns items and hides overflow */
  .categories-section{
    //margin: .938rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

/* Container for scrolling categories, with smooth horizontal scroll */
  .categories {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 1rem;
  }

/* Individual category styling, including dimensions, color, and interactive effects */
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

/* Styling for the selected category, changing the background color to orange */
.category.selected {
    background-color: orange;
  }

/* Styling for focused category, adding a blue border */
  .category.focused {
    border: .125rem solid blue;
  }

/* Heading styling for the categories section */
  .categories h2{
    font-size: 2rem;
    text-align: left;
    font-weight: bold;
  }

</style>