document.addEventListener('DOMContentLoaded', () => {
    const textContent = document.getElementById('text-content');
    const shareTextBtn = document.getElementById('share-text-btn');

    // Text sharing logic
    shareTextBtn.addEventListener('click', async () => {
        const text = textContent.value;
        if (!text) {
            alert('Please enter some text to share.');
            return;
        }

        try {
            const response = await fetch('/upload/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = `/result?id=${data.id}&type=${data.type}`;
            } else {
                alert('An error occurred while sharing text.');
            }
        } catch (error) {
            console.error('Error sharing text:', error);
            alert('An error occurred while sharing text.');
        }
    });
});