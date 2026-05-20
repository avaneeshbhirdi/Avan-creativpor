/* js/main.js */

window.switchSection = function(sectionId, btnElement) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    if (btnElement) {
        document.querySelectorAll('.slide-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
};

window.scrollSoftware = function(direction) {
    const container = document.getElementById('software-scroll');
    if (!container) return;
    const scrollAmount = 250; 
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

window.updateScrollButtons = function() {
    const container = document.getElementById('software-scroll');
    const leftBtn = document.getElementById('scroll-btn-left');
    const rightBtn = document.getElementById('scroll-btn-right');
    
    if (!container || !leftBtn || !rightBtn) return;
    
    // Hide both navigation arrows if any category other than 'all' is active
    if (window.currentSoftwareCategory !== 'all') {
        leftBtn.style.visibility = 'hidden';
        rightBtn.style.visibility = 'hidden';
        return;
    }
    
    if (container.scrollLeft <= 5) {
        leftBtn.style.visibility = 'hidden';
    } else {
        leftBtn.style.visibility = 'visible';
    }
    
    if (Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 5) {
        rightBtn.style.visibility = 'hidden';
    } else {
        rightBtn.style.visibility = 'visible';
    }
};

const softwareCategoryMapping = {
    all: ['premiere', 'ae', 'photoshop', 'illustrator', 'davinci', 'blender', 'flstudio', 'figma'],
    video: ['premiere', 'davinci', 'ae'],
    designing: ['illustrator', 'figma', 'photoshop'],
    music: ['flstudio'],
    vfx: ['blender', 'ae', 'davinci']
};

const softwareData = {
    premiere: { name: 'Premiere Pro', img: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg', fallback: '' },
    ae: { name: 'After Effects', img: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg', fallback: '' },
    photoshop: { name: 'Photoshop', img: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg', fallback: '' },
    illustrator: { name: 'Illustrator', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg', fallback: '' },
    davinci: { name: 'DaVinci Resolve', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png', fallback: 'https://cdn.iconscout.com/icon/free/png-256/davinci-resolve-3628741-3030248.png' },
    blender: { name: 'Blender', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg', fallback: '' },
    flstudio: { name: 'FL Studio', img: 'https://img.icons8.com/color/512/fl-studio.png', fallback: '' },
    figma: { name: 'Figma', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', fallback: 'https://img.icons8.com/color/512/figma.png' }
};

window.currentSoftwareCategory = 'all';

window.filterSoftware = function(category, btnElement) {
    window.currentSoftwareCategory = category;
    
    // Update active button styling
    document.querySelectorAll('.soft-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        // Fallback search if passed via HTML direct click
        const buttons = document.querySelectorAll('.soft-filter-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${category}'`)) {
                btn.classList.add('active');
            }
        });
    }

    window.renderSoftware();
};

window.renderSoftware = function() {
    const container = document.getElementById('software-scroll');
    if (!container) return;
    
    const appIds = softwareCategoryMapping[window.currentSoftwareCategory] || [];
    let html = '';
    
    appIds.forEach(id => {
        const app = softwareData[id];
        if (app) {
            const fallbackAttr = app.fallback ? ` onerror="this.src='${app.fallback}'"` : '';
            html += `
                <div class="soft-item" style="min-width: 130px;">
                    <img src="${app.img}" alt="${app.name}"${fallbackAttr}>
                    <span>${app.name}</span>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    container.scrollLeft = 0;
    
    // Update the visibility of scroll buttons
    setTimeout(() => {
        if (window.updateScrollButtons) window.updateScrollButtons();
    }, 50);
};

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

let projectsData = [];
try {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
        projectsData = JSON.parse(stored);
    } else {
        projectsData = [...defaultProjects];
        localStorage.setItem('portfolio_projects', JSON.stringify(projectsData));
    }
} catch (e) {
    console.error("Failed to load projects from localStorage:", e);
    projectsData = [...defaultProjects];
}

let currentSort = 'recent';
let searchQuery = '';

window.searchProjects = function() {
    searchQuery = document.getElementById('project-search') ? document.getElementById('project-search').value.toLowerCase() : '';
    renderProjects();
};

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    let sorted = projectsData.filter(p => p.title.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery));
    if (currentSort === 'recent') {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'oldest') {
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (currentSort === 'popular') {
        sorted.sort((a, b) => b.views - a.views);
    }
    
    container.innerHTML = '';
    sorted.forEach(proj => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.onclick = () => openProjectDetail(proj.id);
        item.innerHTML = `
            <div class="item-inner" style="height: 100%;">
                <img src="${proj.img}" alt="${proj.title}">
                <div class="item-overlay">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <h3>${proj.title}</h3>
                        <span style="background: var(--color-secondary); color: #000; padding: 2px 8px; font-weight: bold; border: 2px solid #000; font-size: 0.8rem; align-self: flex-start; transform: rotate(-2deg); box-shadow: 2px 2px 0 #000;">${proj.category}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

window.sortProjects = function(type) {
    currentSort = type;
    
    // Update active button
    document.getElementById('sort-recent').classList.remove('active');
    document.getElementById('sort-popular').classList.remove('active');
    document.getElementById('sort-oldest').classList.remove('active');
    document.getElementById('sort-recent').style.boxShadow = '4px 4px 0 #000';
    document.getElementById('sort-popular').style.boxShadow = '4px 4px 0 #000';
    document.getElementById('sort-oldest').style.boxShadow = '4px 4px 0 #000';
    
    const activeBtn = document.getElementById('sort-' + type);
    if(activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.boxShadow = '2px 2px 0 #000';
    }
    
    renderProjects();
};

window.openProjectDetail = function(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;
    
    document.getElementById('projects-list-view').style.display = 'none';
    document.getElementById('projects-detail-view').style.display = 'block';
    
    document.getElementById('proj-detail-img').src = proj.img;
    document.getElementById('proj-detail-title').innerText = proj.title;
    document.getElementById('proj-detail-subtitle').innerText = proj.category + ' • ' + proj.views.toLocaleString() + ' Views';
    document.getElementById('proj-detail-desc').innerText = proj.desc;
};

window.closeProjectDetail = function() {
    document.getElementById('projects-detail-view').style.display = 'none';
    document.getElementById('projects-list-view').style.display = 'block';
};

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    if (window.renderSoftware) window.renderSoftware();
    if (window.updateScrollButtons) window.updateScrollButtons();
    if (window.initRadarChart) window.initRadarChart();

    // Initialize slidebar to correct state if not set
    const activeBtn = document.querySelector('.slide-btn.active');
    if(!activeBtn) {
        const firstBtn = document.querySelector('.slide-btn');
        if (firstBtn) firstBtn.classList.add('active');
    }
});

window.initRadarChart = function() {
    const container = document.getElementById('radar-chart-container');
    if (!container) return;

    // Remove any existing SVG
    const existingSvg = container.querySelector('svg');
    if (existingSvg) existingSvg.remove();

    const coreStrengthsData = [
        { name: "Video Editing", value: 95 },
        { name: "Motion Graphics", value: 85 },
        { name: "Cinematography", value: 90 },
        { name: "VFX", value: 65 },
        { name: "Music Editing", value: 75 },
        { name: "Storytelling", value: 90 },
        { name: "Designing", value: 90 },
        { name: "Writing & Scripting", value: 95 }
    ];

    const width = 450;
    const height = 450;
    const cx = 225;
    const cy = 225;
    const maxR = 140; // max radius for 100%
    const minX = -50;
    const viewBoxWidth = 550;

    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", `${minX} 0 ${viewBoxWidth} ${height}`);
    svg.setAttribute("style", "width: 100%; height: 100%; overflow: visible; font-family: inherit;");

    // 1. Draw concentric background polygons (20%, 40%, 60%, 80%, 100%)
    for (let l = 1; l <= 5; l++) {
        const r = (l / 5) * maxR;
        const points = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45 - 90) * Math.PI / 180;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        const poly = document.createElementNS(svgNamespace, "polygon");
        poly.setAttribute("points", points.join(" "));
        poly.setAttribute("fill", "none");
        poly.setAttribute("stroke", l === 5 ? "#000" : "rgba(0, 0, 0, 0.15)");
        poly.setAttribute("stroke-width", l === 5 ? "2" : "1");
        if (l < 5) poly.setAttribute("stroke-dasharray", "4,4");
        svg.appendChild(poly);
    }

    // 2. Draw axes lines
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45 - 90) * Math.PI / 180;
        const x = cx + maxR * Math.cos(angle);
        const y = cy + maxR * Math.sin(angle);

        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", cx);
        line.setAttribute("y1", cy);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "rgba(0, 0, 0, 0.15)");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
    }

    // 3. Draw data polygon
    const dataPoints = [];
    for (let i = 0; i < 8; i++) {
        const r = (coreStrengthsData[i].value / 100) * maxR;
        const angle = (i * 45 - 90) * Math.PI / 180;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        dataPoints.push(`${x},${y}`);
    }

    const dataPoly = document.createElementNS(svgNamespace, "polygon");
    dataPoly.setAttribute("points", dataPoints.join(" "));
    dataPoly.setAttribute("fill", "var(--color-primary)");
    dataPoly.setAttribute("fill-opacity", "0.2");
    dataPoly.setAttribute("stroke", "var(--color-primary)");
    dataPoly.setAttribute("stroke-width", "4");
    dataPoly.setAttribute("style", "transition: all 0.3s ease; filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.15));");
    svg.appendChild(dataPoly);

    // Keep track of dots and texts
    const dotElements = [];
    const textElements = [];

    const showTooltip = (index) => {
        const item = coreStrengthsData[index];
        const tooltip = document.getElementById("radar-tooltip");
        if (!tooltip) return;

        tooltip.innerHTML = `${item.name}: <span style="background: #fff; color: #000; padding: 1px 5px; margin-left: 5px; border: 2px solid #000; font-weight: 900; font-size: 0.9em; box-shadow: 1px 1px 0 #000;">${item.value}%</span>`;
        
        const r = (item.value / 100) * maxR;
        const angle = (index * 45 - 90) * Math.PI / 180;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        const pctX = ((x - minX) / viewBoxWidth) * 100;
        const pctY = (y / height) * 100;

        tooltip.style.left = `${pctX}%`;
        tooltip.style.top = `${pctY}%`;
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translate(-50%, -125%) scale(1.05)";

        const dot = dotElements[index];
        if (dot) {
            dot.setAttribute("fill", "var(--color-primary)");
            dot.setAttribute("stroke", "#000");
            dot.setAttribute("r", "10");
        }

        const text = textElements[index];
        if (text) {
            text.setAttribute("fill", "var(--color-primary)");
            text.setAttribute("font-size", "12px");
        }
    };

    const hideTooltip = (index) => {
        const tooltip = document.getElementById("radar-tooltip");
        if (tooltip) {
            tooltip.style.opacity = "0";
            tooltip.style.transform = "translate(-50%, -120%) scale(1)";
        }

        const dot = dotElements[index];
        if (dot) {
            dot.setAttribute("fill", "#fff");
            dot.setAttribute("stroke", "var(--color-primary)");
            dot.setAttribute("r", "6");
        }

        const text = textElements[index];
        if (text) {
            text.setAttribute("fill", "#000");
            text.setAttribute("font-size", "11px");
        }
    };

    // 4. Draw labels, dots, and large transparent hover zones
    for (let i = 0; i < 8; i++) {
        const item = coreStrengthsData[i];
        const angle = (i * 45 - 90) * Math.PI / 180;

        // Axis labels
        const labelDist = maxR + 18;
        const lx = cx + labelDist * Math.cos(angle);
        const ly = cy + labelDist * Math.sin(angle);

        let anchor = "middle";
        if (Math.cos(angle) > 0.1) anchor = "start";
        else if (Math.cos(angle) < -0.1) anchor = "end";

        const text = document.createElementNS(svgNamespace, "text");
        text.setAttribute("x", lx);
        text.setAttribute("y", ly + 4);
        text.setAttribute("text-anchor", anchor);
        text.setAttribute("fill", "#000");
        text.setAttribute("font-weight", "800");
        text.setAttribute("font-size", "11px");
        text.setAttribute("style", "text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;");
        text.textContent = item.name;
        svg.appendChild(text);
        textElements.push(text);

        // Vertices dots
        const r = (item.value / 100) * maxR;
        const dx = cx + r * Math.cos(angle);
        const dy = cy + r * Math.sin(angle);

        const dot = document.createElementNS(svgNamespace, "circle");
        dot.setAttribute("cx", dx);
        dot.setAttribute("cy", dy);
        dot.setAttribute("r", "6");
        dot.setAttribute("fill", "#fff");
        dot.setAttribute("stroke", "var(--color-primary)");
        dot.setAttribute("stroke-width", "3");
        dot.setAttribute("style", "cursor: pointer; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);");
        svg.appendChild(dot);
        dotElements.push(dot);

        // Invisible target circle for larger hover area
        const target = document.createElementNS(svgNamespace, "circle");
        target.setAttribute("cx", dx);
        target.setAttribute("cy", dy);
        target.setAttribute("r", "25");
        target.setAttribute("fill", "transparent");
        target.setAttribute("style", "cursor: pointer;");
        
        target.addEventListener('mouseenter', () => showTooltip(i));
        target.addEventListener('mouseleave', () => hideTooltip(i));
        text.addEventListener('mouseenter', () => showTooltip(i));
        text.addEventListener('mouseleave', () => hideTooltip(i));

        svg.appendChild(target);
    }

    container.appendChild(svg);
};


