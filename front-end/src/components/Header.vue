<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK</span>
      <br />
      <span>HAVEN</span>
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

    <SearchBar :searchQuery="searchQuery" @search="searchBook" />

    <div class="header-icons" :class="{ 'mobile-menu': isMenuOpen }">
      <div class="add-book" @click.stop="showAddBookForm">Add a book <span class="icon">+</span></div>
      <div class="logout">Log Out <span class="icon">➡️</span></div>
      <div class="favorite">Favorite <span class="icon">⭐</span></div>
    </div>
  </header>
</template>

<script>
import SearchBar from "./SearchBar.vue";

export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  props: ["searchQuery"],
  methods: {
    searchBook(query) {
      this.$emit("update:searchQuery", query);
    },
    showAddBookForm() {
      this.$emit("showAddBookForm");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  },
  components: {
    SearchBar
  }
};
</script>

<style scoped>
.app-header {
  background-color: #d9a05b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  position: relative;
}

.logo {
  font-size: 30px;
  padding: 20px;
  font-weight: bold;
  color: black;
  line-height: 1;
}

.header-icons {
  display: flex;
  align-items: center;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  margin-left: auto;
}

.hamburger .bar {
  width: 25px;
  height: 3px;
  background-color: black;
  margin: 3px 0;
  transition: 0.3s;
}

.mobile-menu {
  flex-direction: column;
  position: absolute;
  top: 180px;
  left: 0;
  right: 0;
  background-color: #d9a05b;
  width: 100%;
  padding: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.header-icons .add-book,
.header-icons .logout,
.header-icons .favorite {
  margin: 10px 0;
  font-size: 20px;
  padding: 10px 0;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-icons .favorite {
  border-bottom: none;
}

@media (max-width: 768px) {
  .app-header {
    height: auto;
    flex-direction: column;
  }

  .hamburger {
    display: flex;
    position: absolute;
    top: 50px;
    right: 20px;
  }

  .header-icons {
    display: none;
  }

  .header-icons.mobile-menu {
    display: flex;
  }

  .app-header > .search-bar {
    margin-top: 10px;
    width: 90%;
    z-index: 1000;
  }

  .app-header .search-bar {
    margin-top: 10px;
  }
}
</style>