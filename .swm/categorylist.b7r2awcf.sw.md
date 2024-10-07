---
title: CategoryList
---
# Introduction

Path : <SwmPath>[front-end/src/components/CategoryList.vue](/front-end/src/components/CategoryList.vue)</SwmPath>

This document will walk you through the implementation of the CategoryList feature.

The feature allows users to view and select categories in a scrollable list.

We will cover:

1. How the template is structured.
2. How categories are passed as props.
3. How category selection is handled.
4. How the scrolling functionality is implemented.

# Template structure

<SwmSnippet path="/front-end/src/components/CategoryList.vue" line="5">

---

The template defines the structure of the CategoryList component. It includes buttons for scrolling and a list of categories that can be clicked to select.

```
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
```

---

</SwmSnippet>

# Passing categories as props

<SwmSnippet path="/front-end/src/components/CategoryList.vue" line="29">

---

Categories and the selected category are passed as props to the component. This allows the parent component to control the data.

```
  props: ["categories", "selectedCategory"],
```

---

</SwmSnippet>

# Handling category selection

<SwmSnippet path="/front-end/src/components/CategoryList.vue" line="31">

---

The <SwmToken path="/front-end/src/components/CategoryList.vue" pos="35:1:1" line-data="    selectCategory(category) {">`selectCategory`</SwmToken> method emits the selected category to the parent component. This allows the parent component to react to the user's selection.

@param {Object} category - The category selected by the user.

```
    /**
     * Emits the selected category to the parent component.
     * @param {Object} category - The category selected by the user.
     */
    selectCategory(category) {
      this.$emit('categorySelected', category);
    },
```

---

</SwmSnippet>

# Implementing scrolling functionality

<SwmSnippet path="/front-end/src/components/CategoryList.vue" line="38">

---

The <SwmToken path="/front-end/src/components/CategoryList.vue" pos="41:1:1" line-data="    slideLeft() {">`slideLeft`</SwmToken> and <SwmToken path="/front-end/src/components/CategoryList.vue" pos="47:1:1" line-data="    slideRight() {">`slideRight`</SwmToken> methods handle the scrolling of the category list. These methods adjust the scroll position of the category slider.

```
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
```

---

</SwmSnippet>

This concludes the walkthrough of the CategoryList feature. Each section explains the rationale behind the design decisions and how they fit into the overall functionality.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
