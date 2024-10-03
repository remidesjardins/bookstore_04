<!--
  Project: Book Haven
  Created by: Alexandre Borny, Maël Castellan, Laura Donato, and Rémi Desjardins
-->

<template>
  <!-- Simple header for sign-in and log-in page -->
  <header class="app-header">
    <div class="logo">
      <span>BOOK HAVEN</span>
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

      <!-- Password and Confirm Password in the same row -->
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
      <div class="form-group" id="role-field">
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
    /**
     * Navigates to the login page.
     */
    goToLogin() {
      this.$router.push('/Login');
    },
    /**
     * Toggles visibility of the password input field.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    /**
     * Toggles visibility of the confirm password input field.
     */
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    /**
     * Validates the email format.
     * @param {string} email - The email to validate.
     * @returns {boolean} - Returns true if the email is valid, otherwise false.
     */
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    /**
     * Handles form submission and performs validation.
     */
    async handleSubmit() {
      // Reset previous error messages
      this.emailError = '';
      this.usernameError = '';
      this.passwordError = '';
      this.confirmPasswordError = ''
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

        // Submit the form to the server
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${this.$store.state.userToken}`);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(formData),
          redirect: "follow"
        };
        // Send the form data to the API
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
/* App header styles */
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

/* Logo styles */
.logo {
  font-size: 2.5rem;
  padding: .65rem;
  font-weight: bold;
  color: black;
  line-height: 1.2;
  text-align: center;
}

.logo span:first-child {
  letter-spacing: .2rem;
}

/* Signup Container Styles */
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 80vw);
  font-family: Arial, sans-serif;
  padding-top: 9rem;
  box-sizing: border-box;
}

h2 {
  font-size: 1.75rem;
  margin: .8rem 0 2rem 0;
  font-weight: bold;
}

/* Form Styles */
form {
  width: 100%;
  max-width: 50rem; /* Increase width for multiple columns */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-row {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin-bottom: 1.5rem;
}

.form-group {
  width: 45%;
  position: relative;
}

.form-group input,
.form-group select {
  width: 90%;
  padding: .60rem;
  font-size: .8rem;
  border: .1rem solid #000;
  border-radius: 5rem;
  outline: none;
  text-align: left;
  background-color: #f9f9f9;
}

/* Placeholder Input Styles */
.form-group input::placeholder{
  color: #857f7f;
  font-size: .8rem;
  text-align: left;
}

.form-group select {
  margin-right: 0;
  width: 79.6%;
}

#role-field {
  display: flex;
  justify-content: center;
}

/* Password Group Styles */
.password-group {
  position: relative;
}

.password-group i {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

/* Button Styles */
button.submit-btn,
button.login-btn {
  width: 12.5%;
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

button.submit-btn {
  margin-top: 1.5rem;
}

button:hover {
  background-color: #a9a9a9;
}

/* Already an account text style */
.already-account {
  margin-top: .8rem;
  font-size: .8rem;
  color: gray;
  text-align: center;
}

/* Responsive Styles for Mobile Devices */
@media only screen and (max-width: 640px) {
  /* Adjust Heading Margin */
  h2 {
    margin-top: 0;
    margin-bottom:1.5rem;
  }

  /* Adjust Form Row for Column Layout */
  .form-row  {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
  }

  /* Adjust Form Group for Full Width */
  .form-group {
    margin-bottom: 1rem;
    width: auto;
  }

  .form-group select {
    width: 80%;
  }

  /* Adjust Password Icon Position */
  .password-group i {
    right: 0.4rem;
  }

  /* Adjust Button Width */
  button.submit-btn,
  button.login-btn {
    width: 5rem;
  }

  /* Adjust Role Field Width */
  #role-field {
    width: 14rem;
  }
}
</style>