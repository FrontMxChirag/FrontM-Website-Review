/* ============================================================
   FrontM, content data (verbatim copy from the brief)
   Centralised so markup stays lean. Exposed on window.FM.
   ============================================================ */
(function () {
  function ico(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }

  var I = {
    connect: '<path d="M5 12a7 7 0 0114 0"/><path d="M8.5 12a3.5 3.5 0 017 0"/><circle cx="12" cy="12" r="1.3"/><path d="M12 13.5V20"/>',
    engage: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/>',
    care: '<path d="M3 12h4l2-6 3 12 2-6h7"/>',
    entertain: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M10 9.2l5 2.8-5 2.8z"/>',
    inform: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    train: '<path d="M12 4l9 4-9 4-9-4z"/><path d="M5.5 10.5V15c0 1.5 2.9 3 6.5 3s6.5-1.5 6.5-3v-4.5"/>',
    maintain: '<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 005.6-5.6l-2.9 2.9-2-2 2.9-2.9Z"/>',
    manage: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 12h6M9 16h4"/>',
    ship: '<path d="M4 15h16l-2 5H6z"/><path d="M12 3v12"/><path d="M12 6l6 3-6 1z"/>',
    shield: '<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    users: '<circle cx="9" cy="9" r="3"/><path d="M3.5 20c0-3 2.7-5 5.5-5s5.5 2 5.5 5"/><path d="M16 7a3 3 0 010 6"/><path d="M20.5 20c0-2.3-1.4-3.9-3.5-4.6"/>',
    api: '<path d="M9 7V3.5M15 7V3.5M8 7h8v3.5a4 4 0 01-8 0z"/><path d="M12 14.5V21"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v3.5M11 11l-4.5 6M13 11l4.5 6"/>',
    ai: '<circle cx="12" cy="12" r="4.2"/><path d="M12 10v4M10 12h4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2"/>',
    lowcode: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/>',
    integrated: '<path d="M10 13a3 3 0 010-4l2-2a3 3 0 014 4l-1 1"/><path d="M14 11a3 3 0 010 4l-2 2a3 3 0 01-4-4l1-1"/>',
    scalable: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/>',
    check: '<path d="M5 12l4 4L19 6"/>'
  };

  window.FM = {
    ico: ico, I: I,

    /* ---- Information architecture (15 Jun 2026) ----
       Top level: Platform · Solutions · Community · Resources · Company
       Learn is no longer a top-level page — it lives as a section inside
       Platform (platform.html#learn). Standalone learn.html now redirects there.
       Plain items navigate (href) or are inert placeholders (no href, no hover menu).
       Solutions and Company open dropdowns. Solutions sub-pages are not built yet —
       their links are placeholders (#) pending the Solutions page (Change Queue item 04). */
    NAV: [
      { label: 'Home',      href: 'index.html' },
      { label: 'Platform',  href: 'platform.html' },
      { label: 'Solutions', menu: { items: [
        ['By Department', 'solutions-by-department.html'],
        ['By Module'],
        ['By Industry', 'solutions-by-industry.html'],
        ['By Plan']
      ] } },
      /* Community: no FrontM page — clicking opens an interstitial that hands off to onship.com */
      { label: 'Community', interstitial: {
        url: 'https://onship.app', host: 'onship.app',
        logo: '/assets/logos/onship/onship-logo-placeholder.png'
      } },
      { label: 'Resources', menu: { items: [
        ['Blog'],        /* page not built yet — inert, pending pages stage */
        ['Newsletter']   /* page not built yet — inert, pending pages stage */
      ] } },
      { label: 'Company', menu: { items: [
        ['About Us',     'about.html'],
        ['Contact Us',   'contact.html'],
        ['We Are Hiring', 'hiring.html'],
        ['Legal',         'legal.html']
      ] } }
    ],

    PILLARS: [
      { name: 'AI-Native', color: '#6B5FD9', icon: I.ai,
        body: 'Built around frontm.ai. Workflows are described, not coded; intelligence runs at the edge for vessel-network bandwidth.',
        checks: ['Edge-resident inference, no shore round-trip required', 'Natural-language workflow authoring', 'Bandwidth-aware sync, VSAT-friendly', 'Continuous learning from live vessel signals'] },
      { name: 'Low-Code', color: '#01B3F6', icon: I.lowcode,
        body: 'Drag triggers, conditions and role-based actions onto a canvas. Deploy across the fleet without writing TypeScript.',
        checks: ['Drag-and-drop trigger / action / condition canvas', 'Role-based routing across crew + shore + partners', 'Pre-built maritime workflow library', 'Version control + audit log on every change'] },
      { name: 'Integrated', color: '#079B33', icon: I.integrated,
        body: 'Identity, permissions, data and audit shared across modules, and out to crewing systems, ERP and partner services.',
        checks: ['Single identity layer across ship + shore', 'Shared permissions, audit and data fabric', 'Open APIs for crewing, ERP, satcom, partners', 'Module-to-module data flow built in'] },
      { name: 'Scalable', color: '#FF6A04', icon: I.scalable,
        body: 'One operating layer, twelve stakeholder roles, 15,000+ vessels. Multi-tenant. Multi-region. Multi-fleet.',
        checks: ['15,000+ vessels live across 40+ flag states', 'Multi-tenant, multi-region deployment', '12 stakeholder roles per workspace', '99% uptime SLA, low-bandwidth optimised'] }
    ],

    MODULES: [
      { id: 'CONNECT', color: '#01B3F6', icon: I.connect, tag: 'Role-based ship-shore comms. Right message, right rank, every time.',
        body: 'Send bulletins to the people who actually need them. Acknowledgement is tracked at the individual level and exported for ISM and ISPS audits in seconds.',
        slides: [['Bulletin sent', 'HSEQ-2026-11 · Mooring update · 42 vessels'], ['Acknowledged', '38/42 · Masters + Bosuns'], ['Audit export', 'Time-stamped trail · Single click']] },
      { id: 'ENGAGE', color: '#6B5FD9', icon: I.engage, tag: 'Internal community. Target by role, prove what was seen.',
        body: 'Run campaigns to chief cooks across 42 vessels without disturbing the captain. Feedback comes back structured, not as forwarded emails.',
        slides: [['Campaign live', 'Healthier Meals · Chief Cooks only'], ['Targeted reach', 'Vessel · Rank · Department'], ['Feedback in', '29 structured responses · Q2 2026']] },
      { id: 'CARE', color: '#18C95C', icon: I.care, tag: 'Telemedicine on video. The doctor sees what the seafarer sees.',
        body: 'Adaptive video on VSAT and Starlink, store-and-forward when bandwidth drops. Mental health, preventive check-ins and chronic care on one channel.',
        slides: [['Session active', 'MV Northern Star · Dr. Patel'], ['Visual assessment', 'Superficial laceration · Onboard care'], ['Deviation avoided', '3 days fuel + charter contract saved']] },
      { id: 'ENTERTAIN', color: '#FF6A04', icon: I.entertain, tag: 'IPTV + on-demand for recreation spaces. Licensed, managed.',
        body: 'Live channels, films and series scheduled from shore. Local caching for limited bandwidth, multi-language tracks, rights-cleared per flag.',
        slides: [['Channels live', '42 vessels · 14 language tracks'], ['On-demand library', 'Refreshed monthly · Rights-cleared'], ['Local cache', 'Plays under 256 kbps · Store-forward']] },
      { id: 'INFORM', color: '#FFC500', icon: I.inform, tag: 'Digital signage to every crew mess. Scheduled from shore.',
        body: 'Push HSEQ campaigns, weather updates and corporate messages to onboard screens. One canonical version, refreshed the moment policy changes.',
        slides: [['Campaign scheduled', 'Mooring procedures · Across 42 vessels'], ['Screens active', 'Crew mess + bridge + galley'], ['Version current', 'Auto-refresh · No stale posters']] },
      { id: 'TRAIN', color: '#3CAD33', icon: I.train, tag: 'Microlearning + cadet content. Engagement you can measure.',
        body: 'Five-minute safety drills, role-specific refreshers, cadet onboarding. Completion + comprehension tracked at the individual level, exportable.',
        slides: [['Module live', 'Mooring safety · 5 min · 14 languages'], ['Completion', '84% across 42 vessels · 7 days'], ['Comprehension', 'Knowledge-check + pass rate']] },
      { id: 'MAINTAIN', color: '#435FE8', icon: I.maintain, soon: true, tag: 'Maintenance + technical coordination. Workflows that travel.',
        body: 'Job cards, inspections and parts orders move with the vessel. Photo + video evidence attached at source, sync when bandwidth allows.',
        slides: [['Job card open', 'Main engine · CMS due in 14 days'], ['Inspection logged', 'Photo evidence · Crew + shore notified'], ['Parts ordered', 'Approved by superintendent · ETA Suez']] },
      { id: 'MANAGE', color: '#404858', icon: I.manage, soon: true, tag: 'Approvals + administration. One identity across the fleet.',
        body: 'Crew change requests, expense approvals, port agency coordination. Routed by role, logged for audit, visible from a single dashboard.',
        slides: [['Approval queue', '8 items · Crew change + port agency'], ['Audit trail', 'Who approved what, when, on which vessel'], ['Dashboard view', 'Fleet-wide rollup · Per-vessel drill-down']] }
    ],

    PATHWAYS: [
      { t: 'Fleet Operators', icon: I.ship, d: 'See vessel status, route comms by rank or department, and track outcomes across your fleet from one dashboard.' },
      { t: 'Technical & HSQE', icon: I.shield, d: 'Publish HSEQ campaigns to onboard screens, see who acknowledged each safety bulletin, and close the gaps that drive audit findings.' },
      { t: 'Crewing & Workforce', icon: I.users, d: 'Run wellness campaigns, collect structured feedback, connect crew to healthcare partners, and build community across distributed teams.' },
      { t: 'Maritime Service Providers', icon: I.api, d: 'Distribute your service to 15,000+ vessels. Use platform identity, permissions and data. Build with the low-code studio or open APIs.' },
      { t: 'Maritime Ecosystem Organisations', icon: I.network, d: 'Reach members across operators, run multi-org safety campaigns, and distribute welfare resources at scale, without rebuilding the channel each time.' }
    ],

    BLOGS: [
      { cat: 'Operations · May 2026', c: '#01B3F6', t: 'Why fleet-wide email is a hidden audit liability.', x: 'Forwarded chains, partial acknowledgements, and the two days a superintendent loses every ISM cycle, and what replaces them.' },
      { cat: 'Crew Welfare · Apr 2026', c: '#079B33', t: 'Telemedicine over VSAT: from coin-flip to clinical call.', x: 'How adaptive video and store-and-forward changed how the on-call doctor decides on deviations.' },
      { cat: 'Workflow Design · Apr 2026', c: '#9A86FF', t: 'Designing maritime workflows in plain language.', x: 'A walkthrough of frontm.ai, how a Tier-1 bulletin becomes a routed, ack-tracked, audit-ready workflow in under a minute.' },
      { cat: 'Compliance · Mar 2026', c: '#FFC500', t: 'What ISM auditors actually want to see.', x: 'Per-recipient acknowledgement trails, time-stamped exports, escalations before port call, the procurement checklist.' },
      { cat: 'Ecosystem · Feb 2026', c: '#FF6A04', t: 'Why the maritime network needs an operating layer.', x: 'From the captain\u2019s bridge to the broker\u2019s desk, what changes when twelve stakeholder groups share one identity model.' }
    ],

    TESTIMONIALS: [
      { q: 'Auditors used to take two days to get answers. Now it\u2019s a single export. The platform paid for itself in one ISM cycle.', who: 'Superintendent, Mid-sized ship manager · 40+ vessels · Northern Europe', m: '\u221288% audit response time' },
      { q: 'We avoided two deviations last quarter because the doctor could see the injury on video. Days of fuel and contract integrity saved.', who: 'Operations Director, Bulk carrier operator · 60+ vessels · Greece / Singapore', m: '2 / qtr deviations avoided' },
      { q: 'We can target only chief cooks across 28 vessels for a wellness campaign, and prove who actually engaged. Captains aren\u2019t disturbed by what isn\u2019t theirs.', who: 'Crewing Manager, Container shipping line · 180+ vessels · Asia\u2013Europe trade', m: '+73% campaign ack rate' }
    ],

    PARTNERS: [
      /* inv:false — artwork is already dark-mode friendly; rendered WITHOUT the invert filter */
      { f: 'maersk.png', n: 'Maersk', h: 46 },
      { f: 'nyk.png', n: 'NYK', h: 34 },
      { f: 'mol.jpg', n: 'MOL Chemical Tankers', h: 32 },
      { f: 'rio-tinto.png', n: 'Rio Tinto', h: 28, inv: false },
      { f: 'pacific-basin.jpg', n: 'Pacific Basin', h: 46 },
      { f: 'asyad-dark.png', n: 'Asyad', h: 28 },
      { f: 'cmb-tech.jpg', n: 'CMB Tech', h: 34 },
      { f: 'cobelfret.jpg', n: 'Cobelfret', h: 36 },
      { f: 'executive-ship-management.png', n: 'Executive Ship Management', h: 32 },
      { f: 'meiji-mms.png', n: 'Meiji Shipping Group', h: 38 },
      { f: 'campbell.jpg', n: 'Campbell', h: 38 },
      { f: 'petredec.svg', n: 'Petredec', h: 26 },
      { f: 'gem.svg', n: 'GEM', h: 48 },
      { f: 'aesm.jpg', n: 'AESM', h: 34, inv: false }
    ]
  };

  /* ============================================================
     7-JUNE REBUILD DATA  (new sections; tokens/colours unchanged)
     ============================================================ */
  var NI = {
    channels:  '<path d="M12 3v5"/><path d="M12 9l-6 6"/><path d="M12 9l6 6"/><circle cx="12" cy="3" r="1.6"/><circle cx="6" cy="17" r="1.8"/><circle cx="18" cy="17" r="1.8"/>',
    manual:    '<path d="M3.5 12a8.5 8.5 0 0114-6.4L20 8"/><path d="M20 3v5h-5"/><path d="M20.5 12a8.5 8.5 0 01-14 6.4L4 16"/><path d="M4 21v-5h5"/>',
    blind:     '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0112 6c5 0 9 6 9 6a14 14 0 01-2.9 3.2M6.5 6.7A14 14 0 003 12s4 6 9 6a9.3 9.3 0 003.6-.7"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/>',
    slow:      '<path d="M7 3h10v3l-5 6 5 6v3H7v-3l5-6-5-6z"/>',
    risk:      '<path d="M12 3l9 16H3z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    rocket:    '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9.5 11.5a13 13 0 018-8.5c2 0 3 1 3 3a13 13 0 01-8.5 8z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
    trend:     '<path d="M4 18l5-5 3 3 7-7"/><path d="M16 9h5v5"/>',
    chart:     '<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="0.5"/><rect x="10.5" y="6" width="3" height="12" rx="0.5"/><rect x="16" y="13" width="3" height="5" rx="0.5"/>',
    gauge:     '<path d="M5 12a7 7 0 0114 0"/><path d="M8 12a4 4 0 018 0"/><circle cx="12" cy="12" r="1.4"/><path d="M12 12l3.5-2.4"/>',
    heart:     '<path d="M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9z"/>',
    heartplus: '<path d="M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9z"/><path d="M12 9v4M10 11h4"/>',
    compass:   '<circle cx="12" cy="12" r="9"/><path d="M16 8l-2.6 5.4L8 16l2.6-5.4z"/>',
    clock:     '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    star:      '<path d="M12 4l2.3 5.6 5.7.4-4.4 3.6L17 19l-5-3-5 3 1.4-5.4L4 10l5.7-.4z"/>',
    checkc:    '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    badge:     '<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    storefront:'<path d="M4 9l1.6-5h12.8L20 9"/><path d="M5 9.5v9.5h14V9.5"/><path d="M4 9a2.6 2.6 0 005 0 2.6 2.6 0 005 0 2.6 2.6 0 005 0"/><path d="M9.5 19v-5h5v5"/>'
  };

  FM.FRICTION = [
    { ic: NI.channels, c: '#01B3F6', t: 'Too many channels', d: 'Critical information gets scattered.' },
    { ic: NI.manual,   c: '#FFC500', t: 'Too much manual work', d: 'Teams chase instead of progress.' },
    { ic: NI.blind,    c: '#9A86FF', t: 'Too little visibility', d: 'Issues escalate out of sight.' },
    { ic: NI.slow,     c: '#1FE6D4', t: 'Too slow to change', d: 'Digitalisation gets stuck in silos.' },
    { ic: NI.risk,     c: '#FF6A04', t: 'Too much human risk', d: 'Fatigue and safety risk compound.' }
  ];

  FM.OUTCOMES = [
    { ic: I.connect,    c: '#01B3F6', t: 'Reach frontline consistently', d: 'Critical updates reach the right people.' },
    { ic: I.network,    c: '#435FE8', t: 'Coordinate workflows', d: 'Teams, tasks, and vessels stay connected.' },
    { ic: I.shield,     c: '#18C95C', t: 'Safeguard earlier', d: 'Risks are spotted before they escalate.' },
    { ic: I.users,      c: '#6B5FD9', t: 'Connect stakeholders', d: 'Departments, partners, and services align.' },
    { ic: NI.rocket,    c: '#FF6A04', t: 'Launch faster', d: 'Apps and services deploy without silos.' },
    { ic: NI.trend,     c: '#1FE6D4', t: 'Improve adoption', d: 'New tools become easier to use.' },
    { ic: NI.chart,     c: '#FFC500', t: 'Measure value', d: 'Impact becomes visible and reportable.' },
    { ic: I.scalable,   c: '#9A86FF', t: 'Scale AI roadmap', d: 'Digital initiatives grow on one platform.' }
  ];

  FM.TRACKS = [
    { color: '#6B5FD9', ic: I.lowcode, t: 'Subscribe to the FrontM Operating Platform',
      d: 'Access ready-to-use maritime SaaS services for crews, vessels, shore teams, and operational partners through one connected platform.',
      cta: 'Explore Solutions', route: 'pricing', href: 'solutions-by-department.html' },
    { color: '#01B3F6', ic: I.ai, t: 'Build maritime digital solutions faster',
      d: 'Create AI-native maritime apps, automations, agents, and workflows tailored to your operating environment.',
      cta: 'Build with frontm.ai', route: 'frontm-ai', href: 'platform.html' },
    { color: '#18C95C', ic: NI.storefront, t: 'Integrate into the Maritime App Marketplace',
      d: 'Bring your maritime services, products, and custom applications into one ecosystem built for adoption and scale.',
      cta: 'Join the Marketplace', route: 'marketplace', href: 'platform.html' }
  ];

  FM.FUNCTIONS = [
    { id: 'crewing', icon: I.users, title: 'Crewing',
      tag: 'Fill roles faster. Keep crews ready, cared for, and retained.',
      impact: 'Improve crew supply, mobilisation, compliance readiness, communication, welfare access, and retention support.',
      demo: 'Book a Crewing Demo', hl: 'crewing teams',
      x: {
        h: 'Keep the fleet crew-ready at every stage of the seafarer lifecycle.',
        p: 'Crewing teams need to source qualified seafarers, keep documents current, coordinate medicals, training, travel, sign-on/sign-off, pay queries, welfare, and crew communication \u2014 without losing time to fragmented workflows.',
        helps: [
          ['Fill roles faster', 'Connect candidates, crew pools, vessels, and shore teams.'],
          ['Keep crew ready', 'Support certification, PEME, training, onboarding, and joining readiness.'],
          ['Reduce manual chasing', 'Use reminders, workflows, updates, and AI-assisted support.'],
          ['Support the full journey', 'Communicate before joining, onboard, and after sign-off.'],
          ['Improve care and retention', 'Make welfare, healthcare, benefits, feedback, and recognition easier to access and measure.'],
          ['Prepare for MANAGE', 'Extend into end-to-end crew management ERP for planning, documents, mobilisation, payroll, benefits, and lifecycle operations.']
        ],
        uses: ['Crew sourcing','CV pipeline support','Crew communication','Certification reminders','PEME readiness','Training updates','Onboarding','Travel coordination','Sign-on/sign-off communication','Pay and benefits queries','Healthcare access','Welfare support','Crew feedback','Retention campaigns','MANAGE crew ERP workflows'],
        next: ['Essential or Growth to improve crew communication, onboarding, welfare, and engagement.','Scale or Tailored for crew lifecycle workflows, integrations, AI-assisted crewing, and MANAGE readiness.']
      }
    },
    { id: 'marinehr', icon: NI.heart, title: 'Marine HR & Crew Experience',
      tag: 'Build a happier, healthier, and more loyal seafaring workforce.',
      impact: 'Improve engagement, wellbeing, benefits access, employer brand, retention, feedback, learning, and future leadership development.',
      demo: 'Book a Marine HR Demo', hl: 'Marine HR teams',
      x: {
        h: 'Create a crew experience that seafarers choose to return to.',
        p: 'Marine HR teams need to keep seafarers engaged, supported, cared for, and connected across the full employment journey \u2014 before joining, onboard, during leave, and before the next assignment.',
        helps: [
          ['Engage crews continuously', 'Use campaigns, surveys, communities, recognition, and company updates.'],
          ['Improve wellbeing access', 'Bring healthcare, welfare, mental health, benefits, and support schemes closer to crew.'],
          ['Strengthen retention', 'Create more meaningful touchpoints across the seafarer lifecycle.'],
          ['Build employer brand', 'Show crews they are heard, supported, developed, and valued.'],
          ['Develop future leaders', 'Deliver microlearning, mentoring, career content, and leadership nudges.'],
          ['Personalise support with AI', 'Use AI-guided wellbeing prompts, learning recommendations, and crew support assistants.'],
          ['Measure people impact', 'Track engagement, feedback, service adoption, learning activity, and retention signals.']
        ],
        uses: ['Crew campaigns','Pulse surveys','Wellbeing support','Healthcare access','Benefits schemes','Recognition','Employer brand','Microlearning','Career pathways','Mentoring','Crew communities','Feedback loops','Retention campaigns','AI support assistants','Personalised nudges','Service adoption tracking'],
        next: ['Essential or Growth for crew engagement, wellbeing access, feedback, and service adoption.','Scale or Tailored for Marine HR transformation, benefits ecosystems, AI-personalised support, leadership development, and workforce analytics.']
      }
    },
    { id: 'hsqe', icon: I.shield, title: 'HSQE',
      tag: 'Move from compliance activity to safety performance.',
      impact: 'Improve safety culture, inspection readiness, incident learning, audit evidence, and AI-enabled assurance.',
      demo: 'Book an HSQE Demo', hl: 'HSQE teams',
      x: {
        h: 'Make safety, compliance, and assurance measurable across the fleet.',
        p: 'HSQE teams need to improve safety culture, prepare for audits and inspections, close the loop on incidents, evidence compliance, support environmental goals, and keep crews engaged in safer operations.',
        helps: [
          ['Strengthen safety culture', 'Keep safety visible through campaigns, feedback, learning, and participation.'],
          ['Improve inspection readiness', 'Support internal audits, PSC, SIRE, RightShip, class, flag, and customer assurance.'],
          ['Close the learning loop', 'Turn incidents, near misses, and lessons learned into targeted crew communication.'],
          ['Evidence compliance', 'Track acknowledgements, quizzes, policy updates, participation, and campaign reach.'],
          ['Connect departments', 'Align HSQE, technical, operations, vessels, and partners around findings and follow-ups.'],
          ['Use AI for assurance', 'Support safety briefings, risk summaries, readiness checks, and corrective-action intelligence.']
        ],
        uses: ['Safety campaigns','Policy acknowledgements','Incident learning','Near-miss follow-up','Audit readiness','PSC readiness','SIRE preparation','RightShip preparation','Corrective actions','Compliance quizzes','Environmental campaigns','Crew feedback','Safety culture engagement','AI-assisted assurance workflows'],
        next: ['Growth or Scale for safety campaigns, acknowledgements, inspection readiness, and fleet-wide HSQE visibility.','Tailored for AI-assisted assurance, corrective-action workflows, integrations, and multi-department HSQE transformation.']
      }
    },
    { id: 'technical', icon: I.maintain, title: 'Technical',
      tag: 'Keep vessels reliable, available, and cost-controlled.',
      impact: 'Improve technical coordination, maintenance visibility, defect follow-up, superintendent productivity, vendor access, and AI-assisted vessel support.',
      demo: 'Book a Technical Demo', hl: 'technical teams',
      x: {
        h: 'Keep technical operations ahead of vessel risk, cost, and downtime.',
        p: 'Technical teams need to manage vessel condition, maintenance, defects, repairs, dry docking, spares, vendors, budgets, and performance \u2014 while keeping ships operational and commercially available.',
        helps: [
          ['Keep vessels operational', 'Connect defects, updates, service needs, and follow-ups.'],
          ['Support superintendents', 'Give teams faster access to documents, workflows, vessel context, and AI support.'],
          ['Reduce firefighting', 'Make issues, actions, escalations, and repeat problems visible.'],
          ['Coordinate partners', 'Align vendors, OEMs, class, suppliers, vessels, and shore teams.'],
          ['Improve dry dock readiness', 'Support scope, documentation, defect lists, and progress visibility.'],
          ['Prepare for AI technical management', 'Enable troubleshooting, knowledge search, defect summaries, and predictive support.']
        ],
        uses: ['Technical superintendent workflows','Vessel defects','Maintenance follow-up','PMS-linked communication','Documentation access','Troubleshooting','Dry dock preparation','Repair coordination','Spares follow-up','OEM collaboration','Class follow-up','Fleet updates','AI-assisted technical knowledge','Future MANAGE technical workflows'],
        next: ['Growth or Scale for vessel support, documentation, maintenance visibility, and vendor coordination.','Tailored for PMS integrations, dry dock workflows, AI-assisted technical management, fleet performance dashboards, and future MANAGE technical modules.']
      }
    },
    { id: 'operations', icon: NI.compass, title: 'Operations',
      tag: 'Keep voyages moving, visible, and commercially controlled.',
      impact: 'Improve voyage execution, port coordination, ETA visibility, charterer communication, incident response, partner alignment, and AI-assisted decisions.',
      demo: 'Book an Operations Demo', hl: 'operations teams',
      x: {
        h: 'Make voyage execution connected, visible, and AI-ready.',
        p: 'Operations teams manage vessel movements, ETAs, port calls, cargo readiness, charterer updates, agent coordination, vessel performance, incidents, documentation, and commercial follow-up.',
        helps: [
          ['Coordinate voyages', 'Connect movements, ETAs, instructions, and schedules.'],
          ['Improve port readiness', 'Align vessels, agents, terminals, cargo, and shore teams.'],
          ['Support charterers', 'Coordinate instructions, updates, delays, and claims support.'],
          ['Monitor performance', 'Track speed, consumption, off-hire, delays, and exceptions.'],
          ['Respond faster', 'Create a shared layer for first operational response.'],
          ['Use AI for execution', 'Generate voyage summaries, readiness checks, alerts, and decision support.']
        ],
        uses: ['Vessel movements','ETA updates','Port calls','Agent coordination','Berthing','Cargo readiness','Voyage instructions','Charterer updates','Speed and consumption','Off-hire','Delays','Incident response','Port documents','Voyage reports','Claims support','AI-assisted voyage summaries','Future MANAGE operations workflows'],
        next: ['Scale for fleet-wide operational coordination, port-call visibility, performance updates, and partner alignment.','Tailored for voyage execution workflows, charterer interfaces, port and agent integrations, AI-assisted operations, and future MANAGE operations modules.']
      }
    },
    { id: 'digital', icon: I.network, title: 'Digital Leaders',
      tag: 'Turn digital ambition into governed fleet-wide adoption.',
      impact: 'Reduce vendor sprawl, improve adoption, govern AI, connect systems, and prove value across ships and shore.',
      demo: 'Book a Digital Transformation Demo', hl: 'digital leaders',
      x: {
        h: 'Move from fragmented digital projects to one scalable operating model.',
        p: 'Digital leaders need to modernise safety-critical, low-connectivity fleet environments without increasing cyber risk, vendor sprawl, integration debt, or crew workload.',
        helps: [
          ['Reduce vendor sprawl', 'Give approved apps and partners one controlled route to the fleet.'],
          ['Improve adoption', 'Create one consistent experience across ship, shore, crew, and departments.'],
          ['Connect systems', 'Bring workflows, services, APIs, data, and reporting into one layer.'],
          ['Govern AI', 'Enable AI-assisted workflows with human oversight and clear controls.'],
          ['Simplify deployment', 'Support role-based, bandwidth-aware maritime environments.'],
          ['Prove value', 'Measure rollout, usage, engagement, compliance, and service adoption.'],
          ['Scale transformation', 'Turn pilots into a repeatable digital operating model.']
        ],
        uses: ['Digital roadmap','Fleet rollout','Vendor consolidation','Marketplace governance','AI workflows','AI governance','System integration','Role-based access','Low-bandwidth deployment','Adoption tracking','Cyber-aware rollout','Impact reporting','Executive dashboards'],
        next: ['Scale for fleet-wide adoption, workflow standardisation, reporting, and partner-service rollout.','Tailored for enterprise architecture, AI governance, deep integrations, cyber controls, and ecosystem-scale transformation.']
      }
    }
  ];

  FM.FN_SEGUE = 'Technical keeps vessels ready. Operations keeps voyages moving. HSQE keeps assurance measurable. Crewing and Marine HR keep people ready, supported, and retained. Digital leaders make it all scalable, secure, and AI-ready. FrontM connects every function through one intelligent ship-shore operating layer.';

  FM.IMPACT_CARDS = [
    { c: '#01B3F6', ic: I.connect,  t: 'Reach & response', d: 'Measure who received, acknowledged, and acted on critical updates.' },
    { c: '#3CAD33', ic: I.shield,   t: 'Safety & assurance', d: 'Evidence campaign participation, policy acknowledgement, audits, and inspection readiness.' },
    { c: '#18C95C', ic: NI.heartplus, t: 'Health & welfare', d: 'Track healthcare access, welfare usage, support cases, and wellbeing engagement.' },
    { c: '#9A86FF', ic: I.train,    t: 'Learning & competence', d: 'Measure crew education, microlearning, assessments, and development participation.' },
    { c: '#FFC500', ic: NI.gauge,   t: 'Operational efficiency', d: 'Track manual work reduced, workflows completed, cases closed, and delays avoided.' },
    { c: '#FF6A04', ic: NI.rocket,  t: 'Digitalisation accelerated', d: 'Reduce partner scouting, integration effort, rollout time, and change-management friction.' },
    { c: '#435FE8', ic: I.ai,       t: 'AI readiness', d: 'Create data harmony, workflow intelligence, BI visibility, and AI-assisted decision support.' },
    { c: '#1FE6D4', ic: NI.chart,   t: 'Commercial confidence', d: 'Strengthen customer assurance, ESG evidence, contract support, and partner-service value.' }
  ];

  FM.VALUE_BRIDGE = [
    { ic: NI.clock,  t: 'Time saved', d: 'Less chasing, reporting, manual coordination, vendor scouting, repeated rollout effort, and duplicate communication.' },
    { ic: I.shield,  t: 'Risk reduced', d: 'Better visibility into safety participation, welfare access, health support, escalation readiness, and inspection evidence.' },
    { ic: NI.star,   t: 'Value captured', d: 'Higher adoption of healthcare, welfare, learning, benefits, partner services, and existing digital investments.' },
    { ic: NI.checkc, t: 'Cases resolved', d: 'Support cases, welfare requests, healthcare interactions, operational issues, and workflow actions tracked through to closure.' },
    { ic: I.users,   t: 'People supported', d: 'Crew reached, educated, engaged, assisted, recognised, and cared for across the seafarer journey.' },
    { ic: NI.rocket, t: 'Digitalisation accelerated', d: 'Faster discovery, integration, deployment, and adoption of maritime services through one operating platform and marketplace.' },
    { ic: I.ai,      t: 'AI readiness created', d: 'Data, workflows, adoption signals, and BI reporting become structured enough to support AI-assisted operations.' },
    { ic: NI.badge,  t: 'Commercial confidence strengthened', d: 'Evidence for customers, charterers, audits, inspections, ESG reporting, and contract assurance.' }
  ];

  FM.PROOF = [
    { n: '1,500+', l: 'Vessels reached' },
    { n: '100K+',  l: 'Maritime professionals connected' },
    { n: '50+',    l: 'Maritime operators' },
    { n: '30+',    l: 'Partner apps in the marketplace' }
  ];

  /* collaboration wheel — modules reuse FM.MODULES; these are the 12 stakeholders */
  FM.WHEEL_STK = [
    { n: 'Ship Owners',         i: '<path d="M4 15h16l-2 5H6z"/><path d="M12 3v12"/><path d="M12 6l6 3-6 1z"/>' },
    { n: 'Ship Managers',       i: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M8.5 12l2 2 4-4"/>' },
    { n: 'Class Societies',     i: '<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>' },
    { n: 'Crew Manning',        i: '<circle cx="9" cy="9" r="3"/><path d="M3.5 20c0-3 2.7-5 5.5-5s5.5 2 5.5 5"/><path d="M16 7a3 3 0 010 6"/><path d="M20.5 20c0-2.3-1.4-3.9-3.5-4.6"/>' },
    { n: 'Ports & Authorities', i: '<circle cx="12" cy="4" r="2"/><path d="M12 6v14"/><path d="M9 9l3-3 3 3"/><path d="M8 11H5c0 5 3 8 7 8s7-3 7-8h-3"/>' },
    { n: 'Charterers',          i: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>' },
    { n: 'Insurers',            i: '<path d="M12 3v2"/><path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6a2 2 0 01-4 0"/>' },
    { n: 'Regulators',          i: '<path d="M12 4v16"/><path d="M7 20h10"/><path d="M4 8h16"/><path d="M4 8l-2.2 5a3 3 0 006.4 0z"/><path d="M20 8l-2.2 5a3 3 0 006.4 0z"/>' },
    { n: 'Engine OEMs',         i: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2 2M16.8 16.8l2 2M18.8 5.2l-2 2M7.2 16.8l-2 2"/>' },
    { n: 'Service Providers',   i: '<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 005.6-5.6l-2.9 2.9-2-2 2.9-2.9Z"/>' },
    { n: 'Brokers',             i: '<path d="M4 18l5-5 3 3 7-7"/><path d="M15 9h5v5"/>' },
    { n: 'Surveyors',           i: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/><path d="M11 8.5v5M8.5 11h5"/>' }
  ];
})();
