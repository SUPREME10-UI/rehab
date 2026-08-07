<!DOCTYPE html><html class="h-full bg-background light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Rehabilitation Assessment - RHMS</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-secondary-container": "#006e6e",
                        "on-primary-container": "#bcceff",
                        "surface-container": "#eceef0",
                        "outline-variant": "#c3c6d5",
                        "secondary": "#006a6a",
                        "surface-variant": "#e0e3e5",
                        "primary-fixed-dim": "#b0c6ff",
                        "on-primary-fixed-variant": "#00419c",
                        "inverse-on-surface": "#eff1f3",
                        "on-tertiary-container": "#c3cee6",
                        "on-background": "#191c1e",
                        "surface-container-low": "#f2f4f6",
                        "primary": "#003c90",
                        "surface-bright": "#f7f9fb",
                        "on-error": "#ffffff",
                        "tertiary-container": "#4d586c",
                        "tertiary-fixed-dim": "#bcc7de",
                        "on-surface-variant": "#434653",
                        "inverse-surface": "#2d3133",
                        "surface-dim": "#d8dadc",
                        "surface-container-highest": "#e0e3e5",
                        "background": "#f7f9fb",
                        "on-primary": "#ffffff",
                        "on-secondary-fixed-variant": "#004f4f",
                        "on-tertiary-fixed-variant": "#3c475a",
                        "error": "#ba1a1a",
                        "secondary-container": "#90efef",
                        "on-primary-fixed": "#001945",
                        "on-tertiary": "#ffffff",
                        "surface-tint": "#1d59c1",
                        "inverse-primary": "#b0c6ff",
                        "primary-container": "#0f52ba",
                        "primary-fixed": "#d9e2ff",
                        "surface-container-high": "#e6e8ea",
                        "on-secondary-fixed": "#002020",
                        "on-secondary": "#ffffff",
                        "secondary-fixed": "#93f2f2",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed": "#d8e3fb",
                        "error-container": "#ffdad6",
                        "on-surface": "#191c1e",
                        "secondary-fixed-dim": "#76d6d5",
                        "tertiary": "#364154",
                        "on-error-container": "#93000a",
                        "outline": "#737784",
                        "on-tertiary-fixed": "#111c2d",
                        "surface": "#f7f9fb"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "gutter": "20px",
                        "sidebar-width": "260px",
                        "xl": "32px",
                        "xs": "4px",
                        "container-max": "1440px",
                        "md": "16px",
                        "sm": "8px",
                        "lg": "24px",
                        "base": "4px"
                    },
                    "fontFamily": {
                        "body-md": ["Inter"],
                        "data-mono": ["JetBrains Mono"],
                        "headline-sm": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-lg-mobile": ["Inter"],
                        "headline-lg": ["Inter"],
                        "headline-md": ["Inter"],
                        "label-sm": ["Inter"],
                        "label-md": ["Inter"]
                    },
                    "fontSize": {
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "data-mono": ["13px", { "lineHeight": "18px", "fontWeight": "400" }],
                        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
                        "label-md": ["13px", { "lineHeight": "18px", "letterSpacing": "0.05em", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .material-symbols-outlined.fill { font-variation-settings: 'FILL' 1; }
        
        /* Custom range slider styling */
        input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #0f52ba;
            cursor: pointer;
            margin-top: -6px;
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #e0e3e5;
            border-radius: 2px;
        }
    </style>
</head>
<body class="font-body-md text-on-surface bg-background flex h-screen overflow-hidden">
<!-- SideNavBar -->
<nav class="bg-[#1E293B] flex flex-col h-screen fixed left-0 top-0 z-40 w-[260px] border-r border-outline-variant transition-all duration-200 ease-in-out hidden md:flex">
<div class="p-lg border-b border-surface-variant/20">
<div class="flex items-center gap-sm mb-lg">
<div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-on-secondary-container">medical_services</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md font-bold text-white">RHMS</h1>
<p class="font-label-sm text-label-sm text-surface-variant/70">Clinical Portal</p>
</div>
</div>
<button class="w-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md py-sm px-md rounded hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-xs">
<span class="material-symbols-outlined text-[18px]">add</span>
                New Admission
            </button>
</div>
<div class="flex-1 overflow-y-auto py-md">
<ul class="space-y-xs">
<li>
<a class="flex items-center gap-3 px-4 py-3 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-label-md text-label-md">Dashboard</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-4 py-3 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="person_medical">cloud_download</span>
<span class="font-label-md text-label-md">Patient Management</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-4 py-3 border-l-4 border-secondary-fixed bg-secondary-container/10 text-secondary-fixed" href="#">
<span class="material-symbols-outlined fill" data-icon="assessment">assessment</span>
<span class="font-label-md text-label-md">Assessment</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-4 py-3 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="edit_calendar">edit_calendar</span>
<span class="font-label-md text-label-md">Treatment Plans</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-4 py-3 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-label-md text-label-md">Reporting</span>
</a>
</li>
</ul>
</div>
<div class="mt-auto border-t border-surface-variant/20 p-md">
<ul class="space-y-xs">
<li>
<a class="flex items-center gap-3 px-4 py-2 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5 rounded" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
<span class="font-label-md text-label-md">Settings</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-4 py-2 text-surface-variant/70 hover:text-white transition-colors hover:bg-white/5 rounded" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="help">help</span>
<span class="font-label-md text-label-md">Support</span>
</a>
</li>
</ul>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 flex flex-col md:ml-[260px] h-screen overflow-hidden bg-surface">
<!-- TopNavBar -->
<header class="flex justify-between items-center h-16 px-gutter border-b border-outline-variant bg-surface z-30 shrink-0">
<div class="flex items-center gap-md w-1/3">
<button class="md:hidden text-on-surface p-sm -ml-sm">
<span class="material-symbols-outlined">menu</span>
</button>
<div class="font-headline-sm text-headline-sm font-bold text-primary hidden md:block">Rehab Management</div>
</div>
<div class="flex-1 flex justify-center max-w-md w-full px-md">
<div class="relative w-full">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Search patients, records..." type="text">
</div>
</div>
<div class="flex items-center justify-end gap-sm w-1/3">
<button class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors relative">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<button class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors hidden sm:block">
<span class="material-symbols-outlined" data-icon="history">history</span>
</button>
<div class="w-px h-6 bg-outline-variant mx-2 hidden sm:block"></div>
<button class="flex items-center gap-2 hover:bg-surface-container-low p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-outline-variant">
<img alt="Current user profile picture" class="w-8 h-8 rounded-full object-cover bg-surface-variant border border-outline-variant" data-alt="Professional headshot of a clinical practitioner in light neutral medical attire against a clean studio background, highly detailed, soft commercial lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbiuE09sWJlT72qovdqrmdYl5qOlF_XXroD1xuExJBkd6lXABBXl6zhd3ThZKvPiR9YYQgdYi00jddsBOqp9QcgV2bk1J0mEj7TbVC0UT2YzU7OAakEdQhCNCvj48svjWvJfbgTKewayP6_JAqUQkuzHDjIwUGBuxOZW3IuubBzlLSC5iZKo9Qop4peUpQoNgP9oSTfdYWYhmdof2UP_kIWPRFMNPj4ZwMRpu2CoXORdqhMqmBwR-Drg">
<span class="font-label-md text-label-md text-primary hidden sm:block">Profile</span>
</button>
</div>
</header>
<!-- Scrollable Content -->
<main class="flex-1 overflow-y-auto p-gutter bg-background">
<div class="max-w-container-max mx-auto space-y-lg pb-xl">
<!-- Header & Stepper -->
<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
<div>
<div class="flex items-center gap-sm mb-xs">
<span class="px-2 py-1 bg-primary-container text-on-primary-container font-label-sm text-label-sm rounded uppercase tracking-wider">In Progress</span>
<span class="font-data-mono text-data-mono text-on-surface-variant">PT-8472</span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Comprehensive Rehab Assessment</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Patient: Eleanor Vance | DOB: 12/04/1958 | Primary Diagnosis: Right MCA CVA</p>
</div>
<div class="flex gap-sm">
<button class="px-4 py-2 border border-outline-variant rounded text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">Save Draft</button>
<button class="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary/90 transition-colors">Complete Assessment</button>
</div>
</div>
<!-- Progress Stepper -->
<div class="bg-surface rounded-lg border border-outline-variant p-md">
<div class="flex items-center justify-between relative">
<div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-outline-variant -z-10"></div>
<div class="flex flex-col items-center bg-surface px-2">
<div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-md text-label-md shadow-sm border-2 border-surface">
<span class="material-symbols-outlined text-[18px]">check</span>
</div>
<span class="font-label-sm text-label-sm mt-2 text-on-surface font-medium">Vitals</span>
</div>
<div class="flex flex-col items-center bg-surface px-2">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md border-2 border-primary ring-4 ring-primary/10">2</div>
<span class="font-label-sm text-label-sm mt-2 text-primary font-bold">Functional</span>
</div>
<div class="flex flex-col items-center bg-surface px-2">
<div class="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md text-label-md border-2 border-surface">3</div>
<span class="font-label-sm text-label-sm mt-2 text-on-surface-variant">Musculoskeletal</span>
</div>
<div class="flex flex-col items-center bg-surface px-2">
<div class="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md text-label-md border-2 border-surface">4</div>
<span class="font-label-sm text-label-sm mt-2 text-on-surface-variant">Goals</span>
</div>
</div>
</div>
<!-- Bento Grid Layout for Assessment -->
<div class="grid grid-cols-1 xl:grid-cols-3 gap-lg">
<!-- Left Column: FIM Scoring (Takes up 2 cols on XL) -->
<div class="xl:col-span-2 space-y-lg">
<!-- Section: FIM -->
<div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
<div class="p-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
<h3 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary">accessibility_new</span>
                                    Functional Independence Measure (FIM)
                                </h3>
<div class="bg-surface-container-low px-3 py-1 rounded border border-outline-variant">
<span class="font-label-sm text-label-sm text-on-surface-variant">Total Score:</span>
<span class="font-data-mono text-data-mono font-bold text-on-surface ml-2 text-lg">78/126</span>
</div>
</div>
<div class="p-0">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<th class="p-md font-label-md text-label-md text-on-surface-variant w-1/3">Domain</th>
<th class="p-md font-label-md text-label-md text-on-surface-variant w-1/2">Scoring (1-7)</th>
<th class="p-md font-label-md text-label-md text-on-surface-variant text-right w-1/6">Value</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/50">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-lowest transition-colors">
<td class="p-md">
<div class="font-body-md text-body-md text-on-surface font-medium">Eating</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Self-care</div>
</td>
<td class="p-md">
<input class="w-full" max="7" min="1" type="range" value="5">
<div class="flex justify-between text-[10px] text-outline mt-1 font-data-mono">
<span>Total Assist(1)</span>
<span>Indep(7)</span>
</div>
</td>
<td class="p-md text-right font-data-mono text-data-mono">
<select class="border border-outline-variant rounded bg-surface p-1 text-right focus:border-primary focus:ring-1 focus:ring-primary outline-none">
<option>1</option><option>2</option><option>3</option><option>4</option><option selected="">5</option><option>6</option><option>7</option>
</select>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-lowest transition-colors">
<td class="p-md">
<div class="font-body-md text-body-md text-on-surface font-medium">Transfers: Bed/Chair</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Mobility</div>
</td>
<td class="p-md">
<input class="w-full" max="7" min="1" type="range" value="3">
<div class="flex justify-between text-[10px] text-outline mt-1 font-data-mono">
<span>Total Assist(1)</span>
<span>Indep(7)</span>
</div>
</td>
<td class="p-md text-right font-data-mono text-data-mono">
<select class="border border-outline-variant rounded bg-surface p-1 text-right focus:border-primary focus:ring-1 focus:ring-primary outline-none">
<option>1</option><option>2</option><option selected="">3</option><option>4</option><option>5</option><option>6</option><option>7</option>
</select>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container-lowest transition-colors">
<td class="p-md">
<div class="font-body-md text-body-md text-on-surface font-medium">Locomotion: Walk/Wheelchair</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Mobility</div>
</td>
<td class="p-md">
<input class="w-full" max="7" min="1" type="range" value="4">
<div class="flex justify-between text-[10px] text-outline mt-1 font-data-mono">
<span>Total Assist(1)</span>
<span>Indep(7)</span>
</div>
</td>
<td class="p-md text-right font-data-mono text-data-mono">
<select class="border border-outline-variant rounded bg-surface p-1 text-right focus:border-primary focus:ring-1 focus:ring-primary outline-none">
<option>1</option><option>2</option><option>3</option><option selected="">4</option><option>5</option><option>6</option><option>7</option>
</select>
</td>
</tr>
</tbody>
</table>
</div>
<div class="p-sm bg-surface-container-lowest border-t border-outline-variant text-center">
<button class="text-primary font-label-md text-label-md hover:underline">View All 18 Items</button>
</div>
</div>
</div>
<!-- Right Column: Goals & ROM -->
<div class="space-y-lg">
<!-- Goals Section -->
<div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-[400px]">
<div class="p-md border-b border-outline-variant bg-surface-bright flex justify-between items-center shrink-0">
<h3 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">flag</span>
                                    Treatment Goals
                                </h3>
<button class="p-1 rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div class="p-md space-y-md overflow-y-auto flex-1 bg-surface-container-lowest">
<!-- Goal 1 -->
<div class="border border-outline-variant rounded p-sm bg-surface">
<div class="flex justify-between items-start mb-2">
<span class="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">Short Term</span>
<span class="font-data-mono text-data-mono text-[11px] text-on-surface-variant">Target: 2 Weeks</span>
</div>
<textarea class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface resize-none" placeholder="Patient will perform sit-to-stand transfers with contact guard assist..." rows="2">Patient will perform sit-to-stand transfers with minimal assist (FIM 4) to allow for safe toilet transfers.</textarea>
</div>
<!-- Goal 2 -->
<div class="border border-outline-variant rounded p-sm bg-surface">
<div class="flex justify-between items-start mb-2">
<span class="bg-primary-container/20 text-on-primary-fixed-variant border border-primary/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">Long Term</span>
<span class="font-data-mono text-data-mono text-[11px] text-on-surface-variant">Target: 6 Weeks</span>
</div>
<textarea class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-body-md text-on-surface resize-none" placeholder="Enter long term goal..." rows="2">Patient will ambulate 150ft with rolling walker and supervision to navigate home environment safely.</textarea>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>