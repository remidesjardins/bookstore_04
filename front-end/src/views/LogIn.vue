<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK</span>
      <br />
      <span>HAVEN</span>
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

      <!-- Forgot Password Link -->
      <p class="forgot-password">
        <a href="/forgot-password">Forgot Password?</a>
      </p>

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
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle password visibility
    },
    goToSignUp() {
      this.$router.push('/register');
    }
  }
};
</script>
<style scoped>
.app-header {
  display: flex;
  background-color: #d9a05b;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1001;
  width: 100%;
  position: absolute;
  top: 0;
}

/* Style for the logo */
.logo {
  font-size: 40px; /* Increased font size for emphasis */
  padding: 10px;
  font-weight: bold;
  color: black;
  line-height: 1.2;
  text-align: center;
}

.logo span:first-child {
  letter-spacing: 3px; /* Adds some spacing between letters */
}

/* Adjust login container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 80px);
  font-family: Arial, sans-serif;
  padding-top: 250px;
  box-sizing: border-box;
}

h2 {
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
}

form {
  width: 100%;
  max-width: 400px; /* Width adjustment for the login form */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  margin-bottom: 20px;
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #000;
  border-radius: 25px;
  outline: none;
  text-align: left;
  background-color: #f9f9f9;
}

.password-group {
  position: relative;
}

.password-group i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

input::placeholder {
  color: #bbb;
  font-size: 14px;
}

button.submit-btn {
  width: 25%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background-color: #d3d3d3;
  color: black;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

button.submit-btn:hover {
  background-color: #a9a9a9;
}

.forgot-password {
  margin-top: 20px;
  font-size: 14px;
  color: gray;
  text-align: center;
}

.forgot-password a {
  color: #000;
  text-decoration: none;
}

/* New Sign-up section */
.no-account {
  margin-top: 20px;
  font-size: 14px;
  color: gray;
  text-align: center;
}

button {
  width: 25%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background-color: #d3d3d3;
  color: black;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

button.sign-in-btn:hover {
  background-color: #a9a9a9;
}

input::placeholder {
  color: #857f7f;
  font-size: 20px;
  text-align: left;
}

.error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
}

.success-message {
  color: #2ecc71;
  margin-top: 20px;
  text-align: center;
}

.server-error {
  color: #e74c3c;
  margin-top: 20px;
  text-align: center;
}
</style>