document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');
    const originalname = urlParams.get('originalname');

    const contentTitle = document.getElementById('content-title');
    const contentDisplay = document.getElementById('content-display');

    if (!id || !type) {
        contentTitle.textContent = 'Invalid Link';
        contentDisplay.innerHTML = '<p>The sharing link is incomplete or invalid.</p>';
        return;
    }

    try {
        const response = await fetch(`/retrieve/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
            contentTitle.textContent = 'Content Not Found';
            contentDisplay.innerHTML = `<p>${errorData.error || 'An error occurred.'}</p>`;
            return;
        }

        if (type === 'text') {
            const data = await response.json();
            contentTitle.textContent = 'Shared Text';
            contentDisplay.innerHTML = `<pre>${data.content}</pre>`;
        } else if (type === 'image') {
            contentTitle.textContent = originalname ? `Shared Image: ${originalname}` : 'Shared Image';
            contentDisplay.innerHTML = `<img src="/retrieve/${id}" alt="Shared Image">`;
        } else if (type === 'file') {
            contentTitle.textContent = originalname ? `Shared File: ${originalname}` : 'Shared File';
            contentDisplay.innerHTML = `<p>Click the button below to download the file:</p><a href="/retrieve/${id}" class="download-link" download="${originalname || id}">Download ${originalname || 'File'}</a>`;
        }

    } catch (error) {
        console.error('Error fetching content:', error);
        contentTitle.textContent = 'Error';
        contentDisplay.innerHTML = '<p>An error occurred while loading the content.</p>';
    }
});
