# Rant Journal - A Full-Stack Markdown Blog

A complete blog application built with Node.js, Express, and a file-based database. This project allows users to create, read, edit, and delete posts using Markdown for rich-text formatting, with features like search, read-time estimation, and code syntax highlighting.


## Features

-   **Full CRUD Functionality:** Create, Read, Update (Edit), and Delete blog posts.
-   **Markdown Editor:** Posts are written in Markdown and are automatically converted and sanitized into HTML.
-   **Syntax Highlighting:** Code blocks within posts are automatically highlighted for readability.
-   **Search:** A real-time search bar to filter posts by title or content.
-   **Estimated Read Time:** Each post automatically displays the estimated time it will take to read.
-   **Responsive Design:** A clean, modern, and fully responsive UI that works on all devices.
-   **Persistent Storage:** Uses a file-based LokiJS database to persist data between server restarts.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** EJS (Embedded JavaScript Templating)
-   **Database:** LokiJS (In-memory / File-based)
-   **Markdown Parsing:** `marked`
-   **HTML Sanitization:** `dompurify`
-   **Syntax Highlighting:** `highlight.js`

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Ahmarkalam/markdown-blog.git](https://github.com/Ahmarkalam/markdown-blog.git)
    ```
2.  Navigate into the project directory:
    ```bash
    cd markdown-blog
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the application:
    ```bash
    node server.js
    ```
5.  Open your browser and go to `http://localhost:3000`.
