/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL =
    "http://127.0.0.1:5000/api/auth";


/* =====================================================
   ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const message =
    document.getElementById("message");

const rememberInput =
    document.getElementById("remember");


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text, type) {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className =
        "message show " + type;
}


function clearMessage() {

    if (!message) {
        return;
    }

    message.textContent = "";

    message.className =
        "message";
}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            clearMessage();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            /* =================================================
               PASSWORD VALIDATION
            ================================================= */

            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            /* =================================================
               LOADING
            ================================================= */

            loginButton.disabled = true;

            loginButton.classList.add(
                "loading"
            );

            loginButton.textContent =
                "Signing in...";


            try {

                /* =================================================
                   LOGIN REQUEST

                   API_URL:
                   http://127.0.0.1:5000/api/auth

                   Final endpoint:
                   http://127.0.0.1:5000/api/auth/login
                ================================================= */

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    password:
                                        password

                                })
                        }
                    );


                /* =================================================
                   SERVER RESPONSE
                ================================================= */

                let data;


                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    throw new Error(
                        "Invalid response from server."
                    );

                }


                /* =================================================
                   LOGIN FAILED
                ================================================= */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Invalid email or password."
                    );

                }


                /* =================================================
                   CHECK USER DATA
                ================================================= */

                if (!data.user) {

                    throw new Error(
                        "Login successful, but user information was not returned."
                    );

                }


                /* =================================================
                   SAVE USER INFORMATION

                   This is NOT authentication.

                   The real authentication is handled
                   by the Express session cookie.
                ================================================= */

                localStorage.setItem(
                    "maisonUser",
                    JSON.stringify(
                        data.user
                    )
                );


                /* =================================================
                   REMEMBER EMAIL
                ================================================= */

                if (
                    rememberInput &&
                    rememberInput.checked
                ) {

                    localStorage.setItem(
                        "maisonRememberedEmail",
                        email
                    );

                } else {

                    localStorage.removeItem(
                        "maisonRememberedEmail"
                    );

                }


                /* =================================================
                   SUCCESS
                ================================================= */

                showMessage(
                    "Login successful. Welcome back to Maison!",
                    "success"
                );


                loginButton.textContent =
                    "Welcome back ✦";


                /* =================================================
                   REDIRECT
                ================================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to sign in. Please try again.",
                    "error"
                );


                loginButton.disabled =
                    false;


                loginButton.classList.remove(
                    "loading"
                );


                loginButton.textContent =
                    "Sign In";

            }

        }
    );

}


/* =====================================================
   REMEMBERED EMAIL
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedEmail =
            localStorage.getItem(
                "maisonRememberedEmail"
            );


        if (
            savedEmail &&
            emailInput
        ) {

            emailInput.value =
                savedEmail;


            if (rememberInput) {

                rememberInput.checked =
                    true;

            }

        }

    }
);


/* =====================================================
   CLEAR MESSAGE WHEN USER TYPES
===================================================== */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        clearMessage
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        clearMessage
    );

}
