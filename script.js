// Configuration
const API_URL = 'http://localhost:5000/api';

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
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            token = data.token;
            currentUser = data.user;
            loginError.textContent = '';
            showMainPage();
            loadRelationshipData();
            loadStats();
            loadSpecialMessage();
        } else {
            loginError.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Server error. Make sure backend is running on port 5000.';
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
    try {
        const response = await fetch(`${API_URL}/relationship`);
        const data = await response.json();
        // Data is displayed statically in HTML
        console.log('Relationship data loaded:', data);
    } catch (error) {
        console.error('Error loading relationship data:', error);
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        
        document.getElementById('daysTogether').textContent = data.daysTogether;
        document.getElementById('daysRelationship').textContent = data.daysInRelationship;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Special Message
async function loadSpecialMessage() {
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/relationship/special`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        messageText.textContent = data.message || 'I love you so much!';
        
        // Add animation
        messageText.style.opacity = '0';
        setTimeout(() => {
            messageText.style.opacity = '1';
            messageText.style.transition = 'opacity 0.5s ease-in';
        }, 50);
    } catch (error) {
        console.error('Error loading special message:', error);
        messageText.textContent = 'You are my everything, Sweetie! 💕';
    }
}

// Check server connection
async function checkServer() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) {
            console.warn('Backend server may not be running properly');
        }
    } catch (error) {
        console.warn('Backend server not connected. Please start the backend server.');
    }
}

// Check server on load
setTimeout(checkServer, 1000);
