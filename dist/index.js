document.addEventListener('DOMContentLoaded', function(){
    //document.getElementById('scenic-views').innerHTML = scenicViews.map(createScenicView).join('');
    document.getElementById('nav-items').innerHTML = navItems.map(createNavItem).join('');
    document.getElementById('accommodations').innerHTML = accommodations.map(createAccommodation).join('');
    document.getElementById('carousel-items').innerHTML = carouselItems.map(createCarouselItem).join('');
    document.getElementById('table-content').innerHTML = tableContent.map(createTableRow).join('');
    
    
    document.getElementById('signInBtn').addEventListener('click', signIn);
})

const navItems = [
    { name: "Home", href: "#", current: true },
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

const accommodations = [
    { src: "/src/hotel-room.jpg", name: "Hostel", location: "VSU Lower Campus", price: "PHP 700/night" },
    { src: "/src/hotel-room2.jpg", name: "Apartelle", location: "VSU Lower Campus", price: "PHP 800/night" },
    { src: "/src/hotel-room3.jpg", name: "Seafront Suite", location: "VSU Lower Campus", price: "PHP 800/night" },
    { src: "/src/hotel-room4.jpg", name: "Balay Alumni", location: "VSU Lower Campus", price: "PHP 800/night" }
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

function createScenicView(view) {
    return `
        <div class="grid gap-4">
            <div class="relative">
                <img class="h-36 w-96 max-w-full rounded-lg object-cover" src="${view.src}" alt="${view.alt}">
                <p class="absolute flex text-black text-sm font-medium bg-white/50 rounded-full p-2 px-5 mb-2 mr-2 bottom-0 right-0 justify-center items-center">${view.description}</p>
            </div>
        </div>`;
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
                        <button>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

function signIn(){
    document.querySelector('#signInForm').style.display = 'block';
    document.querySelector('#homePage').style.display = 'none';
    console.log("fdf" + document.querySelector('#homePage').style.display)
}