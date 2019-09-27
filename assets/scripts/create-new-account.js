(function() {
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
    const txtFirstName = document.getElementById('txtFirstName');
    const txtLastName = document.getElementById('txtLastName');
    const txtUsername = document.getElementById('txtUsername');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    // const txtConfirmPassword = document.getElementById('txtConfirmPassword');
    const btnSignUp = document.getElementById('btnSignUp');

    // Add Sign Up Event
    btnSignUp.addEventListener('click', e => {
        // Get Email and Password
        const email = txtEmail.value;
        const usernameIn = txtUsername.value;
        // TODO: check passwords match
        const password = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise.then(e => {
            var user = firebase.auth().currentUser;
            console.log(user);

            user.updateProfile({
                displayName: txtFirstName.value + " " + txtLastName.value,
            }).then(function() {
                console.log('user displayName updated');
            }).catch(function(error) {
                console.log('user displayName NOT updated :(');
            });

            firebase.database().ref('users/' + user.uid).set({
                username: usernameIn,
                email: email,
                totalWeightLifted: 0
            });

            firebase.database().ref('usernames/' + usernameIn).set(user.uid);
        })
            .then(function() {
                "use strict";
                window.location.href = 'account.html';
            });

        promise.catch(e => console.log(e.message));
    });

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
        }
        else {
            console.log('not logged in');
        }
    });

}());