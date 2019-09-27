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

var currentUser = null;

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        currentUser = firebaseUser.uid;
        getAllExercisesInRoutine();
    }
    else {
        console.log('not logged in');
    }
});

// DOM Elements
const welcomeMessage = document.getElementById('welcomeMessage');
const txtRoutineInfo = document.getElementById('txtRoutineInfo');
const routineID = sessionStorage.getItem("routineKey");
const muscleGroup = document.getElementById('muscleGroup');
const exerciseOption = document.getElementById('exerciseOption');
const addExerciseBtn = document.getElementById('addExerciseBtn');

// Get the modal
var addExerciseModal = document.getElementById('addExerciseModal');

// Get the <span> element that closes the modal
var span0 = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
addExerciseBtn.onclick = function() {
    addExerciseModal.style.display = "block";
    let selectedMuscleGroup = muscleGroup.options[muscleGroup.selectedIndex].value;
    let selectedMuscleGroupRef = firebase.database().ref('exercises/' + selectedMuscleGroup);
    exerciseOption.innerHTML = ' ';
    selectedMuscleGroupRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let exerciseElement = document.createElement('TR');
                exerciseElement.classList.add("exerciseRow");

                let exerciseImageCell = document.createElement('TD');
                exerciseImageCell.classList.add("exerciseImageCell");

                let exerciseDescCell = document.createElement('TD');
                exerciseDescCell.classList.add("exerciseDescCell");

                let addExerciseCell = document.createElement('TD');
                addExerciseCell.classList.add("addExerciseCell");

                let exerciseImageFileOne = document.createElement('IMG');
                let exerciseImageFileTwo = document.createElement('IMG');
                exerciseImageFileOne.setAttribute('src', childSnapshot.val()['img_one']);
                exerciseImageFileOne.classList.add("exerciseImage");
                exerciseImageFileTwo.setAttribute('src', childSnapshot.val()['img_two']);
                exerciseImageFileTwo.classList.add("exerciseImage");
                exerciseImageFileOne.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                exerciseImageFileTwo.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                exerciseImageCell.appendChild(exerciseImageFileOne);
                exerciseImageCell.appendChild(exerciseImageFileTwo);

                let exerciseName = document.createElement('H1');
                exerciseName.classList.add('redText');
                exerciseName.innerHTML = childSnapshot.key;
                exerciseDescCell.appendChild(exerciseName);

                let equipmentUsed = document.createElement('P');
                equipmentUsed.innerHTML = 'Equipment Used: ' + childSnapshot.val()['equipment'];
                exerciseDescCell.appendChild(equipmentUsed);

                let addExerciseBtn = document.createElement('BUTTON');
                addExerciseBtn.innerHTML = 'Add this exercise';
                addExerciseBtn.addEventListener('click', e => {
                    let selectedExerciseRow = document.getElementById('selectedExerciseRow');
                    selectedExerciseRow.innerHTML = ' ';
                    addExerciseModal.style.display = "none";
                    addSetsToExerciseModal.style.display = "block";
                    let selectedExerciseImageCell = document.createElement('TD');
                    selectedExerciseImageCell.classList.add("exerciseImageCell");

                    let selectedExerciseDescCell = document.createElement('TD');
                    selectedExerciseDescCell.classList.add("exerciseDescCell");

                    let addSetsCell = document.createElement('TD');
                    addSetsCell.classList.add("addSetsCell");

                    let selectedExerciseImageFileOne = document.createElement('IMG');
                    let selectedExerciseImageFileTwo = document.createElement('IMG');
                    selectedExerciseImageFileOne.setAttribute('src', childSnapshot.val()['img_one']);
                    selectedExerciseImageFileOne.classList.add("exerciseImage");
                    selectedExerciseImageFileTwo.setAttribute('src', childSnapshot.val()['img_two']);
                    selectedExerciseImageFileTwo.classList.add("exerciseImage");
                    selectedExerciseImageFileOne.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                    selectedExerciseImageFileTwo.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                    selectedExerciseImageCell.appendChild(selectedExerciseImageFileOne);
                    selectedExerciseImageCell.appendChild(selectedExerciseImageFileTwo);
                    selectedExerciseRow.appendChild(selectedExerciseImageCell);

                    let selectedExerciseName = document.createElement('H1');
                    selectedExerciseName.innerHTML = childSnapshot.key;
                    selectedExerciseDescCell.appendChild(selectedExerciseName);

                    let selectedEquipmentUsed = document.createElement('P');
                    selectedEquipmentUsed.innerHTML = 'Equipment Used: ' + childSnapshot.val()['equipment'];
                    selectedExerciseDescCell.appendChild(selectedEquipmentUsed);
                    selectedExerciseRow.appendChild(selectedExerciseDescCell);

                    let selectedAddSetsBtn = document.createElement('BUTTON');
                    selectedAddSetsBtn.innerHTML = 'Add this exercise';

                    let addSetsInput = document.createElement('INPUT');
                    addSetsInput.setAttribute('id', 'addSetsInput');

                    addSetsInput.setAttribute('type', 'number');
                    addSetsInput.setAttribute('placeholder', '# Sets');
                    addSetsCell.appendChild(addSetsInput);
                    addSetsCell.appendChild(selectedAddSetsBtn);
                    selectedExerciseRow.appendChild(addSetsCell);

                    let exercise = {
                        name: childSnapshot.key,
                        muscleGroup: selectedMuscleGroup,
                        imgOne: childSnapshot.val()['img_one'],
                        imgTwo: childSnapshot.val()['img_two'],
                        equipment: childSnapshot.val()['equipment']
                    };
                    selectedAddSetsBtn.addEventListener('click', e => {
                        "use strict";
                        addExerciseToRoutine(exercise);
                    })
                });

                addExerciseCell.appendChild(addExerciseBtn);

                exerciseElement.appendChild(exerciseImageCell);
                exerciseElement.appendChild(exerciseDescCell);
                exerciseElement.appendChild(addExerciseCell);

                exerciseOption.appendChild(exerciseElement);
            });
        });
};

// When the user clicks on <span> (x), close the addExerciseModal
span0.onclick = function() {
    addExerciseModal.style.display = "none";
};

window.addEventListener('click', event => {
    "use strict";
    if (event.target == addExerciseModal) {
        addExerciseModal.style.display = "none";
    }
});

// Get the modal
var addSetsToExerciseModal = document.getElementById('addSetsToExerciseModal');

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
    addSetsToExerciseModal.style.display = "none";
    console.log('clicked');
};

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', event => {
    "use strict";
    if (event.target == addSetsToExerciseModal) {
        addSetsToExerciseModal.style.display = "none";
    }
});

muscleGroup.addEventListener('change', e => {
    let selectedMuscleGroup = muscleGroup.options[muscleGroup.selectedIndex].value;
    let selectedMuscleGroupRef = firebase.database().ref('exercises/' + selectedMuscleGroup);
    exerciseOption.innerHTML = ' ';
    selectedMuscleGroupRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let exerciseElement = document.createElement('TR');
                exerciseElement.classList.add("exerciseRow");

                let exerciseImageCell = document.createElement('TD');
                exerciseImageCell.classList.add("exerciseImageCell");

                let exerciseDescCell = document.createElement('TD');
                exerciseDescCell.classList.add("exerciseDescCell");

                let addExerciseCell = document.createElement('TD');
                addExerciseCell.classList.add("addExerciseCell");

                let exerciseImageFileOne = document.createElement('IMG');
                let exerciseImageFileTwo = document.createElement('IMG');
                exerciseImageFileOne.setAttribute('src', childSnapshot.val()['img_one']);
                exerciseImageFileOne.classList.add("exerciseImage");
                exerciseImageFileTwo.setAttribute('src', childSnapshot.val()['img_two']);
                exerciseImageFileTwo.classList.add("exerciseImage");
                exerciseImageFileOne.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                exerciseImageFileTwo.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                exerciseImageCell.appendChild(exerciseImageFileOne);
                exerciseImageCell.appendChild(exerciseImageFileTwo);

                let exerciseName = document.createElement('H1');
                exerciseName.classList.add('redText');
                exerciseName.innerHTML = childSnapshot.key;
                exerciseDescCell.appendChild(exerciseName);

                let equipmentUsed = document.createElement('P');
                equipmentUsed.innerHTML = 'Equipment Used: ' + childSnapshot.val()['equipment'];
                exerciseDescCell.appendChild(equipmentUsed);

                let addExerciseBtn = document.createElement('BUTTON');
                addExerciseBtn.innerHTML = 'Add this exercise';
                addExerciseBtn.addEventListener('click', e => {
                    let selectedExerciseRow = document.getElementById('selectedExerciseRow');
                    selectedExerciseRow.innerHTML = ' ';
                    addExerciseModal.style.display = "none";
                    addSetsToExerciseModal.style.display = "block";
                    let selectedExerciseImageCell = document.createElement('TD');
                    selectedExerciseImageCell.classList.add("exerciseImageCell");

                    let selectedExerciseDescCell = document.createElement('TD');
                    selectedExerciseDescCell.classList.add("exerciseDescCell");

                    let addSetsCell = document.createElement('TD');
                    addSetsCell.classList.add("addSetsCell");

                    let selectedExerciseImageFileOne = document.createElement('IMG');
                    let selectedExerciseImageFileTwo = document.createElement('IMG');
                    selectedExerciseImageFileOne.setAttribute('src', childSnapshot.val()['img_one']);
                    selectedExerciseImageFileOne.classList.add("exerciseImage");
                    selectedExerciseImageFileTwo.setAttribute('src', childSnapshot.val()['img_two']);
                    selectedExerciseImageFileTwo.classList.add("exerciseImage");
                    selectedExerciseImageFileOne.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                    selectedExerciseImageFileTwo.setAttribute('alt', 'Bodybuilder demonstrating the exercise');
                    selectedExerciseImageCell.appendChild(selectedExerciseImageFileOne);
                    selectedExerciseImageCell.appendChild(selectedExerciseImageFileTwo);
                    selectedExerciseRow.appendChild(selectedExerciseImageCell);

                    let selectedExerciseName = document.createElement('H1');
                    selectedExerciseName.classList.add('redText');
                    selectedExerciseName.innerHTML = childSnapshot.key;
                    selectedExerciseDescCell.appendChild(selectedExerciseName);

                    let selectedEquipmentUsed = document.createElement('P');
                    selectedEquipmentUsed.innerHTML = 'Equipment Used: ' + childSnapshot.val()['equipment'];
                    selectedExerciseDescCell.appendChild(selectedEquipmentUsed);
                    selectedExerciseRow.appendChild(selectedExerciseDescCell);

                    let selectedAddSetsBtn = document.createElement('BUTTON');
                    selectedAddSetsBtn.innerHTML = 'Add this exercise';

                    let addSetsInput = document.createElement('INPUT');
                    addSetsInput.setAttribute('id', 'addSetsInput');

                    addSetsInput.setAttribute('type', 'number');
                    addSetsInput.setAttribute('placeholder', '# Sets');
                    addSetsCell.appendChild(addSetsInput);
                    addSetsCell.appendChild(selectedAddSetsBtn);
                    selectedExerciseRow.appendChild(addSetsCell);

                    let exercise = {
                        name: childSnapshot.key,
                        muscleGroup: selectedMuscleGroup,
                        imgOne: childSnapshot.val()['img_one'],
                        imgTwo: childSnapshot.val()['img_two'],
                        equipment: childSnapshot.val()['equipment']
                    };
                    selectedAddSetsBtn.addEventListener('click', e => {
                        "use strict";
                        addExerciseToRoutine(exercise);
                    })


                    // firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup').push({
                    //     exercise_name: childSnapshot.key,
                    //     num_sets: 4
                    // });
                });

                addExerciseCell.appendChild(addExerciseBtn);

                exerciseElement.appendChild(exerciseImageCell);
                exerciseElement.appendChild(exerciseDescCell);
                exerciseElement.appendChild(addExerciseCell);

                exerciseOption.appendChild(exerciseElement);
            });
        });
});

welcomeMessage.innerHTML = 'Routine Name: ' + sessionStorage.getItem('routineName');

var muscleGroupsRef = firebase.database().ref('exercises');
muscleGroupsRef.once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let categoryElement = document.createElement('OPTION');
            categoryElement.setAttribute('name', childSnapshot.key);
            categoryElement.innerHTML = childSnapshot.key;
            muscleGroup.appendChild(categoryElement);
        });
    });

function addExerciseToRoutine(exerciseIn) {
    console.log('button clicked :0');
    let exercise = {
        exerciseName: exerciseIn.name,
        muscleGroupTargeted: exerciseIn.muscleGroup,
        equipment: exerciseIn.equipment,
        sets: parseInt(document.getElementById('addSetsInput').value),
        imgOne: exerciseIn.imgOne,
        imgTwo: exerciseIn.imgTwo
    };
    let newExerciseRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup').push(exercise);
    let numSetsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/numSets');
    let numExercisesRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/numExercises');
    numSetsRef.once('value')
        .then(function(snapshot) {
            "use strict";
            numSetsRef.set(exercise.sets + parseInt(snapshot.val()));
        });
    numExercisesRef.once('value')
        .then(function(snapshot) {
            "use strict";
            numExercisesRef.set(snapshot.val() + 1);
        });

    addExerciseElement(exercise, newExerciseRef.key);
    addSetsToExerciseModal.style.display = "none";
}

function addExerciseElement(exercise, key) {
    "use strict";
    let exercisesInRoutine = document.getElementById('exercisesInRoutine');
    let exerciseElementRow = document.createElement('TR');
    exerciseElementRow.classList.add('exerciseRow');

    let exerciseImageCell = document.createElement('TD');
    let exerciseImgOne = document.createElement('IMG');
    let exerciseImgTwo = document.createElement('IMG');
    exerciseImgOne.setAttribute('src', exercise.imgOne);
    exerciseImgTwo.setAttribute('src', exercise.imgTwo);
    exerciseImgOne.classList.add("exerciseImage");
    exerciseImgTwo.classList.add("exerciseImage");
    exerciseImageCell.appendChild(exerciseImgOne);
    exerciseImageCell.appendChild(exerciseImgTwo);
    exerciseImageCell.classList.add('exerciseImageCell');
    exerciseElementRow.appendChild(exerciseImageCell);

    let exerciseDescCell = document.createElement('TD');
    let exerciseNameTxt = document.createElement('H3');
    exerciseNameTxt.classList.add('redText');
    exerciseNameTxt.innerHTML = exercise.exerciseName;
    let exerciseEquipmentTxt = document.createElement('P');
    exerciseEquipmentTxt.innerHTML = 'Equipment Used: ' + exercise.equipment;
    let exerciseMuscleGroupTxt = document.createElement('P');
    exerciseMuscleGroupTxt.innerHTML = 'Muscle Group Targeted: ' + exercise.muscleGroupTargeted;

    exerciseDescCell.appendChild(exerciseNameTxt);
    exerciseDescCell.appendChild(exerciseEquipmentTxt);
    exerciseDescCell.appendChild(exerciseMuscleGroupTxt);
    exerciseDescCell.classList.add('exerciseDescCell');
    exerciseElementRow.appendChild(exerciseDescCell);

    let exerciseSetsCell = document.createElement('TD');
    let exerciseSetsTxt = document.createElement('H3');
    console.log(exercise.sets);
    exerciseSetsTxt.innerHTML = exercise.sets + ' Sets';
    exerciseSetsCell.appendChild(exerciseSetsTxt);
    exerciseSetsCell.classList.add('addSetsCell');
    let deleteExerciseBtn = document.createElement('BUTTON');
    deleteExerciseBtn.innerHTML = 'Delete this Exercise';
    deleteExerciseBtn.classList.add('deleteExerciseBtn');
    deleteExerciseBtn.addEventListener('click', e => {
        let numSetsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/numSets');
        let numExercisesRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/numExercises');
        numSetsRef.once('value')
            .then(function(snapshot) {
                "use strict";
                console.log(exercise.sets);
                numSetsRef.set(snapshot.val() - exercise.sets);
            });
        numExercisesRef.once('value')
            .then(function(snapshot) {
                "use strict";
                numExercisesRef.set(snapshot.val() - 1);
            });
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup/' + key).remove();
        exerciseElementRow.remove();
    });
    exerciseSetsCell.appendChild(deleteExerciseBtn);
    exerciseElementRow.appendChild(exerciseSetsCell);

    exercisesInRoutine.appendChild(exerciseElementRow);
    exerciseElementRow.appendChild(exerciseSetsCell);

    exercisesInRoutine.appendChild(exerciseElementRow);
}

function getAllExercisesInRoutine() {
    "use strict";
    var routineRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup');
    routineRef.once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                let exercisesInRoutine = document.getElementById('exercisesInRoutine');
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
                exerciseNameTxt.classList.add('redText');
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
                exerciseSetsTxt.innerHTML = childSnapshot.val().sets + ' Sets';
                exerciseSetsCell.appendChild(exerciseSetsTxt);
                exerciseSetsCell.classList.add('addSetsCell');
                let deleteExerciseBtn = document.createElement('BUTTON');
                deleteExerciseBtn.innerHTML = 'Delete this Exercise';
                deleteExerciseBtn.classList.add('deleteExerciseBtn');
                deleteExerciseBtn.addEventListener('click', e => {
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/routines/' + sessionStorage.getItem('routineKey') + '/lineup/' + childSnapshot.key).remove();
                    exerciseElementRow.remove();
                });
                exerciseSetsCell.appendChild(deleteExerciseBtn);
                exerciseElementRow.appendChild(exerciseSetsCell);

                exercisesInRoutine.appendChild(exerciseElementRow);
            })
        })
}