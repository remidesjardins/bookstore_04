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
      <div class="add-book" @click.stop="showAddBookForm" v-if="this.$store.state.isAdmin">
        Add a book <span class="icon"><i class="fa-solid fa-plus fa-sm"></i></span></div>
      <div class="home"  @click="goToHome">
        Home <span class="icon"></span><i class="fa-solid fa-house fa-1x"></i>
      </div>
      <div class="logout" @click="logOut">
        Log Out <span class="icon"></span><i class="fa-solid fa-right-from-bracket fa-lg"></i></div>
      <div class="favorite" @click="goToFavorites">
        Favorite <span class="icon"> <i class="fa-solid fa-star fa-xs"></i> </span>
      </div>
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
    goToFavorites() {
      this.$router.push("/favorites");
    },
    goToHome(){
      this.$router.push("/");
    },
    searchBook(query) {
      this.$emit("update:searchQuery", query);
    },
    showAddBookForm() {
      this.$emit("showAddBookForm");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    emitSearchQuery(query) {
      this.$emit("search", query);
    },
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

.logo {
  font-size: 1.5rem;
  padding: 1.25rem;
  font-weight: bold;
  color: black;
  line-height: 1;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

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
}

.header-icons .favorite {
  border-bottom: none;
}

@media (max-width: 951px) {
  .app-header {
    height: auto;
    flex-direction: column;
  }

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

  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    margin-left: auto;
  }

  .hamburger .bar {
    width: 1.563rem;
    height: 0.188rem;
    background-color: black;
    margin: 0.188rem 0;
    transition: 0.3s;
  }

  .header-icons .add-book,
  .header-icons .logout,
  .header-icons .favorite,
  .header-icons .home  {
    border-bottom: 0.063rem solid black;
  }

  .hamburger {
    display: flex;
    position: absolute;
    top: 2.3rem;
    right: 1.25rem;
  }

  .header-icons {
    display: none;
    padding: 0.625rem 0;
  }

  .header-icons.mobile-menu {
    display: flex;
  }

  .app-header > .search-bar {
    margin-top: 0.625rem;
    width: 90%;
    z-index: 1000;
  }

  .app-header .search-bar {
    margin-top: 0.625rem;
  }
}
</style>