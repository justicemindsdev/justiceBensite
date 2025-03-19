<script>
    import { onMount } from 'svelte';
    import { ChunkedContentLoader, ContentSanitizer } from './ContentProcessor.js';
    
    // Props
    export let items = [];
    export let chunkSize = 5;
    export let loadAll = false;
    export let itemComponent = null;
    export let showProgress = true;
    
    // Internal state
    let processedItems = [];
    let loading = true;
    let progress = {
        current: 0,
        total: 0,
        percentage: 0
    };
    
    // Process function - can be overridden by slot props
    export let processFunction = (chunk) => {
        // Default processing: sanitize text content
        return chunk.map(item => {
            if (typeof item === 'string') {
                return ContentSanitizer.sanitizeText(item);
            } else if (typeof item === 'object') {
                // For objects, sanitize text properties
                const sanitizedItem = { ...item };
                
                Object.keys(sanitizedItem).forEach(key => {
                    if (typeof sanitizedItem[key] === 'string') {
                        sanitizedItem[key] = ContentSanitizer.sanitizeText(sanitizedItem[key]);
                    }
                });
                
                return sanitizedItem;
            }
            
            return item;
        });
    };
    
    // Initialize the content loader
    let contentLoader;
    
    onMount(() => {
        if (!items || items.length === 0) {
            loading = false;
            return;
        }
        
        contentLoader = new ChunkedContentLoader(items, chunkSize, processFunction);
        
        // Set initial progress
        progress = {
            current: 0,
            total: Math.ceil(items.length / chunkSize),
            percentage: 0
        };
        
        if (loadAll) {
            // Load all content at once
            processedItems = contentLoader.processAll();
            loading = false;
        } else {
            // Load the first chunk
            loadNextChunk();
        }
        
        return () => {
            // Cleanup if needed
        };
    });
    
    // Function to load the next chunk
    function loadNextChunk() {
        if (!contentLoader || contentLoader.isComplete) {
            loading = false;
            return;
        }
        
        processedItems = contentLoader.processNextChunk();
        
        // Update progress
        progress = {
            current: contentLoader.currentChunk,
            total: Math.ceil(items.length / chunkSize),
            percentage: Math.min(100, Math.round((contentLoader.currentChunk / Math.ceil(items.length / chunkSize)) * 100))
        };
        
        if (contentLoader.isComplete) {
            loading = false;
        }
    }
</script>

<div class="chunked-content">
    {#if loading && showProgress}
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {progress.percentage}%"></div>
            </div>
            <div class="progress-text">
                Loading content ({progress.current}/{progress.total} chunks)
            </div>
        </div>
    {/if}
    
    <div class="content-container">
        {#if processedItems.length > 0}
            {#each processedItems as item, index}
                {#if itemComponent}
                    <svelte:component this={itemComponent} {item} {index} />
                {:else}
                    <slot name="item" {item} {index}>
                        <div class="default-item">
                            {#if typeof item === 'string'}
                                <p>{item}</p>
                            {:else if typeof item === 'object'}
                                <div class="object-item">
                                    {#each Object.entries(item) as [key, value]}
                                        <div class="object-property">
                                            <strong>{key}:</strong> 
                                            {#if typeof value === 'string'}
                                                {value}
                                            {:else}
                                                {JSON.stringify(value)}
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <p>{JSON.stringify(item)}</p>
                            {/if}
                        </div>
                    </slot>
                {/if}
            {/each}
        {:else if loading}
            <slot name="loading">
                <div class="loading-placeholder">
                    <p>Loading content...</p>
                </div>
            </slot>
        {:else}
            <slot name="empty">
                <div class="empty-message">
                    <p>No content available</p>
                </div>
            </slot>
        {/if}
    </div>
    
    {#if !contentLoader?.isComplete && !loading}
        <div class="load-more-container">
            <button class="load-more-button" on:click={loadNextChunk}>
                <slot name="load-more-text">Load More</slot>
            </button>
        </div>
    {/if}
</div>

<style>
    .chunked-content {
        width: 100%;
    }
    
    .progress-container {
        margin-bottom: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background-color: rgba(59, 130, 246, 0.2);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background-color: rgb(59, 130, 246);
        transition: width 0.3s ease;
    }
    
    .progress-text {
        font-size: 0.75rem;
        color: #6b7280;
        text-align: right;
        margin-top: 0.25rem;
    }
    
    .content-container {
        width: 100%;
    }
    
    .default-item {
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.5rem;
        border: 1px solid rgba(75, 85, 99, 0.2);
    }
    
    .object-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .object-property {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .loading-placeholder {
        padding: 2rem;
        text-align: center;
        color: #6b7280;
    }
    
    .empty-message {
        padding: 2rem;
        text-align: center;
        color: #6b7280;
    }
    
    .load-more-container {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    
    .load-more-button {
        padding: 0.5rem 1.5rem;
        background-color: rgba(17, 24, 39, 0.8);
        color: white;
        border: 1px solid rgba(75, 85, 99, 0.5);
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .load-more-button:hover {
        background-color: rgba(31, 41, 55, 0.9);
        transform: translateY(-1px);
    }
</style>
