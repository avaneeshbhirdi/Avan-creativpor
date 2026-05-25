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
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
}

async function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    await loadProjects();
    renderDashboard();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value;

    if ((usernameInput === 'avaneeshbhirdi' || usernameInput === 'admin') && emailInput === 'avaneeshbhirdi3637@gmail.com' && passwordInput === 'avanshree@0503') {
        sessionStorage.setItem('admin_logged_in', 'true');
        loginError.style.display = 'none';
        showToast('Login Successful!', 'success');
        setTimeout(async () => {
            await showDashboard();
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
async function loadProjects() {
    const customized = localStorage.getItem('portfolio_projects_customized');
    const stored = localStorage.getItem('portfolio_projects');
    
    if (customized === 'true' && stored) {
        try {
            projects = JSON.parse(stored);
            console.log("Loaded customized projects from localStorage");
            return;
        } catch (e) {
            console.error("Failed to parse customized projects from localStorage", e);
        }
    }

    try {
        const res = await fetch('/js/projects.json');
        if (res.ok) {
            projects = await res.json();
            // Sync to local storage
            localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        } else {
            throw new Error(`Failed to load: ${res.status}`);
        }
    } catch (e) {
        console.warn("Could not load from projects.json, loading from localStorage/defaults:", e);
        try {
            if (stored) {
                projects = JSON.parse(stored);
            } else {
                projects = [...defaultProjects];
                await saveProjects();
            }
        } catch (err) {
            projects = [...defaultProjects];
        }
    }
}

async function saveProjects() {
    localStorage.setItem('portfolio_projects_customized', 'true');
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    
    try {
        const res = await fetch('/api/save-projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projects)
        });
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                console.log("Successfully persisted projects to server codebase");
            }
        }
    } catch (e) {
        console.warn("Local codebase server persistence not available (normal in production):", e);
    }
}

// --- RENDERING ---
function renderDashboard() {
    renderStats();
    renderTable();
    updateCategoryDatalist();
}

function updateCategoryDatalist() {
    const datalist = document.getElementById('category-options');
    if (!datalist) return;
    
    const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];
    const defaultCategories = ["Music Video", "Short Film", "Docu-series", "Commercial"];
    const allCategories = [...new Set([...defaultCategories, ...uniqueCategories])];
    
    datalist.innerHTML = '';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        datalist.appendChild(option);
    });
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

// --- FILE UPLOAD & COMPRESSION ---
document.getElementById('proj-img-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const MAX_WIDTH = 800;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            document.getElementById('proj-img-data').value = compressedDataUrl;
            document.getElementById('proj-img-preview').src = compressedDataUrl;
            document.getElementById('proj-img-preview-container').style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// --- CRUD OPERATIONS ---
window.addLinkField = function(text = '', url = '') {
    const container = document.getElementById('proj-links-container');
    const index = container.children.length;
    
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = index === 0 ? '1fr 2fr' : '1fr 2fr auto';
    row.style.gap = '20px';
    row.style.alignItems = 'start';
    row.className = 'link-row';
    
    let removeBtnHtml = '';
    if (index > 0) {
        removeBtnHtml = `<button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="margin-top: 25px;" title="Remove link">X</button>`;
    }
    
    row.innerHTML = `
        <div class="form-group">
            <label>${index === 0 ? 'Button Text' : 'Additional Button'}</label>
            <input type="text" class="form-input link-text" placeholder="e.g. Watch Now" value="${text || (index === 0 ? 'Watch Now' : '')}">
        </div>
        <div class="form-group">
            <label>${index === 0 ? 'Button Link URL' : 'Link URL'}</label>
            <input type="url" class="form-input link-url" placeholder="https://..." value="${url}">
        </div>
        ${removeBtnHtml}
    `;
    
    container.appendChild(row);
};

window.openAddModal = function() {
    projectForm.reset();
    projectIdInput.value = '';
    document.getElementById('proj-detail-title-input').value = '';
    document.getElementById('proj-roles').value = '';
    document.getElementById('proj-img-data').value = '';
    document.getElementById('proj-img-preview').src = '';
    document.getElementById('proj-img-preview-container').style.display = 'none';
    document.getElementById('proj-links-container').innerHTML = '';
    addLinkField();
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
    document.getElementById('proj-detail-title-input').value = p.detailTitle || '';
    document.getElementById('proj-category').value = p.category;
    document.getElementById('proj-date').value = p.date;
    document.getElementById('proj-views').value = p.views;
    
    // Set up image preview for edit
    document.getElementById('proj-img-data').value = p.img || '';
    if (p.img) {
        document.getElementById('proj-img-preview').src = p.img;
        document.getElementById('proj-img-preview-container').style.display = 'block';
    } else {
        document.getElementById('proj-img-preview-container').style.display = 'none';
    }
    
    document.getElementById('proj-roles').value = p.roles ? p.roles.join(', ') : '';
    document.getElementById('proj-desc').value = p.desc;
    
    const container = document.getElementById('proj-links-container');
    container.innerHTML = '';
    
    if (p.links && p.links.length > 0) {
        const hasIsMain = p.links.some(l => l.isMain !== undefined);
        let mainLink = null;
        let additionalLinks = [];
        
        if (hasIsMain) {
            mainLink = p.links.find(l => l.isMain === true);
            additionalLinks = p.links.filter(l => l.isMain !== true);
        } else {
            mainLink = p.links[0];
            additionalLinks = p.links.slice(1);
        }
        
        if (mainLink) {
            addLinkField(mainLink.text, mainLink.url);
        } else {
            addLinkField('Watch Now', '');
        }
        
        additionalLinks.forEach(l => addLinkField(l.text, l.url));
    } else {
        // Fallback for older data format
        addLinkField(p.btnText || 'Watch Now', p.link || '');
    }

    projectModal.classList.add('active');
};

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = projectIdInput.value;
    const title = document.getElementById('proj-title').value.trim();
    const detailTitle = document.getElementById('proj-detail-title-input').value.trim();
    const category = document.getElementById('proj-category').value;
    const date = document.getElementById('proj-date').value;
    const views = document.getElementById('proj-views').value.trim() || '0';
    const img = document.getElementById('proj-img-data').value.trim();
    if (!img) {
        showToast('Please select a thumbnail image to upload!', 'danger');
        return;
    }
    const desc = document.getElementById('proj-desc').value.trim();
    const rolesInput = document.getElementById('proj-roles').value.trim();
    const roles = rolesInput ? rolesInput.split(',').map(r => r.trim()).filter(r => r !== '') : [];
    
    const links = [];
    const linkRows = document.querySelectorAll('.link-row');
    linkRows.forEach((row, idx) => {
        const text = row.querySelector('.link-text').value.trim();
        const url = row.querySelector('.link-url').value.trim();
        if (url) {
            links.push({ text: text || 'Watch Now', url: url, isMain: idx === 0 });
        }
    });

    if (idVal) {
        // Edit Mode
        const index = projects.findIndex(proj => proj.id === parseInt(idVal));
        if (index !== -1) {
            projects[index] = {
                id: parseInt(idVal),
                title,
                detailTitle,
                category,
                date,
                views,
                img,
                desc,
                roles,
                links
            };
            showToast('Project updated successfully!', 'success');
        }
    } else {
        // Add Mode
        const newId = projects.length > 0 ? Math.max(...projects.map(proj => proj.id)) + 1 : 1;
        const newProject = {
            id: newId,
            title,
            detailTitle,
            category,
            date,
            views,
            img,
            desc,
            roles,
            links
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
        localStorage.removeItem('portfolio_projects_customized');
        fetch('/js/projects.json')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error();
            })
            .then(data => {
                projects = data;
                saveProjects();
                localStorage.removeItem('portfolio_projects_customized');
                renderDashboard();
                showToast('Reset completed successfully!', 'success');
            })
            .catch(() => {
                projects = [...defaultProjects];
                saveProjects();
                localStorage.removeItem('portfolio_projects_customized');
                renderDashboard();
                showToast('Reset completed successfully!', 'success');
            });
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

// --- DOWNLOAD JSON ---
window.downloadJSON = function() {
    const dataStr = JSON.stringify(projects, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Downloaded projects.json!', 'success');
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
