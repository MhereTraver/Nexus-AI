/**
 * NEXUS AI — Modern Interactive Platform Script
 * Features: Ambient Particle Canvas, Dynamic Spotlight, Theme Switcher,
 * Animated Metrics, Hero Console Simulation, Sandbox Playground, and Modals.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Ambient Particle Constellation Canvas
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;
    let mouse = { x: null, y: null };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse attraction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x += dx * 0.015;
            this.y += dy * 0.015;
          }
        }
      }
      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.25)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isDark);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / maxDistance) * (isDark ? 0.16 : 0.08);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // =========================================================================
  // 2. Dynamic Spotlight Reaction on Cards
  // =========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // =========================================================================
  // 3. Modern Dark/Light Theme Switching (Aligned with Best Practices)
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (colorSchemeMeta) {
      colorSchemeMeta.setAttribute('content', theme);
    }
    localStorage.setItem('nexus_theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen to OS system color-scheme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('nexus_theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // =========================================================================
  // 4. Sticky Header on Scroll
  // =========================================================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Close mobile menu on clicking any link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // =========================================================================
  // 5. Animated Metric Counters (IntersectionObserver)
  // =========================================================================
  const statElements = document.querySelectorAll('.stat-value');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.hero-stats-grid');
  if (statsContainer) statsObserver.observe(statsContainer);

  function animateCounters() {
    statElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        if (isDecimal) {
          el.textContent = `${prefix}${currentVal.toFixed(target > 10 ? 1 : 2)}${suffix}`;
        } else {
          el.textContent = `${prefix}${Math.round(currentVal)}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  // =========================================================================
  // 6. Hero Console Tabs & Interactive Event Stream
  // =========================================================================
  const consoleTabs = document.querySelectorAll('.console-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  consoleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      consoleTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(pane => pane.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(targetTab)?.classList.add('active');
    });
  });

  // Simulated Live Log Stream
  const feedLogsContainer = document.getElementById('hero-feed-logs');
  const simRunBtn = document.getElementById('sim-run-btn');
  const simClearBtn = document.getElementById('sim-clear-btn');

  const logEvents = [
    { agent: 'Architect-01', action: 'Constructing AST dependency graph for target monorepo...', tag: 'OK' },
    { agent: 'Security-Lead', action: 'Validating cryptographic zero-trust bounds for microservices', tag: 'PASSED' },
    { agent: 'Synthesizer', action: 'Synthesizing connection resilience patch for Redis pipeline', tag: 'COMPILED' },
    { agent: 'Chaos-Monkey', action: 'Executing 48 partitioned network latency simulation cycles', tag: '0 REGRESSIONS' },
    { agent: 'Consensus-Core', action: 'Cluster quorum 5/5 validated. Preparing zero-downtime deployment...', tag: 'READY' },
    { agent: 'Deploy-Mesh', action: 'Staging blue/green rollout across 35 edge regions worldwide', tag: '100% HEALTHY' }
  ];

  let logIndex = 0;
  let logInterval = null;

  function addLogEntry(item) {
    if (!feedLogsContainer) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;

    const entry = document.createElement('div');
    entry.className = 'feed-log-entry';
    entry.innerHTML = `
      <span class="log-time">[${timeStr}]</span>
      <span class="log-agent">[${item.agent}]</span>
      <span class="log-action">${item.action}</span>
      <span class="log-success">✓ ${item.tag}</span>
    `;

    feedLogsContainer.appendChild(entry);
    feedLogsContainer.scrollTop = feedLogsContainer.scrollHeight;

    // Keep log max length bounded
    if (feedLogsContainer.children.length > 5) {
      feedLogsContainer.removeChild(feedLogsContainer.firstElementChild);
    }
  }

  function startLogStream() {
    if (logInterval) clearInterval(logInterval);
    logInterval = setInterval(() => {
      const item = logEvents[logIndex % logEvents.length];
      addLogEntry(item);
      logIndex++;
    }, 2200);
  }

  // Prepopulate with 3 items
  if (feedLogsContainer) {
    feedLogsContainer.innerHTML = '';
    addLogEntry(logEvents[0]);
    setTimeout(() => addLogEntry(logEvents[1]), 500);
    setTimeout(() => addLogEntry(logEvents[2]), 1100);
    startLogStream();
  }

  simRunBtn?.addEventListener('click', () => {
    addLogEntry({ agent: 'User-Trigger', action: 'Manual loop re-triggered. Running full swarm cycle...', tag: 'STARTED' });
    startLogStream();
  });

  simClearBtn?.addEventListener('click', () => {
    if (feedLogsContainer) feedLogsContainer.innerHTML = '';
  });

  // =========================================================================
  // 7. Interactive Playground Sandbox
  // =========================================================================
  const presetButtons = document.querySelectorAll('.preset-btn');
  const promptInput = document.getElementById('playground-prompt-input');
  const runPlaygroundBtn = document.getElementById('run-playground-btn');
  const playgroundBtnText = document.getElementById('playground-btn-text');
  const playgroundSpinner = document.getElementById('playground-spinner');
  const codeDisplay = document.getElementById('playground-code-display');
  const outputFilename = document.getElementById('output-filename');
  const executionTimeline = document.getElementById('execution-timeline');
  const copyCodeBtn = document.getElementById('copy-code-btn');

  const presetsData = {
    cache: {
      prompt: "Architect and implement a resilient Redis cache layer with automated TTL decay and fallback.",
      filename: "redis_resilient_cache.ts",
      steps: [
        { title: "Analyze Codebase Topology", desc: "Scanned 148 source files, identified hot Redis cache invalidation bottlenecks." },
        { title: "Author Fault-Tolerant Implementation", desc: "Generated connection pooling with circuit-breaker fallbacks and cluster sharding." },
        { title: "Synthesize Unit & Chaos Tests", desc: "Executed 32 simulated network partition tests. 0 memory leaks discovered." }
      ],
      code: `<span class="tok-kw">export</span> <span class="tok-class">class</span> <span class="tok-type">ResilientRedisCache</span>&lt;<span class="tok-type">T</span>&gt; {
  <span class="tok-kw">private</span> <span class="tok-prop">client</span>: <span class="tok-type">RedisCluster</span>;
  <span class="tok-kw">private</span> <span class="tok-prop">circuitBreaker</span>: <span class="tok-type">CircuitBreaker</span>;

  <span class="tok-fn">constructor</span>(<span class="tok-prop">config</span>: <span class="tok-type">CacheConfig</span>) {
    <span class="tok-kw">this</span>.<span class="tok-prop">client</span> = <span class="tok-kw">new</span> <span class="tok-type">RedisCluster</span>(<span class="tok-prop">config</span>.<span class="tok-prop">nodes</span>);
    <span class="tok-kw">this</span>.<span class="tok-prop">circuitBreaker</span> = <span class="tok-kw">new</span> <span class="tok-type">CircuitBreaker</span>({
      <span class="tok-prop">failureThreshold</span>: <span class="tok-num">3</span>,
      <span class="tok-prop">resetTimeoutMs</span>: <span class="tok-num">5000</span>
    });
  }

  <span class="tok-kw">async</span> <span class="tok-fn">getOrSet</span>(<span class="tok-prop">key</span>: <span class="tok-type">string</span>, <span class="tok-prop">fetcher</span>: () =&gt; <span class="tok-type">Promise</span>&lt;<span class="tok-type">T</span>&gt;, <span class="tok-prop">ttlSeconds</span> = <span class="tok-num">300</span>): <span class="tok-type">Promise</span>&lt;<span class="tok-type">T</span>&gt; {
    <span class="tok-kw">if</span> (!<span class="tok-kw">this</span>.<span class="tok-prop">circuitBreaker</span>.<span class="tok-fn">isOpen</span>()) {
      <span class="tok-kw">const</span> <span class="tok-var">cached</span> = <span class="tok-kw">await</span> <span class="tok-kw">this</span>.<span class="tok-prop">client</span>.<span class="tok-fn">get</span>(<span class="tok-prop">key</span>);
      <span class="tok-kw">if</span> (<span class="tok-var">cached</span>) <span class="tok-kw">return</span> <span class="tok-type">JSON</span>.<span class="tok-fn">parse</span>(<span class="tok-var">cached</span>);
    }
    
    <span class="tok-comment">// Fallback seamlessly to upstream source</span>
    <span class="tok-kw">const</span> <span class="tok-var">fresh</span> = <span class="tok-kw">await</span> <span class="tok-fn">fetcher</span>();
    <span class="tok-kw">this</span>.<span class="tok-prop">client</span>.<span class="tok-fn">setex</span>(<span class="tok-prop">key</span>, <span class="tok-prop">ttlSeconds</span>, <span class="tok-type">JSON</span>.<span class="tok-fn">stringify</span>(<span class="tok-var">fresh</span>)).<span class="tok-fn">catch</span>(<span class="tok-var">console</span>.<span class="tok-prop">error</span>);
    <span class="tok-kw">return</span> <span class="tok-var">fresh</span>;
  }
}`
    },
    refactor: {
      prompt: "Decompose legacy monolithic orders service into an asynchronous event-driven publisher.",
      filename: "orders_event_stream.ts",
      steps: [
        { title: "Extract Domain Bounded Contexts", desc: "Isolated OrderCreated, PaymentProcessed, and InventoryReserved events." },
        { title: "Inject Outbox Pattern & Kafka Producer", desc: "Guaranteed at-least-once delivery with PostgreSQL ACID outbox table." },
        { title: "Generate Migration Plan & Replay Specs", desc: "Produced zero-downtime shadow pipeline for dual-write parity testing." }
      ],
      code: `<span class="tok-kw">export</span> <span class="tok-class">class</span> <span class="tok-type">OrderEventPublisher</span> {
  <span class="tok-kw">constructor</span>(
    <span class="tok-kw">private</span> <span class="tok-prop">outboxRepo</span>: <span class="tok-type">OutboxRepository</span>,
    <span class="tok-kw">private</span> <span class="tok-prop">eventBus</span>: <span class="tok-type">KafkaProducer</span>
  ) {}

  <span class="tok-kw">async</span> <span class="tok-fn">publishOrderPlaced</span>(<span class="tok-prop">order</span>: <span class="tok-type">OrderAggregate</span>): <span class="tok-type">Promise</span>&lt;<span class="tok-type">void</span>&gt; {
    <span class="tok-kw">const</span> <span class="tok-var">eventPayload</span> = {
      <span class="tok-prop">eventId</span>: <span class="tok-type">crypto</span>.<span class="tok-fn">randomUUID</span>(),
      <span class="tok-prop">eventType</span>: <span class="tok-str">'order.placed.v2'</span>,
      <span class="tok-prop">timestamp</span>: <span class="tok-kw">new</span> <span class="tok-type">Date</span>().<span class="tok-fn">toISOString</span>(),
      <span class="tok-prop">data</span>: <span class="tok-var">order</span>.<span class="tok-fn">toDTO</span>()
    };

    <span class="tok-comment">// Atomic transactional outbox write</span>
    <span class="tok-kw">await</span> <span class="tok-kw">this</span>.<span class="tok-prop">outboxRepo</span>.<span class="tok-fn">stageEvent</span>(<span class="tok-var">eventPayload</span>);
    <span class="tok-kw">await</span> <span class="tok-kw">this</span>.<span class="tok-prop">eventBus</span>.<span class="tok-fn">emit</span>(<span class="tok-str">'orders.topic'</span>, <span class="tok-var">eventPayload</span>);
  }
}`
    },
    security: {
      prompt: "Harden authentication repository against timing attacks and enforce parameterized queries.",
      filename: "secure_auth_vault.ts",
      steps: [
        { title: "Static AST Vulnerability Audit", desc: "Detected 2 string-interpolated SQL statements and non-constant-time hash comparisons." },
        { title: "Implement Constant-Time Timing Defense", desc: "Adopted crypto.timingSafeEqual and strict typed parameterized bindings." },
        { title: "Verify with Automated Penetration Tests", desc: "Ran 10,000 statistical timing probes. Difference fell beneath measurement noise floor (<0.02ms)." }
      ],
      code: `<span class="tok-kw">import</span> { <span class="tok-prop">timingSafeEqual</span> } <span class="tok-kw">from</span> <span class="tok-str">'node:crypto'</span>;

<span class="tok-kw">export</span> <span class="tok-class">class</span> <span class="tok-type">SecureAuthService</span> {
  <span class="tok-kw">async</span> <span class="tok-fn">verifyApiKey</span>(<span class="tok-prop">providedKey</span>: <span class="tok-type">string</span>, <span class="tok-prop">storedHash</span>: <span class="tok-type">string</span>): <span class="tok-type">Promise</span>&lt;<span class="tok-type">boolean</span>&gt; {
    <span class="tok-kw">const</span> <span class="tok-var">targetBuf</span> = <span class="tok-type">Buffer</span>.<span class="tok-fn">from</span>(<span class="tok-prop">storedHash</span>, <span class="tok-str">'hex'</span>);
    <span class="tok-kw">const</span> <span class="tok-var">testBuf</span> = <span class="tok-type">Buffer</span>.<span class="tok-fn">from</span>(<span class="tok-kw">await</span> <span class="tok-kw">this</span>.<span class="tok-fn">hashKey</span>(<span class="tok-prop">providedKey</span>), <span class="tok-str">'hex'</span>);

    <span class="tok-kw">if</span> (<span class="tok-var">targetBuf</span>.<span class="tok-prop">length</span> !== <span class="tok-var">testBuf</span>.<span class="tok-prop">length</span>) {
      <span class="tok-kw">return</span> <span class="tok-bool">false</span>;
    }

    <span class="tok-comment">// Defend against statistical side-channel timing analysis</span>
    <span class="tok-kw">return</span> <span class="tok-fn">timingSafeEqual</span>(<span class="tok-var">targetBuf</span>, <span class="tok-var">testBuf</span>);
  }
}`
    }
  };

  function updatePlayground(presetKey) {
    const data = presetsData[presetKey];
    if (!data) return;

    if (promptInput) promptInput.value = data.prompt;
    if (outputFilename) outputFilename.textContent = data.filename;
    if (codeDisplay) codeDisplay.innerHTML = data.code;

    if (executionTimeline) {
      executionTimeline.innerHTML = data.steps.map(step => `
        <div class="timeline-item done">
          <div class="timeline-dot">✓</div>
          <div class="timeline-content">
            <h4>${step.title}</h4>
            <p>${step.desc}</p>
          </div>
        </div>
      `).join('');
    }
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.getAttribute('data-preset');
      updatePlayground(presetKey);
    });
  });

  runPlaygroundBtn?.addEventListener('click', () => {
    if (playgroundBtnText && playgroundSpinner) {
      playgroundBtnText.textContent = "Swarm Synthesizing...";
      playgroundSpinner.style.display = "inline-block";
      runPlaygroundBtn.disabled = true;

      setTimeout(() => {
        playgroundBtnText.textContent = "Execute Task";
        playgroundSpinner.style.display = "none";
        runPlaygroundBtn.disabled = false;
        
        // Show success highlight on code window
        const colCode = document.querySelector('.split-col-code');
        if (colCode) {
          colCode.style.boxShadow = "0 0 25px rgba(16, 185, 129, 0.4)";
          setTimeout(() => colCode.style.boxShadow = "", 1500);
        }
      }, 1200);
    }
  });

  // Copy code helper
  copyCodeBtn?.addEventListener('click', () => {
    const textToCopy = codeDisplay?.innerText || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      const copySpan = copyCodeBtn.querySelector('span');
      if (copySpan) {
        copySpan.textContent = "Copied!";
        setTimeout(() => copySpan.textContent = "Copy", 2000);
      }
    });
  });

  // =========================================================================
  // 8. Annual vs Monthly Pricing Billing Switcher
  // =========================================================================
  const billingToggle = document.getElementById('billing-toggle');
  const proPrice = document.getElementById('pro-price');
  const entPrice = document.getElementById('ent-price');

  if (billingToggle && proPrice && entPrice) {
    billingToggle.addEventListener('click', () => {
      const isAnnual = billingToggle.getAttribute('aria-checked') === 'true';
      const newState = !isAnnual;

      billingToggle.setAttribute('aria-checked', String(newState));

      if (newState) {
        // Annual prices (discounted)
        proPrice.textContent = proPrice.getAttribute('data-annual');
        entPrice.textContent = entPrice.getAttribute('data-annual');
      } else {
        // Monthly prices
        proPrice.textContent = proPrice.getAttribute('data-monthly');
        entPrice.textContent = entPrice.getAttribute('data-monthly');
      }
    });
  }

  // =========================================================================
  // 9. Interactive Dialog Modal
  // =========================================================================
  const demoModal = document.getElementById('demo-modal');
  const triggerDemoBtn = document.getElementById('trigger-demo-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (demoModal && triggerDemoBtn && closeModalBtn) {
    triggerDemoBtn.addEventListener('click', () => {
      demoModal.showModal();
    });

    closeModalBtn.addEventListener('click', () => {
      demoModal.close();
    });

    demoModal.addEventListener('click', (e) => {
      const rect = demoModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        demoModal.close();
      }
    });
  }

  // =========================================================================
  // 10. Signup Form Interaction & Validation
  // =========================================================================
  const signupForm = document.getElementById('signup-form');
  const signupEmail = document.getElementById('signup-email');
  const formFeedback = document.getElementById('form-feedback');
  const signupBtnText = document.getElementById('signup-btn-text');

  if (signupForm && signupEmail && formFeedback) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = signupEmail.value.trim();

      if (!email || !email.includes('@')) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid work email address.';
        return;
      }

      if (signupBtnText) signupBtnText.textContent = 'Generating Access Token...';

      setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `🚀 Welcome aboard! Your invitation link has been dispatched to ${email}. Check your inbox.`;
        if (signupBtnText) signupBtnText.textContent = 'Token Generated!';
        signupEmail.value = '';

        setTimeout(() => {
          if (signupBtnText) signupBtnText.textContent = 'Get Instant Access';
        }, 4000);
      }, 1000);
    });
  }

});
