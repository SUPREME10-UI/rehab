import React, { useState, useEffect } from 'react'
import './home.css'

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/slide1.jpg',
    position: 'center 20%',
    title: 'Advanced Rehabilitation for a Better Tomorrow',
    subtitle: 'Expert care, state-of-the-art facilities, and compassionate specialists dedicated to restoring your mobility and independence.',
    btnPrimary: 'Find a Specialist',
    btnSecondary: 'Explore Services',
  },
  {
    id: 2,
    image: '/images/slide2.jpg',
    position: 'center 25%',
    title: 'Specialized Care Across All Life Stages',
    subtitle: "From pediatric interventions to geriatric mobility solutions, we offer tailored rehabilitation plans for every patient's unique journey.",
    btnPrimary: 'View Our Programs',
    btnSecondary: 'Explore Services',
  },
  {
    id: 3,
    image: '/images/slide3.jpg',
    position: 'center 25%',
    title: 'Compassionate Support That Moves You Forward',
    subtitle: 'Our nurses and therapists work side by side with patients to build confidence, restore strength, and support recovery every step of the way.',
    btnPrimary: 'Meet the Care Team',
    btnSecondary: 'Explore Services',
  },
  {
    id: 4,
    image: '/images/slide4.jpg',
    position: 'center 30%',
    title: 'Professional Physical Therapy Solutions',
    subtitle: 'State-of-the-art facilities and evidence-based therapeutic techniques to accelerate your recovery and restore functional independence.',
    btnPrimary: 'Schedule Therapy',
    btnSecondary: 'Explore Services',
  }
]

const ALL_ARTICLES = [
  {
    id: 1,
    category: 'Neurology',
    categoryColor: '#1d59c1',
    categoryBg: '#eff6ff',
    readTime: '6 min read',
    date: 'Aug 12, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSZtTbcBncrHUfgRpQFWk0G81F3xGwodALQvAoB4VyzWPGDddc6bWUA7ff5PxLLzXC9SiF8UaenIYVKvNxb8JgDhX4_F_qykXSmUi0G3SS4LWBMgZNRX465BPl8lm7_ytDwn864a6ffECIW0Gb8BxnOed1cbQ85--cRgRj-VG4ZH-W06ojynPc0yP1JZMLVO9vdbyUl_3nxgGn9aHT1iDxhoyJyeWCDbvJqsbOAqsJe-cRsbwaPpgBPA',
    title: 'New Innovations in Stroke Recovery: The Role of Robotics',
    summary: 'Cutting-edge robotic exoskeletons are accelerating neuroplasticity and improving outcomes for stroke survivors.',
    body: 'Stroke recovery has long been one of rehabilitation medicine\'s greatest challenges. The brain\'s innate plasticity — its remarkable ability to rewire and form new neural pathways — is the foundation of neurological recovery. Robotic exoskeletons are now harnessing this property in revolutionary ways.\n\nDevices such as the Ekso Bionics EksoGT and ReWalk Personal 6.0 support body weight during gait retraining, allowing patients who have lost the ability to walk to take thousands of repetitive, properly patterned steps each session. This high-volume, task-specific practice is precisely what the brain needs to rebuild motor circuits.\n\nRecent clinical trials published in the Journal of NeuroEngineering and Rehabilitation showed that stroke patients using robotic-assisted gait training for 45 minutes per session, five days a week, achieved significantly greater improvements in walking speed and functional independence compared to conventional therapy alone.\n\nAt RehabConnect, our clinical team integrates robotic exoskeleton therapy with functional electrical stimulation (FES) and virtual reality environments to maximize neuroplastic potential. The results speak for themselves: our stroke rehabilitation program reports an 87% improvement in 10-Meter Walk Test scores and a 92% rate of improved community ambulation after a 12-week intensive program.'
  },
  {
    id: 2,
    category: 'Nutrition',
    categoryColor: '#047857',
    categoryBg: '#ecfdf5',
    readTime: '4 min read',
    date: 'Aug 8, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLfQ_LYxCIytMPK22BuX-pdtyYwuefI5PbG66CW2qsY9QOjVPWAiwuA4TXr-ANpnNnYIEBGtuWBHOUZHZupTY0yfvaH8pHeoG2h1eiWPoJYzeC1wCCgmBfTE9rFHIgA2TOiwqoohlewBt2wUbaiFjZ8YBA0CKqLJf1-UGmMV_UbejIr2PzMHTSGwAnWEpPl9wQE-WFceaUCfjShsWeyg53H7ohcQSVsvyaMSTYuo3adI40pncAVaMrAA',
    title: 'Nutrition Tips for Post-Surgical Healing',
    summary: 'Essential nutrients to accelerate tissue repair and optimize recovery timelines after orthopedic surgery.',
    body: 'Post-surgical recovery is not just about physical therapy — nutrition plays a critical and often underestimated role in how quickly and completely you heal. What you eat in the weeks following surgery directly impacts tissue repair, immune function, and inflammation control.\n\n**Protein:** Surgical trauma significantly increases your body\'s protein demands. Aim for 1.2–2.0g of high-quality protein per kilogram of body weight daily. Lean poultry, fish, eggs, Greek yogurt, and legumes are excellent sources. Protein provides the amino acid building blocks — particularly leucine, glycine, and proline — that are essential for collagen synthesis and muscle repair.\n\n**Vitamin C:** This antioxidant vitamin is a co-factor in collagen production. A deficiency can significantly delay wound healing. Include citrus fruits, bell peppers, strawberries, and broccoli in your daily diet, or consider a supplement providing 500–1000mg per day.\n\n**Zinc & Iron:** Both minerals are essential for cellular proliferation and oxygen transport to healing tissues. Red meat, shellfish, pumpkin seeds, and fortified cereals are strong sources. Work with your dietitian to monitor levels, as excessive supplementation can be counterproductive.\n\n**Omega-3 Fatty Acids:** Found in fatty fish, walnuts, and flaxseed, omega-3s help regulate the inflammatory response. While some initial inflammation is necessary for healing, chronic inflammation impairs tissue repair. Omega-3s help strike this balance.\n\nOur registered dietitians at RehabConnect provide personalized post-surgical nutrition plans tailored to your specific procedure, recovery goals, and dietary preferences.'
  },
  {
    id: 3,
    category: 'Orthopedics',
    categoryColor: '#b45309',
    categoryBg: '#fffbeb',
    readTime: '5 min read',
    date: 'Aug 5, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASNDOKDPH32EzD7yAkwNXD6UiaUk1eA3nXcjH1L03svM1cmzDKVUOIDhYIvZz-_Jkxa2i5ZeKuhXLYwFjL-M1J3O4fXzCNQAvI1FbMyajYd-M00arzLLxWX9-DqW3g0xrxDj6UHFUJMF5gSZ-mCDJYJKWiIYour4NQbvDszcr5uOmQUJzGnbsUXeAPlG3kNYJthS2GBvKQ5KzUEr6seyN_xIfpfBU8e_FN3LkIcP63prHm5wEyKFS0Ng',
    title: 'Understanding Joint Preservation Techniques',
    summary: 'Non-invasive strategies and therapeutic modalities to maintain joint health and delay degenerative progression.',
    body: 'Joint preservation is a proactive medical philosophy aimed at extending the life of your natural joints through targeted interventions before degeneration requires surgical replacement. At RehabConnect, our orthopedic physical therapists specialize in evidence-based joint preservation strategies.\n\n**Unloading and Load Management:** Many joint conditions worsen due to abnormal force distribution during movement. Through gait retraining, orthotics, and activity modification, we reduce peak joint loads by up to 30%, significantly slowing cartilage breakdown.\n\n**Therapeutic Exercise:** Strengthening the muscles that surround and support a compromised joint is the single most powerful non-surgical intervention. Quadriceps strengthening for the knee, rotator cuff rehabilitation for the shoulder, and hip abductor conditioning for the hip all reduce joint contact forces during functional activities.\n\n**Manual Therapy:** Joint mobilization and manipulation techniques improve synovial fluid circulation, restore accessory joint motion, and reduce pain — creating a window of opportunity for therapeutic exercise to take effect.\n\n**Viscosupplementation Support:** Our clinical team coordinates with referring physicians to integrate hyaluronic acid injections, where appropriate, as a complement to physical therapy — providing lubrication and cushioning within the joint space.\n\n**Neuromuscular Re-education:** Proprioceptive training — teaching the joint to sense its position in space — is critical for preventing injurious movement patterns that accelerate wear and tear.\n\nThe goal of joint preservation is always to help you maintain an active, independent life for as long as possible on your natural joints.'
  },
  {
    id: 4,
    category: 'Pediatrics',
    categoryColor: '#1d59c1',
    categoryBg: '#eff6ff',
    readTime: '5 min read',
    date: 'Jul 29, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLfQ_LYxCIytMPK22BuX-pdtyYwuefI5PbG66CW2qsY9QOjVPWAiwuA4TXr-ANpnNnYIEBGtuWBHOUZHZupTY0yfvaH8pHeoG2h1eiWPoJYzeC1wCCgmBfTE9rFHIgA2TOiwqoohlewBt2wUbaiFjZ8YBA0CKqLJf1-UGmMV_UbejIr2PzMHTSGwAnWEpPl9wQE-WFceaUCfjShsWeyg53H7ohcQSVsvyaMSTYuo3adI40pncAVaMrAA',
    title: 'Early Intervention: Why Timing Matters for Child Development',
    summary: 'How early physiotherapy referrals dramatically improve long-term outcomes for children with developmental concerns.',
    body: 'In pediatric rehabilitation, no principle is more important — or more evidence-supported — than the concept of early intervention. The developing nervous system is at its most plastic and responsive during the first years of life, making this window a critical opportunity for therapeutic influence.\n\nResearch consistently shows that children who receive targeted physical and occupational therapy before age three achieve significantly better functional outcomes than those who begin treatment later. This is particularly true for conditions such as cerebral palsy, developmental coordination disorder, and early-onset neuromuscular conditions.\n\n**The Brain\'s Plasticity Window:** Neural pathways are forming at an extraordinary rate during infancy and early childhood. Therapeutic interventions delivered during this period can redirect pathological movement patterns, strengthen underdeveloped neural circuits, and establish motor programs that support lifelong independence.\n\n**Red Flags to Watch For:** Parents and pediatricians should be alert to signs such as asymmetrical movement, delayed sitting or walking milestones, reduced hand use, persistent toe walking, or difficulty with fine motor tasks. Early referral to a pediatric physical therapist for assessment is always appropriate when concerns arise.\n\n**What Early Intervention Looks Like:** Our pediatric sessions are play-based and family-centered. We work with parents to incorporate therapeutic activities into daily routines — bath time, feeding, floor play — maximizing the dose of practice that is so critical for neuromotor learning.\n\nDo not wait for a definitive diagnosis before seeking a pediatric therapy evaluation. Early assessment is always beneficial and carries no risk.'
  },
  {
    id: 5,
    category: 'Geriatrics',
    categoryColor: '#334155',
    categoryBg: '#f8fafc',
    readTime: '4 min read',
    date: 'Jul 22, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASNDOKDPH32EzD7yAkwNXD6UiaUk1eA3nXcjH1L03svM1cmzDKVUOIDhYIvZz-_Jkxa2i5ZeKuhXLYwFjL-M1J3O4fXzCNQAvI1FbMyajYd-M00arzLLxWX9-DqW3g0xrxDj6UHFUJMF5gSZ-mCDJYJKWiIYour4NQbvDszcr5uOmQUJzGnbsUXeAPlG3kNYJthS2GBvKQ5KzUEr6seyN_xIfpfBU8e_FN3LkIcP63prHm5wEyKFS0Ng',
    title: 'Fall Prevention: The Science Behind Balance Training',
    summary: 'Evidence-based balance exercises and vestibular therapy that reduce fall risk by up to 50% in older adults.',
    body: 'Falls are the leading cause of injury-related death in adults over 65 — and they are largely preventable. The science of fall prevention has advanced enormously in the past decade, and structured balance training programs are now one of the most evidence-supported interventions in all of preventive medicine.\n\n**Understanding Fall Risk:** Balance is the product of three sensory systems working in concert — vision, the vestibular system (inner ear), and proprioception (joint position sense). As we age, each of these systems gradually declines. The brain\'s ability to integrate their signals also diminishes, increasing the risk of a fall during any activity that challenges stability.\n\n**Evidence-Based Balance Programs:** The Otago Exercise Programme and STEADI (Stopping Elderly Accidents, Deaths & Injuries) protocol are among the most rigorously validated fall prevention programs. Both have been shown in randomized controlled trials to reduce fall rates by 35–40% in high-risk older adults.\n\n**What We Do at RehabConnect:** Our geriatric physical therapists begin with a comprehensive balance assessment using the Berg Balance Scale, Timed Up and Go Test, and dynamic gait index. We then design a progressive home and clinic exercise program addressing specific deficits — whether that\'s hip and ankle strengthening, dual-task training, vestibular rehabilitation, or environmental hazard reduction.\n\n**Tai Chi:** This ancient practice is one of the few exercise modalities with robust clinical evidence for fall prevention. Our group Tai Chi for Balance classes are a popular and effective addition to individualized therapy.\n\nIf you or a loved one has fallen in the past year, please schedule a fall risk assessment with our team — it may be the most important health decision you make this year.'
  },
  {
    id: 6,
    category: 'Sports Medicine',
    categoryColor: '#0d9488',
    categoryBg: '#f0fdfa',
    readTime: '7 min read',
    date: 'Jul 15, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSZtTbcBncrHUfgRpQFWk0G81F3xGwodALQvAoB4VyzWPGDddc6bWUA7ff5PxLLzXC9SiF8UaenIYVKvNxb8JgDhX4_F_qykXSmUi0G3SS4LWBMgZNRX465BPl8lm7_ytDwn864a6ffECIW0Gb8BxnOed1cbQ85--cRgRj-VG4ZH-W06ojynPc0yP1JZMLVO9vdbyUl_3nxgGn9aHT1iDxhoyJyeWCDbvJqsbOAqsJe-cRsbwaPpgBPA',
    title: 'ACL Return-to-Sport: Criteria That Actually Matter',
    summary: 'Why time-based discharge is obsolete, and which functional criteria truly predict safe return to competitive sport.',
    body: 'For decades, ACL reconstruction rehabilitation was guided primarily by time — if six or nine months had passed since surgery, the athlete was cleared to return to sport. We now know this approach is dangerously inadequate. Re-injury rates for athletes cleared on time alone remain stubbornly high at 15–25% for primary ACL tears, and dramatically higher for revision surgeries.\n\n**The Criteria-Based Paradigm:** Modern sports medicine has shifted decisively toward criteria-based return-to-sport decision making. This means an athlete returns when they can demonstrate objective, measurable readiness — not simply when enough time has elapsed.\n\n**Key Return-to-Sport Criteria:**\n\n- **Limb Symmetry Index (LSI):** Quadriceps and hamstring strength measured by isokinetic dynamometry should be ≥90% of the uninvolved limb. Research shows that athletes returning with LSI <90% face dramatically elevated re-injury risk.\n\n- **Functional Hop Tests:** Single-leg hop, triple hop, crossover hop, and 6-meter timed hop tests should all reach ≥90% LSI. These tests assess neuromuscular control and confidence under load.\n\n- **Psychological Readiness:** The ACL-RSI (Return to Sport after Injury) scale assesses emotions, confidence, and risk appraisal. Low psychological readiness is an independent predictor of re-injury.\n\n- **Movement Quality:** A clinical movement analysis — assessing frontal-plane knee mechanics, landing patterns, and trunk control — must confirm that the athlete is moving safely before contact clearance is given.\n\n**At RehabConnect:** Our sports rehabilitation team uses force plate technology, isokinetic dynamometry, and video motion analysis to objectively quantify readiness. We believe every athlete deserves data-driven clearance decisions — not calendar-driven ones.'
  }
]

const LIFE_STAGE_PROGRAMS = {
  pediatric: {
    id: 'pediatric',
    title: 'Pediatric Rehabilitation Program',
    badge: 'Ages 0 – 17',
    icon: 'sentiment_satisfied',
    themeClass: 'pediatric',
    themeColor: '#1d59c1',
    tagline: 'Nurturing growth, strength, and developmental milestones in a fun, child-centered clinical environment.',
    stats: [
      { label: 'Milestone Attainment', value: '96%' },
      { label: 'Specialist Care', value: '1-on-1 Certified' },
      { label: 'Avg. Recovery Roadmap', value: '8–12 Weeks' }
    ],
    overview: 'Our pediatric program is designed to help infants, children, and adolescents reach their full physical, sensory, and developmental potential. Through play-based exercise therapy and neuro-developmental techniques, our pediatric clinical specialists guide families every step of the way.',
    coreServices: [
      {
        icon: 'toys',
        title: 'Developmental Motor Milestone Retraining',
        desc: 'Rolling, sitting, crawling, independent walking, and dynamic balance coordination.'
      },
      {
        icon: 'psychology',
        title: 'Sensory Integration & Motor Planning',
        desc: 'Sensory gym protocols to enhance spatial awareness, sensory regulation, and coordination.'
      },
      {
        icon: 'accessibility_new',
        title: 'Pediatric Physical & Occupational Therapy',
        desc: 'Strengthening, joint range of motion, fine motor skills, handwriting, and daily independence.'
      },
      {
        icon: 'fitness_center',
        title: 'Orthotics & Pediatric Gait Training',
        desc: 'Custom brace evaluation, LiteGait body-weight supported walking, and assistive technology fitting.'
      }
    ],
    conditionsTreated: [
      'Developmental Delay & Coordination Disorders (DCD)',
      'Cerebral Palsy & Neuromuscular Conditions',
      'Torticollis & Infant Plagiocephaly',
      'Post-Surgical Orthopedic Care (Fractures, ACL)',
      'Juvenile Idiopathic Arthritis & Hypermobility',
      'Idiopathic Toe Walking & Gait Abnormalities'
    ],
    careTeam: 'Certified Pediatric Physical Therapists (PCS), Pediatric Occupational Therapists (OTR/L), and Speech-Language Pathologists (SLP).'
  },
  adult: {
    id: 'adult',
    title: 'Adult Orthopedic & Sports Recovery',
    badge: 'Ages 18 – 64',
    icon: 'directions_walk',
    themeClass: 'adult',
    themeColor: '#0d9488',
    tagline: 'Accelerating recovery, eradicating pain, and restoring peak functional athletic mobility.',
    stats: [
      { label: 'Return-to-Activity Rate', value: '94%' },
      { label: 'Average Pain Reduction', value: '-74%' },
      { label: 'Clinical Protocols', value: '100% Evidence-Based' }
    ],
    overview: 'Whether recovering from reconstructive orthopedic surgery, an acute sports injury, or persistent work-related musculoskeletal pain, our adult program pairs hands-on manual therapy with advanced biomechanical conditioning to ensure safe, lasting recovery.',
    coreServices: [
      {
        icon: 'healing',
        title: 'Post-Surgical Joint Rehabilitation',
        desc: 'Evidence-based staged protocols for ACL reconstruction, rotator cuff repair, and total knee/hip replacements.'
      },
      {
        icon: 'sports_tennis',
        title: 'Sports Performance & Return-to-Play',
        desc: 'High-speed motion video capture, agility drills, plyometrics, and sport-specific biomechanics.'
      },
      {
        icon: 'medical_services',
        title: 'Advanced Manual Therapy & Dry Needling',
        desc: 'Spinal mobilization, myofascial release, joint manipulation, and instrument-assisted soft tissue therapy.'
      },
      {
        icon: 'monitor_heart',
        title: 'Spinal Stabilization & Ergonomic Re-education',
        desc: 'Core endurance, postural correction, and progressive loading for lifelong back & neck health.'
      }
    ],
    conditionsTreated: [
      'Post-Op ACL, Meniscus & Rotator Cuff Repairs',
      'Total Knee, Hip, and Shoulder Joint Replacements',
      'Herniated Discs, Sciatica, and Lumbar Strain',
      'Tendonitis, Bursitis & Impingement Syndromes',
      'Workplace Repetitive Strain Injuries (RSI)',
      'Acute Sprains, Muscle Tears, and Fractures'
    ],
    careTeam: 'Board-Certified Orthopedic Clinical Specialists (OCS), Sports Certified PTs (SCS), and Certified Strength Coaches (CSCS).'
  },
  geriatric: {
    id: 'geriatric',
    title: 'Geriatric Mobility & Balance Vitality',
    badge: 'Ages 65+',
    icon: 'elderly',
    themeClass: 'geriatric',
    themeColor: '#334155',
    tagline: 'Empowering seniors with balance confidence, fall prevention, and lifelong independent living.',
    stats: [
      { label: 'Fall Risk Reduction', value: '88%' },
      { label: 'Home Independence Rate', value: '91%' },
      { label: 'Patient Satisfaction', value: '99%' }
    ],
    overview: 'Our specialized geriatric rehabilitation program is dedicated to keeping older adults active, steady, and autonomous. We combine gentle, progressive resistance training with vestibular therapy and transfer mechanics to preserve independence and quality of life.',
    coreServices: [
      {
        icon: 'accessibility',
        title: 'Evidence-Based Fall Prevention & Balance',
        desc: 'Vestibular retraining, dynamic obstacle walking, and computerized balance assessment systems.'
      },
      {
        icon: 'fitness_center',
        title: 'Osteoporosis & Sarcopenia Strengthening',
        desc: 'Safe, low-impact loading exercises to increase bone mineral density and functional muscle reserves.'
      },
      {
        icon: 'airline_seat_recline_extra',
        title: 'Safe Transfer & Ambulatory Mechanics',
        desc: 'Sit-to-stand techniques, stair negotiation, and personalized rolling walker / cane fitting.'
      },
      {
        icon: 'home',
        title: 'Home Safety & Accessibility Assessment',
        desc: 'Environmental hazard elimination, grab bar recommendations, and home exercise roadmaps.'
      }
    ],
    conditionsTreated: [
      'Balance Instability, Vertigo & Frequent Unsteadiness',
      'Osteoarthritis, Rheumatoid Arthritis & Chronic Joint Pain',
      'Post-Stroke, Parkinson’s & Neurological Movement Needs',
      'Post-Hip Fracture & Joint Replacement Recovery',
      'Spinal Stenosis & Degenerative Disc Discomfort',
      'Generalized Weakness & Post-Hospitalization Recovery'
    ],
    careTeam: 'Geriatric Clinical Specialists (GCS), Certified Fall-Risk Assessment PTs, and Occupational Therapists.'
  }
}

export default function Home({ onOpenPortal, onLoginClick }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedProgramKey, setSelectedProgramKey] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showAllArticles, setShowAllArticles] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProgramKey(null)
        setSelectedArticle(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const goToSlide = (idx) => setCurrentSlide(idx)

  const handlePortalAction = () => {
    setSelectedProgramKey(null)
    setSelectedArticle(null)
    if (onOpenPortal) {
      onOpenPortal()
    } else if (onLoginClick) {
      onLoginClick('client')
    } else {
      window.location.href = '/?auth=login&role=client'
    }
  }

  const activeProgram = selectedProgramKey ? LIFE_STAGE_PROGRAMS[selectedProgramKey] : null

  return (
    <div className="rc-home-wrapper">
      {/* ==================================================================== */}
      {/* 1. HEADER / NAVBAR                                                  */}
      {/* ==================================================================== */}
      <header className="rc-header">
        <div className="rc-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="rc-brand-icon">
            <span className="material-symbols-outlined">medical_services</span>
          </div>
          <span className="rc-brand-title">RehabConnect</span>
        </div>

        <nav className="rc-nav">
          <a href="#home" className="rc-nav-link active">Home</a>
          <a href="#services" className="rc-nav-link">Services</a>
          <a href="#about" className="rc-nav-link">About Us</a>
          <a href="#contact" className="rc-nav-link">Contact</a>
        </nav>

        <div className="rc-header-actions">
          <button className="rc-icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="rc-icon-btn" aria-label="History">
            <span className="material-symbols-outlined">history</span>
          </button>
          <button className="rc-login-btn" onClick={handlePortalAction}>
            Patient Portal Login
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO CAROUSEL                                                    */}
      {/* ==================================================================== */}
      <section className="rc-hero-section" id="home">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`rc-hero-slide ${currentSlide === index ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="rc-hero-bg-img"
              style={{ objectPosition: slide.position || 'center center' }}
            />
            <div className="rc-hero-overlay">
              <div className="rc-hero-container">
                <div className="rc-hero-content">
                  <h1 className="rc-hero-title">
                    {slide.title}
                  </h1>
                  <p className="rc-hero-subtitle">
                    {slide.subtitle}
                  </p>
                  <div className="rc-hero-actions">
                    <button className="rc-btn-specialist" onClick={handlePortalAction}>
                      {slide.btnPrimary}
                    </button>
                    <button
                      className="rc-btn-services"
                      onClick={() => {
                        const el = document.getElementById('services')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {slide.btnSecondary}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrow Controls */}
        <button className="rc-carousel-btn prev" onClick={prevSlide} aria-label="Previous Slide">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="rc-carousel-btn next" onClick={nextSlide} aria-label="Next Slide">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>

        {/* Indicators */}
        <div className="rc-carousel-indicators">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              className={`rc-indicator-pill ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. CARE FOR EVERY LIFE STAGE                                         */}
      {/* ==================================================================== */}
      <section className="rc-lifestages-section" id="services">
        <div className="rc-section-header-center">
          <h2 className="rc-section-title">Care for Every Life Stage</h2>
          <p className="rc-section-subtitle">
            Comprehensive rehabilitation programs designed specifically for the unique physiological needs of different age groups.
          </p>
        </div>

        <div className="rc-cards-grid">
          {/* Card 1: Pediatric Rehab */}
          <div
            className="rc-stage-card"
            onClick={() => setSelectedProgramKey('pediatric')}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
          >
            <div className="rc-stage-icon-box pediatric" style={{ marginBottom: '20px' }}>
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </div>
            <h3 className="rc-stage-title">Pediatric Rehab</h3>
            <p className="rc-stage-desc">
              Specialized therapies focused on developmental milestones, motor skills, and strengthening in a supportive environment for children.
            </p>
            <div className="rc-stage-footer">
              <button
                type="button"
                className="rc-stage-link pediatric"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProgramKey('pediatric')
                }}
              >
                Learn More <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Adult Orthopedic Recovery */}
          <div
            className="rc-stage-card"
            onClick={() => setSelectedProgramKey('adult')}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
          >
            <div className="rc-stage-icon-box adult" style={{ marginBottom: '20px' }}>
              <span className="material-symbols-outlined">directions_walk</span>
            </div>
            <h3 className="rc-stage-title">Adult Orthopedic Recovery</h3>
            <p className="rc-stage-desc">
              Post-surgical rehabilitation, sports injury recovery, and comprehensive physical therapy to restore full function and mobility.
            </p>
            <div className="rc-stage-footer">
              <button
                type="button"
                className="rc-stage-link adult"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProgramKey('adult')
                }}
              >
                Learn More <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3: Geriatric Mobility */}
          <div
            className="rc-stage-card"
            onClick={() => setSelectedProgramKey('geriatric')}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
          >
            <div className="rc-stage-icon-box geriatric" style={{ marginBottom: '20px' }}>
              <span className="material-symbols-outlined">elderly</span>
            </div>
            <h3 className="rc-stage-title">Geriatric Mobility</h3>
            <p className="rc-stage-desc">
              Focused on balance, fall prevention, joint pain management, and maintaining independence through targeted exercises.
            </p>
            <div className="rc-stage-footer">
              <button
                type="button"
                className="rc-stage-link geriatric"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProgramKey('geriatric')
                }}
              >
                Learn More <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3B. PROGRAM DETAILS MODAL                                            */}
      {/* ==================================================================== */}
      {activeProgram && (
        <div
          className="rc-program-modal-backdrop"
          onClick={() => setSelectedProgramKey(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rc-program-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="rc-modal-header">
              <div className="rc-modal-title-group">
                <div className={`rc-modal-icon-box ${activeProgram.themeClass}`}>
                  <span className="material-symbols-outlined">{activeProgram.icon}</span>
                </div>
                <div>
                  <div className="rc-modal-badge-row">
                    <span className={`rc-stage-age-pill ${activeProgram.themeClass}`}>
                      {activeProgram.badge}
                    </span>
                    <span className="rc-modal-clinic-tag">Clinical Specialty Track</span>
                  </div>
                  <h2 className="rc-modal-title">{activeProgram.title}</h2>
                </div>
              </div>
              <button
                className="rc-modal-close-btn"
                onClick={() => setSelectedProgramKey(null)}
                aria-label="Close details"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="rc-modal-body">
              {/* Tagline Callout */}
              <div className={`rc-modal-tagline ${activeProgram.themeClass}`}>
                <span className="material-symbols-outlined">verified</span>
                <p>{activeProgram.tagline}</p>
              </div>

              {/* Stats Highlights */}
              <div className="rc-modal-stats-grid">
                {activeProgram.stats.map((st, i) => (
                  <div key={i} className="rc-modal-stat-card">
                    <div className="rc-modal-stat-val">{st.value}</div>
                    <div className="rc-modal-stat-lbl">{st.label}</div>
                  </div>
                ))}
              </div>

              {/* Program Overview */}
              <div className="rc-modal-section">
                <h4 className="rc-modal-section-title">
                  <span className="material-symbols-outlined">info</span>
                  Program Overview
                </h4>
                <p className="rc-modal-desc">{activeProgram.overview}</p>
              </div>

              {/* Core Specialized Services */}
              <div className="rc-modal-section">
                <h4 className="rc-modal-section-title">
                  <span className="material-symbols-outlined">medical_services</span>
                  Core Therapies &amp; Interventions
                </h4>
                <div className="rc-modal-services-grid">
                  {activeProgram.coreServices.map((srv, idx) => (
                    <div key={idx} className="rc-modal-service-item">
                      <div className="rc-service-icon-wrap">
                        <span className="material-symbols-outlined">{srv.icon}</span>
                      </div>
                      <div>
                        <h5>{srv.title}</h5>
                        <p>{srv.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions Treated */}
              <div className="rc-modal-section">
                <h4 className="rc-modal-section-title">
                  <span className="material-symbols-outlined">checklist</span>
                  Common Conditions Addressed
                </h4>
                <div className="rc-modal-conditions-grid">
                  {activeProgram.conditionsTreated.map((cond, i) => (
                    <div key={i} className="rc-condition-item">
                      <span className="material-symbols-outlined check">check_circle</span>
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multidisciplinary Care Team */}
              <div className="rc-modal-team-box">
                <span className="material-symbols-outlined">groups</span>
                <div>
                  <strong>Dedicated Care Team:</strong> {activeProgram.careTeam}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="rc-modal-footer">
              <button
                className="rc-modal-btn-secondary"
                onClick={() => setSelectedProgramKey(null)}
              >
                Close
              </button>
              <button
                className="rc-modal-btn-primary"
                onClick={handlePortalAction}
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Book Program Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. HEALTH & WELLNESS UPDATES                                         */}
      {/* ==================================================================== */}
      <section className="rc-updates-section" id="about">
        <div className="rc-updates-container">
          <div className="rc-updates-header">
            <div>
              <h2 className="rc-section-title" style={{ marginBottom: '4px' }}>Health &amp; Wellness Updates</h2>
              <p className="rc-section-subtitle">Latest insights and tips from our clinical specialists.</p>
            </div>
            <button
              className="rc-view-all-link"
              onClick={() => setShowAllArticles(!showAllArticles)}
            >
              {showAllArticles ? 'Show Less' : 'View All Articles'}
              <span className="material-symbols-outlined">
                {showAllArticles ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>

          {/* Bento: Featured + 2 Side Cards */}
          <div className="rc-bento-grid">
            {/* Featured Article (Left) */}
            <div className="rc-featured-article" onClick={() => setSelectedArticle(ALL_ARTICLES[0])}>
              <img
                src={ALL_ARTICLES[0].image}
                alt={ALL_ARTICLES[0].title}
                className="rc-featured-img"
              />
              <div className="rc-featured-overlay">
                <span className="rc-badge-neurology">{ALL_ARTICLES[0].category}</span>
                <h3 className="rc-featured-title">{ALL_ARTICLES[0].title}</h3>
                <p className="rc-featured-desc">{ALL_ARTICLES[0].summary}</p>
              </div>
            </div>

            {/* Side Articles (Right) */}
            <div className="rc-side-articles">
              {ALL_ARTICLES.slice(1, 3).map((article) => (
                <div key={article.id} className="rc-side-card" onClick={() => setSelectedArticle(article)}>
                  <img src={article.image} alt={article.title} className="rc-side-thumb" />
                  <div className="rc-side-info">
                    <span
                      className="rc-side-tag"
                      style={{ backgroundColor: article.categoryBg, color: article.categoryColor }}
                    >
                      {article.category}
                    </span>
                    <h4 className="rc-side-title">{article.title}</h4>
                    <p className="rc-side-desc">{article.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expanded All Articles Grid */}
          {showAllArticles && (
            <div className="rc-all-articles-grid">
              {ALL_ARTICLES.slice(3).map((article) => (
                <div
                  key={article.id}
                  className="rc-article-card"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="rc-article-card-img-wrap">
                    <img src={article.image} alt={article.title} className="rc-article-card-img" />
                    <span
                      className="rc-article-card-badge"
                      style={{ backgroundColor: article.categoryBg, color: article.categoryColor }}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="rc-article-card-body">
                    <div className="rc-article-card-meta">
                      <span className="material-symbols-outlined">schedule</span>
                      {article.readTime}
                      <span className="rc-article-meta-sep">·</span>
                      {article.date}
                    </div>
                    <h4 className="rc-article-card-title">{article.title}</h4>
                    <p className="rc-article-card-summary">{article.summary}</p>
                    <span className="rc-article-card-cta">
                      Read Article <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4B. ARTICLE READER MODAL                                             */}
      {/* ==================================================================== */}
      {selectedArticle && (
        <div
          className="rc-program-modal-backdrop"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rc-program-modal-card rc-article-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Article Modal Header */}
            <div className="rc-modal-header">
              <div className="rc-modal-title-group">
                <div>
                  <div className="rc-modal-badge-row">
                    <span
                      className="rc-stage-age-pill"
                      style={{
                        backgroundColor: selectedArticle.categoryBg,
                        color: selectedArticle.categoryColor,
                        border: `1px solid ${selectedArticle.categoryColor}33`
                      }}
                    >
                      {selectedArticle.category}
                    </span>
                    <span className="rc-modal-clinic-tag">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle' }}>schedule</span>
                      {' '}{selectedArticle.readTime} · {selectedArticle.date}
                    </span>
                  </div>
                  <h2 className="rc-modal-title">{selectedArticle.title}</h2>
                </div>
              </div>
              <button
                className="rc-modal-close-btn"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Article Image */}
            <div className="rc-article-modal-img-wrap">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="rc-article-modal-img" />
            </div>

            {/* Article Body */}
            <div className="rc-modal-body rc-article-modal-body">
              {selectedArticle.body.split('\n\n').map((para, i) => (
                <p key={i} className="rc-article-para">
                  {para}
                </p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="rc-modal-footer">
              <button
                className="rc-modal-btn-secondary"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </button>
              <button
                className="rc-modal-btn-primary"
                onClick={handlePortalAction}
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. FOOTER                                                            */}
      {/* ==================================================================== */}
      <footer className="rc-footer" id="contact">
        <div className="rc-footer-container">
          <div className="rc-footer-grid">
            {/* Column 1: Brand */}
            <div>
              <div className="rc-footer-brand">
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#93c5fd' }}>
                  medical_services
                </span>
                <span className="rc-footer-brand-title">RehabConnect</span>
              </div>
              <p className="rc-footer-about">
                Providing systematic, professional, and trustworthy rehabilitation services to restore mobility and improve quality of life.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="rc-footer-col-title">QUICK LINKS</h4>
              <ul className="rc-footer-links">
                <li><a href="#specialist" className="rc-footer-link" onClick={(e) => { e.preventDefault(); handlePortalAction(); }}>Find a Specialist</a></li>
                <li><a href="#services" className="rc-footer-link">Our Services</a></li>
                <li><a href="#portal" className="rc-footer-link" onClick={(e) => { e.preventDefault(); handlePortalAction(); }}>Patient Portal</a></li>
                <li><a href="#careers" className="rc-footer-link">Careers</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="rc-footer-col-title">CONTACT</h4>
              <div>
                <div className="rc-footer-contact-item">
                  <span className="material-symbols-outlined">call</span>
                  <span>1-800-REHAB-CARE</span>
                </div>
                <div className="rc-footer-contact-item">
                  <span className="material-symbols-outlined">mail</span>
                  <span>contact@rehabconnect.org</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rc-footer-divider">
            © 2024 RehabConnect Systems. All rights reserved. Professional Healthcare Environment.
          </div>
        </div>
      </footer>
    </div>
  )
}
