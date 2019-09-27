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

let username = null;
let posts = [];

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {

    // User is logged in
    if (firebaseUser) {
        document.getElementById('welcomeMessage').innerHTML = 'What\'s happening in the Conquer community?';
        firebase.database().ref('users/' + firebaseUser.uid + '/username')
            .once('value', function(snapshot) {
                username = snapshot.val();
            });
        getAllPosts();
    }

    // No user is logged in
    else {
        console.log('not logged in');
        document.getElementById('welcomeMessage').innerHTML = 'Log in to view what\'s happening in the Conquer community';
    }
});

// DOM Elements
const txtTitle = document.getElementById('txtTitle');
const txtBody = document.getElementById('txtBody');
const btnCreateNewPost = document.getElementById('btnCreateNewPost');
const blogContainer = document.getElementById('blogContainer');
const blogPosts = document.getElementById('blogPosts');

// Create New Post event listener
btnCreateNewPost.addEventListener('click', e => {
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

    var time = month + '-' + day + ' ' + hour + ':' + minute + ' ' + meridian;

    // add new post
    firebase.database().ref('posts').push({
        title: txtTitle.value,
        body: txtBody.value,
        timestamp: time,
        author: username
    });
    // fetch all posts
    getAllPosts()
});

function getAllPosts() {
    blogPosts.innerHTML = "";
    var postsRef = firebase.database().ref('posts');
    postsRef.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let newPostElement = document.createElement('ARTICLE');
                let deletePostBtn = document.createElement('BUTTON');
                deletePostBtn.innerHTML = "Delete Post";
                deletePostBtn.classList.add('deletePostBtn');
                let titleTextNode = document.createTextNode('Post title: ' + childSnapshot.val()['title']);
                let bodyTextNode = document.createTextNode(childSnapshot.val()['body']);
                let timestampTextNode = document.createTextNode('Posted at: ' + childSnapshot.val()['timestamp']);
                let authorTextNode = document.createTextNode('Posted by: ' + childSnapshot.val()['author']);
                let newTitleElement = document.createElement('H2');
                let newAuthorElement = document.createElement('H1');
                let newTimestampElement = document.createElement('H3');
                let newBodyElement = document.createElement('P');
                newTitleElement.appendChild(titleTextNode);
                newAuthorElement.appendChild(authorTextNode);
                newTimestampElement.appendChild(timestampTextNode);
                newBodyElement.appendChild(bodyTextNode);
                newPostElement.appendChild(newTitleElement);
                newPostElement.appendChild(newAuthorElement);
                newPostElement.appendChild(newTimestampElement);
                newPostElement.appendChild(newBodyElement);
                if (childSnapshot.val()['author'] === username) {
                    deletePostBtn.addEventListener('click', e => {
                        newPostElement.remove();
                        postsRef.child(childSnapshot.key).remove();
                    });
                    newPostElement.appendChild(deletePostBtn);
                }
                blogPosts.insertBefore(newPostElement, blogPosts.childNodes[0]);
            })
        });
}