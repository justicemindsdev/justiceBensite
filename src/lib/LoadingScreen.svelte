<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { ProgressReporter, progressStore } from './ContentProcessor.js';
    
    let visible = true;
    let progress = 0;
    let loadingMessage = "Initializing...";
    
    // Create a progress reporter for the loading sequence
    const loadingSteps = [
        "Initializing application...",
        "Loading resources...",
        "Preparing content...",
        "Optimizing display...",
        "Finalizing..."
    ];
    
    onMount(() => {
        const reporter = new ProgressReporter(loadingSteps.length, "Loading");
        
        // Subscribe to progress updates
        const unsubscribe = progressStore.subscribe(state => {
            progress = state.percentage;
            if (state.current < loadingSteps.length) {
                loadingMessage = loadingSteps[state.current];
            }
        });
        
        // Simulate loading steps
        let step = 0;
        const interval = setInterval(() => {
            if (step >= loadingSteps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    visible = false;
                }, 500);
                return;
            }
            
            reporter.update(step);
            step++;
        }, 400);
        
        // Cleanup on component unmount
        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    });
</script>

{#if visible}
    <div 
        transition:fade={{duration: 500}}
        class="fixed inset-0 bg-gradient-to-r from-black rounded-xl via-blue-950 to-black z-50 flex flex-col text-gray-500 items-center justify-center animate-zoom"
    >
        <div class="animate-pulse">
            <img src="/assets/organized/logos/Logo-with-crown.png" alt="Logo" class="w-1/2 mx-auto object-contain" />
        </div>
        
        <div class="mt-8 w-64">
            <div class="text-center mb-2 text-gray-400">{loadingMessage}</div>
            <div class="w-full bg-gray-800 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: {progress}%"></div>
            </div>
            <div class="text-right text-xs text-gray-500 mt-1">{progress}%</div>
        </div>
    </div>
{/if}

<style>
    :global(body) {
        margin: 0;
        overflow-x: hidden;
    }
</style>
