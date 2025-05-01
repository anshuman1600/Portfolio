document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded. Initializing script...");

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const themeNameSpan = document.getElementById('themeName');
    const toggleIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    if (!body) {
        console.error("Body element not found! Theme toggle cannot function.");
        return; // Exit if body not found
    }

    // Function to apply the theme
    function setTheme(theme) {
        console.log("Function setTheme called with:", theme);
        body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme); // Save preference
        
        // Update button appearance
        if (theme === 'dark') {
            if (themeNameSpan) themeNameSpan.textContent = 'Dark';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
        } else {
            if (themeNameSpan) themeNameSpan.textContent = 'Light';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            }
        }
        // Also update navbar style immediately based on new theme
        updateNavbarStyle(); 
    }

    // Determine and set initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    console.log("Setting initial theme to:", initialTheme);
    setTheme(initialTheme);

    // Add click listener to the button IF it exists
    if (darkModeToggle) {
        console.log("Attaching click listener to darkModeToggle button.");
        darkModeToggle.addEventListener('click', () => {
            console.log("Dark mode toggle button CLICKED!");
            const currentTheme = document.body.getAttribute('data-bs-theme') || initialTheme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    } else {
        console.error("Dark mode toggle button (#darkModeToggle) not found! Cannot attach listener."); 
    }

    // --- Footer Year --- 
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Bootstrap Tooltips --- 
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- Navbar Styling on Scroll --- 
    const mainNavbar = document.getElementById('mainNavbar');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Re-check for navbar styling

    function updateNavbarStyle() {
        if (!mainNavbar || !document.body) return;
        // Use the actual current theme for styling decisions
        const currentTheme = document.body.getAttribute('data-bs-theme') || (systemPrefersDark ? 'dark' : 'light'); 
        const scrollPosition = window.scrollY;

        if (scrollPosition > 50) { 
            mainNavbar.classList.add('navbar-scrolled');
        } else {
            mainNavbar.classList.remove('navbar-scrolled');
        }
        
        // Update toggle button style based on theme and scroll
        if (darkModeToggle) {
             if (scrollPosition > 50 || currentTheme === 'dark') {
                 // Use a contrast color suitable for dark/scrolled background
                 darkModeToggle.classList.remove('btn-outline-light');
                 darkModeToggle.classList.add('btn-outline-secondary'); 
             } else {
                 // Use light outline for transparent light background
                 darkModeToggle.classList.remove('btn-outline-secondary');
                 darkModeToggle.classList.add('btn-outline-light');
             }
         }
    }

    window.addEventListener('scroll', updateNavbarStyle);
    updateNavbarStyle(); // Initial check

    // --- Smooth Scrolling for Nav Links --- 
    document.querySelectorAll('#mainNavbar .nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                 const navbarHeight = mainNavbar ? mainNavbar.offsetHeight : 0;
                 const elementPosition = targetElement.getBoundingClientRect().top;
                 const offsetPosition = elementPosition + window.scrollY - navbarHeight;

                 window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                 });

                 const navbarCollapse = document.getElementById('navbarNavContent');
                 if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                     const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                     bsCollapse.hide();
                 }
            }
        });
    }); 

}); 