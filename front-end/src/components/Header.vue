<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->
<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK HAVEN</span>
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

    <SearchBar :searchQuery="searchQuery" @search="emitSearchQuery" />

    <div class="header-icons" :class="{ 'mobile-menu': isMenuOpen }">
      <div class="home"  @click="goToHome">
        Home <span class="icon"></span><i class="fa-solid fa-house fa-1x"></i>
      </div>
      <div class="add-book" @click.stop="showAddBookForm" v-if="this.$store.state.isAdmin">
        Add a book <span class="icon"><i class="fa-solid fa-plus fa-sm"></i></span>
      </div>
      <div class="favorite" @click="goToFavorites">
        Favorite <span class="icon"> <i class="fa-solid fa-star fa-xs"></i> </span>
      </div>
      <div class="logout" @click="logOut">
        Log Out <span class="icon"></span><i class="fa-solid fa-right-from-bracket fa-lg"></i></div>
    </div>
  </header>
</template>

<script>
import SearchBar from "./SearchBar.vue";

export default {
  props: ['searchQuery'],
  data() {
    return {
      isMenuOpen: false,
      books: [],
    };
  },
  methods: {
    /**
     * Navigate to the favorites page.
     * @returns {void}
     */
    goToFavorites() {
      this.$router.push("/favorites");
    },
    /**
     * Navigate to the home page.
     * @returns {void}
     */
    goToHome(){
      this.$router.push("/");
    },
    /**
     * Emit the search query to the parent component.
     * @param {string} query - The search query entered by the user.
     * @returns {void}
     */
    searchBook(query) {
      this.$emit("update:searchQuery", query);
    },
    /**
     * Emit an event to show the add book form.
     * @returns {void}
     */
    showAddBookForm() {
      this.$emit("showAddBookForm");
    },
    /**
     * Toggle the visibility of the menu.
     * @returns {void}
     */
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    /**
     * Emit the search query for external handling.
     * @param {string} query - The search query to emit.
     * @returns {void}
     */
    emitSearchQuery(query) {
      this.$emit("search", query);
    },
    /**
     * Dispatch the logout action to the Vuex store.
     * @returns {void}
     */

    logOut(){
      this.$store.dispatch("logout");
    }
  },
  components: {
    SearchBar
  }
};
</script>

<style scoped>
/* Styling for the main header of the application */
.app-header {
  background-color: #d9a05b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 9;
  position: relative;
}

/* Styling for the logo within the header */
.logo {
  font-size: 1.5rem;
  padding: 1.25rem;
  font-weight: bold;
  color: black;
  line-height: 1;
}

/* Container for header icons, aligns items horizontally */
.header-icons {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

/* Common styles for each header icon */
.header-icons .add-book,
.header-icons .logout,
.header-icons .favorite,
.header-icons .home {
  margin: 0.625rem 0;
  font-size: 1.25rem;
  padding: 0.625rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* Removes the border from the favorite icon */
.header-icons .favorite {
  border-bottom: none;
}

/* Media query for screens smaller than 951px */
@media (max-width: 951px) {
  .app-header {
    height: auto;
    flex-direction: column;
  }

  /* Styles for the mobile menu, which appears on smaller screens */
  .mobile-menu {
    flex-direction: column;
    position: absolute;
    top: 9.8rem;
    left: 0;
    right: 0;
    background-color: #d9a05b;
    width: 100%;
    padding: 11.25rem;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  /* Styling for the hamburger menu icon */
  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    margin-left: auto;
  }

  /* Styling for each bar in the hamburger icon */
  .hamburger .bar {
    width: 1.563rem;
    height: 0.188rem;
    background-color: black;
    margin: 0.188rem 0;
    transition: 0.3s;
  }

  /* Adds a bottom border to all header icons in mobile view */
  .header-icons .add-book,
  .header-icons .logout,
  .header-icons .favorite,
  .header-icons .home  {
    border-bottom: 0.063rem solid black;
  }

  /* Displays the hamburger icon in the header */
  .hamburger {
    display: flex;
    position: absolute;
    top: 2.3rem;
    right: 1.25rem;
  }

  /* Hides header icons on mobile view */
  .header-icons {
    display: none;
    padding: 0.625rem 0;
  }

  /* Shows header icons when in mobile menu context */
  .header-icons.mobile-menu {
    display: flex;
  }

  /* Adjusts the search bar's margin and width on mobile */
  .app-header > .search-bar {
    margin-top: 0.625rem;
    width: 90%;
    z-index: 1000;
  }

  /* Additional margin for the search bar */
  .app-header .search-bar {
    margin-top: 0.625rem;
  }
}
</style>