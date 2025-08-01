# ShareBox

A simple file/image/text sharing website without login, allowing one user to paste content, and others to view or copy it using a shareable link.

## Features

*   Text paste and copy
*   Shareable link
*   No login

## Project Structure

```
sharebox/
├── backend/
│   ├── server.js                # Express app
│   ├── routes/
│   │   ├── upload.js            # Handle uploads (text)
│   │   ├── retrieve.js          # Serve text by ID
│   └── utils/
│       └── generateId.js        # Unique ID generator
│
├── frontend/
│   ├── index.html               # Homepage (text/file/image upload)
│   ├── result.html              # Result page (shows link)
│   ├── view.html                # Viewer page for text/files/images
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js              # Upload logic
│       ├── view.js              # View/download logic
│
├── public/                      # Static serving folder (images, js, css)
│
├── .gitignore
├── README.md
└── package.json
```

## How to Run

1.  **Navigate to the project directory:**
    ```bash
    cd sharebox
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000`.

4.  **Open in browser:**
    Go to `http://localhost:3000` in your web browser.
