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

let user = null;

firebase.auth().onAuthStateChanged(firebaseUser =>  {
    if (firebaseUser) {
        // User is signed in.
        let displayName = firebaseUser.displayName;
        console.log(displayName);
        document.getElementById('welcome-message').innerHTML = displayName + '\'s Routines';
        user = firebaseUser;
        getMyRoutines();
    } else {
        document.getElementById('welcome-message').innerHTML = 'Not signed in.';
        // User is signed out.
        // ...
    }
});

// DOM Elements
const btnCreateNewRoutine = document.getElementById('btnCreateNewRoutine');
const routines = document.getElementById('routines');

// Button Listener
btnCreateNewRoutine.addEventListener('click', e => {
    window.location.href = 'create-new-routine.html';
});

function getMyRoutines() {
    var routinesRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines');
    routinesRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let routineElement = document.createElement('TR');
                routineElement.classList.add('routineRow');
                let routineInfoCell = document.createElement('TD');
                routineInfoCell.classList.add('routineInfoCell');
                let routineMusclesCell = document.createElement('TD');
                routineMusclesCell.classList.add('routineMusclesTargetedCell');
                let editRoutineCell = document.createElement('TD');
                editRoutineCell.classList.add('editRoutineCell');

                // Routine Info Elements
                let routineName = document.createElement('H2');
                routineName.classList.add('redText');
                routineName.innerHTML = childSnapshot.val()['name'];
                routineInfoCell.appendChild(routineName);
                let routineType = document.createElement('P');
                routineType.innerHTML = 'Goal: ' + childSnapshot.val()['type'];
                routineInfoCell.appendChild(routineType);
                let routineDesc = document.createElement('P');
                routineDesc.innerHTML = 'Description: ' + childSnapshot.val()['description'];
                routineInfoCell.appendChild(routineDesc);

                routineElement.appendChild(routineInfoCell);


                // Edit Routine Buttons
                let editRoutineBtn = document.createElement('BUTTON');
                editRoutineBtn.innerHTML = 'Edit Routine';
                editRoutineBtn.addEventListener('click', e => {
                    "use strict";
                    sessionStorage.setItem("routineKey", childSnapshot.key);
                    sessionStorage.setItem("routineName", childSnapshot.val()['name']);
                    window.location.href = 'edit-routine.html';
                });
                let deleteRoutineBtn = document.createElement('BUTTON');
                deleteRoutineBtn.innerHTML = 'Delete Rotuine';
                deleteRoutineBtn.addEventListener('click', e => {
                    "use strict";
                    firebase.database().ref('users/' + user.uid + '/routines/' + childSnapshot.key).remove();
                    routineElement.remove();
                });
                editRoutineCell.appendChild(editRoutineBtn);
                editRoutineCell.appendChild(deleteRoutineBtn);
                routineElement.appendChild(editRoutineCell);

                routines.appendChild(routineElement);
            })
        })
}