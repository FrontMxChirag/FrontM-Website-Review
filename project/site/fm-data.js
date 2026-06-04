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

    NAV: [
      { label: 'Platform', menu: {
        title: 'The connected operating layer',
        grid: [
          ['Platform Overview', 'How the four-layer maritime stack fits together'],
          ['App Marketplace', 'Partner apps installed across 15,000+ vessels'],
          ['Superapp PaaS', 'Build maritime apps on shared platform infrastructure'],
          ['Low-Code Framework', 'Drag-and-drop workflow studio with AI assist'],
          ['frontm.ai', 'AI-assisted workflows for shore teams'],
          ['APIs & Integrations', 'Connect with crewing, ERP and fleet systems']
        ],
        cta: ['See how the four layers work together', 'View architecture']
      }},
      { label: 'Product', menu: {
        title: 'Eight modules, one platform',
        colored: true,
        grid: [
          ['CONNECT', 'Role-based ship-shore communication with acknowledgement', '#01B3F6'],
          ['ENGAGE', 'Internal community for the company, campaigns & feedback', '#6B5FD9'],
          ['CARE', 'Video telemedicine & wellbeing for crew at sea', '#079B33'],
          ['ENTERTAIN', 'IPTV & managed content for shared recreation spaces', '#FF6A04'],
          ['INFORM', 'Digital signage & HSEQ campaigns scheduled from shore', '#FFC500'],
          ['TRAIN', 'Microlearning, safety awareness & cadet content', '#3CAD33'],
          ['MAINTAIN', 'Maintenance workflows & technical coordination', '#435FE8', 'Coming Soon'],
          ['MANAGE', 'Approvals, administration & management workflows', '#404858', 'Coming Soon']
        ]
      }},
      { label: 'Industries', menu: {
        title: 'Built for the teams running maritime',
        grid: [
          ['Fleet Operators', 'Visibility across vessels, comms, services and delivery'],
          ['Technical Management & HSQE', 'Safety guidance, awareness, inspections, audit trails'],
          ['Crewing & Workforce Operations', 'Engagement, welfare, readiness, feedback, retention'],
          ['Maritime Service Providers', 'Distribute services to platform-ready vessels and crew'],
          ['Maritime Ecosystem Organisations', 'Member updates, campaigns, welfare programmes at scale'],
          ['Welfare & Healthcare Partners', 'Deliver telemedicine and welfare services via the platform']
        ]
      }},
      { label: 'Community', menu: {
        title: 'onship, the professional community for maritime people',
        one: true,
        grid: [
          ['onship App', ''],
          ['Seafarers Network', ''],
          ['Maritime Professionals', ''],
          ['Cadets Network', '']
        ],
        cta: ['', 'Visit onship']
      }},
      { label: 'Company', menu: {
        title: 'FrontM',
        one: true,
        grid: [['About', ''], ['Resources', ''], ['Case Studies', ''], ['Contact', '']]
      }}
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
      { id: 'CARE', color: '#079B33', icon: I.care, tag: 'Telemedicine on video. The doctor sees what the seafarer sees.',
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
      { f: 'maersk.png', n: 'Maersk' },
      { f: 'nyk.png', n: 'NYK' },
      { f: 'mol.jpg', n: 'MOL Chemical Tankers' },
      { f: 'rio-tinto.png', n: 'Rio Tinto' },
      { f: 'pacific-basin.jpg', n: 'Pacific Basin' },
      { f: 'asyad-dark.png', n: 'Asyad' },
      { f: 'cmb-tech.jpg', n: 'CMB Tech' },
      { f: 'cobelfret.jpg', n: 'Cobelfret' },
      { f: 'executive-ship-management.png', n: 'Executive Ship Management' },
      { f: 'meiji-mms.png', n: 'Meiji Shipping Group' },
      { f: 'campbell.jpg', n: 'Campbell' },
      { f: 'petredec.svg', n: 'Petredec' },
      { f: 'gem.svg', n: 'GEM' },
      { f: 'aesm.jpg', n: 'AESM' }
    ]
  };
})();
