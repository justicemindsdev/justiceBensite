<script>
  import { onMount } from 'svelte';
  import Navbar from "$lib/Navbar.svelte";
  
  // The URL to redirect to
  const redirectUrl = "https://justiceminds-nine.vercel.app/rooms/f21a3397-f125-4360-8093-35e2cb812336";
  
  // Flag to control the visibility of the loading screen
  let isLoading = true;
  
  onMount(() => {
    // Set a short timeout to show the loading screen briefly before redirecting
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
  });
</script>

<Navbar />

{#if isLoading}
  <div class="fixed inset-0 bg-gradient-to-r from-black rounded-xl via-blue-950 to-black z-50 flex flex-col text-gray-500 items-center justify-center">
    <div class="animate-pulse mb-8">
      <img src="/assets/organized/logos/Logo-with-crown.png" alt="Logo" class="w-1/3 mx-auto object-contain" />
    </div>
    <h3 class="text-3xl text-gray-400 font-thin mb-4">Redirecting to Portal</h3>
    <p class="text-gray-600">Please wait while we connect you to the Justice Minds case management system...</p>
    
    <div class="mt-8 flex space-x-2">
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
    </div>
  </div>
{/if}
