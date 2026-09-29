/**
 * BharatIntel - Tactical Private Intelligence Engine
 * Client Portal & UI Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Synthesizer (Zero-dependency Web Audio API for tactical micro-cues)
  class TacticalAudio {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.playBeep(880, 0.05, 'sine');
      }
      return this.enabled;
    }

    playBeep(freq = 600, duration = 0.04, type = 'sine') {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio feedback failed', e);
      }
    }

    playConfirm() {
      if (!this.enabled || !this.ctx) return;
      this.playBeep(523.25, 0.08);
      setTimeout(() => this.playBeep(659.25, 0.08), 80);
      setTimeout(() => this.playBeep(783.99, 0.12), 160);
    }
  }

  const audioEngine = new TacticalAudio();

  // Audio Toggle Button Hookup
  const audioToggles = document.querySelectorAll('.tactical-audio-toggle');
  audioToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isEnabled = audioEngine.toggle();
      audioToggles.forEach(b => {
        if (isEnabled) {
          b.classList.add('active');
          b.innerHTML = `<span class="live-pulse-gold inline-block"></span> <i class="fas fa-volume-high text-gold-400"></i> <span>HUD AUDIO: <strong class="text-gold-400">ON</strong></span>`;
        } else {
          b.classList.remove('active');
          b.innerHTML = `<i class="fas fa-volume-xmark text-gray-400"></i> <span>HUD AUDIO: <strong>OFF</strong></span>`;
        }
      });
    });
  });

  // Attach subtle click cue to buttons and cards
  document.querySelectorAll('button, a, .hover-lift-gold, .faq-header').forEach(el => {
    el.addEventListener('mouseenter', () => audioEngine.playBeep(1200, 0.02));
    el.addEventListener('click', () => audioEngine.playBeep(700, 0.04));
  });

  // 2. High-Tech Splash Screen / Loader Fadeout (1.2s Duration)
  const splashScreen = document.getElementById('splash-screen');
  const splashStatus = document.getElementById('splash-status-text');
  
  if (splashScreen) {
    const statuses = [
      "INITIALIZING SECURE BHARATINTEL NETWORK...",
      "SYNCING PAN-INDIA OPERATIONAL COMMAND...",
      "AUTHENTICATING BENGALURU HQ & REGIONAL NODES...",
      "SECURITY PROTOCOLS VERIFIED. CLEARANCE GRANTED."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (splashStatus && statuses[step]) {
        splashStatus.textContent = statuses[step];
        audioEngine.playBeep(900 + step * 100, 0.03);
      }
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        splashScreen.remove();
      }, 600);
    }, 1250);
  }

  // 3. Live Tactical Clock (IST / Nashik Tactical Command)
  function updateLiveClock() {
    const timeElements = document.querySelectorAll('.live-tactical-time');
    const now = new Date();
    
    // Formatting IST string
    const options = { 
      timeZone: 'Asia/Kolkata', 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    const timeString = new Intl.DateTimeFormat('en-IN', options).format(now);
    
    timeElements.forEach(el => {
      el.textContent = `${timeString} IST [HQ: BENGALURU // NASHIK OPS]`;
    });
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // 4. Case ID Generator Helper
  function generateCaseCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const char = chars.charAt(Math.floor(Math.random() * chars.length));
    return `BE-NX-${char}${randomNum}`;
  }

  // Populate any tracking code placeholders
  const generatedCodeEls = document.querySelectorAll('.auto-generated-case-code');
  generatedCodeEls.forEach(el => {
    el.textContent = generateCaseCode();
  });

  // 5. Mobile Navigation Drawer
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.remove('hidden');
      setTimeout(() => {
        mobileMenuDrawer.classList.remove('opacity-0', 'translate-x-full');
      }, 10);
      document.body.style.overflow = 'hidden';
      audioEngine.playBeep(800, 0.05);
    }
  }

  function closeMobileMenu() {
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        mobileMenuDrawer.classList.add('hidden');
      }, 300);
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 6. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          audioEngine.playBeep(950, 0.04);
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // 7. Interactive Service Dossier Modal System
  const serviceDossiers = {
    'pre-matrimonial': {
      title: 'Pre-Matrimonial Intelligence & Character Due Diligence',
      code: 'PROTOCOL-NX-PM1',
      classification: 'HIGH DISCRETION // LEVEL 3 CLEARANCE',
      description: 'Comprehensive, covert verification of prospective alliance profiles across Nashik, Mumbai, Pune, and overseas. We uncover verified facts regarding financial net worth, employment authenticity, hidden marital records, personal habits, social reputation, and family lineage without alerting the subject.',
      deliverables: [
        'Complete Financial Net-Worth & Property Cross-Verification',
        'Employment, Educational Credentials & Direct Director Roles Check',
        'Prior Marital Status, Civil Litigation & Police Background Audit',
        'Social Footprint, Lifestyle Patterns & Habit Surveillance',
        'Family Background & Market Reputation Triangulation'
      ],
      turnaround: '3 to 7 Operational Business Days',
      equipment: 'Covert Telephoto Optical Kits, Deep-OSINT Aggregators, Field HUMINT Handlers'
    },
    'post-matrimonial': {
      title: 'Post-Matrimonial Surveillance & Infidelity Forensics',
      code: 'PROTOCOL-NX-PM2',
      classification: 'STRICT CONFIDENTIAL // SECTION 65B READY',
      description: 'Zero-leak physical tracking and electronic surveillance conducted by seasoned field operatives. Provides time-stamped, high-resolution photographic and video documentation of movements, unrevealed meetings, and secret relationships, compliant with Section 65B of the Indian Evidence Act for family court admissibility.',
      deliverables: [
        'Time-stamped 4K Optical & Low-Light Night-Vision Video Logs',
        'Detailed Chronological Minute-by-Minute Activity Timeline',
        'Identification of Third Parties, Contact Points & Secret Locations',
        'Social Media & Digital Alias Link Analysis',
        'Court-Admissible Section 65B Certified Evidentiary Dossier'
      ],
      turnaround: '4 to 10 Field Days (Active Staking)',
      equipment: 'Tactical Covert Vehicles, 4K Optical Telephoto Recorders, Micro-Optical Modules'
    },
    'corporate-due-diligence': {
      title: 'Corporate Due Diligence & Executive Vetting',
      code: 'PROTOCOL-NX-CD1',
      classification: 'ENTERPRISE INTEL // C-SUITE RISK AUDIT',
      description: 'Critical business intelligence for corporations, manufacturing units in Ambad/Satpur MIDC Nashik, Pune IT corridors, and Mumbai venture funds. Protect investments, audit prospective CXOs, uncover concealed shell entities, and verify supplier integrity prior to mergers or joint ventures.',
      deliverables: [
        'Concealed Beneficial Ownership & Shell Company Mapping',
        'Litigation, Debt Default (NCLT/DRT) & Regulatory Compliance Search',
        'C-Suite & Key Management Personnel Integrity & Past Track Record',
        'Supply Chain & Competitor Collusion Threat Assessment',
        'Forensic Asset Verification of Industrial Plants & Inventory'
      ],
      turnaround: '5 to 12 Business Days',
      equipment: 'MCA Data Parsers, Global Sanctions & Politically Exposed Persons (PEP) Scanners, HUMINT Enquiries'
    },
    'asset-tracing': {
      title: 'High-Value Asset Tracing & Financial Fraud Detection',
      code: 'PROTOCOL-NX-AT1',
      classification: 'FINANCIAL FORENSICS // DRT & COURT ENFORCEMENT',
      description: 'Specialized financial intelligence to trace hidden, siphoned, or benami real estate, undeclared corporate holdings, luxury vehicles, and bank accounts across Maharashtra and international jurisdictions for debt recovery, divorce settlements, and commercial arbitration.',
      deliverables: [
        'Identification of Benami & Indirectly Controlled Real Estate Titles',
        'Corporate Shareholdings, Director Ships & Offshore Entities',
        'Movable Asset Identification (High-End Vehicles, Heavy Machinery)',
        'Comprehensive Financial Net-Worth Dossier with Documentary Proof',
        'Admissible Summary for Enforcement Decrees & Recovery Tribunals'
      ],
      turnaround: '7 to 14 Business Days',
      equipment: 'Land Registry Crawlers, Sub-Registrar Database Verifications, Financial Node Graphs'
    },
    'cyber-forensics': {
      title: 'Cyber Forensics, Digital OSINT & Extortion Mitigation',
      code: 'PROTOCOL-NX-CF1',
      classification: 'CYBER TACTICAL // DIGITAL EVIDENCE UNIT',
      description: 'Advanced digital forensic extraction, electronic harassment tracing, honeytrap/extortion defense, and deep web Open Source Intelligence (OSINT). We trace origins of malicious communications, preserve cryptographic chain-of-custody, and recover critical digital evidence.',
      deliverables: [
        'Deep Web Email & Phone Header Triangulation to Identify Culprits',
        'Blackmail, Extortion & Honeytrap Threat Neutralization Strategies',
        'Cryptographically Signed Digital Evidence Extraction (Hash Verification)',
        'Executive Digital Footprint Sanitization & Dark Web Breach Audit',
        'Section 65B Electronic Evidence Certificate for Legal Action'
      ],
      turnaround: '24 Hours to 5 Business Days',
      equipment: 'EnCase/FTK Forensic Suites, Hardware Write-Blockers, Maltego OSINT Graph Engines'
    },
    'missing-persons': {
      title: 'Missing Persons, Skip Tracing & Geolocation Operations',
      code: 'PROTOCOL-NX-MP1',
      classification: 'RAPID DEPLOYMENT // SEARCH & RECON',
      description: 'Time-critical tracing of missing family members, runaway teens, absconding loan defaulters, and critical legal witnesses across Nashik, Maharashtra, and pan-India transit corridors using cell-tower OSINT, transport hubs, and local informant networks.',
      deliverables: [
        'Real-time Geolocation Lead Triangulation & Route Tracking',
        'Field Reconnaissance across Bus Terminals, Railway Hubs & Lodges',
        'Digital Alias & Recent Communication Intercept Reconstruction',
        'Coordination with Local Authorities when requested by Client',
        'Safe Location Handover & Identity Confirmation Report'
      ],
      turnaround: 'Immediate Tactical Launch (< 4 Hours)',
      equipment: 'Regional Informant Networks, OSINT Geolocation Scraping, Field Mobile Recon Squads'
    },
    'loyalty-test': {
      title: 'Loyalty Test & Integrity Verification Investigation',
      code: 'PROTOCOL-NX-LT1',
      classification: 'HIGH SENSITIVITY // PERSONAL ASSIGNMENT',
      description: 'Discreet, controlled psychological and behavioral integrity testing to assess fidelity, trust, and external inducements for engaged couples or married partners.',
      deliverables: [
        'Controlled Decoy / Social Interaction Integrity Testing',
        'Physical Movement & Secret Digital Communication Verification',
        'Audio-Visual Evidence Logs Stamped with Timestamp Metadata',
        'Certified Section 65B Integrity Dossier Handover'
      ],
      turnaround: '3 to 6 Operational Days',
      equipment: 'Covert Field Operatives, Digital Communication Analyzers'
    },
    'divorce-case': {
      title: 'Divorce Case Investigation & Custody/Alimony Evidence',
      code: 'PROTOCOL-NX-DC1',
      classification: 'JUDICIAL EVIDENCE // FAMILY COURT ADMISSIBLE',
      description: 'Court-admissible evidentiary support for divorce, maintenance disputes, child custody, and cruelty/infidelity allegations certified under Section 65B of the Indian Evidence Act.',
      deliverables: [
        'Adultery & Dual Relationship Evidentiary Video/Photographic Proof',
        'Concealed Income, Employment & Business Revenue Discovery',
        'Child Custody Fitness & Habit Surveillance Logs',
        'Section 65B Legal Certificate and Senior Investigator Affidavit'
      ],
      turnaround: '5 to 12 Field Days',
      equipment: '4K Covert Telephoto Cameras, GPS Trackers, Forensic Accounting Suits'
    },
    'surveillance': {
      title: 'Day-to-Day Surveillance & Evidence Collection',
      code: 'PROTOCOL-NX-SUR1',
      classification: 'PHYSICAL RECON // 24/7 FIELD SQUAD',
      description: 'Round-the-clock covert physical observation and transit tailing of subjects across city streets, hotels, workplaces, and inter-city highways with zero detection.',
      deliverables: [
        'Minute-by-Minute Activity Timeline Logs',
        '4K Day & Night Ultra-Low Light Video Documentation',
        'Mapping of Interacted Persons, Vehicles, and Destinations',
        'Real-Time Tactical Dispatches to Case Handler'
      ],
      turnaround: '24 Hours to Ongoing Mobilization',
      equipment: 'Tactical Recon Vehicles, Long-Range Telephoto Optics, Covert Micro-Lenses'
    },
    'other': {
      title: 'Custom & Specialized Covert Intelligence Operation',
      code: 'PROTOCOL-NX-SPEC9',
      classification: 'CUSTOM TACTICAL // DIRECT HANDLER ASSIGNMENT',
      description: 'Bespoke covert intelligence, surveillance, asset recovery, or legal fact-finding tailored to unique personal, legal, or commercial requirements. Operatives and technical assets are assembled according to specific threat profiles across Karnataka, Maharashtra, and pan-India.',
      deliverables: [
        'Dedicated Senior Handler Consultation & Customized Operational Blueprint',
        'Multi-Disciplinary Operative Squad (Field HUMINT + Cyber OSINT)',
        'Daily Encrypted Telemetry & Progress Debriefs',
        'Section 65B Certified Final Evidentiary Package',
        'Strict Compartmented Non-Disclosure & Automatic Server Purge'
      ],
      turnaround: 'Customized Deployment (< 12 Hours Mobilization)',
      equipment: 'Tailored Tactical Gear, Covert Audio/Video Arrays, Forensic Hardware'
    }
  };

  const dossierModal = document.getElementById('service-dossier-modal');
  const dossierClose = document.getElementById('dossier-modal-close');
  const dossierBtns = document.querySelectorAll('.open-dossier-btn');

  function openDossier(serviceKey) {
    const data = serviceDossiers[serviceKey];
    if (!data || !dossierModal) return;

    document.getElementById('modal-dossier-title').textContent = data.title;
    document.getElementById('modal-dossier-code').textContent = data.code;
    document.getElementById('modal-dossier-classification').textContent = data.classification;
    document.getElementById('modal-dossier-desc').textContent = data.description;
    document.getElementById('modal-dossier-turnaround').textContent = data.turnaround;
    document.getElementById('modal-dossier-equipment').textContent = data.equipment;

    const deliverablesList = document.getElementById('modal-dossier-deliverables');
    deliverablesList.innerHTML = '';
    data.deliverables.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2 text-sm text-gray-300';
      li.innerHTML = `<i class="fas fa-shield-alt text-gold-400 mt-1 flex-shrink-0"></i> <span>${item}</span>`;
      deliverablesList.appendChild(li);
    });

    // Set Intake CTA link to scroll to form with service preselected
    const bookBtn = document.getElementById('modal-dossier-book-btn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        closeDossier();
        const serviceSelect = document.getElementById('intake-service');
        if (serviceSelect) {
          serviceSelect.value = serviceKey;
        }
        const intakeSec = document.getElementById('secure-intake');
        if (intakeSec) {
          intakeSec.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    dossierModal.classList.remove('hidden');
    setTimeout(() => {
      dossierModal.classList.add('modal-open');
    }, 10);
    document.body.style.overflow = 'hidden';
    audioEngine.playConfirm();
  }

  function closeDossier() {
    if (dossierModal) {
      dossierModal.classList.remove('modal-open');
      setTimeout(() => {
        dossierModal.classList.add('hidden');
      }, 300);
      document.body.style.overflow = '';
    }
  }

  dossierBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      openDossier(serviceKey);
    });
  });

  if (dossierClose) dossierClose.addEventListener('click', closeDossier);
  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) closeDossier();
    });
  }

  // 8. Secure Intake Form Handler with AJAX Web3Forms Dispatch & WhatsApp Integration
  const intakeForm = document.getElementById('secure-intake-form');
  const intakeConfirmationModal = document.getElementById('intake-confirmation-modal');
  const intakeConfClose = document.getElementById('intake-conf-close');
  const intakeSubmitBtn = document.getElementById('intake-submit-btn');
  const formStatusAlert = document.getElementById('form-status-alert');

  if (intakeForm) {
    intakeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const trackingCode = generateCaseCode();
      const alias = (document.getElementById('intake-alias')?.value || '').trim() || 'Confidential Client';
      const phone = (document.getElementById('intake-phone')?.value || '').trim() || 'Not Disclosed (Direct Signal)';
      const email = (document.getElementById('intake-email')?.value || '').trim() || 'Not Provided';
      const service = document.getElementById('intake-service')?.value || 'General Inquiry';
      const jurisdiction = document.getElementById('intake-jurisdiction')?.value || 'Maharashtra';
      const urgency = document.getElementById('intake-urgency')?.value || 'Standard';
      const details = (document.getElementById('intake-brief')?.value || '').trim() || 'No detailed brief submitted.';

      // Button loading state
      if (intakeSubmitBtn) {
        intakeSubmitBtn.disabled = true;
        intakeSubmitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        const btnText = intakeSubmitBtn.querySelector('#btn-text');
        const btnLoader = intakeSubmitBtn.querySelector('#btn-loader');
        if (btnText && btnLoader) {
          btnText.classList.add('hidden');
          btnLoader.classList.remove('hidden');
        }
      }

      // Populate hidden fields if present
      const hiddenCode = document.getElementById('hidden-case-code');
      if (hiddenCode) hiddenCode.value = trackingCode;

      // Construct sanitized WhatsApp Message URL
      const waText = encodeURIComponent(
        `*NEW CASE BRIEFING - BharatIntel*\n` +
        `================================\n` +
        `[CASE CODE] ${trackingCode}\n` +
        `[CLIENT]    ${alias}\n` +
        `[CONTACT]   ${phone}\n` +
        `[SERVICE]   ${service.toUpperCase()}\n` +
        `[LOCATION]  ${jurisdiction}\n` +
        `[URGENCY]   ${urgency}\n` +
        `[BRIEF]     ${details}\n` +
        `================================\n` +
        `*Confidentiality:* Strict NDA // Sec 65B Court-Admissible`
      );
      const waUrl = `https://wa.me/919225348787?text=${waText}`;

      // Prepare AJAX submission to Web3Forms
      const formData = new FormData(intakeForm);
      formData.set('case_code', trackingCode);
      formData.set('timestamp', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
      formData.set('destination_email', 'saathidreamsfoundation@gmail.com');

      const accessKey = formData.get('access_key');
      let submissionSuccess = false;

      // Only attempt remote API POST if key is provided and not the default placeholder
      if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE' && accessKey.length > 10) {
        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          if (result.success) {
            submissionSuccess = true;
            if (formStatusAlert) {
              formStatusAlert.className = 'rounded-xl p-4 text-xs font-mono bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 block mb-4';
              formStatusAlert.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Case File <strong>#${trackingCode}</strong> successfully encrypted and logged under NDA secrecy. An operative has been alerted for priority assessment.`;
            }
          }
        } catch (err) {
          console.warn('[BharatIntel] Web3Forms dispatch fallback:', err);
        }
      }

      if (!submissionSuccess && formStatusAlert) {
        formStatusAlert.className = 'rounded-xl p-4 text-xs font-mono bg-gold-950/70 border border-gold-500/50 text-gold-300 block mb-4';
        formStatusAlert.innerHTML = `<i class="fas fa-shield-alt mr-2"></i> Case File <strong>#${trackingCode}</strong> logged under strict NDA secrecy. Click 'Dispatch via WhatsApp' below for instant direct priority dispatch to our operations desk.`;
      }

      // Reset submit button state
      if (intakeSubmitBtn) {
        intakeSubmitBtn.disabled = false;
        intakeSubmitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        const btnText = intakeSubmitBtn.querySelector('#btn-text');
        const btnLoader = intakeSubmitBtn.querySelector('#btn-loader');
        if (btnText && btnLoader) {
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
        }
      }

      // Update and display Confirmation Modal
      if (intakeConfirmationModal) {
        const cCode = document.getElementById('conf-case-code');
        const cAlias = document.getElementById('conf-alias');
        const cService = document.getElementById('conf-service');
        const cUrgency = document.getElementById('conf-urgency');
        if (cCode) cCode.textContent = trackingCode;
        if (cAlias) cAlias.textContent = alias;
        if (cService) cService.textContent = service;
        if (cUrgency) cUrgency.textContent = urgency;
        
        const waDispatchBtn = document.getElementById('conf-wa-dispatch-btn');
        if (waDispatchBtn) {
          waDispatchBtn.href = waUrl;
        }

        intakeConfirmationModal.classList.remove('hidden');
        setTimeout(() => {
          intakeConfirmationModal.classList.add('modal-open');
        }, 10);
        document.body.style.overflow = 'hidden';
      }

      audioEngine.playConfirm();
      intakeForm.reset();
    });
  }

  if (intakeConfClose) {
    intakeConfClose.addEventListener('click', () => {
      if (intakeConfirmationModal) {
        intakeConfirmationModal.classList.remove('modal-open');
        setTimeout(() => {
          intakeConfirmationModal.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
      }
    });
  }

  // 9. Animated Counter on Viewport Scroll
  const statElements = document.querySelectorAll('.counter-stat');
  let statsCounted = false;

  function runCounterAnimation() {
    if (statsCounted) return;
    const statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) {
      statsCounted = true;
      statElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(start + (target - start) * easeOut);

          el.textContent = currentVal.toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');
          }
        }
        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', runCounterAnimation);
  runCounterAnimation(); // Trigger check on load

  // 10. Smooth Navbar Background Transition on Scroll
  const mainNav = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (mainNav) {
      if (window.scrollY > 40) {
        mainNav.classList.add('bg-opacity-95', 'shadow-2xl', 'backdrop-blur-xl', 'border-b', 'border-amber-500/20');
      } else {
        mainNav.classList.remove('bg-opacity-95', 'shadow-2xl', 'backdrop-blur-xl', 'border-amber-500/20');
      }
    }
  });

  // 11. Quick Copy Tracking Code helper
  document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = document.getElementById('conf-case-code')?.textContent || '';
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = `<i class="fas fa-check text-green-400"></i> Copied to Clipboard`;
          setTimeout(() => {
            btn.innerHTML = orig;
          }, 2000);
        });
      }
    });
  });
});


