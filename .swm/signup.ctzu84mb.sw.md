---
title: Signup
---
# Introduction

Path : <SwmPath>[front-end/src/views/SignIn.vue](/front-end/src/views/SignIn.vue)</SwmPath>

This document will walk you through the implementation of the signup feature.

The feature allows users to create an account by providing their email, username, password, and role. It includes form validation and submission to the server.

We will cover:

1. The structure of the signup form.
2. Data handling and state management.
3. Form validation logic.
4. Form submission process.

# Signup form structure

The signup form is structured to collect user information such as email, username, password, and role. It also includes buttons for form submission and navigation to the login page.

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="6">

---

The form header is defined as follows:

```
<template>
  <!-- Simple header for sign-in and log-in page -->
  <header class="app-header">
    <div class="logo">
      <span>BOOK HAVEN</span>
    </div>
  </header>
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="13">

---

The main form structure includes fields for email, username, password, confirm password, and role selection:

```


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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="48">

---

Finally, the form includes submit and login buttons:

```

      <!-- Submit and Log In buttons -->
      <button type="submit" class="submit-btn">Sign In</button>
      <p class="already-account">You already have an account?</p>
      <button type="button" class="login-btn" @click="goToLogin">Log In</button>
    </form>
  </div>
</template>
```

---

</SwmSnippet>

# Data handling and state management

The component's data properties manage the state of the form inputs and error messages. This ensures that the form can provide feedback to the user and handle input changes dynamically.

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="60">

---

The data properties are initialized as follows:

```
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
```

---

</SwmSnippet>

# Navigation and visibility methods

The component includes methods for navigating to the login page and toggling the visibility of password fields. These methods enhance user experience by providing additional functionality.

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="80">

---

The <SwmToken path="/front-end/src/views/SignIn.vue" pos="83:1:1" line-data="    goToLogin() {">`goToLogin`</SwmToken> method navigates to the login page:

```
    /**
     * Navigates to the login page.
     */
    goToLogin() {
      this.$router.push('/Login');
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="86">

---

The <SwmToken path="/front-end/src/views/SignIn.vue" pos="89:1:1" line-data="    togglePasswordVisibility() {">`togglePasswordVisibility`</SwmToken> method toggles the visibility of the password input field:

```
    /**
     * Toggles visibility of the password input field.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="92">

---

The <SwmToken path="/front-end/src/views/SignIn.vue" pos="95:1:1" line-data="    toggleConfirmPasswordVisibility() {">`toggleConfirmPasswordVisibility`</SwmToken> method toggles the visibility of the confirm password input field:

```
    /**
     * Toggles visibility of the confirm password input field.
     */
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
```

---

</SwmSnippet>

# Form

## Form validation logic

The form includes validation logic to ensure that user inputs meet the required criteria before submission. This prevents invalid data from being sent to the server.

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="98">

---

The <SwmToken path="/front-end/src/views/SignIn.vue" pos="103:1:1" line-data="    validateEmail(email) {">`validateEmail`</SwmToken> method checks if the email format is valid.

@param {string} <SwmToken path="/front-end/src/views/SignIn.vue" pos="103:3:3" line-data="    validateEmail(email) {">`email`</SwmToken> - The email to validate.\
@returns {boolean} - Returns true if the email is valid, otherwise false.

```
    /**
     * Validates the email format.
     * @param {string} email - The email to validate.
     * @returns {boolean} - Returns true if the email is valid, otherwise false.
     */
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="107">

---

The <SwmToken path="/front-end/src/views/SignIn.vue" pos="110:3:3" line-data="    async handleSubmit() {">`handleSubmit`</SwmToken> method handles form submission and performs validation:

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="119">

---

The validation logic includes checks for email, username, password, confirm password, and role:

```

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
```

---

</SwmSnippet>

## Form submission process

If all validations pass, the form data is submitted to the server. The submission process includes setting up headers, creating a request, and handling the server response.

<SwmSnippet path="/front-end/src/views/SignIn.vue" line="151">

---

The form data is prepared and submitted as follows:

```

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
```

---

</SwmSnippet>

This concludes the walkthrough of the signup feature implementation. The code ensures that user inputs are validated and securely submitted to the server for account creation.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
