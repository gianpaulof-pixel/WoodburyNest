// shared.js — Navigation, Footer, Chat, Scroll animations
// WoodburyNest | woodburynest.com

(function () {
  'use strict';

  /* ---- Inject Google Fonts ---- */
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  /* ---- NAV ---- */
  function renderNav(activePage) {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    nav.innerHTML = `
      <div class="nav-inner">
        <div class="nav-logo-group">
          <a href="/" class="nav-logo" aria-label="WoodburyNest - Home">
            <img src="/images/logo.svg" alt="WoodburyNest" class="nav-logo-svg" loading="eager" />
          </a>
          <img src="/images/kw-logo.png" alt="Keller Williams Premier Realty" class="nav-logo-kw" />
        </div>
        <ul class="nav-links">
          <li><a href="/buyers" ${activePage==='buyers'?'class="active"':''}>Buy</a></li>
          <li><a href="/sellers" ${activePage==='sellers'?'class="active"':''}>Sell</a></li>
          <li><a href="/listings" ${activePage==='listings'?'class="active"':''}>Listings</a></li>
          <li><a href="/market" ${activePage==='market'?'class="active"':''}>Market</a></li>
          <li><a href="/blog" ${activePage==='blog'?'class="active"':''}>Blog</a></li>
          <li><a href="/about" ${activePage==='about'?'class="active"':''}>About</a></li>
        </ul>
        <a href="/contact" class="btn btn-primary btn-sm nav-cta">Get in Touch</a>
        <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="nav-mobile" id="mobile-menu">
        <ul>
          <li><a href="/buyers">Buy</a></li>
          <li><a href="/sellers">Sell</a></li>
          <li><a href="/listings">Listings</a></li>
          <li><a href="/market">Market</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="/contact" class="btn btn-primary">Get in Touch</a>
      </nav>
    `;

    // Scroll class
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) mobileMenu.classList.remove('open');
    });
  }

  /* ---- FOOTER ---- */
  function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="/images/logo.svg" alt="WoodburyNest" style="height:44px;width:auto;max-width:200px;display:block;margin-bottom:12px;filter:brightness(0) invert(1);" />
            <p>Your Twin Cities real estate guide. Serving Woodbury, Minneapolis, Saint&nbsp;Paul, Eagan, Burnsville, Bloomington, Maple Grove, Plymouth, Cottage&nbsp;Grove, Stillwater, and beyond.</p>
            <div class="kw-affiliation">
              <img src="/images/kw-logo.png" alt="Keller Williams Premier Realty" />
              <span>Affiliated with<br>Keller Williams Premier Realty</span>
            </div>
            <div style="display:flex;align-items:center;gap:14px;margin-top:16px;flex-wrap:wrap;">
              <img src="/images/realtor-logo.png" alt="REALTOR®" style="height:38px;width:auto;filter:brightness(0) invert(1);opacity:0.75;" />
              <img src="/images/equal-housing.png" alt="Equal Housing Opportunity" style="height:38px;width:auto;filter:brightness(0) invert(1);opacity:0.75;" />
            </div>
          </div>
          <div class="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a href="/buyers">Buyers</a></li>
              <li><a href="/sellers">Sellers</a></li>
              <li><a href="/listings">Listings</a></li>
              <li><a href="/home-worth">Home Value</a></li>
              <li><a href="/services">Services</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Learn</h4>
            <ul>
              <li><a href="/market">Market Report</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/blog/first-time-buyer-twin-cities">First-Time Buyers</a></li>
              <li><a href="/blog/twin-cities-housing-market-2026">2026 Market</a></li>
              <li><a href="/about">About Gian</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <address>
              <a href="tel:6125201009">(612) 520-1009</a><br>
              <a href="mailto:gian@woodburynest.com">gian@woodburynest.com</a><br><br>
              635 Bielenberg Dr, STE 100<br>
              Woodbury, MN 55125<br><br>
              <a href="https://gianpaulovisciglio.kw.com/" target="_blank" rel="noopener">Browse Listings →</a>
            </address>
          </div>
        </div>
        <div class="footer-bottom">
          <p style="font-size:0.84rem;color:rgba(250,248,243,0.65);font-weight:500;margin-bottom:8px;">Gian &ldquo;G&rdquo; Visciglio, REALTOR® &nbsp;|&nbsp; MN License #41031450 &nbsp;|&nbsp; Keller Williams Premier Realty</p>
          <p>&copy; ${new Date().getFullYear()} WoodburyNest. All rights reserved. &nbsp;|&nbsp; 
            <a href="/contact">Contact</a> &nbsp;|&nbsp; <a href="/about">About</a><br>
            WoodburyNest is operated by Gian &ldquo;G&rdquo; Visciglio (licensed as Gianpaulo Visciglio), REALTOR&reg;, MN License #41031450, affiliated with Keller Williams Premier Realty, 635 Bielenberg Dr STE 100, Woodbury, MN 55125. Equal Housing Opportunity. All information deemed reliable but not guaranteed.
          </p>
        </div>
      </div>
    `;
  }

  /* ---- CHATBOT ---- */
  function renderChat() {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;
    widget.innerHTML = `
      <div id="chat-box" role="dialog" aria-label="Chat with Nest">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🏡</div>
            <div>
              <h4>Nest</h4>
              <p>WoodburyNest Assistant</p>
            </div>
          </div>
          <button class="chat-close" id="chat-close" aria-label="Close chat">✕</button>
        </div>
        <div id="chat-messages"></div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="Ask me anything…" autocomplete="off" maxlength="400" />
          <button class="chat-send" id="chat-send" aria-label="Send">➤</button>
        </div>
      </div>
      <button id="chat-toggle" aria-label="Chat with Nest">🏡</button>
    `;

    const chatBox = document.getElementById('chat-box');
    const toggle = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('chat-close');
    const messagesEl = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    let opened = false;
    const history = [];

    function addMsg(text, role) {
      const div = document.createElement('div');
      div.className = `chat-msg ${role}`;
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'chat-msg bot chat-typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    // Track collected lead info across conversation
    const leadData = { name: null, contact: null, intent: null };
    let leadSaved = false;

    function detectContactInfo(text) {
      // Detect email anywhere in the message
      const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) return { type: 'email', value: emailMatch[0] };
      // Detect phone — exactly 10 digits, strip formatting first
      const stripped = text.replace(/[\s\-().+]/g, '');
      const phoneMatch = stripped.match(/1?(\d{10})(?!\d)/);
      if (phoneMatch && phoneMatch[1].length === 10) return { type: 'phone', value: phoneMatch[1] };
      return null;
    }

    function detectName(text, botHistory) {
      // If bot recently asked for name and user replied with 1-3 words
      const words = text.trim().split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && !text.includes('@') && !/\d{7,}/.test(text)) {
        // Check if the previous bot message asked for their name
        const lastBot = botHistory.filter(m => m.role === 'assistant').slice(-1)[0];
        if (lastBot && /name|call you|who am i/i.test(lastBot.content)) {
          return text.trim();
        }
      }
      return null;
    }

    function detectIntent(historyText) {
      if (/sell|selling|list|listing|what.s my home worth/i.test(historyText)) return 'selling';
      if (/buy|buying|looking for|search|find a home/i.test(historyText)) return 'buying';
      return 'general';
    }

    async function saveChatLead() {
      if (leadSaved || !leadData.contact) return;
      leadSaved = true;
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_lead',
            name: leadData.name || 'Chatbot Visitor',
            contact: leadData.contact,
            intent: leadData.intent || 'general'
          })
        });
        console.log('[Chat] Lead saved:', leadData.name, leadData.contact);
      } catch (e) {
        console.error('[Chat] Lead save failed:', e.message);
      }
    }

    async function sendMessage(text) {
      if (!text.trim()) return;
      addMsg(text, 'user');
      input.value = '';
      history.push({ role: 'user', content: text });

      // Detect contact info in user message
      const contactInfo = detectContactInfo(text);
      if (contactInfo && !leadData.contact) {
        leadData.contact = contactInfo.value;
        leadData.intent = detectIntent(history.map(m => m.content).join(' '));
      }

      // Detect name
      if (!leadData.name) {
        const name = detectName(text, history);
        if (name) leadData.name = name;
      }

      // Save lead as soon as we have contact info
      if (leadData.contact && !leadSaved) {
        saveChatLead();
      }

      const typing = showTyping();
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history })
        });
        const data = await res.json();
        typing.remove();
        const reply = data.reply || "I'm having trouble right now. Please contact G directly at (612) 520-1009.";
        addMsg(reply, 'bot');
        history.push({ role: 'assistant', content: reply });

        // Try to extract name from bot response context after reply
        if (!leadData.name && /nice to meet you|thanks? .{0,20}|great .{0,20}|hi .{1,20}[,!]/i.test(reply)) {
          // Bot may have addressed visitor by name in reply
          const nameInReply = reply.match(/(?:hi|hey|hello|thanks?|great),?\s+([A-Z][a-z]+)/);
          if (nameInReply) leadData.name = nameInReply[1];
        }
      } catch {
        typing.remove();
        addMsg("I'm offline right now. Reach G at (612) 520-1009 or gian@woodburynest.com.", 'bot');
      }
    }

    toggle.addEventListener('click', () => {
      chatBox.classList.toggle('open');
      if (!opened) {
        opened = true;
        addMsg("Hi! I'm Nest 🏡 How can I help you today? I can answer questions about buying, selling, or the Twin Cities market — or connect you with G.", 'bot');
      }
      if (chatBox.classList.contains('open')) input.focus();
    });

    closeBtn.addEventListener('click', () => chatBox.classList.remove('open'));
    sendBtn.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(input.value); });
  }

  /* ---- SCROLL ANIMATIONS ---- */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
  }

  /* ---- FORM HANDLER ---- */
  window.handleFormSubmit = async function(formId, endpoint) {
    const form = document.getElementById(formId);
    if (!form) return;
    const msgEl = form.querySelector('.form-message');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          msgEl.className = 'form-message success';
          msgEl.textContent = result.message || 'Message sent! Gian will be in touch shortly.';
          form.reset();
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        msgEl.className = 'form-message error';
        msgEl.textContent = 'Something went wrong. Please try again or call (612) 520-1009.';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  };

  /* ---- HEAD INJECTION — favicon, OG tags, canonical ---- */
  function injectHead() {
    const head = document.head;
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const url  = 'https://www.woodburynest.com' + path;

    // Favicon — only inject if not already in page
    if (!document.querySelector('link[rel="icon"]')) {
      const ico = document.createElement('link');
      ico.rel = 'icon'; ico.type = 'image/x-icon'; ico.href = '/favicon.ico';
      head.appendChild(ico);

      const png32 = document.createElement('link');
      png32.rel = 'icon'; png32.type = 'image/png';
      png32.setAttribute('sizes', '32x32'); png32.href = '/images/favicon-logo.png';
      head.appendChild(png32);

      const apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      apple.setAttribute('sizes', '180x180'); apple.href = '/images/apple-touch-icon.png';
      head.appendChild(apple);
    }

    // Open Graph tags — only inject if og:image not already set
    if (!document.querySelector('meta[property="og:image"]')) {
      const ogTags = [
        { property: 'og:type',        content: 'website' },
        { property: 'og:site_name',   content: 'WoodburyNest' },
        { property: 'og:url',         content: url },
        { property: 'og:image',       content: 'https://www.woodburynest.com/images/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height',content: '630' },
        { property: 'og:image:alt',   content: 'WoodburyNest — find your nest. | Twin Cities Real Estate' },
        { name: 'twitter:card',       content: 'summary_large_image' },
        { name: 'twitter:image',      content: 'https://www.woodburynest.com/images/og-image.jpg' },
      ];

      // og:title and og:description from existing page tags
      const pageTitle = document.title;
      const pageDesc  = document.querySelector('meta[name="description"]')?.content || '';
      ogTags.push({ property: 'og:title',       content: pageTitle });
      ogTags.push({ property: 'og:description', content: pageDesc });
      ogTags.push({ name: 'twitter:title',       content: pageTitle });
      ogTags.push({ name: 'twitter:description', content: pageDesc });

      ogTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.property) meta.setAttribute('property', tag.property);
        if (tag.name)     meta.setAttribute('name', tag.name);
        meta.content = tag.content;
        head.appendChild(meta);
      });
    }
  }

  /* ---- INIT ---- */
  document.addEventListener('DOMContentLoaded', () => {
    // Determine active page
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const active = path.split('/')[1] || 'home';
    injectHead();
    renderNav(active);
    renderFooter();
    renderChat();
    initScrollAnimations();

    // WebSite schema on homepage only
    if (path === '' || path === '/') {
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "WoodburyNest",
        "alternateName": "WoodburyNest Realty",
        "url": "https://www.woodburynest.com/",
        "description": "Find homes for sale in Woodbury and the Twin Cities with WoodburyNest. Trusted guidance for buyers, sellers, and first-time homeowners.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://gianpaulovisciglio.kw.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      });
      document.head.appendChild(schema);
    }
  });

})();
