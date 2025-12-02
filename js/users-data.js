// Users data structure
const usersData = {
    users: [
        // Regular Users
        {
            id: 1,
            login: "juliemorgan",
            password: "Morgan123",
            name: "Julie Morgan",
            email: "julie.morgan@example.com",
            type: "User",
            location: "Lviv",
            image: "../profile_photo/julie.jpg",
            bio: "Fashion enthusiast passionate about sustainable clothing.",
            joinedDate: "2023-01-15"
        },
        {
            id: 2,
            login: "mikejohnson",
            password: "Johnson123",
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            type: "User", 
            location: "Kyiv",
            image: "../profile_photo/mike.jpg",
            quote: "Supporting local artisans and sustainable fashion.",
            bio: "Environmental activist and conscious consumer.",
            joinedDate: "2023-03-20"
        },
        // Tailors
        {
            id: 3,
            login: "annashevchenko",
            password: "Shevchenko123",
            name: "Anna Shevchenko",
            email: "anna.shevchenko@example.com",
            type: "Tailor",
            location: "Lviv",
            image: "../profile_photo/anna.jpg",
            quote: "Transforming forgotten fabrics into wearable art.",
            bio: "Professional tailor with 10+ years experience in upcycling and sustainable fashion.",
            specialty: "Dresses, Jackets",
            experience: "10 years",
            rating: 4.8,
            completedProjects: 47,
            joinedDate: "2022-11-10"
        },
        {
            id: 4,
            login: "petrokovalenko",
            password: "Kovalenko123",
            name: "Petro Kovalenko", 
            email: "petro.kovalenko@example.com",
            type: "Tailor",
            location: "Kyiv",
            image: "../profile_photo/petro.jpg",
            quote: "Every piece tells a story of renewal.",
            bio: "Master tailor specializing in denim upcycling and custom alterations.",
            specialty: "Denim, Accessories",
            experience: "7 years",
            rating: 4.9,
            completedProjects: 32,
            joinedDate: "2023-02-05"
        }
    ]
};

// Initialize users in localStorage if not exists
function initializeUsers() {
    if (!localStorage.getItem('reviveProjectUsers')) {
        localStorage.setItem('reviveProjectUsers', JSON.stringify(usersData.users));
    }
}

// Load users from localStorage
function loadUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem('reviveProjectUsers');
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    return usersData.users;
}