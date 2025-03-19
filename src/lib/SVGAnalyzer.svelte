<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { ContentAnalyzer } from './ContentProcessor.js';
    
    // Props
    export let svgUrl = '';
    export let showDetails = true;
    export let showVisualization = true;
    
    // Internal state
    let svgContent = '';
    let analysis = null;
    let loading = true;
    let error = null;
    
    // Generate a color based on complexity
    function getComplexityColor(complexity) {
        if (complexity < 50) return '#10B981'; // Green for simple SVGs
        if (complexity < 200) return '#FBBF24'; // Yellow for medium complexity
        return '#EF4444'; // Red for complex SVGs
    }
    
    // Only fetch SVG after component is mounted (client-side only)
    onMount(async () => {
        if (!svgUrl) {
            loading = false;
            error = 'No SVG URL provided';
            return;
        }
        
        try {
            loading = true;
            error = null;
            
            const response = await fetch(svgUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
            }
            
            svgContent = await response.text();
            analysis = ContentAnalyzer.analyzeSvg(svgContent);
            
            if (!analysis.valid) {
                error = 'Invalid SVG content';
            }
        } catch (err) {
            error = err.message || 'Failed to analyze SVG';
            console.error('SVG analysis error:', err);
        } finally {
            loading = false;
        }
        
        // Set up watcher for URL changes after initial load
        const unsubscribe = svgUrl$.subscribe(async (newUrl) => {
            if (newUrl && newUrl !== svgUrl) {
                svgUrl = newUrl;
                await fetchSvg(newUrl);
            }
        });
        
        return () => {
            if (unsubscribe) unsubscribe();
        };
    });
    
    // Create a store for svgUrl to watch for changes
    const svgUrl$ = writable(svgUrl);
    
    // Update the store when the prop changes
    $: svgUrl$.set(svgUrl);
    
    // Function to fetch SVG by URL
    async function fetchSvg(url) {
        if (!url) {
            loading = false;
            error = 'No SVG URL provided';
            return;
        }
        
        try {
            loading = true;
            error = null;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
            }
            
            svgContent = await response.text();
            analysis = ContentAnalyzer.analyzeSvg(svgContent);
            
            if (!analysis.valid) {
                error = 'Invalid SVG content';
            }
        } catch (err) {
            error = err.message || 'Failed to analyze SVG';
            console.error('SVG analysis error:', err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="svg-analyzer">
    {#if loading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Analyzing SVG...</p>
        </div>
    {:else if error}
        <div class="error">
            <p>Error: {error}</p>
        </div>
    {:else if analysis && analysis.valid}
        <div class="analysis-container">
            {#if showVisualization}
                <div class="svg-preview">
                    <h3>SVG Preview</h3>
                    <div class="preview-container">
                        {@html svgContent}
                    </div>
                </div>
            {/if}
            
            {#if showDetails}
                <div class="analysis-details">
                    <h3>Analysis Results</h3>
                    
                    {#if analysis.title}
                        <div class="detail-item">
                            <span class="detail-label">Title:</span>
                            <span class="detail-value">{analysis.title}</span>
                        </div>
                    {/if}
                    
                    <div class="detail-item">
                        <span class="detail-label">Complexity:</span>
                        <div class="complexity-meter">
                            <div class="complexity-bar" 
                                 style="width: {Math.min(100, analysis.complexity / 5)}%; background-color: {getComplexityColor(analysis.complexity)}">
                            </div>
                            <span class="complexity-value">{analysis.complexity} elements</span>
                        </div>
                    </div>
                    
                    {#if analysis.viewBox}
                        <div class="detail-item">
                            <span class="detail-label">ViewBox:</span>
                            <span class="detail-value">{analysis.viewBox}</span>
                        </div>
                    {/if}
                    
                    <div class="element-counts">
                        <h4>Element Counts</h4>
                        <div class="counts-grid">
                            {#each Object.entries(analysis.elementCounts) as [element, count]}
                                <div class="count-item">
                                    <div class="count-label">{element}</div>
                                    <div class="count-value">{count}</div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <div class="no-data">
            <p>No valid SVG data available</p>
        </div>
    {/if}
</div>

<style>
    .svg-analyzer {
        width: 100%;
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.5rem;
        padding: 1.5rem;
        color: #e5e7eb;
    }
    
    .loading, .error, .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
    }
    
    .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        border-top-color: rgb(59, 130, 246);
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .error {
        color: #ef4444;
    }
    
    .analysis-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    @media (min-width: 768px) {
        .analysis-container {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .svg-preview, .analysis-details {
        background-color: rgba(31, 41, 55, 0.5);
        border-radius: 0.375rem;
        padding: 1rem;
    }
    
    .svg-preview h3, .analysis-details h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #f3f4f6;
        border-bottom: 1px solid rgba(75, 85, 99, 0.4);
        padding-bottom: 0.5rem;
    }
    
    .preview-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.25rem;
        padding: 1rem;
        min-height: 200px;
        overflow: hidden;
    }
    
    .preview-container :global(svg) {
        max-width: 100%;
        max-height: 300px;
        height: auto;
    }
    
    .detail-item {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }
    
    .detail-label {
        font-weight: 500;
        color: #9ca3af;
        margin-bottom: 0.25rem;
    }
    
    .detail-value {
        font-family: monospace;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        word-break: break-all;
    }
    
    .complexity-meter {
        position: relative;
        height: 0.75rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.375rem;
        overflow: hidden;
        margin-top: 0.5rem;
    }
    
    .complexity-bar {
        height: 100%;
        border-radius: 0.375rem;
        transition: width 0.5s ease, background-color 0.5s ease;
    }
    
    .complexity-value {
        position: absolute;
        right: 0.5rem;
        top: 0.75rem;
        font-size: 0.75rem;
        color: #9ca3af;
    }
    
    .element-counts {
        margin-top: 1.5rem;
    }
    
    .element-counts h4 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        font-size: 1rem;
        color: #f3f4f6;
    }
    
    .counts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.75rem;
    }
    
    .count-item {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0.25rem;
        padding: 0.5rem;
        text-align: center;
    }
    
    .count-label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-bottom: 0.25rem;
        text-transform: capitalize;
    }
    
    .count-value {
        font-size: 1.25rem;
        font-weight: 500;
    }
</style>
