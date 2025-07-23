document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');

    const contentTitle = document.getElementById('content-title');
    const contentDisplay = document.getElementById('content-display');
    const copyTextBtn = document.getElementById('copy-text-btn');
    const copyPopup = document.getElementById('copy-popup');

    if (!id || !type) {
        contentTitle.textContent = 'Invalid Link';
        contentDisplay.innerHTML = '<p>The sharing link is incomplete or invalid.</p>';
        copyTextBtn.style.display = 'none'; // Hide copy button
        return;
    }

    try {
        const response = await fetch(`/retrieve/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
            contentTitle.textContent = 'Content Not Found';
            contentDisplay.innerHTML = `<p>${errorData.error || 'An error occurred.'}</p>`;
            copyTextBtn.style.display = 'none'; // Hide copy button
            return;
        }

        if (type === 'text') {
            const data = await response.json();
            contentTitle.textContent = 'Shared Text';
            // Display as plain text, preventing HTML rendering
            const preElement = document.createElement('pre');
            preElement.textContent = data.content; // Use textContent to prevent HTML rendering
            contentDisplay.appendChild(preElement);

            // Copy functionality
            copyTextBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(data.content).then(() => {
                    copyPopup.classList.add('show');
                    setTimeout(() => {
                        copyPopup.classList.remove('show');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text.');
                });
            });
        } else {
            // This case should ideally not be reached if only text sharing is enabled
            contentTitle.textContent = 'Unsupported Content Type';
            contentDisplay.innerHTML = '<p>This content type is not supported for viewing.</p>';
            copyTextBtn.style.display = 'none'; // Hide copy button
        }

    } catch (error) {
        console.error('Error fetching content:', error);
        contentTitle.textContent = 'Error';
        contentDisplay.innerHTML = '<p>An error occurred while loading the content.</p>';
        copyTextBtn.style.display = 'none'; // Hide copy button
    }
});