firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        showAccountsPage();
    } else {
        redirectToLoginPage();
    }
});
function showAccountsPage() {
    console.log("User Logged In!");
}
function redirectToLoginPage() {
    window.location.href = 'login.html';
}