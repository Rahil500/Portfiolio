/**
 * Mohammed Rahil - Portfolio Interactive Logic
 * Handles Vertical Sidebar Navigation, Night Mode (CSS Media Query detection + Toggle),
 * Scroll Spy for all 8 sections, and Interactive Pixel Art Terminal Chat.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. NIGHT MODE / THEME TOGGLE (CSS Media Query Default + Manual Override)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const themeStatusText = document.getElementById('theme-status-text');
  const htmlRoot = document.documentElement;

  // Media query detecting user's default browser theme
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Helper to determine active effective theme
  const getEffectiveTheme = () => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) return saved;
    return systemPrefersDark.matches ? 'dark' : 'light';
  };

  // Helper to update toggle button UI label & accessibility titles
  const updateToggleUI = (theme) => {
    if (themeStatusText) {
      themeStatusText.textContent = theme === 'dark' ? 'NIGHT' : 'DAY';
    }
    const titleText = `Current: ${theme.toUpperCase()} MODE. Click to toggle.`;
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', titleText);
      themeToggleBtn.setAttribute('aria-label', titleText);
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.setAttribute('title', titleText);
      mobileThemeToggle.setAttribute('aria-label', titleText);
    }
  };

  // Check saved preference; otherwise let CSS media queries handle default
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
    updateToggleUI(savedTheme);
  } else {
    htmlRoot.removeAttribute('data-theme');
    updateToggleUI(systemPrefersDark.matches ? 'dark' : 'light');
  }

  // Listen for browser/system theme changes dynamically
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      updateToggleUI(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle theme action handler
  const toggleTheme = () => {
    const current = getEffectiveTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';

    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateToggleUI(newTheme);
  };

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);


  // --------------------------------------------------------------------------
  // 2. VERTICAL SIDEBAR NAVIGATION & MOBILE DRAWER LOGIC
  // --------------------------------------------------------------------------
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');

  const openSidebar = () => {
    if (sidebarNav) sidebarNav.classList.add('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('is-active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = window.innerWidth < 1024 ? 'hidden' : '';
  };

  const closeSidebar = () => {
    if (sidebarNav) sidebarNav.classList.remove('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('is-active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Close sidebar on link click (mobile) and handle keyboard escape
  sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('is-open')) {
      closeSidebar();
    }
  });


  // --------------------------------------------------------------------------
  // 3. SCROLL SPY - ACTIVE NAVIGATION LINK HIGHLIGHTING
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.sidebar-nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          sidebarNavLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy(); // Initial call


  // --------------------------------------------------------------------------
  // 4. INTERACTIVE PIXEL ART CHAT TERMINAL LOGIC
  // --------------------------------------------------------------------------
  const terminalForm = document.getElementById('terminalChatForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalScreen = document.getElementById('terminalScreen');
  const presetChips = document.querySelectorAll('.pixel-chip-btn');

  const addTerminalMessage = (sender, text, type) => {
    if (!terminalScreen) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `terminal-msg ${type}`;
    msgDiv.innerHTML = `
      <span class="msg-sender">[${sender}]:</span>
      <p>${text}</p>
    `;
    terminalScreen.appendChild(msgDiv);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  };

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = terminalInput.value.trim();
      if (!message) return;

      // Append user message
      addTerminalMessage('TRAVELER', message, 'user-msg');
      terminalInput.value = '';

      // Simulated retro bot reply
      setTimeout(() => {
        let reply = "Transmission received! 🚀 I'm currently active and eager to connect. Feel free to also reach me directly at 05mohammerahil@gmail.com!";
        if (message.toLowerCase().includes('job') || message.toLowerCase().includes('hire') || message.toLowerCase().includes('role')) {
          reply = "Thank you for the opportunity! 💼 I am available for Software Engineer roles (Java, Python, Full Stack). Check out my resume in the quest inventory!";
        } else if (message.toLowerCase().includes('project') || message.toLowerCase().includes('collaborate')) {
          reply = "Awesome! ⚔️ I love architecting scalable projects. Drop the specifics in the contact form or send a mail anytime!";
        }
        addTerminalMessage('RAHIL_BOT', reply, 'npc-msg');
      }, 600);
    });
  }

  // Handle Preset Dialogue Chips
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (terminalInput && prompt) {
        terminalInput.value = prompt;
        terminalForm.dispatchEvent(new Event('submit'));
      }
    });
  });


  // --------------------------------------------------------------------------
  // 5. VIDEO INTRODUCTION INTERACTION
  // --------------------------------------------------------------------------
  const heroWatchVideoBtn = document.getElementById('heroWatchVideoBtn');
  const introVideoCard = document.getElementById('intro-video-card');
  const introVideo = document.getElementById('introVideo');

  if (heroWatchVideoBtn && introVideoCard) {
    heroWatchVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      introVideoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      introVideoCard.classList.remove('highlight-pulse');
      // Trigger reflow to restart CSS animation
      void introVideoCard.offsetWidth;
      introVideoCard.classList.add('highlight-pulse');
      setTimeout(() => {
        introVideoCard.classList.remove('highlight-pulse');
      }, 2600);
    });
  }

  // --------------------------------------------------------------------------
  // 6. FOOTER CURRENT YEAR
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
