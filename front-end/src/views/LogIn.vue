<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->

<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK HAVEN</span>
    </div>
  </header>
  <div class="login-container">
    <h2>Log In</h2>
    <form @submit.prevent="handleLogin">
      <!-- Username or Email Field -->
      <div class="form-group">
        <input
            type="text"
            v-model="usernameOrEmail"
            placeholder="Email"
            required
        />
        <span v-if="usernameOrEmailError" class="error">{{ usernameOrEmailError }}</span>
      </div>

      <!-- Password Field -->
      <div class="form-group password-group">
        <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
        />
        <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i> <!-- Password show/hide icon -->
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
      </div>

      <!-- Error Message -->
      <p v-if="serverError" class="server-error">Email or password invalid</p>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn">Log In</button>

      <!-- Haven't got an account? Section -->
      <p class="no-account">Haven't got an account?</p>
      <button type="button" class="sign-in-btn" @click="goToSignUp">Sign Up</button>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      showPassword: false,
      usernameOrEmailError: '',
      passwordError: '',
      serverError: '',
      successMessage: '',
    };
  },
  methods: {
    ...mapActions(['login']), // Map Vuex login action

    /**
     * Handles user login by dispatching the login action.
     */
    async handleLogin() {
      // Reset previous error messages
      this.usernameOrEmailError = '';
      this.passwordError = '';
      this.serverError = '';
      this.successMessage = '';

      try {
        await this.$store.dispatch('login', {
          email: this.usernameOrEmail,
          password: this.password});
        this.successMessage = "Logged in successfully!";
      } catch (error) {
        this.serverError = "Invalid credentials or server issue.";
      }

    },
    /**
     * Toggles the visibility of the password input field.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle password visibility
    },
    /**
     * Navigates the user to the Sign Up page.
     */
    goToSignUp() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
/* App Header Styles */
.app-header {
  display: flex;
  background-color: #d9a05b;
  justify-content: center;
  align-items: center;
  padding: 1.3rem 0;
  z-index: 1001;
  width: 100%;
  position: absolute;
  top: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Logo Styles */
.logo {
  font-size: 2.5rem; /* Increased font size for emphasis */
  padding: .65rem;
  font-weight: bold;
  color: black;
  line-height: 1.2;
  text-align: center;
}

.logo span:first-child {
  letter-spacing: .2rem; /* Adds some spacing between letters */
}

/* Login Container Styles */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 80vw);
  font-family: Arial, sans-serif;
  padding-top: 9rem;
  box-sizing: border-box;
}

/* Heading Styles */
h2 {
  font-size: 1.75rem;
  margin: .8rem 0 2rem 0;
  font-weight: bold;
}

/* Form Styles */
form {
  width: 100%;
  max-width: 25rem; /* Width adjustment for the login form */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Form Group Styles */
.form-group {
  width: 80%;
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group input {
  width: 90%;
  padding: .60rem;
  font-size: .8rem;
  border: .1rem solid #000;
  border-radius: 5rem;
  outline: none;
  text-align: left;
  background-color: #f9f9f9;
}

/* Password Group Styles */
.password-group {
  position: relative;
}

.password-group i {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

/* Submit Button Styles */
button.submit-btn {
  width: 25%;
  padding: .75rem;
  border: none;
  border-radius: 5rem;
  background-color: #d3d3d3;
  color: black;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
}

button.submit-btn:hover {
  background-color: #a9a9a9; /* Hover effect for submit button */
}

/* New Sign-up Section Styles */
.no-account {
  margin-top: 2rem;
  font-size: .8rem;
  color: gray;
  text-align: center;
}

/* Button Styles */
button {
  width: 25%;
  padding: .75rem;
  border: none;
  border-radius: 5rem;
  background-color: #d3d3d3;
  color: black;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0 0 1rem 0;
}

button.sign-in-btn:hover {
  background-color: #a9a9a9; /* Hover effect for sign-in button */
}

/* Placeholder Input Styles */
input::placeholder {
  color: #857f7f;
  font-size: .8rem;
  text-align: left;
}

/* Server Error Message Styles */
.server-error {
  color: #e74c3c;
  font-size: .8rem;
  text-align: center;
  margin-top: 0;
}
</style>