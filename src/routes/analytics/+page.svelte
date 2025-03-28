<script>
    import Navbar from "$lib/Navbar.svelte";
    import ChunkedContent from "$lib/ChunkedContent.svelte";
    import SVGAnalyzer from "$lib/SVGAnalyzer.svelte";
    import { ContentAnalyzer } from "$lib/ContentProcessor.js";
    import { onMount } from "svelte";
    import { getAllEndorsements, getAllCertificates, getEndorsementById } from "$lib/content.js";
    
    // Get data from content.js
    const endorsements = getAllEndorsements();
    const certificates = getAllCertificates();
    
    // SVG files to analyze
    const svgFiles = [
        {
            name: "Animated Radar Chart",
            url: "/svg/animated-radar-chart-revised.svg"
        },
        {
            name: "Ben Mak Case Analysis",
            url: "/svg/ben-mak-case-analysis.svg"
        },
        {
            name: "Ben Mak Case 4D Analysis",
            url: "/svg/ben-mak-case-4d-analysis.svg"
        },
        {
            name: "Ben Mak Case Timeline",
            url: "/svg/ben-mak-case-timeline.svg"
        },
        {
            name: "Communication Frequency Graph",
            url: "/svg/communication-frequency-graph.svg"
        },
        {
            name: "Consent Metrics Chart",
            url: "/svg/consent-metrics-chart.svg"
        },
        {
            name: "Sentiment Analysis Chart",
            url: "/svg/sentiment-analysis-chart.svg"
        },
        {
            name: "Valerie Coercive Manipulation Chart",
            url: "/svg/valerie-coercive-manipulation-chart.svg"
        }
    ];
    
    // State for selected SVG
    let selectedSvg = svgFiles[0];
    
    // Generate some sample text content for demonstration
    const textContent = Array(20).fill().map((_, i) => 
        `Sample content block ${i + 1}: This is a demonstration of chunked content loading. This technique is useful for loading large amounts of content efficiently, improving performance and user experience.`
    );
    
    // Function to process endorsements for display
    function processEndorsements(endorsements) {
        return endorsements.map(endorsement => ({
            id: endorsement.id,
            title: endorsement.title,
            subtitle: endorsement.subtitle,
            content: endorsement.content,
            logo: endorsement.logo,
            quote: endorsement.quote
        }));
    }
    
    // Process certificates for display
    const processedCertificates = certificates.map(cert => ({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        image: cert.image
    }));
    
    // Process endorsements for display
    const processedEndorsements = processEndorsements(endorsements);
    
    // Tab state
    let activeTab = 'text'; // 'text', 'endorsements', or 'certificates'
    
    // Function to switch tabs
    function switchTab(tab) {
        activeTab = tab;
        // Reset endorsement detail view when switching tabs
        selectedEndorsement = null;
        endorsementVisible = false;
    }
    
    // Get current tab content
    $: currentTabItems = activeTab === 'text' 
        ? textContent 
        : activeTab === 'endorsements' 
            ? processedEndorsements 
            : processedCertificates;
    
    // Chunk size based on content type
    $: chunkSize = activeTab === 'text' ? 5 : 3;
    
    // Endorsement detail view state
    let selectedEndorsement = null;
    let endorsementVisible = false;
    
    // Show endorsement details
    function showEndorsement(id) {
        selectedEndorsement = getEndorsementById(id);
        endorsementVisible = true;
        
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
        endorsementVisible = false;
    }
    
    // Initialize the carousel when the component is mounted
    onMount(() => {
        // Create a div for the React carousel
        const carouselContainer = document.getElementById('endorsement-carousel-container');
        if (carouselContainer) {
            // Initialize the React carousel
            const script = document.createElement('script');
            script.type = 'text/babel';
            script.innerHTML = `
                const { motion, AnimatePresence } = window.Motion;
                const { useState, useEffect } = React;

                const LogoCarousel = () => {
                    const [selectedCard, setSelectedCard] = useState(null);
                    const [isVisible, setIsVisible] = useState(false);

                    useEffect(() => {
                        if (selectedCard) {
                            const timer = setTimeout(() => setIsVisible(true), 100);
                            return () => clearTimeout(timer);
                        }
                        setIsVisible(false);
                    }, [selectedCard]);

                    const CarouselRow = ({ direction = 1, speed = 40, startIndex = 0 }) => {
                        const shiftedEndorsements = [...${JSON.stringify(endorsements)}.slice(startIndex), ...${JSON.stringify(endorsements)}.slice(0, startIndex)];
                        return (
                            <motion.div
                                className="flex items-center gap-8"
                                animate={{
                                    x: direction > 0 ? [0, -1920] : [-1920, 0],
                                }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        duration: speed,
                                        ease: "linear",
                                    },
                                }}
                                style={{
                                    paddingTop: "1rem",
                                    paddingBottom: "1rem",
                                }}
                            >
                                {[...shiftedEndorsements, ...shiftedEndorsements].map((endorsement, index) => (
                                <motion.div
                                    key={\`\${endorsement.id}-\${index}\`}
                                    className="flex-shrink-0"
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                    onClick={() => window.showEndorsementDetail(endorsement.id)}
                                >
                                    <div className="relative w-96 h-64 rounded-2xl overflow-hidden flex items-start justify-center card-shadow card-fade">
                                        <div className="absolute inset-0 flex flex-col items-center">
                                            <div className="flex-1 flex items-center justify-center -mt-4">
                                                <img
                                                    src={endorsement.logo}
                                                    alt={endorsement.title}
                                                    className={\`object-contain opacity-100 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] \${
                                                        endorsement.title.includes("LIVERPOOL CITY COUNCIL") 
                                                            ? "w-28 h-40 -mt-8 mb-4" // Move up and add space below
                                                            : endorsement.title.includes("OBE")
                                                                ? "w-32 h-32 -mt-8 mb-4" // Move up and add space below
                                                            : endorsement.title.includes("HEALTH")
                                                                ? "w-48 h-28 -mt-8" // Smaller and raised health logo
                                                            : endorsement.title.includes("POLICE")
                                                                ? "w-36 h-36 -mt-4" // Smaller Cumbria Police logo
                                                                : "w-48 h-48" // Default size for other logos
                                                    }\`}
                                                    style={{ filter: 'brightness(1.4) contrast(0.95)' }}
                                                />
                                            </div>
                                            <div className="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center gap-1">
                                                <h3 className="text-l font-thin tracking-wide text-white text-shadow whitespace-nowrap px-2">
                                                    {endorsement.title}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {endorsement.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            </motion.div>
                        );
                    };

                    return (
                        <>
                            <div className="page-gradient"></div>
                            <div className="w-full overflow-hidden py-10">
                                <div className="relative max-w-7xl mx-auto px-4">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-thin text-white tracking-wider mb-2">
                                            ENDORSEMENTS CAROUSEL
                                        </h2>
                                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
                                    </div>

                                    <div className="relative overflow-hidden">
                                        <div className="space-y-12 fade-edges">
                                            <CarouselRow direction={1} speed={40} startIndex={0} />
                                            <CarouselRow direction={-1} speed={35} startIndex={5} />
                                            <CarouselRow direction={1} speed={45} startIndex={7} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                };

                // Expose a function to show endorsement details
                window.showEndorsementDetail = (id) => {
                    // Call the Svelte function to show endorsement details
                    if (typeof window.svelte_showEndorsement === 'function') {
                        window.svelte_showEndorsement(id);
                    }
                };

                // Render the carousel
                const root = ReactDOM.createRoot(document.getElementById('endorsement-carousel-container'));
                root.render(<LogoCarousel />);
            `;
            document.body.appendChild(script);
            
            // Expose the showEndorsement function to the window object
            window.svelte_showEndorsement = showEndorsement;
        }
    });
</script>

<Navbar />

<div class="analytics-page">
    <header class="page-header">
        <h1>Content Analytics Dashboard</h1>
        <p class="subtitle">Demonstrating advanced content processing techniques</p>
    </header>
    
    <div class="dashboard-grid">
        <!-- SVG Analysis Section -->
        <section class="dashboard-section svg-section">
            <h2>SVG Analysis</h2>
            <p class="section-description">
                Analyze SVG files to extract key information and visualize complexity.
            </p>
            
            <div class="svg-selector">
                <label for="svg-select">Select SVG to analyze:</label>
                <select id="svg-select" bind:value={selectedSvg} class="svg-select">
                    {#each svgFiles as svg}
                        <option value={svg}>{svg.name}</option>
                    {/each}
                </select>
            </div>
            
            <SVGAnalyzer svgUrl={selectedSvg.url} />
        </section>
        
        <!-- Endorsement Carousel Section -->
        <section class="dashboard-section carousel-section">
            <h2>Endorsement Carousel</h2>
            <p class="section-description">
                Interactive carousel displaying endorsements with multiple rows moving in different directions.
            </p>
            
            <div id="endorsement-carousel-container" class="endorsement-carousel"></div>
        </section>
        
        <!-- Chunked Content Section -->
        <section class="dashboard-section chunked-section">
            <h2>Chunked Content Loading</h2>
            <p class="section-description">
                Load content in manageable chunks to improve performance and user experience.
            </p>
            
            <div class="content-tabs">
                <div class="tab-buttons">
                    <button 
                        class="tab-button {activeTab === 'text' ? 'active' : ''}" 
                        on:click={() => switchTab('text')}
                    >
                        Text Content
                    </button>
                    <button 
                        class="tab-button {activeTab === 'endorsements' ? 'active' : ''}" 
                        on:click={() => switchTab('endorsements')}
                    >
                        Endorsements
                    </button>
                    <button 
                        class="tab-button {activeTab === 'certificates' ? 'active' : ''}" 
                        on:click={() => switchTab('certificates')}
                    >
                        Certificates
                    </button>
                </div>
                
                <div class="tab-content">
                    <ChunkedContent 
                        items={currentTabItems} 
                        chunkSize={chunkSize} 
                        showProgress={true}
                    >
                        <svelte:fragment slot="item" let:item let:index>
                            {#if activeTab === 'text'}
                                <div class="text-item">
                                    <p>{item}</p>
                                </div>
                            {:else if activeTab === 'endorsements'}
                                <button 
                                    class="endorsement-item card-shadow card-fade" 
                                    on:click={() => showEndorsement(item.id)}
                                    on:keydown={(e) => e.key === 'Enter' && showEndorsement(item.id)}
                                    aria-label="View details for {item.title}"
                                >
                                    <div class="endorsement-header">
                                        <h3>{item.title}</h3>
                                        <p class="endorsement-subtitle">{item.subtitle}</p>
                                    </div>
                                    <p class="endorsement-content">{item.content.substring(0, 100)}...</p>
                                    <div class="view-details">Click to view details</div>
                                </button>
                            {:else}
                                <div class="certificate-item">
                                    <h3>{item.title}</h3>
                                    <div class="certificate-details">
                                        <p><strong>Issuer:</strong> {item.issuer}</p>
                                        <p><strong>Date:</strong> {item.date}</p>
                                    </div>
                                </div>
                            {/if}
                        </svelte:fragment>
                    </ChunkedContent>
                </div>
            </div>
        </section>
        
        <!-- Content Stats Section -->
        <section class="dashboard-section stats-section">
            <h2>Content Statistics</h2>
            <p class="section-description">
                Overview of content across the Justice Ben website.
            </p>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{endorsements.length}</div>
                    <div class="stat-label">Endorsements</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-value">{certificates.length}</div>
                    <div class="stat-label">Certificates</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-value">{svgFiles.length}</div>
                    <div class="stat-label">SVG Charts</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-value">{textContent.length}</div>
                    <div class="stat-label">Text Blocks</div>
                </div>
            </div>
        </section>
    </div>
</div>

{#if selectedEndorsement && endorsementVisible}
    <div class="endorsement-detail-overlay">
        <div class="relative min-h-[60vh] flex items-center justify-center" class:visible={endorsementVisible}>
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
            
            <button 
                class="back-button"
                on:click={returnToEndorsements}
            >
                Return to Analytics
            </button>
        </div>
    </div>
{/if}

<style>
    /* Endorsement detail view styles */
    .endorsement-detail-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        overflow-y: auto;
        padding: 2rem;
    }
    
    body {
        font-family: "IBM Plex Serif";
        font-weight: 300;
        color: white;
    }
    
    .page-gradient {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at center,
            rgba(15, 23, 42, 0.3) 0%,
            rgba(0, 0, 0, 0.95) 100%
        );
        z-index: -1;
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
    
    .fade-edges {
        mask-image: linear-gradient(
            to right,
            transparent,
            black 15%,
            black 85%,
            transparent
        );
    }
    
    .text-shadow {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
    .endorsement-detail-overlay .endorsement-content {
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
        bottom: -6rem;
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
    
    /* Mobile responsiveness for back button */
    @media (max-width: 768px) {
        .back-button {
            bottom: -8rem; /* Move even further down on mobile */
            padding: 0.6rem 1.5rem; /* Slightly smaller padding */
            font-size: 0.9rem; /* Slightly smaller font */
            width: auto; /* Allow button to size to content */
            max-width: 80%; /* Prevent button from being too wide */
        }
    }
    
    .back-button:hover {
        background: rgba(59, 130, 246, 0.9);
        transform: translateX(-50%) translateY(-2px);
    }
    
    .title-wrap {
        white-space: normal;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.2;
    }
    
    .view-details {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #3b82f6;
        text-align: right;
    }
    
    /* Carousel styles */
    .endorsement-carousel {
        width: 100%;
        overflow: hidden;
        margin: 1rem 0;
        position: relative;
        min-height: 400px;
    }
    
    .analytics-page {
        background-color: #111827;
        color: #e5e7eb;
        min-height: 100vh;
        padding: 2rem 1rem;
    }
    
    /* Item styles for different content types */
    .text-item {
        padding: 1rem;
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border-left: 3px solid #3b82f6;
    }
    
    .endorsement-item {
        padding: 1.25rem;
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border-left: 3px solid #10b981;
        text-align: left;
        width: 100%;
        display: block;
    }
    
    .endorsement-header {
        margin-bottom: 0.75rem;
    }
    
    .endorsement-header h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #f3f4f6;
        margin-bottom: 0.25rem;
    }
    
    .endorsement-subtitle {
        font-size: 0.875rem;
        color: #9ca3af;
    }
    
    .endorsement-content {
        color: #d1d5db;
        line-height: 1.5;
    }
    
    .certificate-item {
        padding: 1.25rem;
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border-left: 3px solid #f59e0b;
    }
    
    .certificate-item h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #f3f4f6;
        margin-bottom: 0.75rem;
    }
    
    .certificate-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #d1d5db;
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .page-header h1 {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        background: linear-gradient(to right, #3b82f6, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
        color: #9ca3af;
        font-size: 1.125rem;
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    @media (min-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: 2fr 1fr;
        }
        
        .svg-section {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        
        .carousel-section {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
        }
        
        .chunked-section {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
        }
        
        .stats-section {
            grid-column: 1 / 3;
            grid-row: 3 / 4;
        }
    }
    
    .dashboard-section {
        background-color: rgba(31, 41, 55, 0.5);
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .dashboard-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #f3f4f6;
    }
    
    .section-description {
        color: #9ca3af;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
    }
    
    .svg-selector {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .svg-select {
        background-color: rgba(17, 24, 39, 0.8);
        color: #e5e7eb;
        border: 1px solid rgba(75, 85, 99, 0.5);
        border-radius: 0.375rem;
        padding: 0.5rem;
        font-size: 0.875rem;
    }
    
    .content-tabs {
        border: 1px solid rgba(75, 85, 99, 0.3);
        border-radius: 0.375rem;
        overflow: hidden;
    }
    
    .tab-buttons {
        display: flex;
        border-bottom: 1px solid rgba(75, 85, 99, 0.3);
    }
    
    .tab-button {
        flex: 1;
        padding: 0.75rem;
        background-color: rgba(17, 24, 39, 0.5);
        color: #9ca3af;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .tab-button.active {
        background-color: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        font-weight: 500;
    }
    
    .tab-button:hover:not(.active) {
        background-color: rgba(31, 41, 55, 0.8);
        color: #e5e7eb;
    }
    
    .tab-content {
        padding: 1rem;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .stat-card {
        background-color: rgba(17, 24, 39, 0.7);
        border-radius: 0.375rem;
        padding: 1rem;
        text-align: center;
        transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
    }
    
    .stat-value {
        font-size: 2rem;
        font-weight: 600;
        color: #3b82f6;
        margin-bottom: 0.25rem;
    }
    
    .stat-label {
        color: #9ca3af;
        font-size: 0.875rem;
    }
</style>
