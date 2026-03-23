document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSection = document.getElementById('loadingSection');
    const outputSection = document.getElementById('outputSection');
    const notesContent = document.getElementById('notesContent');
    const copyBtn = document.getElementById('copyBtn');

    // Simulated AI Response Generator
    const generateMockNotes = (topic) => {
        // Sanitize topic slightly for display
        const safeTopic = topic.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        return `
            <h3>Overview</h3>
            <p><strong>${safeTopic}</strong> represents a fascinating subject with a rich theoretical foundation. It encompasses several key principles that have evolved significantly over time.</p>
            
            <h3>Key Concepts</h3>
            <ul>
                <li><strong>Fundamental Principles:</strong> The core mechanics and established rules that drive the primary interactions within the domain of ${safeTopic}.</li>
                <li><strong>Modern Applications:</strong> Widely utilized in contemporary systems, particularly in environments requiring extensive processing and strategic implementation.</li>
                <li><strong>Future Trajectories:</strong> Current trends point towards optimizing efficiency, demonstrating the dynamic and evolving nature of this field.</li>
            </ul>

            <h3>Summary</h3>
            <p>Understanding the nuances of ${safeTopic} provides a critical advantage in navigating complex problem spaces. This foundational knowledge allows for robust, scalable, and innovative solutions.</p>
        `;
    };

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        if (!topic) {
            topicInput.focus();
            // Optional visual feedback for empty input
            topicInput.style.borderColor = '#ef4444';
            setTimeout(() => topicInput.style.borderColor = '', 1000);
            return;
        }

        // State: Loading
        generateBtn.disabled = true;
        generateBtn.querySelector('.btn-text').textContent = 'Synthesizing...';
        outputSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        // Simulate network request/processing delay
        setTimeout(() => {
            // State: Done
            loadingSection.classList.add('hidden');
            outputSection.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.querySelector('.btn-text').textContent = 'Generate Notes';

            // Insert notes
            notesContent.innerHTML = generateMockNotes(topic);
            
            // Scroll to output with a slight delay to ensure rendering
            setTimeout(() => {
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        }, 2500); // 2.5s simulated delay
    });

    // Copy to Clipboard Functionality
    copyBtn.addEventListener('click', () => {
        // Create a temporary element to extract clean text
        const tempElement = document.createElement('div');
        tempElement.innerHTML = notesContent.innerHTML;
        const textToCopy = tempElement.innerText || tempElement.textContent || '';
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalIcon = copyBtn.innerHTML;
            // Show checkmark on success
            copyBtn.innerHTML = '<i class="ph-fill ph-check"></i>';
            copyBtn.style.color = '#10b981'; // Emerald color
            copyBtn.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.color = '';
                copyBtn.style.transform = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy notes: ', err);
            // Fallback empty action or error state
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="ph-bold ph-x"></i>';
            copyBtn.style.color = '#ef4444';
            setTimeout(() => copyBtn.innerHTML = originalIcon, 2000);
        });
    });

    // Allow pressing "Enter" in textarea to submit without shift key
    topicInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            generateBtn.click();
        }
    });
});
