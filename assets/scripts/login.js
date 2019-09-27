// Initialize Firebase
var config = {
    apiKey: "AIzaSyBL3jIAWFLZgyQOL1bcIoQP0FZ4aJnhqYs",
    authDomain: "conquer-d708f.firebaseapp.com",
    databaseURL: "https://conquer-d708f.firebaseio.com",
    projectId: "conquer-d708f",
    storageBucket: "conquer-d708f.appspot.com",
    messagingSenderId: "832746671290"
};
firebase.initializeApp(config);

// Get DOM Elements
const status = document.getElementById('status');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const txtNoAccount = document.getElementById('txtNoAccount');
const btnLogIn = document.getElementById('btnLogIn');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogOut = document.getElementById('btnLogOut');

// Add login event
btnLogIn.addEventListener('click', e => {
    // Get Email and Password
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);

    promise.catch(e => {
        if (e.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
            console.log('no existing account :(');
        }
        if (e.message === "The password is invalid or the user does not have a password.") {
            // Password is incorrect
            console.log('password incorrect :(');
        }
    });
});

// Add Sign Up Event
btnSignUp.addEventListener('click', e => {
    window.location.href = 'create-new-account.html';
});

// Add logout event
btnLogOut.addEventListener('click', e => {
   firebase.auth().signOut();
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        status.innerHTML = firebaseUser.displayName + ' is signed in to Conquer.';
        btnLogIn.classList.add('hide');
        txtEmail.classList.add('hide');
        txtPassword.classList.add('hide');
        txtNoAccount.classList.add('hide');
        btnSignUp.classList.add('hide');
        btnLogOut.classList.remove('hide');
    }
    else {
        status.innerHTML = 'No user is currently signed in to Conquer.';
        btnLogIn.classList.remove('hide');
        txtEmail.classList.remove('hide');
        txtPassword.classList.remove('hide');
        txtNoAccount.classList.remove('hide');
        btnSignUp.classList.remove('hide');
        btnLogOut.classList.add('hide');
    }
});