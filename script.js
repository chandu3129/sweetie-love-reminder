// Configuration
const API_URL = 'http://localhost:5000/api';
const USE_LOCAL_AUTH = true; // Use local authentication for GitHub Pages

// State
let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('currentUser');

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const messageText = document.getElementById('messageText');
const refreshMessageBtn = document.getElementById('refreshMessageBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (token && currentUser) {
        showMainPage();
        loadRelationshipData();
        loadStats();
        loadSpecialMessage();
    } else {
        showLoginPage();
    }
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Local authentication
    const validCredentials = [
        { username: 'chandu', password: 'chandu@sweetie123', fullName: 'Chandu' },
        { username: 'sweetie', password: 'sweetie@chandu123', fullName: 'Sweetie' }
    ];
    
    const user = validCredentials.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('token', 'local-token-' + username);
        localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: user.username, fullName: user.fullName }));
        token = 'local-token-' + username;
        currentUser = JSON.stringify({ id: 1, username: user.username, fullName: user.fullName });
        loginError.textContent = '';
        showMainPage();
        loadRelationshipData();
        loadStats();
        loadSpecialMessage();
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    token = null;
    currentUser = null;
    showLoginPage();
    loginForm.reset();
    loginError.textContent = '';
});

// Refresh Message
refreshMessageBtn.addEventListener('click', loadSpecialMessage);

// Page Navigation
function showLoginPage() {
    loginPage.classList.add('active');
    mainPage.classList.remove('active');
}

function showMainPage() {
    loginPage.classList.remove('active');
    mainPage.classList.add('active');
    const user = JSON.parse(currentUser);
    userGreeting.textContent = `Welcome, ${user.fullName}! 💕`;
}

// Load Relationship Data
async function loadRelationshipData() {
    // Data is hardcoded in HTML
    console.log('Relationship data loaded');
}

// Load Stats
async function loadStats() {
    try {
        // Calculate days locally
        const friendshipStart = new Date('2022-07-03');
        const relationshipStart = new Date('2025-09-29');
        const today = new Date();
        
        const daysTogether = Math.floor((today - friendshipStart) / (1000 * 60 * 60 * 24));
        const daysRelationship = Math.floor((today - relationshipStart) / (1000 * 60 * 60 * 24));
        
        document.getElementById('daysTogether').textContent = daysTogether;
        document.getElementById('daysRelationship').textContent = daysRelationship;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Special Message
async function loadSpecialMessage() {
    if (!token) return;
    
    const messages = [
        'You make my heart smile every single day!',
        'Our friendship is my greatest treasure. I love you so much!',
        'Every moment with you is a blessing I never want to lose.',
        'You are my best friend, my love, my everything!',
        'I fall in love with you more every day.',
        'Thank you for 3 years of beautiful friendship and forever of love.',
        'Your smile is my favorite sight in the whole world.',
        'With you, I found my soulmate and my best friend.',
        'You make ordinary days feel extraordinary.',
        'Forever is not enough time with you, Sweetie!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageText.textContent = randomMessage;
    
    // Add animation
    messageText.style.opacity = '0';
    setTimeout(() => {
        messageText.style.opacity = '1';
        messageText.style.transition = 'opacity 0.5s ease-in';
    }, 50);
}

// Check server connection (optional)
// Removed - works offline now!
