---
title: Login
---
# Introduction

Path : <SwmPath>[front-end/src/views/LogIn.vue](/front-end/src/views/LogIn.vue)</SwmPath>

This document will walk you through the implementation of the login feature.

The feature allows users to log in to the application using their email and password. It includes form validation, error handling, and navigation to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

We will cover:

1. The structure of the login form.
2. Data handling and state management.
3. Form submission and error handling.
4. Additional functionalities like password visibility toggle and navigation to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

# Structure of the login form

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="6">

---

The login form includes fields for the username/email and password, error messages, and buttons for form submission and navigation to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="25">

---

The password field includes a toggle for showing/hiding the password.

```

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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="37">

---

The form also displays a server error message if the login fails and provides a button to navigate to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

```

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
```

---

</SwmSnippet>

# Data handling and state management

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="54">

---

The component's data properties include fields for the username/email, password, error messages, and a success message. These properties are used to manage the form's state and display appropriate messages to the user.

```
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
```

---

</SwmSnippet>

# Form submission and error handling

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="67">

---

The <SwmToken path="/front-end/src/views/LogIn.vue" pos="14:10:10" line-data="    &lt;form @submit.prevent=&quot;handleLogin&quot;&gt;">`handleLogin`</SwmToken> method is responsible for handling the form submission. It dispatches the <SwmToken path="/front-end/src/views/LogIn.vue" pos="54:5:5" line-data="  name: &#39;Login&#39;,">`Login`</SwmToken> action to the Vuex store and handles any errors that occur during the login process.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="78">

---

The method resets previous error messages, dispatches the login action, and sets the success message if the login is successful. If an error occurs, it sets the server error message.

```

      try {
        await this.$store.dispatch('login', {
          email: this.usernameOrEmail,
          password: this.password});
        this.successMessage = "Logged in successfully!";
      } catch (error) {
        this.serverError = "Invalid credentials or server issue.";
      }
```

---

</SwmSnippet>

# Additional functionalities

The component includes methods for toggling the password visibility and navigating to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="89">

---

The <SwmToken path="/front-end/src/views/LogIn.vue" pos="92:1:1" line-data="    togglePasswordVisibility() {">`togglePasswordVisibility`</SwmToken> method toggles the visibility of the password input field.

```
    /**
     * Toggles the visibility of the password input field.
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle password visibility
    },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/views/LogIn.vue" line="95">

---

The <SwmToken path="/front-end/src/views/LogIn.vue" pos="98:1:1" line-data="    goToSignUp() {">`goToSignUp`</SwmToken> method navigates the user to the <SwmToken path="/front-end/src/views/LogIn.vue" pos="211:4:6" line-data="/* New Sign-up Section Styles */">`Sign-up`</SwmToken> page.

```
    /**
     * Navigates the user to the Sign Up page.
     */
    goToSignUp() {
      this.$router.push('/register');
    }
  }
```

---

</SwmSnippet>

# Conclusion

This document explained the implementation of the login feature, covering the structure of the login form, data handling and state management, form submission and error handling, and additional functionalities. The code snippets provided illustrate the key parts of the implementation.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
