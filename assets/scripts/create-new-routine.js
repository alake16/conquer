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

// DOM Elements
const txtRoutineName = document.getElementById('txtRoutineName');
const txtRoutineType = document.getElementById('txtRoutineType');
const txtRoutineDesc = document.getElementById('txtRoutineDesc');
const btnCreateNewRoutine = document.getElementById('btnCreateNewRoutine');

// Button click listeners
btnCreateNewRoutine.addEventListener('click', e => {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines').push({
        name: txtRoutineName.value,
        type: txtRoutineType.value,
        description: txtRoutineDesc.value,
        numSets: 0,
        numExercises: 0
    })
    .then(function() {
        "use strict";
        window.location.href = 'routines.html';
    });
});