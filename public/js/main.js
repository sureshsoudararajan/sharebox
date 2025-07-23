document.addEventListener('DOMContentLoaded', () => {
    const textTabButton = document.querySelector('[data-tab="text"]');
    const fileTabButton = document.querySelector('[data-tab="file"]');
    const textTabContent = document.getElementById('text-tab');
    const fileTabContent = document.getElementById('file-tab');

    const textContent = document.getElementById('text-content');
    const shareTextBtn = document.getElementById('share-text-btn');

    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const shareFileBtn = document.getElementById('share-file-btn');

    let uploadedFile = null;

    // Tab switching logic
    textTabButton.addEventListener('click', () => {
        textTabButton.classList.add('active');
        fileTabButton.classList.remove('active');
        textTabContent.classList.add('active');
        fileTabContent.classList.remove('active');
    });

    fileTabButton.addEventListener('click', () => {
        fileTabButton.classList.add('active');
        textTabButton.classList.remove('active');
        fileTabContent.classList.add('active');
        textTabContent.classList.remove('active');
    });

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

    // File upload logic
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            uploadedFile = files[0];
            dropArea.querySelector('p').textContent = `Selected file: ${uploadedFile.name}`;
        }
    }

    shareFileBtn.addEventListener('click', async () => {
        if (!uploadedFile) {
            alert('Please select a file to share.');
            return;
        }

        const formData = new FormData();
        formData.append('shareFile', uploadedFile);

        try {
            const response = await fetch('/upload/file', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                let redirectUrl = `/result?id=${data.id}&type=${data.type}`;
                if (data.originalname) {
                    redirectUrl += `&originalname=${encodeURIComponent(data.originalname)}`;
                }
                window.location.href = redirectUrl;
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error sharing file:', error);
            alert(`Error: ${data.error}`);
        }
    });
});