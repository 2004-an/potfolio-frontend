// This URL will be updated later once your backend is live on Render
const BACKEND_URL = 'https://anjela-potfolio.onrender.com/api/portfolio';

// 1. FETCH DATA FROM CLOUD BACKEND AND INJECT INTO HTML
async function loadPortfolio() {
    try {
        const response = await fetch(BACKEND_URL);
        const data = await response.json();

        // Target your exact HTML container IDs to inject the text dynamically
        document.getElementById('api-profile').innerText = data.profile;
        document.getElementById('api-email').innerText = data.contact.email;
        document.getElementById('api-phone').innerText = data.contact.phone;
        document.getElementById('api-location').innerText = data.contact.location;

        // Populate your 3 Skill Cards dynamically
        renderList('api-languages', data.skills.languages);
        renderList('api-tools', data.skills.tools);
        renderList('api-proficiencies', data.skills.proficiencies);

        // Populate your Featured Projects Section dynamically
        const projectContainer = document.getElementById('api-projects-container');
        projectContainer.innerHTML = data.projects.map(project => `
            <div class="project-card">
                <div class="project-icon">${project.icon}</div>
                <h3>${project.title}</h3>
                <p class="project-objective"><strong>Core Objective:</strong> ${project.objective}</p>
                <ul class="project-details">
                    ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                    <li><strong>Technologies Used:</strong> 
                        ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join(' ')}
                    </li>
                </ul>
            </div>
        `).join('');

        // Trigger animations AFTER the cards are built and added to the page
        initScrollAnimations();

    } catch (error) {
        console.error("Cloud connection failed: ", error);
        document.getElementById('api-profile').innerText = "Failed to load cloud structural content.";
    }
}

// Helper function to build lists with checkmarks
function renderList(elementId, itemsArray) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = itemsArray.map(item => `<li>✓ ${item}</li>`).join('');
}


// 2. CONTACT FORM SUBMISSION HANDLING
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        successMessage.style.display = 'block';
        contactForm.reset();
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    });
}


// 3. SMOOTH NAVIGATION SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});


// 4. SCROLL ANIMATIONS FOR CARDS
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Run data fetch automatically when the web page finishes loading
window.onload = loadPortfolio;
