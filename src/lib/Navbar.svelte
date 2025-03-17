<script>
  import { getNavLinks } from './content.js';
  
  // Get navigation links from the centralized content file
  const navLinks = getNavLinks();
</script>

<header class="text-gray-400 bg-gradient-to-r from-black m-2 rounded-xl via-blue-950 to-black border-b border-gray-700">
  <div class="w-full flex flex-wrap px-5 py-2 flex-col md:flex-row items-center">
    <a href="/" class="flex title-font items-center text-white mb-4 md:mb-0">
      <img src="/assets/organized/logos/Logo-with-crown.png" class="w-[80px]" alt="Ben Mak Logo">
      <!-- Uncomment to add text next to logo
      <div class="flex flex-col">
        <span class="ml-3 text-xl">Justice Minds</span>
        <span class="ml-3 text-xs font-thin text-gray-400">Official Govt Portal</span>
      </div> -->
    </a>
    
    <nav data-sveltekit-reload class="md:ml-auto flex flex-wrap items-center text-base justify-center">
      {#each navLinks.filter(link => !link.isButton) as link}
        <a href={link.url} class="mr-5 hover:text-white">{link.title}</a>
      {/each}
    </nav>
    
    {#each navLinks.filter(link => link.isButton) as buttonLink}
      <a 
        href={buttonLink.url.startsWith('http') ? buttonLink.url : buttonLink.url === '/contact' ? 'mailto:consult@justice-minds.com' : buttonLink.url} 
        class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
      >
        {buttonLink.title}
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
    {/each}
  </div>
</header>
