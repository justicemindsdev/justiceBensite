<script>
  import Navbar from "$lib/Navbar.svelte";
  import { onMount } from "svelte";
  import { getAllEndorsements, getEndorsementById } from "$lib/content.js";

  // Get endorsements from the centralized content file
  const endorsements = getAllEndorsements();

  let selectedEndorsement = null;
  let visible = false;
  let carouselPosition = 0;
  let animationId = null;
  let carouselContainer;

  // Show endorsement details
  function showEndorsement(id) {
    selectedEndorsement = getEndorsementById(id);
    visible = true;
    
    // Add a small delay to ensure the DOM is updated
    setTimeout(() => {
      const backButton = document.querySelector('.back-button');
      if (backButton) {
        backButton.style.bottom = '2rem';
      }
    }, 100);
  }

  // Return to endorsements list
  function returnToEndorsements() {
    selectedEndorsement = null;
    visible = false;
  }

  // Animate the carousel
  function animateCarousel() {
    carouselPosition -= 0.5;
    
    // Reset position when it goes too far
    if (carouselPosition < -5000) {
      carouselPosition = 0;
    }
    
    if (carouselContainer) {
      carouselContainer.style.transform = `translateX(${carouselPosition}px)`;
    }
    
    animationId = requestAnimationFrame(animateCarousel);
  }

  onMount(() => {
    // Start the carousel animation
    animationId = requestAnimationFrame(animateCarousel);
    
    // Clean up on component unmount
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<Navbar />
<div id="root" style="padding-top: 60px;" class="bg-radial from-[#05042b] from-2% to-black">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-12 text-shadow">ENDORSEMENTS & ACCOLADES</h1>
    
    {#if !selectedEndorsement}
      <!-- Endorsements Carousel -->
      <div class="carousel-wrapper">
        <div class="flex items-center gap-8" bind:this={carouselContainer} role="region" aria-label="Endorsements carousel">
          <!-- Westminster City Council -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_city westminster.png" alt="Westminster City Council" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">WESTMINSTER ENDORSEMENT</h3>
                  <p class="text-sm text-gray-400">CITY COUNCIL RECOGNITION</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- House of Commons -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_house commons.png" alt="House of Commons" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">PARLIAMENTARY ENDORSEMENT</h3>
                  <p class="text-sm text-gray-400">HOUSE OF COMMONS RECOGNITION</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Liverpool City Council -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_lpool city counil .png" alt="Liverpool City Council" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-28 h-40 -mt-8 mb-4" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">LOCAL AUTHORITY RECOGNITION</h3>
                  <p class="text-sm text-gray-400">PRACTITIONER ENDORSEMENT</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Department of Health -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_download.png" alt="Department of Health" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-28 -mt-8" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">SECRETARY OF STATE ENGAGEMENT</h3>
                  <p class="text-sm text-gray-400">Health and Social Care communications</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Justice Recognition -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_justice .png" alt="Justice Recognition" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">JUSTICE ENDORSEMENT</h3>
                  <p class="text-sm text-gray-400">LEGAL ADVOCACY RECOGNITION</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- NSPCC -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_nspsc.png" alt="NSPCC" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">NSPCC ENDORSEMENT</h3>
                  <p class="text-sm text-gray-400">CHILD PROTECTION RECOGNITION</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- OBE Nomination -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_OBE-GOLD-Effect-logo.png" alt="OBE Nomination" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-32 h-32 -mt-8 mb-4" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">OBE NOMINATION INTERVIEW</h3>
                  <p class="text-sm text-gray-400">ORDER OF THE BRITISH EMPIRE</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Liverpool College -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_lliverpool collehe .png" alt="Liverpool College" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">EDUCATIONAL EXCELLENCE</h3>
                  <p class="text-sm text-gray-400">ACADEMIC RECOGNITION</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- UK Parliament -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/processed_UK-Parliament-Logo-1536x864.png" alt="UK Parliament" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-48 h-48" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">PARLIAMENTARY RECOGNITION</h3>
                  <p class="text-sm text-gray-400">LEGISLATIVE ENGAGEMENT</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cumbria Police -->
          <div class="flex-shrink-0">
            <div class="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
              <div class="absolute inset-0 flex flex-col items-center">
                <div class="flex-1 flex items-center justify-center -mt-4">
                  <img src="/Logo final/cumbria police.png" alt="Cumbria Police" class="object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] w-36 h-36 -mt-4" style="filter: brightness(1.4) contrast(0.95);">
                </div>
                <div class="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                  <h3 class="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">SENIOR DETECTIVE COMMENDATION</h3>
                  <p class="text-sm text-gray-400">LEGAL EXPERTISE &amp; RESILIENCE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Endorsement Detail View -->
      <div class="relative min-h-[60vh] flex items-center justify-center" class:visible>
        <img 
          src={selectedEndorsement.logo} 
          alt={selectedEndorsement.title}
          class="modal-logo"
        />
        
        <div class="modal-content">
          <h1 class="text-4xl font-bold mb-2 title-wrap typewriter">{selectedEndorsement.title}</h1>
          <h2 class="text-xl text-gray-300 mb-8">{selectedEndorsement.subtitle}</h2>
          
          <div class="endorsement-content">
            <p class="text-lg leading-relaxed">{selectedEndorsement.content}</p>
            
            {#if selectedEndorsement.quote}
              <div class="mt-8 p-6 border-l-4 border-blue-500 bg-opacity-20 bg-blue-900 rounded">
                <p class="italic text-gray-300">
                  "{selectedEndorsement.quote.text}"
                </p>
                <p class="mt-4 text-right">— {selectedEndorsement.quote.author}</p>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Return Button - Now properly positioned via CSS -->
        <button 
          class="back-button"
          on:click={returnToEndorsements}
        >
          Return to Endorsements
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .carousel-wrapper {
    width: 100%;
    overflow: hidden;
    margin: 2rem 0;
    position: relative;
  }
  
  .card-shadow {
    box-shadow: 
      0 0 40px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(0, 0, 0, 0.3);
  }

  .card-fade {
    background: linear-gradient(
      145deg,
      rgba(15, 23, 42, 0.7) 0%,
      rgba(0, 0, 0, 0.95) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    .flex.items-center.gap-8 > .flex-shrink-0 {
      transform: scale(0.8);
    }
  }
  
  /* Typewriter effect */
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }

  .typewriter {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 2s steps(40) forwards;
  }
  
  /* Modal content animation */
  .endorsement-content {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease 2s, transform 0.5s ease 2s;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .visible .endorsement-content {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Modal logo styling */
  .modal-logo {
    position: absolute;
    width: 800px;
    height: 1000px;
    opacity: 0.15;
    filter: brightness(1.8) contrast(0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: contain;
  }
  
  /* Modal content styling */
  .modal-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    border-left: 4px solid #3B82F6;
    margin-bottom: 3rem;
  }
  
  /* Back button styling */
  .back-button {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 2rem;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(12px);
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .back-button:hover {
    background: rgba(59, 130, 246, 0.9);
    transform: translateX(-50%) translateY(-2px);
  }
</style>

<!-- Google Custom Search -->
<div id="search" style="max-width: 800px; margin: 20px auto; padding: 20px; background: rgba(15, 23, 42, 0.7); border-radius: 12px; display: none;">
  <h3 style="color: #e2e8f0; margin-bottom: 15px; text-align: center;">News Search</h3>
  <script async src="https://cse.google.com/cse.js?cx=b4f0d42b9413c4450"></script>
  <div class="gcse-search"></div>
</div>
