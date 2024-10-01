<template>
  <header class="app-header">
    <div class="logo">
      <span>BOOK</span>
      <br />
      <span>HAVEN</span>
    </div>
  </header>
  <div class="signup-container">
    <h2>Create an account</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Email and Username in the same row -->
      <div class="form-row">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="text" v-model="username" placeholder="Username" required />
        </div>
      </div>

      <!-- Password and Confirm Password in the same row --><!-- Password and Confirm Password in the same row -->
      <div class="form-row">
        <div class="form-group password-group">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required />
          <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i> <!-- Password show/hide icon -->
        </div>
        <div class="form-group password-group">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm Password" required />
          <i class="fas" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" @click="toggleConfirmPasswordVisibility"></i> <!-- Confirm Password show/hide icon -->
        </div>
      </div>

      <!-- Role Field -->
      <div class="form-group">
        <select v-model="role" required>
          <option value="" disabled>Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Submit and Log In buttons -->
      <button type="submit" class="submit-btn">Sign In</button>

      <p class="already-account">You already have an account?</p>
      <button type="button" class="login-btn" @click="goToLogin">Log In</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'SignUp',
  data() {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      confirmPasswordError: '',
      roleError: '',
      serverError: '',
      successMessage: '',
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    goToLogin() {
      this.$router.push('/Login');
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    async handleSubmit() {
      // Reset previous error messages
      this.emailError = '';
      this.usernameError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';  // Reset confirm password error
      this.roleError = '';
      this.serverError = '';
      this.successMessage = '';

      let isValid = true;

      // Validate Email
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Username
      if (this.username.length < 3) {
        this.usernameError = 'Username must be at least 3 characters long.';
        isValid = false;
      }

      // Validate Password
      if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters long.';
        isValid = false;
      }

      // Validate Confirm Password (must match password)
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Passwords do not match.';
        isValid = false;
      }

      // Validate Role
      if (!this.role) {
        this.roleError = 'Please select a role.';
        isValid = false;
      }

      // If all validations pass
      if (isValid) {
        const formData = {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role,
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(formData),
          redirect: "follow"
        };

        fetch("https://bot.servhub.fr/api/users", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              this.successMessage = "Account created successfully!";
              console.log(result);
            })
            .catch((error) => {
              this.serverError = "There was a problem creating your account.";
              console.error(error);
            });
      }
    },
  },
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
  font-size: 40px;
  padding: 10px;
  font-weight: bold;
  color: black;
  line-height: 1.2;
  text-align: center;
}

.logo span:first-child {
  letter-spacing: 3px;
}

.signup-container {
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
  max-width: 800px; /* Increase width for multiple columns */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
}

.form-group {
  width: 48%; /* Allow two fields to fit side-by-side */
  position: relative;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  font-size: 20px;
  border: 2px solid #000;
  border-radius: 25px;
  outline: none;
  text-align: left;
  background-color: #f9f9f9;
}

.form-group input::placeholder{
  color: #857f7f;
  font-size: 20px;
  text-align: left;
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

button.submit-btn,
button.login-btn {
  width: 20%;
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

button.submit-btn {
  margin-top: 40px;
  background-color: #c0c0c0;
}

.already-account {
  margin-top: 20px;
  font-size: 14px;
  color: gray;
  text-align: center;
}

button:hover {
  background-color: #a9a9a9;
}
</style>