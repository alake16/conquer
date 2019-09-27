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

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        user = firebaseUser;
        getMyRoutines();
    }
    else {
        console.log('not logged in');
    }
});

// DOM Elements
const routines = document.getElementById('routines');
const exercisesInRoutine = document.getElementById('exercisesInRoutine');
const modalHeader = document.getElementById('modalHeader');
let submitWorkoutBtn = document.getElementById('submitWorkoutBtn');

// Get the modal
var logExerciseModal = document.getElementById('logExerciseModal');

// Get the <span> element that closes the modal
var span0 = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the logExerciseModal
span0.onclick = function() {
    logExerciseModal.style.display = "none";
};

window.addEventListener('click', event => {
    "use strict";
    if (event.target == logExerciseModal) {
        logExerciseModal.style.display = "none";
    }
});

let newWorkoutKey;

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
                let logRoutineCell = document.createElement('TD');
                logRoutineCell.classList.add('logRoutineCell');

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


                let logWorkoutBtn = document.createElement('BUTTON');
                logWorkoutBtn.innerHTML = 'Log this Workout';
                logWorkoutBtn.addEventListener('click', e => {
                    "use strict";
                    sessionStorage.setItem("routineKey", childSnapshot.key);
                    sessionStorage.setItem("routineName", childSnapshot.val()['name']);
                    exercisesInRoutine.innerHTML = "";
                    logExerciseModal.style.display = "block";
                    modalHeader.innerHTML = 'Logging Exercise: ' + childSnapshot.val()['name'];
                    newWorkoutKey = firebase.database().ref('users/' + user.uid + '/loggedWorkouts').push({
                        name: childSnapshot.val()['name'],
                        description: childSnapshot.val()['description'],
                        type: childSnapshot.val()['type'],
                        time: getTime()
                    }).key;
                    getAllExercisesInRoutine();
                });
                logRoutineCell.appendChild(logWorkoutBtn);
                routineElement.appendChild(logRoutineCell);

                routines.appendChild(routineElement);
            })
        })

}

let workout;

function getAllExercisesInRoutine() {
    "use strict";
    var routineRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup');
    routineRef.once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                let newExerciseKey = firebase.database().ref('users/' + user.uid + '/loggedWorkouts/' + newWorkoutKey + '/log/').push({
                    exerciseName: childSnapshot.val()['exerciseName']
                }).key;
                let exerciseElementRow = document.createElement('TR');
                exerciseElementRow.classList.add('exerciseRow');

                let exerciseImageCell = document.createElement('TD');
                let exerciseImgOne = document.createElement('IMG');
                let exerciseImgTwo = document.createElement('IMG');
                exerciseImgOne.setAttribute('src', childSnapshot.val().imgOne);
                exerciseImgTwo.setAttribute('src', childSnapshot.val().imgTwo);
                exerciseImgOne.classList.add("exerciseImage");
                exerciseImgTwo.classList.add("exerciseImage");
                exerciseImageCell.appendChild(exerciseImgOne);
                exerciseImageCell.appendChild(exerciseImgTwo);
                exerciseImageCell.classList.add('exerciseImageCell');
                exerciseElementRow.appendChild(exerciseImageCell);

                let exerciseDescCell = document.createElement('TD');
                let exerciseNameTxt = document.createElement('H3');
                exerciseNameTxt.innerHTML = childSnapshot.val().exerciseName;
                let exerciseEquipmentTxt = document.createElement('P');
                exerciseEquipmentTxt.innerHTML = 'Equipment Used: ' + childSnapshot.val().equipment;
                let exerciseMuscleGroupTxt = document.createElement('P');
                exerciseMuscleGroupTxt.innerHTML = 'Muscle Group Targeted: ' + childSnapshot.val().muscleGroupTargeted;

                exerciseDescCell.appendChild(exerciseNameTxt);
                exerciseDescCell.appendChild(exerciseEquipmentTxt);
                exerciseDescCell.appendChild(exerciseMuscleGroupTxt);
                exerciseDescCell.classList.add('exerciseDescCell');
                exerciseElementRow.appendChild(exerciseDescCell);

                let exerciseSetsCell = document.createElement('TD');
                let exerciseSetsTxt = document.createElement('H3');
                let numSets = childSnapshot.val()['sets'];
                exerciseSetsTxt.innerHTML = numSets + ' Sets';
                exerciseSetsCell.appendChild(exerciseSetsTxt);
                exerciseSetsCell.classList.add('addSetsCell');
                for (var i = 0; i < numSets; i++) {
                    let setNum = document.createElement('P');
                    setNum.innerHTML = 'Set #' + (i + 1);
                    let weightInput = document.createElement('INPUT');
                    weightInput.setAttribute('placeholder', 'Weight (LBs)');
                    weightInput.setAttribute('type', 'number');
                    let repsInput = document.createElement('INPUT');
                    repsInput.setAttribute('placeholder', '# Reps');
                    repsInput.setAttribute('type', 'number');
                    exerciseSetsCell.appendChild(setNum);
                    exerciseSetsCell.appendChild(weightInput);
                    exerciseSetsCell.appendChild(repsInput);
                    submitWorkoutBtn.addEventListener('click', e => {
                        firebase.database().ref('users/' + user.uid + '/loggedWorkouts/' + newWorkoutKey + '/log/' + newExerciseKey).push({
                            weight: weightInput.value,
                            reps: repsInput.value
                        });
                    });
                }
                exerciseElementRow.appendChild(exerciseSetsCell);

                exercisesInRoutine.appendChild(exerciseElementRow);
            })
        })

}

submitWorkoutBtn.addEventListener('click', e => {
    "use strict";
    logExerciseModal.style.display = "none";
});

function getTime() {
    "use strict";
    var d = new Date();
    var month = d.getMonth() + 1;
    var meridian;
    if(month < 10) {
        month = '0' + month;
    }
    var day = d.getDate();
    if(day < 10) {
        day = '0' + day;
    }
    var hour = d.getHours();
    if (hour > 12) {
        hour = hour % 12;
        meridian = 'PM';
    }
    else {
        meridian = 'AM';
    }
    var minute = d.getMinutes();

    if (minute < 10) {
        minute = '0' + minute;
    }

    var time = month + '-' + day + ' ' + hour + ':' + minute + ' ' + meridian;
    return time;
}