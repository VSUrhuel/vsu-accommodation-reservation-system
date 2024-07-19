import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';  
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, update } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
        // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBYOi_Y3now8wDYR1SrqMkMDqdEh4VsZgI",
    authDomain: "accommodation-reservatio-f8432.firebaseapp.com",
    databaseURL: "https://accommodation-reservatio-f8432-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "accommodation-reservatio-f8432",
    storageBucket: "accommodation-reservatio-f8432.appspot.com",
    messagingSenderId: "841098874029",
    appId: "1:841098874029:web:ec69d582bf4e16d69e4a24",
    measurementId: "G-35LFVPDW3F"
};

        // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

var userEmail = '';

document.addEventListener('DOMContentLoaded', function(){
    //document.getElementById('scenic-views').innerHTML = scenicViews.map(createScenicView).join('');

    function handleIndexPage() {
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
        
        document.getElementById('carousel-items').innerHTML = carouselItems.map(createCarouselItem).join('');
        document.getElementById('table-content').innerHTML = tableContent.map(createTableRow).join('');
        

        viewAccommodations();

        

        const signInBtn = document.getElementById('signInBtn');
        if (signInBtn) {
            signInBtn.addEventListener('click', function() {
                window.location.href = 'signup.html';
            });
        }
        const logInBtn = document.getElementById('logInBtn');
        if (logInBtn) {
            logInBtn.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
        /*
        const userBtn = document.getElementById('userBtn');
        if (userBtn){
            userBtn.addEventListener('click', function() {
                window.location.href = 'profile.html';
            });
        }*/

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', function() {
                safeRemoveItem('loggedIn');
                safeRemoveItem('email');
                safeRemoveItem('signOut');
                window.location.href = 'index.html';
            });
        }

       

        if (localStorage.getItem('loggedIn') === 'true') {
            document.querySelector('#loginSigninBtn').style.display = 'none';
            document.querySelector('#userCard').style.display = 'block';
            const email = localStorage.getItem('email');
            const userRef = ref(database, 'user');
    
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((data) => {
                        if (data.val().email === email) {
                            document.getElementById('profileName').textContent = `${data.val().firstName} ${data.val().lastName}`;
                            document.getElementById('profileEmail').textContent = data.val().email;
                        }
                    });
                }
            }, (error) => {
                console.error('Error fetching user data:', error);
            }); 
            
        } else {
            document.querySelector('#userCard').style.display = 'none';
        }

        if (localStorage.getItem('signOut') === 'true') {
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'index.html';
        }
    }
    
    function handleLoginPage() {
        const loginForm = document.getElementById("logInForm");
        if (loginForm) {
            loginForm.addEventListener('submit', logInAcc);
        } 
        document.querySelector('#logInBtn').addEventListener('click', logInAcc);
    }

    function handleSignInPage(){
        const signInForm = document.querySelector('#signInForm');
        if(signInForm){
            signInForm.addEventListener('submit', createAccount);
        }
       // document.querySelector('#createAccount').addEventListener('submit', createAccount);
        document.getElementById('googleSignIn').addEventListener('click', signInGoogle);
        document.getElementById('fbSignIn').addEventListener('click', signInFacebook);
    }

    /*function handleProfilePage() {
        createUserCard();
        populateNavItems();
        const email = localStorage.getItem('email');
        const userRef = ref(database, 'user');
    
        fetchUserData(userRef, email, populateProfileInfo);
    
        setupSignOutButton();
        setupEditProfileButton(userRef, email);
        
        handleSignOutRedirect();

        //IM HERE HAVING ISSUE

       const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(evet) {
                event.preventDefault();
                const newPhoneNumber = document.getElementById('editPhoneNumber').textContent;
                const newBirthday = document.getElementById('editBirthday').value;
                const newFirstName = document.getElementById('editFirstName').value;
                const newLastName = document.getElementById('editLastName').value;
                alert(newPhoneNumber);

                set(ref(database, `user/${localStorage.getItem('userKey')}`), {
                    email: localStorage.getItem('email'),
                    phoneNumber: newPhoneNumber,
                    birthday: newBirthday,
                    firstName: newFirstName,
                    lastName: newLastName
                });

                alert('Profile updated successfully');
                window.location.href = 'profile.html';
            });
        }
    }*/

    function handleProfilePage() {
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
        const email = localStorage.getItem('email');
        const userRef = ref(database, 'user');

        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((data) => {
                    if (data.val().email === email) {
                        document.getElementById('profileName').textContent = `${data.val().firstName} ${data.val().lastName}`;
                        
                        document.getElementById('profileName1').textContent = `${data.val().firstName} ${data.val().lastName}`;
                        document.getElementById('profileEmail').textContent = data.val().email;
                        document.getElementById('profileEmailInfo').textContent = data.val().email;
                        document.getElementById('profilePhone').textContent = data.val().phoneNumber;
                        document.getElementById('profileBirthday').textContent = data.val().birthday;

                        document.getElementById('firstName').textContent = data.val().firstName;
                        document.getElementById('lastName').textContent = data.val().lastName;
                    }
                });
            }
        }, (error) => {
            console.error('Error fetching user data:', error);
        });

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', function() {
                
                localStorage.setItem('signOut', 'true');
            
                // Redirect to the home page
                window.location.href = 'index.html';
            });
        }
        
        const editProfile = document.getElementById('editProfile');
        if (editProfile) {
            editProfile.addEventListener('click', function() {
                //HEREREEEEEEE
                
                document.getElementById('profileInfo').style.display = 'none';
                document.getElementById('editProfileForm').style.display = 'block';
               
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((data) => {
                            if (data.val().email === email) {
                                document.getElementById('editEmail').textContent = data.val().email;
                                document.getElementById('editPhoneNumber').value = data.val().phoneNumber;
                                document.getElementById('editBirthday').value = data.val().birthday;
        
                                document.getElementById('editFirstName').value = data.val().firstName;
                                document.getElementById('editLastName').value = data.val().lastName;
                            }
                        });
                    }
                }, (error) => {
                    console.error('Error fetching user data:', error);
                });
            });
        }

      

        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(evet) {
                event.preventDefault();
                const newPhoneNumber = document.getElementById('editPhoneNumber').value;
                const newBirthday = document.getElementById('editBirthday').value;
                const newFirstName = document.getElementById('editFirstName').value;
                const newLastName = document.getElementById('editLastName').value;


                update(ref(database, `user/${localStorage.getItem('userKey')}`), {
                    email: localStorage.getItem('email'),
                    phoneNumber: newPhoneNumber,
                    birthday: newBirthday,
                    firstName: newFirstName,
                    lastName: newLastName
                });

                window.location.href = 'profile.html';
            });

        
            if (localStorage.getItem('signOut') === 'true') {
                safeRemoveItem('loggedIn');
                safeRemoveItem('email');
                safeRemoveItem('signOut');
                window.location.href = 'index.html';
            }
        }
    }
    function handleRoomPage() {
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');

        if (localStorage.getItem('loggedIn') === 'true') {
            document.querySelector('#loginSigninBtn').style.display = 'none';
            document.querySelector('#userCard').style.display = 'block';
            const email = localStorage.getItem('email');
            const userRef = ref(database, 'user');
    
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((data) => {
                        if (data.val().email === email) {
                            document.getElementById('profileName').textContent = `${data.val().firstName} ${data.val().lastName}`;
                            document.getElementById('profileEmail').textContent = data.val().email;
                        }
                    });
                }
            }, (error) => {
                console.error('Error fetching user data:', error);
            }); 
            
        } else {
            document.querySelector('#userCard').style.display = 'none';
        }

        if(localStorage.getItem('roomData')){
            const room = JSON.parse(localStorage.getItem('roomData'));
            var accomodation = '';
            if(room.accommodationId  === 'ACC001') {
                accomodation = 'Apartlle';
            } else if(room.accommodationId === 'ACC002') {
                accomodation = 'Seafront Suite';
            } else if(room.accommodationId  === 'ACC003') {
                accomodation = 'Balay Alumni';
            } else {
                accomodation = 'Hostel';
            }
            document.getElementById('roomTitle').textContent = `Book ${accomodation}`;
            document.getElementById('accName').textContent = `${accomodation}`;
            document.getElementById('roomType').textContent = room.unitType;    
            document.getElementById('pricePerNight').textContent = `${room.price.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}`;

            const amenitiesList = document.getElementById('amenities');

            // Clear the existing list if any
            amenitiesList.innerHTML = '';
            console.log(room.amenities);
            var i = 0;
            room.amenities.forEach((x) => {
                
                const amenity = document.createElement('li');
                if(i==0){
                    amenity.className = 'inline-flex items-center';
                    i++;
                } else {
                    amenity.className = 'inline-flex items-center ml-6';
                }
            
                // Find the corresponding amenity object
                const amenityData = amenities.find(a => a.name === x);
                if (amenityData) {
                    amenity.innerHTML = amenityData.svg;
            
                    const title = document.createElement('p');
                    title.className = 'pl-2';
                    title.textContent = x;
            
                    amenity.appendChild(title);
                    amenitiesList.appendChild(amenity);
                }
            });
        }

        if (localStorage.getItem('signOut') === 'true') {
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'index.html';
        }
    }
    if (document.body.classList.contains('index-page')) {
        handleIndexPage();
    } else if (document.body.classList.contains('login-page')) {
        handleLoginPage();
    } else if(document.body.classList.contains('sigin-page')) {
        handleSignInPage();
    } else if(document.body.classList.contains('profile-page')) {
        handleProfilePage();
    } else if(document.body.classList.contains('room-page')) {
        handleRoomPage();
    }
})

function viewAccommodations() {
    let accommodations = [];
    const userRef = ref(database, 'accommodations');

    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            accommodations = []; // Clear the array to avoid duplicates
            snapshot.forEach((data) => {
                const acc = {
                    id: data.key,
                    src: data.val().src,
                    name: data.val().accommodationName,
                    location: data.val().location,
                    price: data.val().price
                };
                accommodations.push(acc);
            });
            // Update the DOM after processing all data
            const accommodationsContainer = document.getElementById('accommodations');
            accommodationsContainer.innerHTML = accommodations.map(createAccommodation).join('');

            accommodationsContainer.addEventListener('click', (event) => {
                if (event.target.closest('.dynamic-button')) {
                    const button = event.target.closest('.dynamic-button');
                    const accommodationId = button.getAttribute('data-id');
                    alert(`Button clicked for accommodation ID: ${accommodationId}`);
                    viewRoom('UNT001');
                    // Add your event handling logic here
                }
            });
        } else {
            console.log('No accommodations found');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });

}

function populateNavItems() {
    document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
}

function fetchUserData(userRef, email, callback) {
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if (data.val().email === email) {
                    callback(data.val());
                }
            });
        }
    }, (error) => {
        console.error('Error fetching user data:', error);
    });
}

function populateProfileInfo(userData) {
    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileEmailInfo').textContent = userData.email;
    document.getElementById('profilePhone').textContent = userData.phoneNumber;
    document.getElementById('profileBirthday').textContent = userData.birthday;

    document.getElementById('firstName').textContent = userData.firstName;
    document.getElementById('lastName').textContent = userData.lastName;

}

function setupSignOutButton() {
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            localStorage.setItem('signOut', 'true');
            window.location.href = 'index.html';
        });
    }
}

function setupEditProfileButton(userRef, email) {
    const editProfile = document.getElementById('editProfile');
    if (editProfile) {
        editProfile.addEventListener('click', function() {
            document.getElementById('profileInfo').style.display = 'none';
            document.getElementById('editProfileForm').style.display = 'block';

            fetchUserData(userRef, email, populatedEditProfileInfo);
        });
    }
}

function populatedEditProfileInfo(userData) {
    document.getElementById('editEmail').textContent = userData.email;
    document.getElementById('editPhoneNumber').textContent = userData.phoneNumber;
    document.getElementById('editBirthday').textContent = userData.birthday;

    document.getElementById('editFirstName').textContent = userData.firstName;
    document.getElementById('editLastName').textContent = userData.lastName;

}

function handleSignOutRedirect() {
    if (localStorage.getItem('signOut') === 'true') {
        safeRemoveItem('loggedIn');
        safeRemoveItem('email');
        safeRemoveItem('signOut');
        window.location.href = 'index.html';
    }
}

const amenities = [
    { name: "Free Wifi", svg: `<svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="w-4 h-auto inline"
                      viewBox="0 0 122.88 94.72"
                      xml:space="preserve"
                    >
                      <g>
                        <path
                          d="M8.46,31.23c-1.08,0.92-2.42,1.32-3.72,1.22c-1.31-0.1-2.58-0.7-3.5-1.78l-0.02-0.03c-0.91-1.07-1.3-2.41-1.2-3.7 c0.1-1.31,0.7-2.58,1.78-3.5l0.01-0.01c9.06-7.77,18.73-13.65,28.73-17.58c10.08-3.96,20.5-5.93,31-5.84 c10.35,0.09,20.74,2.19,30.9,6.36c9.81,4.03,19.4,10,28.55,17.97c0.11,0.08,0.21,0.17,0.29,0.26c0.96,0.92,1.5,2.13,1.58,3.37 c0.08,1.24-0.29,2.51-1.12,3.55c-0.08,0.12-0.18,0.23-0.29,0.33c-0.92,0.96-2.13,1.5-3.37,1.58c-1.3,0.09-2.65-0.33-3.71-1.26 c-8.27-7.23-16.9-12.62-25.68-16.25c-8.99-3.72-18.14-5.58-27.23-5.66c-9.2-0.08-18.38,1.68-27.31,5.2 C25.25,18.97,16.6,24.25,8.46,31.23L8.46,31.23z M61.44,72.27c3.1,0,5.9,1.26,7.93,3.29c2.03,2.03,3.29,4.84,3.29,7.93 c0,3.1-1.26,5.9-3.29,7.93c-2.03,2.03-4.84,3.29-7.93,3.29c-3.1,0-5.9-1.26-7.94-3.29c-2.03-2.03-3.29-4.84-3.29-7.93 c0-3.09,1.26-5.9,3.29-7.93l0,0C55.54,73.53,58.34,72.27,61.44,72.27L61.44,72.27z M42.07,66.17c-1.1,0.89-2.46,1.26-3.76,1.12 c-1.24-0.13-2.44-0.71-3.32-1.71c-0.1-0.1-0.19-0.21-0.26-0.32c-0.8-1.07-1.12-2.35-0.99-3.59c0.13-1.24,0.71-2.44,1.71-3.32 c0.09-0.09,0.19-0.17,0.29-0.24c4-3.23,8.18-5.7,12.47-7.37c4.35-1.7,8.82-2.57,13.33-2.58c4.45-0.01,8.89,0.81,13.27,2.5 c4.25,1.64,8.44,4.11,12.48,7.41c1.1,0.89,1.73,2.15,1.87,3.45c0.13,1.3-0.23,2.66-1.12,3.76l-0.01,0.01 c-0.89,1.09-2.14,1.72-3.45,1.86c-1.3,0.13-2.66-0.23-3.76-1.12l0,0c-3.14-2.57-6.35-4.47-9.56-5.73c-3.25-1.28-6.5-1.9-9.72-1.89 c-3.25,0.01-6.52,0.67-9.77,1.96C48.46,61.67,45.21,63.62,42.07,66.17L42.07,66.17z M25.81,49.65c-0.08,0.08-0.17,0.16-0.26,0.22 c-1.03,0.84-2.3,1.21-3.53,1.14c-1.27-0.08-2.51-0.63-3.44-1.63c-0.09-0.08-0.16-0.17-0.23-0.26c-0.84-1.03-1.21-2.3-1.14-3.53 c0.08-1.31,0.66-2.59,1.72-3.53c6.81-6.03,13.85-10.59,21.01-13.61c7.18-3.02,14.49-4.51,21.85-4.38c7.27,0.12,14.53,1.8,21.69,5.1 c6.97,3.21,13.86,7.96,20.59,14.3l0.13,0.12c0.95,0.95,1.44,2.2,1.48,3.46c0.04,1.31-0.42,2.63-1.39,3.66l-0.12,0.13 c-0.96,0.95-2.2,1.45-3.46,1.49c-1.31,0.04-2.63-0.42-3.66-1.39c-5.83-5.5-11.73-9.59-17.62-12.35c-5.95-2.78-11.9-4.19-17.8-4.29 c-5.99-0.1-12,1.15-17.96,3.69C37.64,40.58,31.66,44.48,25.81,49.65L25.81,49.65z"
                        />
                      </g>
                    </svg>` },
    { name: "Air Conditioning", svg: `<svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="w-4 h-auto inline"
                      viewBox="0 0 122.88 122.88"
                      xml:space="preserve"
                    >
                      <g>
                        <path
                          d="M58.76,44.64l-6.9-6.9l-0.58,8.81l7.48,7.48V44.64L58.76,44.64z M32.17,35.1l-12.8,0.48c-1.49,0.05-2.74-1.11-2.79-2.6 c-0.05-1.49,1.11-2.74,2.6-2.79l7.78-0.29l-8.81-8.81c-1.06-1.06-1.06-2.77,0-3.83c1.06-1.06,2.77-1.06,3.83,0l8.67,8.67l0.12-7.29 c0.02-1.49,1.25-2.68,2.74-2.66c1.49,0.02,2.68,1.25,2.66,2.74l-0.2,12.52l11.23,11.23l0.64-9.78c0.07-1.19,1.1-2.1,2.29-2.02 c0.55,0.03,1.03,0.27,1.39,0.63l0,0l7.22,7.22V20.82l-9-8.72c-1.07-1.04-1.09-2.75-0.05-3.82c1.04-1.07,2.75-1.09,3.82-0.05 l5.23,5.07V2.71c0-1.5,1.21-2.71,2.71-2.71c1.5,0,2.71,1.21,2.71,2.71v10.77l5.71-5.29c1.09-1.02,2.8-0.96,3.82,0.14 c1.02,1.09,0.96,2.8-0.14,3.82l-9.39,8.71v16.89l7.51-6.58c0.9-0.79,2.26-0.69,3.05,0.2c0.36,0.41,0.53,0.92,0.53,1.42h0.01v10.92 l13.07-13.07l-0.2-12.52c-0.02-1.49,1.17-2.72,2.66-2.74c1.49-0.02,2.72,1.17,2.74,2.66l0.12,7.29l7.49-7.49 c1.06-1.06,2.77-1.06,3.83,0c1.06,1.06,1.06,2.77,0,3.83l-7.62,7.62l7.78,0.29c1.49,0.05,2.66,1.3,2.6,2.79 c-0.05,1.49-1.3,2.66-2.79,2.6l-12.8-0.48L80.31,46.34l9.28,0.61c1.19,0.07,2.1,1.1,2.02,2.29c-0.03,0.55-0.27,1.03-0.63,1.39l0,0 l-7.28,7.28h18.34l8.72-9c1.04-1.07,2.75-1.09,3.82-0.05c1.07,1.04,1.09,2.75,0.05,3.82l-5.07,5.23h10.58 c1.5,0,2.71,1.21,2.71,2.71c0,1.5-1.21,2.71-2.71,2.71H109.4l5.29,5.71c1.02,1.09,0.96,2.8-0.14,3.82 c-1.09,1.02-2.8,0.96-3.82-0.14l-8.71-9.39H84.59l6.53,7.45c0.79,0.9,0.69,2.26-0.2,3.05c-0.41,0.36-0.92,0.53-1.42,0.53v0.01 H79.11L92.23,87.5l12.52-0.2c1.49-0.02,2.72,1.17,2.74,2.66c0.02,1.49-1.17,2.72-2.66,2.74l-7.29,0.12l7.49,7.49 c1.06,1.06,1.06,2.77,0,3.83c-1.06,1.06-2.77,1.06-3.83,0l-7.62-7.62l-0.29,7.78c-0.05,1.49-1.3,2.66-2.79,2.6 c-1.49-0.05-2.66-1.3-2.6-2.79l0.48-12.8l-12.4-12.4l-0.64,9.78c-0.07,1.19-1.1,2.1-2.29,2.02c-0.55-0.03-1.03-0.27-1.39-0.63l0,0 l-7.47-7.47v17.72l9.39,8.71c1.09,1.02,1.15,2.73,0.14,3.82c-1.02,1.09-2.73,1.15-3.82,0.14l-5.71-5.29v12.45 c0,1.5-1.21,2.71-2.71,2.71c-1.5,0-2.71-1.21-2.71-2.71v-12.26l-5.23,5.07c-1.07,1.04-2.78,1.02-3.82-0.05 c-1.04-1.07-1.02-2.78,0.05-3.82l9-8.72V83.86l-7.26,6.36c-0.9,0.79-2.26,0.69-3.05-0.2c-0.36-0.41-0.53-0.92-0.53-1.42h-0.01 v-9.85L35.94,90.71l0.48,12.8c0.05,1.49-1.11,2.74-2.6,2.79c-1.49,0.05-2.74-1.11-2.79-2.6l-0.29-7.78l-8.81,8.81 c-1.06,1.06-2.77,1.06-3.83,0c-1.06-1.06-1.06-2.77,0-3.83l8.67-8.67l-7.29-0.12c-1.49-0.02-2.68-1.25-2.66-2.74 c0.02-1.49,1.25-2.68,2.74-2.66l12.52,0.2l11.8-11.8l-10.28-0.68c-1.19-0.07-2.1-1.1-2.02-2.29c0.03-0.55,0.27-1.03,0.63-1.39l0,0 l7.4-7.41H22.54l-8.71,9.39c-1.02,1.09-2.73,1.15-3.82,0.14c-1.09-1.02-1.15-2.73-0.14-3.82l5.29-5.71H2.71 c-1.5,0-2.71-1.21-2.71-2.71c0-1.5,1.21-2.71,2.71-2.71h12.26l-5.07-5.23c-1.04-1.07-1.02-2.78,0.05-3.82 c1.07-1.04,2.78-1.02,3.82,0.05l8.72,9h15.99l-6.41-7.32c-0.79-0.9-0.69-2.26,0.2-3.05c0.41-0.36,0.92-0.53,1.42-0.53v-0.01h10.38 L32.17,35.1L32.17,35.1z M48.41,51.35h-9.95l5.76,6.57h10.76L48.41,51.35L48.41,51.35z M71.91,74.84l-7.73-7.73v9.39l7.15,7.15 L71.91,74.84L71.91,74.84z M68.07,63.34l6.7,6.7h9.95l-5.87-6.7H68.07L68.07,63.34z M45.73,63.34l-7.09,7.09l9.31,0.61l7.71-7.71 H45.73L45.73,63.34z M68.73,57.92h8.85l6.97-6.97l-8.31-0.55L68.73,57.92L68.73,57.92z M52.25,74.4v9.41l6.51-5.71V67.89 L52.25,74.4L52.25,74.4z M64.18,54.81l6.76-6.76V37.57l-6.76,5.93V54.81L64.18,54.81z"
                        />
                      </g>
                    </svg>`},
    { name: "Free TV", svg: `<svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-4 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve"
                    >
                      <g>
                        <path
                          d="M2.08,0H120.8h2.08v2.08v69.2v2.08h-2.08H77.57v4.55h16.61v5.15H28.55v-5.15h16.61v-4.55H2.08H0v-2.08V2.08V0H2.08L2.08,0z M118.73,4.15H4.15v65.05h114.57V4.15L118.73,4.15z"
                        />
                      </g>
                    </svg>`},
    { name: "Hot and Cold Shower", svg: `<svg 
        version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-4 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve">
                      <g>
                      <path class="st0" d="M28.38,20.1l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08 c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C28.21,21.02,28.12,20.48,28.38,20.1L28.38,20.1z M60.91,89.12v28.25 c0,3.71-2.7,5.51-6,5.51h0c-3.3,0-6-1.8-6-5.51v-27.6h-3.6v27.6c0,3.71-2.7,5.51-6,5.51h0c-3.3,0-6-1.8-6-5.51V89.12 c-0.15-0.24-0.25-0.54-0.25-0.86V64.45l0-0.08l-16.8-8.53c-2.33-1.18-3.35-3.93-2.42-6.31l6.22-17.71c0.91-2.62,3.78-4,6.4-3.09 c2.62,0.91,4,3.78,3.09,6.4l-4.82,13.73l12.98,6.59c0.18,0.09,0.34,0.19,0.5,0.29c4.72-2.85,11.71-3.24,16.73-1.41l12.38-7.56 l-5.67-13.93c-1.04-2.58,0.2-5.51,2.78-6.56c2.58-1.04,5.51,0.2,6.56,2.78l7.28,17.88c0.91,2.24,0.08,4.88-2.05,6.18l-15.07,9.21 v25.93C61.16,88.57,61.07,88.87,60.91,89.12L60.91,89.12z M47.12,29.03c6.03,0,10.91,4.89,10.91,10.91 c0,6.03-4.89,10.91-10.91,10.91c-6.03,0-10.91-4.89-10.91-10.91C36.2,33.92,41.09,29.03,47.12,29.03L47.12,29.03z M0,10.28 c2.92-3.81,17.16-6.74,20.74-4.32c-2.12,3.71-1.85,7.48,1.16,11.33c-0.38,0.63-0.35,1.3,0.08,2.04l0.95,1.09 c0.38,0.38,0.85,0.42,1.46-0.08l14.45-14.6c0.39-0.47,0.32-0.87-0.14-1.24c-1.03-1.25-1.15-1.47-2.97-1.16 c-4.05-2.64-7.91-3.1-11.55-1.01C17.21-1.69,6.21-0.22,0,4.51V10.28L0,10.28z M36.57,13.08l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2 l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C36.39,13.99,36.3,13.46,36.57,13.08 L36.57,13.08z M40.31,9.33l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08 c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C40.14,10.24,40.05,9.71,40.31,9.33L40.31,9.33z M32.85,16.73l0.05-0.08 c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55 C32.67,17.64,32.58,17.11,32.85,16.73L32.85,16.73z"/>
                      </g>
                      </svg>`},
]


const navItems = [
    { name: "Home", href: "index.html", current: true },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" }
];

const carouselItems = [
    { src: "/src/hotel-room.jpg", alt: "Hotel Room 1" },
    { src: "/src/hotel-room2.jpg", alt: "Hotel Room 2", active: true },
    { src: "/src/hotel-room3.jpg", alt: "Hotel Room 3" },
    { src: "/src/hotel-room4.jpg", alt: "Hotel Room 4" },
    { src: "/src/hotel-room5.jpg", alt: "Hotel Room 5" }
];

const tableContent = [
    { accommodation: "Which accommodation do you prefer?", details: "Check Details", checkIn: "Add Date", checkOut: "Add Date" }
];

const scenicViews = [
    { src: "/src/vsu-scenic-view/vsu1.jpg", alt: "VSU Admin", description: "VSU Admin" },
    { src: "/src/vsu-scenic-view/vsu3.jpg", alt: "VSU Beach", description: "VSU Beach" },
    { src: "/src/vsu-scenic-view/vsu4.jpg", alt: "Search for Truth", description: "Search for Truth" },
    { src: "/src/vsu-scenic-view/vsu5.jpg", alt: "Mt. Pangasugan", description: "Mt. Pangasugan" },
    { src: "/src/vsu-scenic-view/vsu6.jpg", alt: "Centennial Gate", description: "Centennial Gate" },
    { src: "/src/vsu-scenic-view/vsu2.jpg", alt: "VSU Lower Campus", description: "VSU Lower Campus" }
];



function createNavItem(item) {
    return `
        <li>
            <a href="${item.href}" class="block py-2 px-3 md:p-0 ${item.current ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}" aria-current="${item.current ? 'page' : 'false'}">
                ${item.name}
            </a>
        </li>
    `;
}

function createCarouselItem(item) {
    return `
        <div class="${item.active ? 'block' : 'hidden'} duration-700 ease-in-out" data-carousel-item="${item.active ? 'active' : ''}">
            <img src="${item.src}" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="${item.alt}">
        </div>
    `;
}

function createTableRow(row) {
    return `
        <tr class="bg-white text-sm font-light">
            <td class="px-4 py-0 border-l-4 border-black">${row.accommodation}</td>
            <td class="px-4 py-0">${row.details}</td>
            <td class="px-4 py-0">${row.checkIn}</td>
            <td class="px-4 py-0">${row.checkOut}</td>
        </tr>
    `;
}

function createInputField(data) {
    return `<div class="relative">
                  <input
                    type="text"
                    value="${data.info}"
                    id=""
                    class="px-3 py-2 text-xs font-medium text-left inline-flex items-center text-black bg-white rounded-lg focus:outline-none"
                  />
                </div>;`

}
function createScenicView(view) {
    return `
        <div class="grid gap-4">
            <div class="relative">
                <img class="h-36 w-96 max-w-full rounded-lg object-cover" src="${view.src}" alt="${view.alt}">
                <p class="absolute flex text-black text-sm font-medium bg-white/50 rounded-full p-2 px-5 mb-2 mr-2 bottom-0 right-0 justify-center items-center">${view.description}</p>
            </div>
        </div>`;
}

function safeRemoveItem(key) {
    if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        console.log(`Removed item with key: ${key}`);
    } else {
        alert(`Item with key: ${key} does not exist`);
    }
}

function createUserCard() {
    const userCard = document.getElementById('userCard');

    // Create the inner flex container
    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex items-center gap-4 h-10';

    // Create the user image
    const userImg = document.createElement('img');
    userImg.src = '/src/profile.png';
    userImg.alt = 'user';
    userImg.className = 'h-10 w-auto cursor-pointer';
    userImg.type = 'button';
    userImg.id = 'userBtn';
    userImg.setAttribute('data-dropdown-toggle', 'dropdownDelay');
    userImg.setAttribute('data-dropdown-delay', '300');
    userImg.setAttribute('data-dropdown-trigger', 'hover');

    // Create the dropdown div
    const dropdownDiv = document.createElement('div');
    dropdownDiv.id = 'dropdownDelay';
    dropdownDiv.className = 'z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44';

    // Create the dropdown ul
    const dropdownUl = document.createElement('ul');
    dropdownUl.className = 'py-2 text-sm text-gray-700 dark:text-gray-200';
    dropdownUl.setAttribute('aria-labelledby', 'dropdownDelayButton');

    // Create the profile list item
    const profileLi = document.createElement('li');
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.className = 'block px-4 py-2 hover:bg-gray-100';
    profileLink.textContent = 'Profile';
    profileLi.appendChild(profileLink);

    // Create the sign out list item
    const signOutLi = document.createElement('li');
    const signOutLink = document.createElement('a');
    signOutLink.href = '';
    signOutLink.id = 'signOutBtn';
    signOutLink.className = 'block px-4 py-2 hover:bg-gray-100';
    signOutLink.textContent = 'Sign out';
    signOutLi.appendChild(signOutLink);

    // Append list items to the dropdown ul
    dropdownUl.appendChild(profileLi);
    dropdownUl.appendChild(signOutLi);

    // Append ul to the dropdown div
    dropdownDiv.appendChild(dropdownUl);

    // Create the profile info div
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.className = 'font-medium text-black';

    // Create the profile name div
    const profileNameDiv = document.createElement('div');
    profileNameDiv.id = 'profileName';
    profileNameDiv.textContent = 'Rhuel Laurente';

    // Create the profile email div
    const profileEmailDiv = document.createElement('div');
    profileEmailDiv.className = 'text-sm text-gray-500 hover:underline hover:text-blue-600 cursor-pointer';
    profileEmailDiv.id = 'profileEmail';
    profileEmailDiv.textContent = 'johnrhuell@gmail.com';

    // Append name and email to the profile info div
    profileInfoDiv.appendChild(profileNameDiv);
    profileInfoDiv.appendChild(profileEmailDiv);

    // Append image, dropdown, and profile info to the flex container
    flexContainer.appendChild(userImg);
    flexContainer.appendChild(dropdownDiv);
    flexContainer.appendChild(profileInfoDiv);

    // Append the flex container to the main container
    userCard.appendChild(flexContainer);

    // Append the main container to the body or a specific parent element
}
function createAccommodation(accommodation) {
    return `
        <div class="grid gap-4 items-center">
            <div class="border border-gray-200 object-cover rounded-lg shadow">
                <div class="p-4">
                    <a href="#">
                        <img class="w-96 h-36 m-6 rounded-xl object-cover" src="${accommodation.src}" alt="product image" />
                    </a>
                </div>
                <div class="px-6 mx-7 pb-5">
                    <a href="#">
                        <h5 class="text-lg font-medium tracking-tight text-gray-900">${accommodation.name}</h5>
                        <p class="text-sm font-light tracking-tight text-gray-600">${accommodation.location}</p>
                    </a>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-sm font-bold text-gray-900 dark:text-white">from ${accommodation.price}</span>
                        <button class="dynamic-button" data-id=${accommodation.id}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

 
function viewRoom(unitId){
    const roomRef = ref(database, 'unit');
    let room = {};
    onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if(data.key === unitId){
                    room = {
                        accommodationId: data.val().accommodationID,
                        amenities: data.val().amenities,
                        availability: data.val().availability,
                        capacity: data.val().capacity,
                        price: data.val().price,
                        unitId: data.val().unitID,
                        unitNumber: data.val().unitNumber,
                        unitType: data.val().unitType
                    };
                    
                    alert("jd");
                    //console.log(room);
                    if(localStorage.getItem('roomData')){
                        localStorage.removeItem('roomData');
                    } 
                    localStorage.setItem('roomData', JSON.stringify(room));
                    window.location.href = 'room.html';
                }
            });
        } else {
            console.log('No rooms found');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}
function setUpRoom(room){
    window.location.href = 'room.html';
   
}
let isSubmitting = false;

function logInAcc(event) {
    event.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    isSubmitting = true;

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const userRef = ref(database, 'user');

    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            let userFound = false;
            snapshot.forEach((data) => {
                if (data.val().email === email && data.val().password === password) {
                    userFound = true;
                    alert('User logged in successfully');
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('email', `${email}`);
                    localStorage.setItem('userKey', `${data.key}`);
                    localStorage.setItem('signOut', 'false')
                    window.location.href = 'index.html';
                    return;
                }
            });
            if (!userFound) {
                alert('User not found or incorrect password');
                isSubmitting = false; // Reset the flag
            }
        } else {
            alert('User not found');
            isSubmitting = false; // Reset the flag
        }
    }, (error) => {
        alert(`Error: ${error.message}`);
        isSubmitting = false; // Reset the flag
    });
}
function signInGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('email', `${user.email}`);
        window.location.href = 'index.html';
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert(errorMessage);
    });
}

function signInFacebook() {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('email', `${user.email}`);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = FacebookAuthProvider.credentialFromError(error);
            alert(errorMessage);
        });
}

async function createAccount(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const floating_email = document.querySelector('#floating_email').value;
    const floating_password = document.querySelector('#floating_password').value;
    const floating_repeat_password = document.querySelector('#floating_repeat_password').value;
    const floating_first_name = document.querySelector('#floating_first_name').value;
    const floating_last_name = document.querySelector('#floating_last_name').value;
    const birthday_picker = document.querySelector('#birthday_picker').value;
    const floating_phone = document.querySelector('#floating_phone').value;

    if(floating_password != floating_repeat_password){
        alert("password dint matched");
        return;
    }
    try{
        const newId = await fetchLatestUserId();
        alert(newId);
        const userCredential = await createUserWithEmailAndPassword(auth, floating_email, floating_password);
        const user = userCredential.user;

        await set(ref(database, `user/${newId}`), {
            userId: newId,
            email: floating_email,
            password: floating_password,
            firstName: floating_first_name,
            lastName: floating_last_name,
            birthday: birthday_picker,
            phoneNumber: floating_phone

        });
        console.log('User created and additional data stored:', newId);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('email', `${floating_email}`);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error creating user:', error);
    }
    
}

async function fetchLatestUserId() {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'user');
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                let latestId = null;
                snapshot.forEach((data) => {
                    latestId = data.key;
                });

                if (latestId) {
                    const prefix = latestId.slice(0, 3);
                    const idNumber = parseInt(latestId.slice(3)) + 1;
                    const newId = prefix + idNumber.toString().padStart(3, '0');
                    resolve(newId);
                } else {
                    resolve('USR001'); // Default ID if no users exist
                }
            } else {
                resolve('USR001'); // Default ID if no users exist
            }
        }, (error) => {
            reject(error);
        });
    });
}

