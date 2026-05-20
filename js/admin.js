/* js/admin.js */

const defaultProjects = [
    {
        id: 1,
        title: "Neon Nights",
        category: "Music Video",
        date: "2023-11-15",
        views: 125000,
        img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=600",
        desc: "A vibrant, fast-paced music video shot entirely at night. Focused on cyberpunk aesthetics and heavy neon color grading to bring the artist's vision to life."
    },
    {
        id: 2,
        title: "The Last Drop",
        category: "Short Film",
        date: "2022-05-10",
        views: 45000,
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=600",
        desc: "An award-winning short film exploring themes of scarcity. Directed and edited this piece, utilizing a muted color palette to emphasize the bleak atmosphere."
    },
    {
        id: 3,
        title: "Urban Vlog",
        category: "Docu-series",
        date: "2024-02-20",
        views: 89000,
        img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600",
        desc: "A kinetic documentary series following street artists. Employed dynamic camera movements and snappy editing to match the energy of the subjects."
    },
    {
        id: 4,
        title: "Echoes",
        category: "Commercial",
        date: "2021-08-30",
        views: 210000,
        img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=600",
        desc: "A high-end commercial for a premium audio brand. Handled the cinematography, focusing on sleek product shots and lifestyle integration."
    }
];

let projects = [];

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const projectsTableBody = document.getElementById('projects-table-body');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const projectForm = document.getElementById('project-form');
const projectIdInput = document.getElementById('project-id');
const toastElement = document.getElementById('toast');

// --- AUTHENTICATION ---
function checkAuth() {
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    loadProjects();
    renderDashboard();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;

    if (usernameInput === 'admin' && passwordInput === 'password123') {
        sessionStorage.setItem('admin_logged_in', 'true');
        loginError.style.display = 'none';
        showToast('Login Successful!', 'success');
        setTimeout(() => {
            showDashboard();
        }, 500);
    } else {
        loginError.innerText = 'Invalid username or password!';
        loginError.style.display = 'block';
        showToast('Login Failed!', 'danger');
    }
});

window.logout = function() {
    sessionStorage.removeItem('admin_logged_in');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 500);
};

// --- DATA ACCESS ---
function loadProjects() {
    try {
        const stored = localStorage.getItem('portfolio_projects');
        if (stored) {
            projects = JSON.parse(stored);
        } else {
            projects = [...defaultProjects];
            saveProjects();
        }
    } catch (e) {
        console.error(e);
        projects = [...defaultProjects];
    }
}

function saveProjects() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

// --- RENDERING ---
function renderDashboard() {
    renderStats();
    renderTable();
}

function renderStats() {
    const totalProjectsEl = document.getElementById('stat-total-projects');
    const totalViewsEl = document.getElementById('stat-total-views');
    const popularProjectEl = document.getElementById('stat-popular-project');

    if (!totalProjectsEl || !totalViewsEl || !popularProjectEl) return;

    totalProjectsEl.innerText = projects.length;

    const totalViews = projects.reduce((sum, p) => sum + parseInt(p.views || 0), 0);
    totalViewsEl.innerText = totalViews.toLocaleString();

    if (projects.length > 0) {
        const popular = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
        popularProjectEl.innerText = popular.title;
    } else {
        popularProjectEl.innerText = 'None';
    }
}

function renderTable() {
    projectsTableBody.innerHTML = '';

    if (projects.length === 0) {
        projectsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; font-style: italic;">
                    No projects found. Add one to get started!
                </td>
            </tr>
        `;
        return;
    }

    projects.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${p.img || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=100'}" 
                     class="thumb-preview" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=100'">
            </td>
            <td style="font-weight: 800; font-size: 1.1rem;">${p.title}</td>
            <td><span class="category-tag">${p.category}</span></td>
            <td>${p.date}</td>
            <td>${parseInt(p.views || 0).toLocaleString()}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="openEditModal(${p.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${p.id})">Delete</button>
                </div>
            </td>
        `;
        projectsTableBody.appendChild(tr);
    });
}

// --- CRUD OPERATIONS ---
window.openAddModal = function() {
    projectForm.reset();
    projectIdInput.value = '';
    modalTitle.innerText = 'Add New Project';
    projectModal.classList.add('active');
};

window.closeModal = function() {
    projectModal.classList.remove('active');
};

window.openEditModal = function(id) {
    const p = projects.find(proj => proj.id === id);
    if (!p) return;

    modalTitle.innerText = 'Edit Project';
    projectIdInput.value = p.id;
    document.getElementById('proj-title').value = p.title;
    document.getElementById('proj-category').value = p.category;
    document.getElementById('proj-date').value = p.date;
    document.getElementById('proj-views').value = p.views;
    document.getElementById('proj-img').value = p.img;
    document.getElementById('proj-desc').value = p.desc;

    projectModal.classList.add('active');
};

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = projectIdInput.value;
    const title = document.getElementById('proj-title').value.trim();
    const category = document.getElementById('proj-category').value;
    const date = document.getElementById('proj-date').value;
    const views = parseInt(document.getElementById('proj-views').value || 0);
    const img = document.getElementById('proj-img').value.trim();
    const desc = document.getElementById('proj-desc').value.trim();

    if (idVal) {
        // Edit Mode
        const index = projects.findIndex(proj => proj.id === parseInt(idVal));
        if (index !== -1) {
            projects[index] = {
                id: parseInt(idVal),
                title,
                category,
                date,
                views,
                img,
                desc
            };
            showToast('Project updated successfully!', 'success');
        }
    } else {
        // Add Mode
        const newId = projects.length > 0 ? Math.max(...projects.map(proj => proj.id)) + 1 : 1;
        const newProject = {
            id: newId,
            title,
            category,
            date,
            views,
            img,
            desc
        };
        projects.push(newProject);
        showToast('New project added successfully!', 'success');
    }

    saveProjects();
    closeModal();
    renderDashboard();
});

window.deleteProject = function(id) {
    const p = projects.find(proj => proj.id === id);
    if (!p) return;

    if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
        projects = projects.filter(proj => proj.id !== id);
        saveProjects();
        renderDashboard();
        showToast('Project deleted successfully', 'danger');
    }
};

window.resetToDefault = function() {
    if (confirm('Are you sure you want to RESET all data to default projects? This will discard your custom projects!')) {
        projects = [...defaultProjects];
        saveProjects();
        renderDashboard();
        showToast('Reset completed successfully!', 'success');
    }
};

// --- COPY CONFIGURATION ---
window.copyCodeConfig = function() {
    const jsString = `const projectsData = ${JSON.stringify(projects, null, 4)};`;
    navigator.clipboard.writeText(jsString)
        .then(() => {
            showToast('Copied JS config to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Copying failed!', 'danger');
        });
};

// --- TOAST ALERTS ---
let toastTimeout;
function showToast(message, type = 'success') {
    clearTimeout(toastTimeout);
    toastElement.innerText = message;
    
    toastElement.className = 'toast'; // reset class
    if (type === 'danger') {
        toastElement.classList.add('toast-danger');
    } else if (type === 'success') {
        toastElement.classList.add('toast-success');
    }
    
    toastElement.classList.add('show');
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
