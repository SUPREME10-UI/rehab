import React, { useEffect } from 'react'

const HOME_HTML = `
<!-- TopNav - Extracted from Shared Components -->
<header class="flex justify-between items-center h-16 px-gutter w-full z-30 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline fixed top-0 shadow-sm">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined icon-rounded" aria-hidden="true">medical_services</span>
<span class="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">RehabConnect</span>
</div>
<nav class="hidden md:flex gap-8 h-full">
<a class="h-full flex items-center text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md" href="#">Home</a>
<a class="h-full flex items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors px-2 font-label-md text-label-md" href="#">Services</a>
<a class="h-full flex items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors px-2 font-label-md text-label-md" href="#">About Us</a>
<a class="h-full flex items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors px-2 font-label-md text-label-md" href="#">Contact</a>
</nav>
<div class="flex items-center gap-4">
<button aria-label="Notifications" class="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors text-primary">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button aria-label="History" class="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors text-primary">
<span class="material-symbols-outlined" data-icon="history">history</span>
</button>
<button class="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">Patient Portal Login</button>
</div>
</header>
<main class="flex-grow pt-16">
<!-- Hero Section with Carousel -->
<section class="relative w-full h-[640px] min-h-[500px] overflow-hidden" id="hero-carousel">
<!-- Slide 1 -->
<div class="carousel-slide active" style="background-image:url('/images/slide1.jpg'); background-size:cover; background-position:center;">
<div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex flex-col justify-center px-gutter md:px-xl max-w-container-max mx-auto">
<div class="max-w-2xl text-white">
<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-white">Advanced Rehabilitation for a Better Tomorrow</h1>
<p class="font-body-lg text-body-lg mb-8 text-inverse-on-surface opacity-90">Expert care, state-of-the-art facilities, and compassionate specialists dedicated to restoring your mobility and independence.</p>
<div class="flex gap-4">
<button class="bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-md">Find a Specialist</button>
<button class="bg-surface/20 text-white border border-white/30 px-6 py-3 rounded-full font-label-md text-label-md hover:bg-surface/30 transition-colors backdrop-blur-sm">Explore Services</button>
</div>
</div>
</div>
</div>
<!-- Slide 2 -->
<div class="carousel-slide" style="background-image:url('/images/slide2.jpg'); background-size:cover; background-position:center;">
<div class="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/40 flex flex-col justify-center px-gutter md:px-xl max-w-container-max mx-auto">
<div class="max-w-2xl text-white">
<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-white">Specialized Care Across All Life Stages</h1>
<p class="font-body-lg text-body-lg mb-8 text-inverse-on-surface opacity-90">From pediatric interventions to geriatric mobility solutions, we offer tailored rehabilitation plans for every patient's unique journey.</p>
<div class="flex gap-4">
<button class="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md">View Our Programs</button>
</div>
</div>
</div>
</div>
<!-- Slide 3 -->
<div class="carousel-slide" style="background-image:url('/images/slide3.jpg'); background-size:cover; background-position:center;">
<div class="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/30 flex flex-col justify-center px-gutter md:px-xl max-w-container-max mx-auto">
<div class="max-w-2xl text-white">
<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-white">Compassionate Support That Moves You Forward</h1>
<p class="font-body-lg text-body-lg mb-8 text-inverse-on-surface opacity-90">Our nurses and therapists work side by side with patients to build confidence, restore strength, and support recovery every step of the way.</p>
<div class="flex gap-4">
<button class="bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-md">Meet the Care Team</button>
</div>
</div>
</div>
</div>
<!-- Slide 4 -->
<div class="carousel-slide" style="background-image:url('/images/slide4.jpg'); background-size:cover; background-position:center;">
<div class="absolute inset-0 bg-gradient-to-r from-tertiary/90 to-tertiary/40 flex flex-col justify-center px-gutter md:px-xl max-w-container-max mx-auto">
<div class="max-w-2xl text-white">
<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-4 text-white">Professional Physical Therapy Solutions</h1>
<p class="font-body-lg text-body-lg mb-8 text-inverse-on-surface opacity-90">State-of-the-art facilities and evidence-based therapeutic techniques to accelerate your recovery and restore functional independence.</p>
<div class="flex gap-4">
<button class="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md">Schedule Therapy</button>
</div>
</div>
</div>
</div>
<!-- Carousel Indicators -->
<div class="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
<button aria-label="Go to slide 1" onclick="window.goToSlide(0)" class="w-3 h-3 rounded-full bg-white opacity-100 transition-opacity" type="button"></button>
<button aria-label="Go to slide 2" onclick="window.goToSlide(1)" class="w-3 h-3 rounded-full bg-white opacity-40 hover:opacity-70 transition-opacity" type="button"></button>
<button aria-label="Go to slide 3" onclick="window.goToSlide(2)" class="w-3 h-3 rounded-full bg-white opacity-40 hover:opacity-70 transition-opacity" type="button"></button>
<button aria-label="Go to slide 4" onclick="window.goToSlide(3)" class="w-3 h-3 rounded-full bg-white opacity-40 hover:opacity-70 transition-opacity" type="button"></button>
</div>
<!-- Carousel Controls -->
<button aria-label="Previous slide" onclick="window.prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 backdrop-blur-md transition-colors" type="button">
<span class="material-symbols-outlined text-[28px]">chevron_left</span>
</button>
<button aria-label="Next slide" onclick="window.nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 backdrop-blur-md transition-colors" type="button">
<span class="material-symbols-outlined text-[28px]">chevron_right</span>
</button>
</section>
<!-- Care for Every Life Stage -->
<section class="py-xl md:py-[64px] px-gutter md:px-xl max-w-container-max mx-auto bg-surface">
<div class="text-center mb-12">
<h2 class="font-headline-md text-headline-md text-on-surface mb-2">Care for Every Life Stage</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Comprehensive rehabilitation programs designed specifically for the unique physiological needs of different age groups.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Pediatric Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col h-full">
      <div class="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined icon-rounded" aria-hidden="true">child_care</span>
      </div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Pediatric Rehab</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">Specialized therapies focused on developmental milestones, motor skills, and strengthening in a supportive environment for children.</p>
<a class="font-label-md text-label-md text-primary flex items-center gap-1 hover:text-primary-container transition-colors mt-auto" href="#">Learn More <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
</div>
<!-- Adult Orthopedic Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col h-full relative overflow-hidden">
<div class="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -z-10"></div>
      <div class="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined icon-rounded secondary" aria-hidden="true">directions_walk</span>
      </div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Adult Orthopedic Recovery</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">Post-surgical rehabilitation, sports injury recovery, and comprehensive physical therapy to restore full function and mobility.</p>
<a class="font-label-md text-label-md text-secondary flex items-center gap-1 hover:text-secondary-container transition-colors mt-auto" href="#">Learn More <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
</div>
<!-- Geriatric Card -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col h-full">
      <div class="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined icon-rounded tertiary" aria-hidden="true">elderly</span>
      </div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Geriatric Mobility</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">Focused on balance, fall prevention, joint pain management, and maintaining independence through targeted exercises.</p>
<a class="font-label-md text-label-md text-tertiary flex items-center gap-1 hover:text-tertiary-container transition-colors mt-auto" href="#">Learn More <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
</div>
</div>
</section>
<!-- Health & Wellness Updates (Bento Layout) -->
<section class="py-xl md:py-[64px] px-gutter md:px-xl max-w-container-max mx-auto bg-surface-container-low">
<div class="flex justify-between items-end mb-8">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface mb-2">Health &amp; Wellness Updates</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Latest insights and tips from our clinical specialists.</p>
</div>
<a class="hidden md:flex font-label-md text-label-md text-primary items-center gap-1 hover:underline" href="#">View All Articles</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-4 h-auto md:h-[500px]">
<article class="md:col-span-8 md:row-span-2 relative rounded-xl overflow-hidden group">
<img class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A professional medical photograph showing a close-up of a modern robotic exoskeleton device assisting a patient's leg movement in a rehabilitation clinic. The lighting is bright and clinical, emphasizing the advanced technology. The color palette features medical blues and clean whites. The mood is hopeful and innovative, highlighting new technological advancements in stroke recovery." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSZtTbcBncrHUfgRpQFWk0G81F3xGwodALQvAoB4VyzWPGDddc6bWUA7ff5PxLLzXC9SiF8UaenIYVKvNxb8JgDhX4_F_qykXSmUi0G3SS4LWBMgZNRX465BPl8lm7_ytDwn864a6ffECIW0Gb8BxnOed1cbQ85--cRgRj-VG4ZH-W06ojynPc0yP1JZMLVO9vdbyUl_3nxgGn9aHT1iDxhoyJyeWCDbvJqsbOAqsJe-cRsbwaPpgBPA" alt="Robotic exoskeleton assisting patient"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
<div class="absolute bottom-0 left-0 p-6 md:p-8">
<span class="inline-block bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm mb-3">Neurology</span>
<h3 class="font-headline-md text-headline-md text-white mb-2 max-w-xl group-hover:text-primary-container transition-colors">New Innovations in Stroke Recovery: The Role of Robotics</h3>
<p class="font-body-md text-body-md text-inverse-on-surface opacity-90 hidden md:block max-w-xl">Explore how cutting-edge robotic exoskeletons are accelerating neuroplasticity and improving outcomes for stroke survivors.</p>
</div>
</article>
<article class="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group bg-surface-container-lowest border border-outline-variant p-5 flex flex-col justify-center">
<div class="flex items-start gap-4 h-full">
<div class="w-20 h-20 rounded-lg flex-shrink-0 bg-surface-container-high overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A vibrant overhead shot of a healthy, balanced meal in a clean, modern kitchen setting. The meal includes lean proteins, colorful vegetables, and whole grains, specifically tailored for post-surgical recovery. The lighting is natural and bright, emphasizing fresh ingredients. The aesthetic is clean and health-focused." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLfQ_LYxCIytMPK22BuX-pdtyYwuefI5PbG66CW2qsY9QOjVPWAiwuA4TXr-ANpnNnYIEBGtuWBHOUZHZupTY0yfvaH8pHeoG2h1eiWPoJYzeC1wCCgmBfTE9rFHIgA2TOiwqoohlewBt2wUbaiFjZ8YBA0CKqLJf1-UGmMV_UbejIr2PzMHTSGwAnWEpPl9wQE-WFceaUCfjShsWeyg53H7ohcQSVsvyaMSTYuo3adI40pncAVaMrAA"/>
</div>
<div class="flex flex-col h-full justify-center">
<span class="font-label-sm text-label-sm text-secondary mb-1">Nutrition</span>
<h4 class="font-label-md text-label-md text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">Nutrition Tips for Post-Surgical Healing</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-xs line-clamp-2">Essential nutrients to accelerate tissue repair and recovery.</p>
</div>
</div>
</article>
<article class="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group bg-surface-container-lowest border border-outline-variant p-5 flex flex-col justify-center">
<div class="flex items-start gap-4 h-full">
<div class="w-20 h-20 rounded-lg flex-shrink-0 bg-surface-container-high overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A professional image of a physical therapist holding a detailed anatomical model of a human spine, explaining it to a patient out of frame. The setting is a clean, well-lit consultation room with a clinical blue palette. The focus is on the spine model, conveying education and expert care in orthopedic health." src="https://lh3.googleusercontent.com/aida-public/AB6AXuASNDOKDPH32EzD7yAkwNXD6UiaUk1eA3nXcjH1L03svM1cmzDKVUOIDhYIvZz-_Jkxa2i5ZeKuhXLYwFjL-M1J3O4fXzCNQAvI1FbMyajYd-M00arzLLxWX9-DqW3g0xrxDj6UHFUJMF5gSZ-mCDJYJKWiIYour4NQbvDszcr5uOmQUJzGnbsUXeAPlG3kNYJthS2GBvKQ5KzUEr6seyN_xIfpfBU8e_FN3LkIcP63prHm5wEyKFS0Ng"/>
</div>
<div class="flex flex-col h-full justify-center">
<span class="font-label-sm text-label-sm text-tertiary mb-1">Orthopedics</span>
<h4 class="font-label-md text-label-md text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">Understanding Joint Preservation Techniques</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-xs line-clamp-2">Non-invasive strategies to maintain joint health as you age.</p>
</div>
</div>
</article>
</div>
<a class="md:hidden mt-6 flex justify-center font-label-md text-label-md text-primary items-center gap-1 hover:underline" href="#">View All Articles</a>
</section>
</main>
<!-- Footer Area (Minimalist corporate style) -->
<footer class="bg-inverse-surface text-inverse-on-surface py-12 px-gutter md:px-xl border-t border-outline-variant/20">
<div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
<div class="col-span-1 md:col-span-2">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined icon-rounded inverse" aria-hidden="true">medical_services</span>
<span class="font-headline-sm text-headline-sm font-bold text-white">RehabConnect</span>
</div>
<p class="font-body-md text-body-md text-surface-variant max-w-sm mb-6">Providing systematic, professional, and trustworthy rehabilitation services to restore mobility and improve quality of life.</p>
</div>
<div>
<h4 class="font-label-md text-label-md text-white mb-4 uppercase tracking-wider">Quick Links</h4>
<ul class="space-y-2">
<li><a class="font-body-md text-body-md text-surface-variant hover:text-white transition-colors" href="#">Find a Specialist</a></li>
<li><a class="font-body-md text-body-md text-surface-variant hover:text-white transition-colors" href="#">Our Services</a></li>
<li><a class="font-body-md text-body-md text-surface-variant hover:text-white transition-colors" href="#">Patient Portal</a></li>
<li><a class="font-body-md text-body-md text-surface-variant hover:text-white transition-colors" href="#">Careers</a></li>
</ul>
</div>
<div>
<h4 class="font-label-md text-label-md text-white mb-4 uppercase tracking-wider">Contact</h4>
<ul class="space-y-2">
<li class="flex items-center gap-2 font-body-md text-body-md text-surface-variant"><span class="material-symbols-outlined icon-rounded sm secondary" aria-hidden="true">call</span> 1-800-REHAB-CARE</li>
<li class="flex items-center gap-2 font-body-md text-body-md text-surface-variant"><span class="material-symbols-outlined icon-rounded sm secondary" aria-hidden="true">mail</span> contact@rehabconnect.org</li>
</ul>
</div>
</div>
<div class="max-w-container-max mx-auto mt-12 pt-8 border-t border-outline-variant/10 text-center font-body-md text-body-md text-surface-variant text-sm">© 2024 RehabConnect Systems. All rights reserved. Professional Healthcare Environment.</div>
</footer>
`

export default function HomeStatic(){
  useEffect(()=>{
    // Small delay to ensure DOM is ready after dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      let currentSlide = 0
      const slides = Array.from(document.querySelectorAll('.carousel-slide'))
      const indicators = Array.from(document.querySelectorAll('button[aria-label^="Go to slide"]'))
      const totalSlides = slides.length || 1

      console.log('Carousel initialized:', { slides: slides.length, indicators: indicators.length })

      function updateSlide(newIndex){
        if(!slides.length) return
        slides[currentSlide].classList.remove('active')
        if(indicators[currentSlide]){
          indicators[currentSlide].classList.remove('opacity-100')
          indicators[currentSlide].classList.add('opacity-40')
        }
        currentSlide = newIndex
        slides[currentSlide].classList.add('active')
        if(indicators[currentSlide]){
          indicators[currentSlide].classList.remove('opacity-40')
          indicators[currentSlide].classList.add('opacity-100')
        }
      }

      function nextSlide(){ updateSlide((currentSlide + 1) % totalSlides) }
      function prevSlide(){ updateSlide((currentSlide - 1 + totalSlides) % totalSlides) }
      function goToSlide(i){ updateSlide(i) }

      // expose globals for onclick handlers
      window.goToSlide = goToSlide
      window.nextSlide = nextSlide
      window.prevSlide = prevSlide

      // Attach click handlers to indicator dots
      indicators.forEach((btn, idx) => {
        btn.onclick = () => goToSlide(idx)
        btn.style.cursor = 'pointer'
      })

      const interval = setInterval(nextSlide, 8000)

      // Keyboard left/right navigation
      function onKey(e){
        if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return
        if(e.key === 'ArrowRight') nextSlide()
        if(e.key === 'ArrowLeft') prevSlide()
      }
      window.addEventListener('keydown', onKey)

      // Wire Patient Portal Login: find header button by text and postMessage to open auth
      const headerBtns = Array.from(document.querySelectorAll('header button'))
      const loginBtn = headerBtns.find(b => b.textContent && b.textContent.trim().toLowerCase().includes('patient portal'))
      if(loginBtn){
        const handler = () => {
          try{ window.parent.postMessage({type:'open-auth', mode:'login', role:'client'}, window.location.origin) }
          catch(e){ window.location.href = '/?auth=login&role=client' }
        }
        loginBtn.addEventListener('click', handler)
      }

      return ()=>{
        clearInterval(interval)
        window.goToSlide = undefined
        window.nextSlide = undefined
        window.prevSlide = undefined
        window.removeEventListener('keydown', onKey)
      }
    }, 100)

    return () => clearTimeout(timer)
  },[])

  return <div dangerouslySetInnerHTML={{__html: HOME_HTML}} />
}
