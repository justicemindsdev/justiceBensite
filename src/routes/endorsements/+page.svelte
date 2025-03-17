<script>
  import Navbar from "$lib/Navbar.svelte";
  import { onMount } from "svelte";
  import { getAllEndorsements, getEndorsementById } from "$lib/content.js";

  // Get endorsements from the centralized content file
  const endorsements = getAllEndorsements();

  let selectedEndorsement = null;
  let visible = false;

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

  onMount(() => {
    // Add event listeners or initialization code here
  });
</script>

<Navbar />
<div id="root" style="padding-top: 60px;" class="bg-radial from-[#05042b] from-2% to-black">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-12 text-shadow">ENDORSEMENTS & ACCOLADES</h1>
    
    {#if !selectedEndorsement}
      <!-- Endorsements Grid -->
      <div class="endorsements-grid">
        {#each endorsements as endorsement}
          <div 
            class="endorsement-card card-fade card-shadow rounded-lg p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105"
            on:click={() => showEndorsement(endorsement.id)}
          >
            <img 
              src={endorsement.logo} 
              alt={endorsement.title} 
              class="w-32 h-32 mx-auto mb-4 object-contain"
            />
            <h2 class="endorsement-title text-xl font-semibold mb-2">{endorsement.title}</h2>
            <p class="endorsement-subtitle text-sm text-gray-300">{endorsement.subtitle}</p>
          </div>
        {/each}
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

<!-- Google Custom Search -->
<div id="search" style="max-width: 800px; margin: 20px auto; padding: 20px; background: rgba(15, 23, 42, 0.7); border-radius: 12px; display: none;">
  <h3 style="color: #e2e8f0; margin-bottom: 15px; text-align: center;">News Search</h3>
  <script async src="https://cse.google.com/cse.js?cx=b4f0d42b9413c4450"></script>
  <div class="gcse-search"></div>
</div>
