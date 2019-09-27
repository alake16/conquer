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
        document.getElementById('welcome-message').innerHTML = displayName + '\'s Logged Workouts';
        user = firebaseUser;
        getMyLoggedWorkouts();
    } else {
        document.getElementById('welcome-message').innerHTML = 'Not signed in.';
        // User is signed out.
        // ...
    }
});

// Get the modal
var viewExerciseModal = document.getElementById('viewExerciseModal');

// Get the <span> element that closes the modal
var span0 = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the logExerciseModal
span0.onclick = function() {
    viewExerciseModal.style.display = "none";
};

window.addEventListener('click', event => {
    "use strict";
    if (event.target === viewExerciseModal) {
        viewExerciseModal.style.display = "none";
    }
});


// DOM Elements
const workouts = document.getElementById('workouts');
const exercisesLogged = document.getElementById('exercisesLogged');
const modalHeader = document.getElementById('modalHeader');
const modalFooter = document.getElementById('modalFooter');


function getMyLoggedWorkouts() {
    var loggedWorkoutsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/loggedWorkouts');
    loggedWorkoutsRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let workoutElement = document.createElement('TR');
                workoutElement.classList.add('routineRow');
                let workoutInfoCell = document.createElement('TD');
                workoutInfoCell.classList.add('workoutInfoCell');
                let viewWorkoutCell = document.createElement('TD');
                viewWorkoutCell.classList.add('viewWorkoutCell');

                // Routine Info Elements
                let exerciseName = document.createElement('H2');
                exerciseName.classList.add('redText');
                exerciseName.innerHTML = childSnapshot.val()['name'];
                workoutInfoCell.appendChild(exerciseName);
                let workoutDate = document.createElement('P');
                workoutDate.innerHTML = 'Date: ' + childSnapshot.val()['time'];
                workoutInfoCell.appendChild(workoutDate);
                let workoutType = document.createElement('P');
                workoutType.innerHTML = 'Goal: ' + childSnapshot.val()['type'];
                workoutInfoCell.appendChild(workoutType);
                let workoutDesc = document.createElement('P');
                workoutDesc.innerHTML = 'Description: ' + childSnapshot.val()['description'];
                workoutInfoCell.appendChild(workoutDesc);
                workoutElement.appendChild(workoutInfoCell);


                // Edit Routine Buttons
                let viewWorkoutBtn = document.createElement('BUTTON');
                viewWorkoutBtn.innerHTML = 'View Workout';
                viewWorkoutBtn.addEventListener('click', e => {
                    "use strict";
                    sessionStorage.setItem("workoutKey", childSnapshot.key);
                    sessionStorage.setItem("exerciseName", childSnapshot.val()['name']);
                    exercisesLogged.innerHTML = ' ';
                    viewExerciseModal.style.display = "block";
                    modalHeader.innerHTML = 'Viewing Exercise: ' + childSnapshot.val()['name'];
                    modalFooter.innerHTML = 'Logged On: ' + childSnapshot.val()['time'];
                    getAllExercisesInRoutine();
                });
                viewWorkoutCell.appendChild(viewWorkoutBtn);
                workoutElement.appendChild(viewWorkoutCell);

                workouts.appendChild(workoutElement);
            })
        })

}

function getAllExercisesInRoutine() {
    "use strict";
    var loggedRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/loggedWorkouts/' + sessionStorage.getItem('workoutKey') + '/log/');
    loggedRef.once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                let exerciseElementRow = document.createElement('TR');
                exerciseElementRow.classList.add('exerciseRow');
                let exerciseDescCell = document.createElement('TD');
                exerciseDescCell.classList.add('exerciseDescCell');
                let exerciseNameTxt = document.createElement('H3');
                exerciseNameTxt.innerHTML = childSnapshot.val().exerciseName;
                exerciseDescCell.appendChild(exerciseNameTxt);
                exerciseElementRow.appendChild(exerciseDescCell);
                childSnapshot.forEach(function(childChildSnapshot) {
                    let exerciseSetCell = document.createElement('TD');
                    let exerciseWeightTxt = document.createElement('H3');
                    let exerciseRepsTxt = document.createElement('H3');
                    let numWeight = childChildSnapshot.val()['weight'];
                    let numReps = childChildSnapshot.val()['reps'];
                    exerciseWeightTxt.innerHTML = numWeight + ' LBs';
                    exerciseRepsTxt.innerHTML = numReps + ' reps';
                    if (exerciseWeightTxt.innerHTML !== 'undefined LBs') {
                        exerciseSetCell.appendChild(exerciseWeightTxt);
                        exerciseSetCell.appendChild(exerciseRepsTxt);
                    }
                    exerciseSetCell.classList.add('addSetsCell');
                    exerciseElementRow.appendChild(exerciseSetCell);
                });
                exercisesLogged.appendChild(exerciseElementRow);
            })
        })

}
