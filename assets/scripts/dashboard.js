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

let user;
// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {

    // There is a user logged in
    if (firebaseUser) {
        document.getElementById('welcome-message').innerHTML = firebaseUser.displayName + '\'s Dashboard';

        // Load dashboard information for that user
        const totalWorkoutsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/totalWorkoutsTracked');
        totalWorkoutsRef.on('value', function(snapshot) {
            totalWorkoutsTracked.innerHTML = snapshot.val() + ' Workouts';
        });

        const dateOfLastRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/dateOfLastWorkout');
        dateOfLastRef.on('value', function(snapshot) {
            daysSinceLastWorkout.innerHTML = parseInt(getTodaysDate()) - parseInt(snapshot.val()) + ' Days';
        });

        const currentWeightRef = firebase.database().ref('users/' + firebaseUser.uid + '/current_weight');
        currentWeightRef.on('value', function(snapshot) {
            currentWeight.innerHTML = 'Current Weight: ' + snapshot.val() + ' LBs';
        });
        const targetWeightRef = firebase.database().ref('users/' + firebaseUser.uid + '/target_weight');
        targetWeightRef.on('value', function(snapshot) {
            targetWeight.innerHTML = 'Target Weight: ' + snapshot.val() + ' LBs';
        });

        // Load that user's goals
        const goalsRef = firebase.database().ref('users/' + firebaseUser.uid + '/goals');
        goalsRef.on('value', function(snapshot) {
            goals.innerHTML = ' ';
            snapshot.forEach(function(childSnapshot) {
                "use strict";
                let newGoal = document.createElement('SECTION');
                newGoal.classList.add('card');
                let goalTitle = document.createElement('H4');
                let goalDate = document.createElement('P');
                let goalDescription = document.createElement('P');
                goalTitle.innerHTML = 'Title: ' + childSnapshot.val()['title'];
                goalDate.innerHTML = 'Date: ' + childSnapshot.val()['date'];
                goalDescription.innerHTML = 'Description: ' + childSnapshot.val()['description'];
                newGoal.appendChild(goalTitle);
                newGoal.appendChild(goalDate);
                newGoal.appendChild(goalDescription);
                let newGoalAchievedButton = document.createElement('BUTTON');
                newGoalAchievedButton.innerHTML = 'Goal Achieved';
                newGoalAchievedButton.addEventListener('click', e => {
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/goals/' + childSnapshot.key).remove();
                    newGoal.remove();
                });
                newGoal.appendChild(newGoalAchievedButton);

                goals.appendChild(newGoal);
            })
        });

        const heightRef = firebase.database().ref('users/' + firebaseUser.uid + '/height');
        heightRef.on('value', function(snapshot) {
            height.innerHTML = 'Height: ' + snapshot.val();
        });
        const bmiRef = firebase.database().ref('users/' + firebaseUser.uid + '/body_mass_index');
        bmiRef.on('value', function(snapshot) {
           bodyMassIndex.innerHTML = 'Body Mass Index: ' + snapshot.val() + '%';
        });
        get_weight_data(getPastMonthDate(), getTodaysDate());
    }

    // No user is currently signed in
    else {
        document.getElementById('welcome-message').innerHTML = 'Not signed in.';
    }
});

// Fetch weight data for charting
function get_weight_data(startDate, endDate) {
    let weights = [];
    firebase.database()
        .ref('users/' + firebase.auth().currentUser.uid + '/weight_data')
        .orderByChild('date')
        .startAt(startDate)
        .endAt(endDate)
        .once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                weights.push(childSnapshot.val());
            })
        })
        .then(function(result) {
            console.log(weights);
            getMyChartData(weights)
        })
}

function getMyChartData(weights) {
    let labelsIn = [];
    let dataIn = [];

    for (var i = 0; i < weights.length; i++) {
        labelsIn.push(weights[i].date);
        dataIn.push(weights[i].weight);
    }


    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsIn,
            datasets: [{
                label: 'Weight (LBs)',
                data: dataIn,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Weight'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Weights (LBs'
                    },
                    ticks: {
                        beginAtZero: false
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    }
                }]
            }
        }
    });
}

// DOM elements
const txtWeight = document.getElementById('txtWeight');
const txtDate = document.getElementById('txtDate');
const btnCurrentWeight = document.getElementById('btnCurrentWeight');
const btnTargetWeight = document.getElementById('btnTargetWeight');
const currentWeight = document.getElementById('currentWeight');
const targetWeight = document.getElementById('targetWeight');
const height = document.getElementById('height');
const btnHeight = document.getElementById('btnHeight');
const txtHeightFeet = document.getElementById('txtHeightFeet');
const txtHeightInches = document.getElementById('txtHeightInches');
const bodyMassIndex = document.getElementById('txtBodyMassIndex');
const timeframe = document.getElementById('timeframe');
const logWorkoutBtn = document.getElementById('logWorkoutBtn');
const totalWorkoutsTracked = document.getElementById('totalWorkoutsTracked');
const daysSinceLastWorkout = document.getElementById('daysSinceLastWorkout');
const btnCreateNewGoal = document.getElementById('btnCreateNewGoal');
const txtGoalTitle = document.getElementById('txtGoalTitle');
const txtGoalDate = document.getElementById('txtGoalDate');
const txtGoalDescription = document.getElementById('txtGoalDescription');
const goals = document.getElementById('goals');
const viewLoggedWorkoutsBtn = document.getElementById('viewLoggedWorkoutsBtn');

// Weight chart filter
timeframe.addEventListener('change', e => {
    "use strict";
    let selectedTimeframe = timeframe.options[timeframe.selectedIndex].value;
    console.log(selectedTimeframe);
    switch (selectedTimeframe) {
        case 'Month' :
            get_weight_data(getPastMonthDate(), getTodaysDate());
            break;
        case 'Year' :
            get_weight_data(getPastYearDate(), getTodaysDate());
            break;
        case 'Week' :
            get_weight_data(getPastWeekDate(), getTodaysDate());
            break;
    }
});

// Button Listeners
logWorkoutBtn.addEventListener('click', e => {
    "use strict";
    let totalWorkoutsTrackedRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/totalWorkoutsTracked');
    totalWorkoutsTrackedRef.once('value')
        .then(function(snapshot) {
            totalWorkoutsTrackedRef.set(parseInt(snapshot.val() + 1));
        });
    let dateOfLastWorkoutRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/dateOfLastWorkout');
    dateOfLastWorkoutRef.once('value')
        .then(function(snapshot) {
            dateOfLastWorkoutRef.set(getTodaysDate());
        });
    window.location.href = 'log-workout.html';
});

btnCurrentWeight.addEventListener('click', e => {
    const weightIn = txtWeight.value;
    const dateIn = txtDate.value;

    const heightInchesRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/height_inches');
    heightInchesRef.on('value', function(snapshot) {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/body_mass_index').set((703 * (weightIn / (snapshot.val() * snapshot.val()))).toFixed(2));
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = mm + '-' + dd + '-' + yyyy;
    const user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid + '/current_weight').set(weightIn);


    firebase.database().ref('users/' + user.uid + '/weight_data').push({
        date: dateIn,
        weight: weightIn
    });

    const currentWeightRef = firebase.database().ref('users/' + user.uid + '/current_weight');
    currentWeightRef.on('value', function(snapshot) {
        currentWeight.innerHTML = 'Current Weight: ' + snapshot.val() + ' LBs';
    });

    const bodyMassIndexRef = firebase.database().ref('users/' + user.uid + '/body_mass_index');
    bodyMassIndexRef.on('value', function(snapshot) {
        bodyMassIndex.innerHTML = 'Body Mass Index: ' + snapshot.val() + '%';
    });
    get_weight_data(getPastMonthDate(), getTodaysDate());
});

// Event listener for updating target weight
btnTargetWeight.addEventListener('click', e => {
    const weightIn = txtWeight.value;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = mm + '-' + dd + '-' + yyyy;
    const user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid + '/target_weight').set(weightIn);

    const targetWeightRef = firebase.database().ref('users/' + user.uid + '/target_weight');
    targetWeightRef.on('value', function(snapshot) {
        targetWeight.innerHTML = 'Target Weight: ' + snapshot.val() + ' LBs';
    });
});

// Event listener for updating height
btnHeight.addEventListener('click', e => {
    const user = firebase.auth().currentUser;
    const feetIn = txtHeightFeet.value;
    const inchesIn = txtHeightInches.value;

    const heightInches = 12 * Number(feetIn) + Number(inchesIn);

    firebase.database().ref('users/' + user.uid + '/height').set(feetIn + '\' ' + inchesIn + '"');
    firebase.database().ref('users/' + user.uid + '/height_inches').set(heightInches);

    const heightRef = firebase.database().ref('users/' + user.uid + '/height');
    heightRef.on('value', function(snapshot) {
        height.innerHTML = 'Height: ' + snapshot.val();
    });

    const weightRef = firebase.database().ref('users/' + user.uid + '/current_weight');
    weightRef.on('value', function(snapshot) {
        firebase.database().ref('users/' + user.uid + '/body_mass_index').set((703 * (snapshot.val() / (heightInches * heightInches))).toFixed(2));
    });

    const bodyMassIndexRef = firebase.database().ref('users/' + user.uid + '/body_mass_index');
    bodyMassIndexRef.on('value', function(snapshot) {
        bodyMassIndex.innerHTML = 'Body Mass Index: ' + snapshot.val() + '%';
    });
});

btnCreateNewGoal.addEventListener('click', e => {
    "use strict";
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/goals').push({
        title: txtGoalTitle.value,
        date: txtGoalDate.value,
        description: txtGoalDescription.value
    });
});

viewLoggedWorkoutsBtn.addEventListener('click', e => {
    "use strict";
    window.location.href = 'view-logged-workouts.html';
});

function getTodaysDate() {
    "use strict";
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getPastMonthDate() {
    "use strict";
    var pastMonthDate = new Date();
    var dd = pastMonthDate.getDate();
    var mm = pastMonthDate.getMonth();
    var yyyy = pastMonthDate.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    pastMonthDate = yyyy + '-' + mm + '-' + dd;
    return pastMonthDate;
}

function getPastYearDate() {
    "use strict";
    var pastYearDate = new Date();
    var dd = pastYearDate.getDate();
    var mm = pastYearDate.getMonth() + 1;
    var yyyy = pastYearDate.getFullYear() - 1;

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    pastYearDate = yyyy + '-' + mm + '-' + dd;
    return pastYearDate;
}

function getPastWeekDate() {
    "use strict";
    var pastWeekDate = new Date();
    var dd = pastWeekDate.getDate() - 7;
    var mm = pastWeekDate.getMonth() + 1;
    var yyyy = pastWeekDate.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    pastWeekDate = yyyy + '-' + mm + '-' + dd;
    return pastWeekDate;
}