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
            document.getElementById('accommodations').innerHTML = accommodations.map(createAccommodation).join('');

            document.querySelectorAll('.dynamic-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const accommodationId = event.currentTarget.getAttribute('data-id');
                    alert(`Button clicked for accommodation ID: ${accommodationId}`);
                    // Add your event handling logic here
                });
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

