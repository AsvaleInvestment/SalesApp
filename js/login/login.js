const auth = firebase.auth();

/**
 * redirect to the homepage if the user is logged in
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        showHomepage();
    }
});
function showHomepage() {
    window.location.href = 'index.html';
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    
    const loginButton = document.querySelector('button[type="submit"]');
    loginButton.disabled = true; // Disable login button during the process
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.style.display = 'none'; // Hide error message initially

    try {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';
        await firebase.auth().signInWithEmailAndPassword(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        errorMessageElement.innerText = JSON.parse(error.message).error.message;
        errorMessageElement.style.display = 'block';
    } finally {
        loginButton.disabled = false;
        loader.style.display = 'none';
    }
});
