import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
//import DateRangePicker from '/node_modules/flowbite-datepicker';
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
let filters = [];
document.addEventListener('DOMContentLoaded', function () {
    //document.getElementById('scenic-views').innerHTML = scenicViews.map(createScenicView).join('');

    function handleIndexPage() {
        localStorage.setItem('currentPage', 'index.html')
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');

        document.getElementById('carousel-items').innerHTML = carouselItems.map(createCarouselItem).join('');
        document.getElementById('table-content').innerHTML = tableContent.map(createTableRow).join('');

        document.getElementById('book').addEventListener('click', function() {
            window.location.href = 'book.html';
        })


        viewAccommodations();

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
            document.querySelector('#loginSigninBtn').style.display = 'block';

        }

        const signInBtn = document.getElementById('signInBtn');
        if (signInBtn) {
            signInBtn.addEventListener('click', function () {
                window.location.href = 'signup.html';
            });
        }
        const logInBtn = document.getElementById('logInBtn');
        if (logInBtn) {
            logInBtn.addEventListener('click', function () {
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
            signOutBtn.addEventListener('click', function () {
                safeRemoveItem('loggedIn');
                safeRemoveItem('email');
                safeRemoveItem('signOut');
                window.location.href = 'index.html';
            });
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

    function handleSignInPage() {
        
        const signInForm = document.querySelector('#signInForm');
        if (signInForm) {
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
        for(let i=0; i<navItems.length; i++) {
            navItems[i].current = false;
        }
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
            signOutBtn.addEventListener('click', function () {

                localStorage.setItem('signOut', 'true');

                // Redirect to the home page
                window.location.href = 'index.html';
            });
        }

        const editProfile = document.getElementById('editProfile');
        if (editProfile) {
            editProfile.addEventListener('click', function () {
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
            profileForm.addEventListener('submit', function (evet) {
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
        for(let i=0; i<navItems.length; i++) {
            navItems[i].current = false;
        }

        localStorage.setItem('previousPage', localStorage.getItem('currentPage'));
        localStorage.setItem('currentPage', 'room.html');
        document.getElementById('backBtn').addEventListener('click', function() {
            window.location.href = localStorage.getItem('previousPage');
        })
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

        if (localStorage.getItem('roomData')) {
            const room = JSON.parse(localStorage.getItem('roomData'));
            var accomodation = '';
            if (room.accommodationId === 'ACC001') {
                accomodation = 'Apartlle';
            } else if (room.accommodationId === 'ACC002') {
                accomodation = 'Seafront Suite';
            } else if (room.accommodationId === 'ACC003') {
                accomodation = 'Balay Alumni';
            } else {
                accomodation = 'Hostel';
            }
            document.getElementById('roomTitle').textContent = `Book ${accomodation}`;
            document.getElementById('accName').textContent = `${accomodation}`;
            document.getElementById('roomType').textContent = room.unitType;
            document.getElementById('pricePerNight').textContent = `PHP ${room.price.toLocaleString('en-US')}`;
            const userRef = ref(database, 'accommodations');
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((data) => {
                        if (data.key === room.accommodationId) {
                            document.getElementById('roomDescription').textContent = data.val().description;
                        }
                    });
                }
            });
            //document.getElementById('roomDescription').textContent = 
            
            let startDate = localStorage.getItem('startDate');
            document.getElementById('checkInDate').textContent = convertDate(startDate);
            let endDate = localStorage.getItem('endDate');
            document.getElementById('checkOutDate').textContent = convertDate(endDate);

            let timeDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
            let days = timeDiff / (1000 * 3600 * 24);
            let night = days > 1 ? 'nights' : 'night';
            
            document.getElementById('totalNights').textContent = `${days} ${night}`;
            document.getElementById('totalPrice').textContent = `PHP ${(days * room.price).toLocaleString('en-US')}`;

            const amenitiesList = document.getElementById('amenities');

            // Clear the existing list if any
            amenitiesList.innerHTML = '';
            console.log(room.amenities);
            var i = 0;
            room.amenities.forEach((x) => {

                const amenity = document.createElement('li');
                if (i == 0) {
                    amenity.className = 'inline-flex items-center';
                    i++;
                } else {
                    amenity.className = 'inline-flex items-center ml-6';
                }

                // Find the corresponding amenity object
                let amenityData = amenities.find(a => a.name === x);

                // Handle special case for 'bed'
                if (x.includes('bed')) {
                    amenityData = amenities.find(a => a.name === 'bed');
                }
                console.log(amenityData);
                if (amenityData) {
                    amenity.innerHTML = amenityData.svg;

                    const title = document.createElement('p');
                    title.className = 'pl-2';
                    if(x.includes('bed')){
                        title.textContent = titleCase(x);
                    } else {
                        title.textContent = x;
                    }

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

        document.getElementById('bookNowBtn').addEventListener('click', function(){
            bookReservation();
        });
    }
    function handleBookPage() {
        localStorage.setItem('previousPage', localStorage.getItem('currentPage'));
        localStorage.setItem('currentPage', 'book.html');
        document.getElementById('backBtn').addEventListener('click', function() {
            window.location.href = localStorage.getItem('previousPage');
        })
       

        for(let i=0; i<navItems.length; i++) {
            if(navItems[i].name === 'Book') {
                console.log("ins");
                navItems[i].current = true;
                break;
            }
            navItems[i].current = false;
            console.log("remove");
        }
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
        
        if (localStorage.getItem('loggedIn') === 'true') {
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
            window.location.href = 'login.html';
        }
        document.getElementById('signOutBtn').addEventListener('click', function() {
            localStorage.setItem('signOut', 'true');
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'login.html';
        })

    

      

        

        
        document.getElementById('searchBtn').addEventListener('click', function() {
            if(document.getElementById('showerFilter').checked) {
                document.getElementById('showerFilter').checked = false;
            } 
            if(document.getElementById('airconditionedFilter').checked) {
            document.getElementById('airconditionedFilter').checked = false;
            }
            if(document.getElementById('tvFilter').checked) {
            document.getElementById('tvFilter').checked = false;
            }
            
            searchAvailableAcc();
        });
        deafultAvailableAcc();

        document.getElementById('showerFilter').addEventListener('change', function() {
            if(document.getElementById('showerFilter').checked){
                filters.push('Hot and Cold Shower');
            } else {
                filters.splice(filters.indexOf('Hot and Cold Shower'), 1);
            }
            
            popularFilterChange();
        });
        document.getElementById('tvFilter').addEventListener('change', function() {
            if(document.getElementById('tvFilter').checked){
                filters.push('Free TV');
            } else {
                filters.splice(filters.indexOf('Free TV'), 1);
            }
            
            popularFilterChange();
        });
        document.getElementById('airconditionedFilter').addEventListener('change', function() {
            if(document.getElementById('airconditionedFilter').checked){
                filters.push('Air Conditioning');
            } else {
                filters.splice(filters.indexOf('Air Conditioning'), 1);
            }
            
            popularFilterChange();
        });

        document.getElementById('anyPrice').addEventListener('change', function() {
            popularFilterChange();
            if(document.getElementById('anyPrice').checked){
                units = units.filter(unit => unit.price >= 0);
            } else {
                units = units.filter(unit => unit.price >= 0);
            }
            defaultRoomView();
        })
        document.getElementById('less250').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('less250').checked = true;
            if(document.getElementById('less250').checked){
                units = units.filter(unit => unit.price <= 250);
            } else {
                units = units.filter(unit => unit.price > 250);
            }
            defaultRoomView();
        })
        document.getElementById('250-750').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('250-750').checked = true;
            if(document.getElementById('250-750').checked){
                units = units.filter(unit => unit.price > 250 && unit.price <= 750);
            } else {
                units = units.filter(unit => unit.price < 250 || unit.price > 750);
            }
            defaultRoomView();
        })
        document.getElementById('750-1500').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('750-1500').checked = true;
            if(document.getElementById('750-1500').checked){
                units = units.filter(unit => unit.price > 750 && unit.price <= 1500);
            } else {
                units = units.filter(unit => unit.price < 750 || unit.price > 1500);
            }
            defaultRoomView();
        })
        document.getElementById('above1500').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('above1500').checked = true;
            if(document.getElementById('above1500').checked){
                units = units.filter(unit => unit.price > 1500);
            }
            defaultRoomView();
        })
        document.getElementById('anyAcc').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('anyAcc').checked = true;
            if(document.getElementById('anyAcc').checked){
                units = units.filter(unit => unit.accommodationID === 'ACC001' || unit.accommodationID === 'ACC002' || unit.accommodationID === 'ACC003' || unit.accommodationID === 'ACC004');
            } else {
                units = units.filter(unit => unit.accommodationID === 'ACC001' || unit.accommodationID === 'ACC002' || unit.accommodationID === 'ACC003' || unit.accommodationID === 'ACC004');
            }
            defaultRoomView();
        }) 
        document.getElementById('appartle').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('appartle').checked = true;
            if(document.getElementById('appartle').checked){
                units = units.filter(unit => unit.accommodationID === 'ACC001');
            } else {
                units = units.filter(unit => unit.accommodationID !== 'ACC001');
            }
            defaultRoomView();
        })
        document.getElementById('seafrontSuite').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('seafrontSuite').checked = true;
            if(document.getElementById('seafrontSuite').checked){
                units = units.filter(unit => unit.accommodationID === 'ACC002');
            }
            defaultRoomView();
        })
        document.getElementById('balayAlumni').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('balayAlumni').checked = true;
            if(document.getElementById('balayAlumni').checked){
                units = units.filter(unit => unit.accommodationID === 'ACC003');
            }
            defaultRoomView();
        })
        document.getElementById('hostel').addEventListener('change', function() {
            popularFilterChange();
            document.getElementById('hostel').checked = true;
            if(document.getElementById('hostel').checked){
                units = units.filter(unit => unit.accommodationID === 'ACC004');
            }
            defaultRoomView();
        })





        const datepickerStart = document.getElementById('datepicker-range-start');
        const today = new Date().toLocaleDateString();
        datepickerStart.setAttribute(`datepicker-min-date`, today);

        const datepickerEnd = document.getElementById('datepicker-range-end');
        datepickerEnd.setAttribute(`datepicker-min-date`, today);

       /* document.getElementById('page2').addEventListener('click', function() { paginationView(2); })
        document.getElementById('page1').addEventListener('click', function() { paginationView(1); })
        document.getElementById('page3').addEventListener('click', function() { paginationView(3); })
        document.getElementById('page4').addEventListener('click', function() { paginationView(4); })
        document.getElementById('page5').addEventListener('click', function() { paginationView(5); })
        document.getElementById('page6').addEventListener('click', function() { paginationView(6); })
        document.getElementById('page7').addEventListener('click', function() { paginationView(7); })*/

       
        /*let i=0;

        const userRef = ref(database, 'unit');
        const rooms = document.getElementById('rooms');
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((data) => {
                    if (i==4 || data.val().reservation.reserved){
                        return;
                    }
                    i++;
                    let unit = {};
                    unit.accommodationID = data.val().accommodationID;
                    unit.amenities = data.val().amenities;
                    unit.availability = data.val().availability;
                    unit.capacity = data.val().capacity;
                    unit.price = data.val().price;
                    unit.unitID = data.val().unitID;
                    unit.unitNumber = data.val().unitNumber;
                    unit.unitType = data.val().unitType;
                    unit.reservation = data.val().reservation;
                    createRooms(rooms, unit);
                });
            }
        })*/

        
        
    } 
    function handleBookingsPage() {

        for(let i=0; i<navItems.length; i++) {
            if(navItems[i].name === 'Bookings') {
                navItems[i].current = true;
                break;
            }
            navItems[i].current = false;
        }
        
        createUserCard();
        document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
        if (localStorage.getItem('loggedIn') === 'true') {
            document.querySelector('#userCard').style.display = 'block';
            const email = localStorage.getItem('email');
            const userRef = ref(database, 'user');

            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((data) => {
                        if (data.val().email === email) {
                            document.getElementById('profileName').textContent = `${data.val().firstName} ${data.val().lastName}`;
                            document.getElementById('profileEmail').textContent = data.val().email;
                            document.getElementById('welcomeMessage').textContent = `Hi, ${data.val().firstName}!`;
                            getBookedUnits(data.key);
                        }
                    });
                }
            }, (error) => {
                console.error('Error fetching user data:', error);
            });

        } else {
            document.querySelector('#userCard').style.display = 'none';
            window.location.href = 'index.html';
        }
        
        
        document.getElementById('signOutBtn').addEventListener('click', function() {
            localStorage.setItem('signOut', 'true');
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'index.html';
        })
       
        if (localStorage.getItem('signOut') === 'true') {
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'index.html';
        }

        document.getElementById('addBookingBtn').addEventListener('click', function() {
    
            window.location.href = 'book.html';
        })
       

       
    } 
    function handleAboutPage() {
        for(let i=0; i<navItems.length; i++) {
            if(navItems[i].name === 'About'){
                navItems[i].current = true;
                break;
            } 
            navItems[i].current = false;
        }

        localStorage.setItem('previousPage', localStorage.getItem('currentPage'));
        localStorage.setItem('currentPage', 'about.html');
        
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

        document.getElementById('signOutBtn').addEventListener('click', function() {
            localStorage.setItem('signOut', 'true');
            safeRemoveItem('loggedIn');
            safeRemoveItem('email');
            safeRemoveItem('signOut');
            window.location.href = 'index.html';
        })


    }
    if (document.body.classList.contains('index-page')) {
        handleIndexPage();
    } else if (document.body.classList.contains('login-page')) {
        handleLoginPage();
    } else if (document.body.classList.contains('sigin-page')) {
        handleSignInPage();
    } else if (document.body.classList.contains('profile-page')) {
        handleProfilePage();
    } else if (document.body.classList.contains('room-page')) {
        handleRoomPage();
    } else if (document.body.classList.contains('book-page')) {
        handleBookPage();
    } else if (document.body.classList.contains('bookings-page')) {
        handleBookingsPage();
    } else if (document.body.classList.contains('about-page')) {
        handleAboutPage();
    }
}) 

let bookedUnits = [];

function getBookedUnits(userID) {

    bookedUnits = [];
    
    const reservationRef = ref(database, 'reservation');
    onValue(reservationRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if (data.val().userID === userID) {
                    bookedUnits.push(data.val().unitID);
                    
                }
            });
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
    let container = document.getElementById('container');
    container.innerHTML = '';
    console.log(bookedUnits);
    const userRef = ref(database, 'unit');
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                for(let i=0; i<bookedUnits.length; i++) {
                    if (data.val().unitID === bookedUnits[i]) {
                        if(convertToDateObj(data.val().reservation.startDate) < Date.now()){
                            createBookingUnit(container, data.val());
                            console.log("ibnsie");
                        }
                    }
                }
            });
        }
    });
}

function createBookingUnit(container, units) {
    let data = units;
    const innerDiv = document.createElement('div');
    innerDiv.className = 'my-2 p-3 border-2 border-black h-44 w-full rounded-lg relative';
    container.appendChild(innerDiv);

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex flex-wrap h-60';
    innerDiv.appendChild(flexDiv);

    const img = document.createElement('img');
    img.src = '/src/hotel-room2.jpg';
    img.alt = '';
    img.className = 'rounded-lg object-cover w-60';
    flexDiv.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'px-2';
    flexDiv.appendChild(infoDiv);

    const roomTitle = document.createElement('p');
    roomTitle.className = 'font-bold';
    let accommodationName = '';
    const userRef = ref(database, 'accommodations');
    onValue(userRef, (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((x) => {
                if(x.key === units.accommodationID){
                    roomTitle.textContent = `${x.val().accommodationName}`;
                }
            })
        }
    });
    infoDiv.appendChild(roomTitle);

    const amenitiesTitle = document.createElement('p');
    amenitiesTitle.className = 'ml-2 mt-2 font-medium text-sm ';
    amenitiesTitle.textContent = 'Amenities';
    infoDiv.appendChild(amenitiesTitle);

    const amenitiesContainer = document.createElement('div');
    amenitiesContainer.className = 'w-96 grid grid-cols-2';

    const leftContainer = document.createElement('div');
    leftContainer.className = 'w-50';

    const amenitiesList = document.createElement('ul');
    amenitiesList.className = 'ml-4 grid font-light text-xsm text-gray-500';
    let limit = units.amenities.length > 3 ? 3 : units.amenities.length;
    for(let i=0; i<limit; i++) {
        const amenity = document.createElement('li');
        amenity.className = "inline-flex items-center";
        let amenityName = units.amenities[i];
        let amenityData = amenities.find(a => a.name === amenityName);

                // Handle special case for 'bed'
        if (amenityName.includes('bed')) {
            amenityData = amenities.find(a => a.name === 'bed');
        }
               
        if (amenityData) {
            amenity.innerHTML = amenityData.svg;
            const title = document.createElement('p');
            title.className = 'pl-2 font-light text-sm';
            if(amenityName.includes('bed')){
                title.textContent = titleCase(amenityName);
            } else {
                title.textContent = amenityName;
            }

            amenity.appendChild(title);
            amenitiesList.appendChild(amenity);
        }
    }
    leftContainer.appendChild(amenitiesList);

    const rightContainer = document.createElement('div');
    rightContainer.className = 'w-50';
    const amenitiesList2 = document.createElement('ul');
    amenitiesList2.className = 'ml-4 block font-light text-xsm text-gray-500';
    if(units.amenities.length > 3) {
        for(let i=3; i<units.amenities.length; i++) {
            const amenity = document.createElement('li');
            amenity.className = "inline-flex items-center";
            let amenityName = units.amenities[i];
            let amenityData = amenities.find(a => a.name === amenityName);

            if (amenityName.includes('bed')) {
                amenityData = amenities.find(a => a.name === 'bed');
            }

            if (amenityData) {
                amenity.innerHTML = amenityData.svg;
                const title = document.createElement('p');
                title.className = 'pl-2 font-light text-sm';
                if(amenityName.includes('bed')){
                    title.textContent = titleCase(amenityName);
                } else {
                    title.textContent = amenityName;
                }
    
                amenity.appendChild(title);
                amenitiesList2.appendChild(amenity);
            }

        }
    }
    rightContainer.appendChild(amenitiesList2)

    amenitiesContainer.appendChild(leftContainer);
    amenitiesContainer.appendChild(rightContainer);

    const container1 = document.createElement('div');
    container1.className = "absolute bottom-0 mb-4 ml-2 block block-wrap";

    const roomType = document.createElement('p');
    roomType.className = "text-center font-medium text-sm";
    roomType.textContent = units.unitType;
    
    let textColor = '';
    const roomNumber = document.createElement('div');
    if(units.unitType === 'Standard Room') {
        roomNumber.className = "rounded-lg bg-blue-400 w-24 py-1 mt-1";
        textColor = 'text-blue-900';
    } else if (units.unitType === 'Deluxe Room') {
        roomNumber.className = "rounded-lg bg-green-400 w-24 py-1 mt-1";
        textColor = 'text-green-900';
    } else if (units.unitType === 'Superior Room') {
        roomNumber.className = "rounded-lg bg-yellow-400 w-24 py-1 mt-1";
        textColor = 'text-yellow-900';
    } else if (units.unitType === 'Bed Spacer') {
        roomNumber.className = "rounded-lg bg-red-400 w-24 py-1 mt-1";
        textColor = 'text-red-900';
    } else if (units.unitType === 'Cottage') {
        roomNumber.className = "rounded-lg bg-purple-400 w-24 py-1 mt-1";
        textColor = 'text-purple-900';
    } else if (units.unitType === 'Matrimonial Room') {
        roomNumber.className = "rounded-lg bg-pink-400 w-24 py-1 mt-1";
        textColor = 'text-pink-900';
    } else if (units.unitType === 'Dormer-type Room') {
        roomNumber.className = "rounded-lg bg-gray-400 w-24 py-1 mt-1";
        textColor = 'text-gray-900';
    } 
      
    const roomNumberText = document.createElement('p');
    roomNumberText.className = `font-medium text-xs text-center ${textColor}`;
    let text = units.unitNumber.split(" ");
    roomNumberText.textContent = `R#: ${text[1]}`;
    
    roomNumber.appendChild(roomNumberText);

    container1.appendChild(roomType);
    container1.appendChild(roomNumber);

    const reviews = document.createElement('div');
    reviews.className = "absolute flex justify-end  right-0 top-0 p-2 pr-4";

    

    let timeDiff = (new Date(units.reservation.endDate)).getTime() - (new Date(units.reservation.startDate)).getTime();
    let days = timeDiff / (1000 * 3600 * 24);
    let night = days > 1 ? 'nights' : 'night';


    const container4 = document.createElement('div');
    container4.className = "absolute block text-right right-0 bottom-0 mb-1 p-2 pr-4";
    const price = document.createElement('p');
    price.className = "font-semibold";
    price.textContent = `PHP ${(days * units.price).toLocaleString('en-US')}`;
    const numberNights = document.createElement('div');
    numberNights.className = "font-light text-xs mb-2";
    numberNights.textContent = `${days} ${night}`;
    const dateRange = document.createElement('div');
    dateRange.className = "rounded-lg bg-green-400 py-2 px-4";
    const textRange = document.createElement('p');
    textRange.className = "font-bold text-xs text-green-900";
    let yearStart = units.reservation.startDate.split('/');
    let yearEnd = units.reservation.endDate.split('/');
    textRange.textContent = `${formatDate(units.reservation.startDate)}, ${yearStart[2]} - ${formatDate(units.reservation.endDate)}, ${yearEnd[2]}`;
    dateRange.appendChild(textRange);

    container4.appendChild(price);
    container4.appendChild(numberNights);
    container4.appendChild(dateRange);



    infoDiv.appendChild(container1);
    infoDiv.appendChild(reviews);
    infoDiv.appendChild(amenitiesContainer);
    infoDiv.appendChild(container4);


}

function validCardNumber(number) {
    const cleanedCardNumber = number.replace(/\D/g , '');
    if (cleanedCardNumber === ''){
        return false;
    }
    return true;
}
async function bookReservation() {
  

    const cardName = document.getElementById('cardName');
    const cardNumber = document.getElementById('cardNumber');
    const validityDate = document.getElementById('validityDate');
    const cvc = document.getElementById('cvc');
    let notAllowed = false;
    if(cardName.value === '') {
        cardName.className = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 ps-3 p-2.5';
        
        notAllowed = true;
    }
    if (validityDate.value === '') {
        validityDate.className = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5';
        
        notAllowed = true;
    }
    if (cvc.value === '' || cvc.value.length != 3) {
        cvc.className = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5';
       
        notAllowed = true;
    }
    if (cardNumber.value === '' || !validCardNumber(cardNumber.value)) {
        cardNumber.className = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5';
        
        notAllowed = true;
    } 
    if(notAllowed) {
        alert("Please enter necessary payment details.");
        return;
    }
    
    const totalPrice = document.getElementById('totalPrice').textContent;
    const date = new Date();
    const currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const paymentID = await fetchLatestPaymentID();


    set(ref(database, `payment/${paymentID}`), {
        nameOnCard: cardName.value,
        cardNumber: cardNumber.value,
        paymentDate: currentDate,
        cvc: cvc.value,
        paymentID: paymentID,
        amount: totalPrice,
        validityDate: validityDate.value
    });

    const reservationID = await fetchLatestReservationID();
    const roomGet = JSON.parse(localStorage.getItem('roomData'));
    const roomID = roomGet.unitId;
  

    set(ref(database, `reservation/${reservationID}`), {
        paymentID: paymentID,
        reservationID: reservationID,
        userID: localStorage.getItem('userKey'),
        unitID: roomID
    });


    const room = JSON.parse(localStorage.getItem('roomData'));
    
    
    const userRef = ref(database, 'unit');
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if (data.val().unitID === `${room.unitId}`) {
                    const reservation = {
                        reserved: true,
                        startDate: localStorage.getItem('startDate'),
                        endDate: localStorage.getItem('endDate')
                    };
                    update(ref(database, `unit/${room.unitId}/reservation`), reservation);
                    
                   
                    window.location.href = 'index.html';
                }
            });
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}

function convertDate(date) {
   
    const dateParts = date.split("/");
    const dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', {weekday: 'long'});
    const month = dateObj.toLocaleDateString('en-US', {month: "long"});
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();   
    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

function popularFilterChange() {
    if(document.getElementById('less250') || document.getElementById('250-750') || document.getElementById('750-1500') || document.getElementById('above1500')) {
        document.getElementById('anyPrice').checked = true;
    }
    console.log(units.length);
    searchAvailableAcc();
    const filteredUnits = [];
    for (let i = 0; i < units.length; i++) {
       
        let unit = units[i];
        let amenitiesMatched = true;
        
        for (let j = 0; j < filters.length; j++) {
            
            if (!unit.amenities.includes(filters[j])) {
                amenitiesMatched = false;
                break;
            }
        }
        
        if (amenitiesMatched) {
            filteredUnits.push(unit);
            console.log(unit);
        }
    }
    
    units = filteredUnits;
    defaultRoomView();
    document.getElementById('pagination').innerHTML = '';
    document.getElementById('pagination').appendChild(createPaginationBar(Math.ceil(filteredUnits.length/5)));
}
function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    
    return `${month} ${day}`;
}

let units = [];

function deafultAvailableAcc() {
    const userRef = ref(database, 'unit');
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if (data.val().reservation.reserved) {
                    return;
                }
                let unit = {
                    accommodationID: data.val().accommodationID,
                    amenities: data.val().amenities,
                    availability: data.val().availability,
                    capacity: data.val().capacity,
                    price: data.val().price,
                    unitID: data.val().unitID,
                    unitNumber: data.val().unitNumber,
                    unitType: data.val().unitType,
                    reservation: data.val().reservation
                };
                units.push(unit);
            });
            handlePagination();
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}

function handlePagination() {
    const pagination = document.getElementById('pagination');
    const pageSize = 5;
    const pageCount = Math.ceil(units.length / pageSize);
    pagination.innerHTML = '';
    pagination.appendChild(createPaginationBar(pageCount));
    paginationView(1, pageCount);
}

function convertToDateObj(date) {
    const dateParts = date.split('/');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[0], 10) - 1;
    const day = parseInt(dateParts[1], 10);
    
    return new Date(year, month, day);
}

function searchAvailableAcc() {
   
    const rooms = document.getElementById('rooms');
    const startDate = document.getElementById('datepicker-range-start').value;
    const endDate = document.getElementById('datepicker-range-end').value;
    if(startDate == ''  && endDate == ''){
        document.getElementById('defualtInfo').style.display = 'block';
        document.getElementById('searchInfo').style.display = 'hidden';
        document.getElementById('datepicker-range-start').classList = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5';
        document.getElementById('datepicker-range-end').classList = 'bg-gray-50 border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5';

    } else {
        document.getElementById('default').textContent = '';
        document.getElementById('defualtInfo').style.display = 'hidden';
        document.getElementById('searchInfo').style.display = 'block';
        document.getElementById('dateRange').textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        document.getElementById('datepicker-range-start').classList = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5';
        document.getElementById('datepicker-range-end').classList = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5';

    }
    units = [];
   
    const userRef = ref(database, 'unit');
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                console.log(data.val().reservation.reserved);
                let end1 = convertToDateObj(data.val().reservation.endDate);
                let startRes = convertToDateObj(data.val().reservation.startDate);
                let startCheckIn = convertToDateObj(startDate);
                let endCheckIn = convertToDateObj(endDate);
                if (data.val().reservation.reserved && (end1 > startCheckIn && startRes < endCheckIn)) {
                    return;
                }
                let unit = {
                    accommodationID: data.val().accommodationID,
                    amenities: data.val().amenities,
                    availability: data.val().availability,
                    capacity: data.val().capacity,
                    price: data.val().price,
                    unitID: data.val().unitID,
                    unitNumber: data.val().unitNumber,
                    unitType: data.val().unitType,
                    reservation: data.val().reservation
                };
                units.push(unit);
            });
            
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
    const priceCheckbox = document.getElementById('priceCheckbox');
    console.log(units);
    if(priceCheckbox.checked) {
        units = units.sort((a, b) => a.price - b.price);
    } 
    console.log(units);
    console.log(units.length);
    
    document.getElementById('pagination').innerHTML = '';
    document.getElementById('pagination').appendChild(createPaginationBar(Math.ceil(units.length/5)));
    document.getElementById('numberSearch').textContent = `${units.length} search results for`;
    defaultRoomView();
}

function defaultRoomView() {
    console.log(units);
    document.getElementById('rooms').innerHTML = '';
    for(let i=0; i<5 && i<units.length; i++){
        createRooms(rooms, units[i]);
    }
    document.getElementById('pagination').innerHTML = '';
    document.getElementById('pagination').appendChild(createPaginationBar(Math.ceil(units.length/5)));
}

function createPaginationBar(numPages) {
    const paginationBar = document.createElement('nav');
  paginationBar.setAttribute('aria-label', 'Page navigation example item-center');

  const ul = document.createElement('ul');
  ul.classList.add('flex', 'items-center', '-space-x-px', 'h-8', 'text-sm');

  // Previous page button
  const prevPageLi = document.createElement('li');
  const prevPageLink = document.createElement('a');
  prevPageLink.setAttribute('id', 'prevPage');
  prevPageLink.classList.add('flex', 'items-center', 'justify-center', 'px-3', 'h-8', 'ms-0', 'leading-tight', 'text-gray-500', 'bg-white', 'border', 'border-e-0', 'border-gray-300', 'rounded-s-lg', 'hover:bg-gray-100', 'hover:text-gray-700', 'cursor-pointer');
  prevPageLink.innerHTML = `
    <span class="sr-only">Previous</span>
    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
    </svg>
  `;
  prevPageLink.addEventListener('click', function() {
    for(let i=1; i<=numPages; i++){
        if(document.querySelector(`#page${i}`).className === 'flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-gray-100 hover:text-blue-700 cursor-pointer'){
            let pageNum = i;
            if(pageNum > 1){
                paginationView(pageNum-1, numPages);
            }
            break;
        }
    }
  })
  prevPageLi.appendChild(prevPageLink);
  ul.appendChild(prevPageLi);

  // Page buttons
  for (let i = 1; i <= numPages; i++) {
    let color = '';
    if(i==1){
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('id', `page${i}`);
        link.className = 'flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-gray-100 hover:text-blue-700 cursor-pointer';
        link.textContent = i;
        link.addEventListener('click', function() { paginationView(i, numPages); })
        li.appendChild(link);
        ul.appendChild(li);
    } else {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('id', `page${i}`);
        link.classList.add('flex', 'items-center', 'justify-center', 'px-3', 'h-8', 'leading-tight', 'text-gray-500', 'bg-white', 'border', 'border-gray-300', 'hover:bg-gray-100', 'hover:text-gray-700', 'cursor-pointer');
        link.textContent = i;
        link.addEventListener('click', function() { paginationView(i, numPages); })
        li.appendChild(link);
        ul.appendChild(li);
    }
  }

  // Next page button
  const nextPageLi = document.createElement('li');
  const nextPageLink = document.createElement('a');
  nextPageLink.setAttribute('id', 'nextPage');
  nextPageLink.classList.add('flex', 'items-center', 'justify-center', 'px-3', 'h-8', 'leading-tight', 'text-gray-500', 'bg-white', 'border', 'border-gray-300', 'rounded-e-lg', 'hover:bg-gray-100', 'hover:text-gray-700', 'cursor-pointer');
  nextPageLink.innerHTML = `
    <span class="sr-only">Next</span>
    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
    </svg>
  `;
  nextPageLink.addEventListener('click', function() {
    for(let i=1; i<=numPages; i++){
        if(document.querySelector(`#page${i}`).className === 'flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-gray-100 hover:text-blue-700 cursor-pointer'){
            let pageNum = i;
            if(pageNum < numPages){
                paginationView(pageNum+1, numPages);
                break;
            }
            break;
        }
    }
  })
  nextPageLi.appendChild(nextPageLink);
  ul.appendChild(nextPageLi);

  paginationBar.appendChild(ul);

  return paginationBar;
}

function paginationView(pageNum, max){
    document.querySelector('#rooms').innerHTML = '';
    document.querySelector(`#page${pageNum}`).className = 'flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-gray-100 hover:text-blue-700 cursor-pointer';

    for (let i = 1; i <= max; i++) {
        if (i !== pageNum) {
            document.querySelector(`#page${i}`).className = 'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer';
        }
    }

    const rooms = document.getElementById('rooms');
    const pageSize = 5;
    const start = (pageNum - 1) * pageSize;
    const end = pageNum * pageSize;

    for (let k = start; k < units.length && k < end; k++) {
        createRooms(rooms, units[k]);
    }
   
}

function titleCase(str){
    str = str.toLowerCase().split(' ');
    for(let i=0; i<str.length; i++){
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}
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
                    window.location.href = 'book.html';
                    //alert(`Button clicked for accommodation ID: ${accommodationId}`);
                    //viewRoom('UNT001');
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
        signOutBtn.addEventListener('click', function () {
            localStorage.setItem('signOut', 'true');
            window.location.href = 'index.html';
        });
    }
}

function setupEditProfileButton(userRef, email) {
    const editProfile = document.getElementById('editProfile');
    if (editProfile) {
        editProfile.addEventListener('click', function () {
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
let startCheckInDate = '', endDate = '';
function createRooms(rooms, units) {
   // rooms.innerHTML = '';
    let data = units;
    const innerDiv = document.createElement('div');
    innerDiv.className = 'my-2 p-3 border-2 border-black h-44 w-full rounded-lg relative';
    rooms.appendChild(innerDiv);

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex flex-wrap h-60';
    innerDiv.appendChild(flexDiv);

    const img = document.createElement('img');
    img.src = '/src/hotel-room2.jpg';
    img.alt = '';
    img.className = 'rounded-lg object-cover w-60';
    flexDiv.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'px-2';
    flexDiv.appendChild(infoDiv);

    const roomTitle = document.createElement('p');
    roomTitle.className = 'font-bold';
    let accommodationName = '';
    const userRef = ref(database, 'accommodations');
    onValue(userRef, (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((x) => {
                if(x.key === units.accommodationID){
                    roomTitle.textContent = `${x.val().accommodationName}`;
                }
            })
        }
    });
    infoDiv.appendChild(roomTitle);

    const amenitiesTitle = document.createElement('p');
    amenitiesTitle.className = 'ml-2 mt-2 font-medium text-sm ';
    amenitiesTitle.textContent = 'Amenities';
    infoDiv.appendChild(amenitiesTitle);

    const amenitiesContainer = document.createElement('div');
    amenitiesContainer.className = 'w-96 grid grid-cols-2';

    const leftContainer = document.createElement('div');
    leftContainer.className = 'w-50';

    const amenitiesList = document.createElement('ul');
    amenitiesList.className = 'ml-4 grid font-light text-xsm text-gray-500';
    let limit = units.amenities.length > 3 ? 3 : units.amenities.length;
    for(let i=0; i<limit; i++) {
        const amenity = document.createElement('li');
        amenity.className = "inline-flex items-center";
        let amenityName = units.amenities[i];
        let amenityData = amenities.find(a => a.name === amenityName);

                // Handle special case for 'bed'
        if (amenityName.includes('bed')) {
            amenityData = amenities.find(a => a.name === 'bed');
        }
               
        if (amenityData) {
            amenity.innerHTML = amenityData.svg;
            const title = document.createElement('p');
            title.className = 'pl-2 font-light text-sm';
            if(amenityName.includes('bed')){
                title.textContent = titleCase(amenityName);
            } else {
                title.textContent = amenityName;
            }

            amenity.appendChild(title);
            amenitiesList.appendChild(amenity);
        }
    }
    leftContainer.appendChild(amenitiesList);

    const rightContainer = document.createElement('div');
    rightContainer.className = 'w-50';
    const amenitiesList2 = document.createElement('ul');
    amenitiesList2.className = 'ml-4 block font-light text-xsm text-gray-500';
    if(units.amenities.length > 3) {
        for(let i=3; i<units.amenities.length; i++) {
            const amenity = document.createElement('li');
            amenity.className = "inline-flex items-center";
            let amenityName = units.amenities[i];
            let amenityData = amenities.find(a => a.name === amenityName);

            if (amenityName.includes('bed')) {
                amenityData = amenities.find(a => a.name === 'bed');
            }

            if (amenityData) {
                amenity.innerHTML = amenityData.svg;
                const title = document.createElement('p');
                title.className = 'pl-2 font-light text-sm';
                if(amenityName.includes('bed')){
                    title.textContent = titleCase(amenityName);
                } else {
                    title.textContent = amenityName;
                }
    
                amenity.appendChild(title);
                amenitiesList2.appendChild(amenity);
            }

        }
    }
    rightContainer.appendChild(amenitiesList2)

    amenitiesContainer.appendChild(leftContainer);
    amenitiesContainer.appendChild(rightContainer);

    const container1 = document.createElement('div');
    container1.className = "absolute bottom-0 mb-4 ml-2 block block-wrap";

    const roomType = document.createElement('p');
    roomType.className = "text-center font-medium text-sm";
    roomType.textContent = units.unitType;
    
    let textColor = '';
    const roomNumber = document.createElement('div');
    if(units.unitType === 'Standard Room') {
        roomNumber.className = "rounded-lg bg-blue-400 w-24 py-1 mt-1";
        textColor = 'text-blue-900';
    } else if (units.unitType === 'Deluxe Room') {
        roomNumber.className = "rounded-lg bg-green-400 w-24 py-1 mt-1";
        textColor = 'text-green-900';
    } else if (units.unitType === 'Superior Room') {
        roomNumber.className = "rounded-lg bg-yellow-400 w-24 py-1 mt-1";
        textColor = 'text-yellow-900';
    } else if (units.unitType === 'Bed Spacer') {
        roomNumber.className = "rounded-lg bg-red-400 w-24 py-1 mt-1";
        textColor = 'text-red-900';
    } else if (units.unitType === 'Cottage') {
        roomNumber.className = "rounded-lg bg-purple-400 w-24 py-1 mt-1";
        textColor = 'text-purple-900';
    } else if (units.unitType === 'Matrimonial Room') {
        roomNumber.className = "rounded-lg bg-pink-400 w-24 py-1 mt-1";
        textColor = 'text-pink-900';
    } else if (units.unitType === 'Dormer-type Room') {
        roomNumber.className = "rounded-lg bg-gray-400 w-24 py-1 mt-1";
        textColor = 'text-gray-900';
    } 
      
    const roomNumberText = document.createElement('p');
    roomNumberText.className = `font-medium text-xs text-center ${textColor}`;
    let text = units.unitNumber.split(" ");
    roomNumberText.textContent = `R#: ${text[1]}`;
    
    roomNumber.appendChild(roomNumberText);

    container1.appendChild(roomType);
    container1.appendChild(roomNumber);

    /*const reviews = document.createElement('div');
    reviews.className = "absolute flex justify-end  right-0 top-0 p-2 pr-4";

   const container2 = document.createElement('div');
    container2.className = "w-20 block justify-end";
    const text2 = document.createElement('p');
    text2.className = "right-0 font-normal text-light text-right text-sm text-green-500 mr-2";
    text2.textContent = "Excellent";
    const reviewCount = document.createElement('p');
    reviewCount.className = "font-light text-xs text-right mr-2";
    reviewCount.textContent = "100 reviews";

    const container3 = document.createElement('div');
    container3.className = "bg-green-300 rounded-lg px-3 items-center justify-center h-6 mt-2";
    const text3 = document.createElement('p');
    text3.className = "font-normal text-bold text-xs items-center justify-center mt-1 text-green-700 rounded-full";
    text3.textContent = "9.8";

    container3.appendChild(text3);
    container2.appendChild(text2);
    container2.appendChild(reviewCount);
    reviews.appendChild(container2);
    reviews.appendChild(container3);*/

    const container4 = document.createElement('div');
    container4.className = "absolute block text-right right-0 bottom-0 mb-1 p-2 pr-4";
    const price = document.createElement('p');
    price.className = "font-semibold";
    
    const numberNights = document.createElement('div');
    numberNights.className = "font-light text-xs";
    const startDate = document.getElementById('datepicker-range-start').value;
    const endDate = document.getElementById('datepicker-range-end').value;
    if(startDate !=='' && endDate !== '') {
        const dateDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
        let days = dateDiff / (1000 * 3600 * 24);
        let night = days > 1 ? 'nights' : 'night';
        numberNights.textContent = `${days} ${night}`;
        price.textContent = `PHP ${(units.price * days).toLocaleString('en-PH')}`;
    } else {
        numberNights.textContent = "per night";
        price.textContent = `PHP ${units.price.toLocaleString('en-PH')}`;
    }
    const detailesButton = document.createElement('button');
    detailesButton.className = "w-full text-sm text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold mt-2  py-2 px-8 rounded-full";
    detailesButton.textContent = "See Booking Details";
   
        detailesButton.addEventListener('click', function() { 
            if (document.getElementById('datepicker-range-start').value === '' && document.getElementById('datepicker-range-end').value === '') {
                document.getElementById('datepicker-range-start').className = 'bg-red-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5'
                 document.getElementById('datepicker-range-end').className = 'bg-red-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  block w-full ps-10 p-2.5'
                return;
            }
            startCheckInDate = document.getElementById('datepicker-range-start').value ;
            localStorage.setItem('startDate', startCheckInDate);
            let endDate = document.getElementById('datepicker-range-end').value;
            localStorage.setItem('endDate', endDate);
            viewRoom(units.unitID); 
        })
    
    
    
   



    container4.appendChild(price);
    container4.appendChild(numberNights);
    container4.appendChild(detailesButton);



    infoDiv.appendChild(container1);
   // infoDiv.appendChild(reviews);
    infoDiv.appendChild(amenitiesContainer);
    infoDiv.appendChild(container4);


   
    /**/

}

const amenities = [
    {
        name: "Free Wifi", svg: `<svg
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
    {
        name: "Air Conditioning", svg: `<svg
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
    {
        name: "Free TV", svg: `<svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-3 w-auto inline"
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
    {
        name: "Hot and Cold Shower", svg: `<svg 
        version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-4 w-5 inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve">
                      <g>
                      <path class="st0" d="M28.38,20.1l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08 c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C28.21,21.02,28.12,20.48,28.38,20.1L28.38,20.1z M60.91,89.12v28.25 c0,3.71-2.7,5.51-6,5.51h0c-3.3,0-6-1.8-6-5.51v-27.6h-3.6v27.6c0,3.71-2.7,5.51-6,5.51h0c-3.3,0-6-1.8-6-5.51V89.12 c-0.15-0.24-0.25-0.54-0.25-0.86V64.45l0-0.08l-16.8-8.53c-2.33-1.18-3.35-3.93-2.42-6.31l6.22-17.71c0.91-2.62,3.78-4,6.4-3.09 c2.62,0.91,4,3.78,3.09,6.4l-4.82,13.73l12.98,6.59c0.18,0.09,0.34,0.19,0.5,0.29c4.72-2.85,11.71-3.24,16.73-1.41l12.38-7.56 l-5.67-13.93c-1.04-2.58,0.2-5.51,2.78-6.56c2.58-1.04,5.51,0.2,6.56,2.78l7.28,17.88c0.91,2.24,0.08,4.88-2.05,6.18l-15.07,9.21 v25.93C61.16,88.57,61.07,88.87,60.91,89.12L60.91,89.12z M47.12,29.03c6.03,0,10.91,4.89,10.91,10.91 c0,6.03-4.89,10.91-10.91,10.91c-6.03,0-10.91-4.89-10.91-10.91C36.2,33.92,41.09,29.03,47.12,29.03L47.12,29.03z M0,10.28 c2.92-3.81,17.16-6.74,20.74-4.32c-2.12,3.71-1.85,7.48,1.16,11.33c-0.38,0.63-0.35,1.3,0.08,2.04l0.95,1.09 c0.38,0.38,0.85,0.42,1.46-0.08l14.45-14.6c0.39-0.47,0.32-0.87-0.14-1.24c-1.03-1.25-1.15-1.47-2.97-1.16 c-4.05-2.64-7.91-3.1-11.55-1.01C17.21-1.69,6.21-0.22,0,4.51V10.28L0,10.28z M36.57,13.08l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2 l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C36.39,13.99,36.3,13.46,36.57,13.08 L36.57,13.08z M40.31,9.33l0.05-0.08c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08 c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55C40.14,10.24,40.05,9.71,40.31,9.33L40.31,9.33z M32.85,16.73l0.05-0.08 c0.27-0.38,0.8-0.47,1.18-0.2l6.5,4.55c0.38,0.27,0.47,0.8,0.2,1.18l-0.05,0.08c-0.27,0.38-0.8,0.47-1.18,0.2l-6.5-4.55 C32.67,17.64,32.58,17.11,32.85,16.73L32.85,16.73z"/>
                      </g>
                      </svg>`},
    {
        name: "bed", svg: `<svg  version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-3 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve"><g><path class="st0" d="M3.36,0h7.3c1.85,0,3.36,1.56,3.36,3.36v43.77h37.33L61.99,9.69h41.85c10.47,0,19.04,8.59,19.04,19.04v19.04 h-0.02c0.01,0.12,0.02,0.24,0.02,0.37v30.49h-14.02V64.32H14.02v13.66H0V3.36C0,1.51,1.51,0,3.36,0L3.36,0z M35.44,10.37 c8.62,0,15.61,6.99,15.61,15.61c0,8.62-6.99,15.61-15.61,15.61c-8.62,0-15.61-6.99-15.61-15.61 C19.83,17.36,26.82,10.37,35.44,10.37L35.44,10.37z"/></g></svg>`},
    {
        name: "Home Entertainment", svg: `<svg version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-3 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve"><g><path d="M6.32,0v6.22h12.22V0h6.32v14.88h73.15V0h6.32v6.22h12.22V0h6.32v110.35h-6.32v-7.19h-12.22v7.19h-6.32V94.79H24.87v15.56 h-6.32v-7.19H6.32v7.19H0V0H6.32L6.32,0z M73.58,60.81c0.93-0.16,1.81-0.13,2.58,0.05v-18.1l-19.16,5.5v21.02 c0.01,0.11,0.02,0.23,0.02,0.35c0,0,0,0,0,0c0,2.83-2.97,5.64-6.63,6.27c-3.66,0.63-6.63-1.15-6.63-3.98 c0-2.83,2.97-5.64,6.63-6.27c1.38-0.24,2.66-0.13,3.72,0.24l0-25.88h0.16l24.79-5.68v29.15c0.04,0.21,0.07,0.43,0.07,0.65 c0,0,0,0,0,0c0,2.36-2.48,4.71-5.54,5.24c-3.06,0.53-5.54-0.96-5.54-3.33C68.04,63.68,70.52,61.33,73.58,60.81L73.58,60.81 L73.58,60.81z M98.01,21.2H24.87v67.27h73.15V21.2L98.01,21.2z M116.56,96.84v-11.8h-12.22v11.8H116.56L116.56,96.84z M116.56,78.72v-11.8h-12.22v11.8H116.56L116.56,78.72z M116.56,60.59v-11.8h-12.22v11.8H116.56L116.56,60.59z M116.56,42.47v-11.8 h-12.22v11.8H116.56L116.56,42.47z M116.56,24.35v-11.8h-12.22v11.8H116.56L116.56,24.35z M18.54,96.84v-11.8H6.32v11.8H18.54 L18.54,96.84z M18.54,78.72v-11.8H6.32v11.8H18.54L18.54,78.72z M18.54,60.59v-11.8H6.32v11.8H18.54L18.54,60.59z M18.54,42.47 v-11.8H6.32v11.8H18.54L18.54,42.47z M18.54,24.35v-11.8H6.32v11.8H18.54L18.54,24.35z"/></g></svg>`},
    {
        name: "Refrigerator", svg: `<svg version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-3 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve"><g><path d="M6.14,0H65.4c1.69,0,3.23,0.69,4.34,1.8c1.11,1.11,1.8,2.65,1.8,4.34v29.67v73.73c0,1.69-0.69,3.23-1.8,4.34 c-1.11,1.11-2.65,1.8-4.34,1.8h-4.89v2.72c0,2.47-2.02,4.49-4.49,4.49l0,0c-2.47,0-4.49-2.02-4.49-4.49v-2.72H20.17v2.72 c0,2.47-2.02,4.49-4.49,4.49l0,0c-2.47,0-4.49-2.02-4.49-4.49v-2.72H6.14c-1.69,0-3.23-0.69-4.34-1.8c-1.11-1.11-1.8-2.65-1.8-4.34 V35.81V6.14C0,4.45,0.69,2.91,1.8,1.8C2.91,0.69,4.45,0,6.14,0L6.14,0z M10.2,44.89c0-1.34,1.09-2.43,2.43-2.43 c1.34,0,2.43,1.09,2.43,2.43v20.4c0,1.34-1.09,2.43-2.43,2.43c-1.34,0-2.43-1.09-2.43-2.43V44.89L10.2,44.89z M10.2,10.39 c0-1.34,1.09-2.43,2.43-2.43c1.34,0,2.43,1.09,2.43,2.43v15.15c0,1.34-1.09,2.43-2.43,2.43c-1.34,0-2.43-1.09-2.43-2.43V10.39 L10.2,10.39z M4.87,33.37h61.81V6.14c0-0.35-0.14-0.67-0.38-0.9c-0.23-0.23-0.55-0.38-0.9-0.38H6.14c-0.35,0-0.67,0.14-0.9,0.38 c-0.23,0.23-0.38,0.55-0.38,0.9V33.37L4.87,33.37z M66.67,38.24H4.87v71.29c0,0.35,0.14,0.67,0.38,0.9 c0.23,0.23,0.55,0.38,0.9,0.38H65.4c0.35,0,0.67-0.14,0.9-0.38c0.23-0.23,0.38-0.55,0.38-0.9V38.24L66.67,38.24z"/></g></svg>`},
    {
        name: "Fan", svg: `<svg version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="h-3 w-auto inline"
                      viewBox="0 0 122.88 83.06"
                      style="enable-background: new 0 0 122.88 83.06"
                      xml:space="preserve"><g><path class="st0" d="M89.84,122.88H19c0.68-8.61,5.08-15.16,11.38-19.62c-5.37-2.65-10.25-6.16-14.44-10.36 C6.09,83.05,0,69.45,0,54.42c0-15.03,6.09-28.63,15.94-38.48C25.79,6.09,39.39,0,54.42,0C69.45,0,83.05,6.09,92.9,15.94 c9.85,9.85,15.94,23.45,15.94,38.48c0,15.03-6.09,28.63-15.94,38.48c-4.15,4.15-8.97,7.64-14.28,10.28 C84.82,107.62,89.15,114.18,89.84,122.88L89.84,122.88z M58.75,42.7l0.15,0.02c0.32-0.41,0.66-0.82,1-1.22 c0.59-0.69,1.21-1.36,1.86-2.01c2.66-2.67,5.3-4.15,7.92-5.63c1.71-0.96,3.41-1.91,5.02-3.16c0.58-0.45,1-0.91,1.3-1.38 c0.51-0.82,0.64-1.7,0.49-2.58c-0.17-0.99-0.69-2-1.41-2.92c-0.79-1.02-1.82-1.93-2.93-2.63c-0.99-0.63-2.1-1.15-3.24-1.58 c-1.16-0.44-2.37-0.78-3.57-1.07c-1.1-0.26-2.18-0.44-3.25-0.54c-1.11-0.11-2.21-0.16-3.31-0.15c-3.72,0.03-6.81,0.73-9.24,1.95 c-2.22,1.12-3.89,2.68-5,4.58c-1.12,1.93-1.68,4.23-1.66,6.79c0.03,3.29,1.01,7,2.99,10.93c0.34,0.67,0.75,1.25,1.22,1.76 c0.18,0.2,0.37,0.39,0.57,0.57c2.09-1.44,4.63-2.29,7.36-2.29C56.31,42.15,57.57,42.35,58.75,42.7L58.75,42.7z M53.24,46.2 c-1.64,0.28-3.1,0.91-4.38,1.87c-0.16,0.14-0.32,0.29-0.47,0.44c-1.69,1.69-2.74,4.03-2.74,6.62s1.05,4.93,2.74,6.62 c0.35,0.35,0.72,0.67,1.12,0.95c0.23,0.15,0.46,0.29,0.7,0.43l0,0c0.1,0.06,0.2,0.13,0.29,0.2c1.34,0.74,2.88,1.16,4.51,1.16 c2.59,0,4.93-1.05,6.62-2.74c1.69-1.69,2.74-4.03,2.74-6.62s-1.05-4.93-2.74-6.62c-1.03-1.03-2.3-1.82-3.73-2.29 C56.2,45.96,54.64,45.96,53.24,46.2L53.24,46.2z M44.99,46.88c-0.2-0.19-0.39-0.39-0.58-0.6c-0.68-0.75-1.29-1.6-1.77-2.55 c-2.23-4.43-3.34-8.69-3.37-12.52c-0.03-3.22,0.7-6.14,2.14-8.62c1.46-2.51,3.63-4.56,6.49-6c2.91-1.47,6.54-2.3,10.84-2.33 c1.24-0.01,2.47,0.04,3.69,0.16c1.26,0.13,2.5,0.33,3.72,0.61c1.32,0.31,2.68,0.7,4.02,1.21c1.35,0.51,2.67,1.13,3.89,1.9 c1.45,0.91,2.81,2.12,3.87,3.48c1.06,1.37,1.83,2.92,2.11,4.52c0.3,1.71,0.04,3.46-1,5.1c-0.52,0.82-1.22,1.6-2.15,2.32 c-1.85,1.43-3.65,2.45-5.45,3.46c-2.41,1.36-4.84,2.72-7.13,5.02c-0.58,0.58-1.14,1.19-1.67,1.82c-0.14,0.16-0.28,0.33-0.41,0.49 c0.71,0.47,1.36,1.01,1.96,1.61c1.9,1.9,3.22,4.4,3.65,7.18c0.34-0.04,0.68-0.07,1.03-0.08c1.01-0.04,2.04,0.03,3.09,0.27 c4.84,1.12,8.82,2.99,11.79,5.41c2.49,2.03,4.27,4.46,5.26,7.17c1,2.72,1.18,5.7,0.46,8.81c-0.74,3.19-2.41,6.51-5.13,9.83l0,0 c-0.78,0.96-1.61,1.87-2.48,2.73c-0.9,0.88-1.84,1.71-2.85,2.46c-1.08,0.81-2.25,1.61-3.5,2.32c-1.26,0.72-2.59,1.34-3.95,1.78 c-1.63,0.53-3.42,0.8-5.14,0.74c-1.73-0.06-3.42-0.46-4.83-1.27c-1.52-0.87-2.7-2.19-3.3-4.03c-0.3-0.91-0.44-1.95-0.4-3.12 c0.08-2.33,0.45-4.37,0.83-6.41c0.5-2.72,1-5.46,0.7-8.7c-0.07-0.78-0.18-1.59-0.33-2.44c-0.06-0.37-0.13-0.74-0.21-1.1 c-1.22,0.38-2.51,0.58-3.86,0.58c-1.62,0-3.17-0.3-4.61-0.84c-0.08,0.19-0.16,0.38-0.25,0.57c-0.42,0.91-0.96,1.8-1.66,2.63 c-3.2,3.79-6.68,6.47-10.2,8c-2.95,1.29-5.92,1.77-8.77,1.41c-2.88-0.36-5.61-1.56-8.06-3.63c-2.49-2.11-4.68-5.11-6.39-9.05 c-0.5-1.14-0.93-2.29-1.3-3.46c-0.37-1.19-0.67-2.41-0.89-3.67c-0.23-1.33-0.4-2.73-0.46-4.17c-0.06-1.44,0-2.9,0.22-4.32 c0.27-1.7,0.85-3.42,1.68-4.92c0.85-1.52,1.97-2.83,3.33-3.71c1.47-0.95,3.18-1.4,5.09-1.09c0.96,0.15,1.95,0.5,2.97,1.07 c2.03,1.13,3.68,2.4,5.32,3.67c2.19,1.69,4.39,3.38,7.42,4.59c0.75,0.3,1.53,0.58,2.32,0.83c0.5,0.16,1.01,0.3,1.54,0.44 C42.75,50.37,43.69,48.47,44.99,46.88L44.99,46.88z M68.12,56.72c-0.24,1.72-0.81,3.38-1.73,4.96c-0.98,1.69-2.33,3.28-4.07,4.77 c0.11,0.52,0.21,1.04,0.3,1.55c0.15,0.86,0.27,1.77,0.36,2.72c0.35,3.74-0.2,6.71-0.74,9.68c-0.35,1.92-0.7,3.83-0.77,5.88 c-0.02,0.73,0.06,1.36,0.24,1.9c0.3,0.92,0.9,1.58,1.66,2.02c0.87,0.5,1.97,0.75,3.15,0.79c1.29,0.04,2.66-0.17,3.91-0.58 c1.13-0.37,2.23-0.88,3.29-1.48c1.07-0.61,2.12-1.32,3.1-2.06c0.9-0.68,1.73-1.4,2.5-2.15c0.79-0.78,1.53-1.59,2.22-2.44l0,0l0,0 c2.36-2.88,3.8-5.7,4.41-8.35c0.56-2.42,0.43-4.71-0.33-6.78c-0.76-2.08-2.17-3.98-4.16-5.6c-2.55-2.08-6.03-3.71-10.31-4.69 c-0.72-0.17-1.44-0.22-2.14-0.19C68.7,56.66,68.41,56.69,68.12,56.72L68.12,56.72z M47.17,65.46c-1.4-1-2.6-2.25-3.58-3.77 c-1.05-1.63-1.84-3.56-2.37-5.79c-0.5-0.14-1.01-0.28-1.51-0.44c-0.86-0.27-1.72-0.58-2.59-0.92c-3.49-1.4-5.89-3.25-8.28-5.09 c-1.54-1.19-3.08-2.37-4.87-3.37c-0.64-0.36-1.24-0.57-1.79-0.66c-0.96-0.15-1.82,0.07-2.56,0.55c-0.85,0.55-1.57,1.41-2.14,2.44 c-0.63,1.13-1.07,2.44-1.28,3.73c-0.19,1.17-0.23,2.39-0.18,3.61c0.05,1.23,0.21,2.48,0.42,3.7c0.19,1.09,0.45,2.16,0.78,3.2 c0.33,1.06,0.72,2.09,1.16,3.09c1.49,3.41,3.34,5.98,5.42,7.74c1.89,1.6,3.98,2.52,6.17,2.8c2.22,0.28,4.55-0.11,6.9-1.13 c3.01-1.31,6.05-3.67,8.89-7.03c0.47-0.56,0.85-1.17,1.14-1.81c0.13-0.27,0.24-0.54,0.33-0.82L47.17,65.46L47.17,65.46z M90.35,18.49C81.15,9.3,68.45,3.61,54.42,3.61c-14.03,0-26.73,5.69-35.93,14.88C9.3,27.69,3.61,40.39,3.61,54.42 c0,14.03,5.69,26.73,14.88,35.93c9.19,9.19,21.9,14.88,35.93,14.88c14.03,0,26.73-5.69,35.93-14.88 c9.19-9.19,14.88-21.9,14.88-35.93C105.23,40.39,99.54,27.69,90.35,18.49L90.35,18.49z"/></g></svg>`},
    {}
]


const navItems = [
    { name: "Home", href: "index.html", current: true },
    { name: "Book", href: "book.html", current: false},
    { name: "Bookings", href: "bookings.html", current: false},
    { name: "About", href: "about.html", current: false }
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
            <a href="${item.href}" id="${item.name}" class="block py-2 px-3 md:p-0 ${item.current ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}" aria-current="${item.current ? 'page' : 'false'}">
                ${item.name}
            </a>
        </li>
    `;
}

function createCarouselItem(item) {
    return `
        <div class="${item.active ? 'block' : 'hidden'} duration-700 ease-in-out" data-carousel-item="${item.active ? 'active' : ''}">
            <img src="${item.src}"  class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="${item.alt}">
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
                    <a href="book.html">
                        <img class="w-96 h-36 m-6 rounded-xl object-cover" src="${accommodation.src}" alt="product image" />
                    </a>
                </div>
                <div class="px-6 mx-7 pb-5">
                    <a href="book.html">
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


function viewRoom(unitId) {
    const roomRef = ref(database, 'unit');
    let room = {};
    onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((data) => {
                if (data.key === unitId) {
                    room = {
                        accommodationId: data.val().accommodationID,
                        amenities: data.val().amenities,
                        availability: data.val().availability,
                        capacity: data.val().capacity,
                        price: data.val().price,
                        unitId: data.val().unitID,
                        unitNumber: data.val().unitNumber,
                        unitType: data.val().unitType,
                        reservation: data.val().reservation
                    };
                    //console.log(room);
                    if (localStorage.getItem('roomData')) {
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
  
function setUpRoom(room) {
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

    if (floating_password != floating_repeat_password) {
        alert("password dint matched");
        return;
    }
    try {
        const newId = await fetchLatestUserId();
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

async function fetchLatestPaymentID() {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'payment');
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
                    resolve('PMT001'); // Default ID if no users exist
                }
            } else {
                resolve('PMT001'); // Default ID if no users exist
            }
        }, (error) => {
            reject(error);
        });
    });
}

async function fetchLatestReservationID() {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'reservation');
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
                    resolve('RES001'); // Default ID if no users exist
                }
            } else {
                resolve('RES001'); // Default ID if no users exist
            }
        }, (error) => {
            reject(error);
        });
    });
}

