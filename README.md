# DynamicWordServer

**Author**: Jerry Wang ([qwang7@scu.edu](mailto:qwang7@scu.edu))

## Overview
DynamicWordServer is a Node.js-based project that demonstrates essential server-side development concepts. It incorporates static file serving, client-server interaction, custom fetch behavior, and offline-first UX principles. This project is structured as a lab assignment to teach key web development skills.

## Features
1. **Custom Fetch Monkey Patching**
   - Implements a custom `fetch` function in `fetch.js` to simulate a client-side-only server behavior.
   - Handles URL parameters, HTTP status codes, and response generation.

2. **Serving Static Files**
   - Uses an HTTP server to serve HTML, CSS, and JavaScript files from a `/static` directory.
   - Supports appropriate MIME types for CSS and JS files.

3. **Dynamic Word Management**
   - Retrieves and serves word data dynamically through the `/words` endpoint.
   - Includes pagination with `offset` and `count` query parameters.

4. **Offline-First Features**
   - Provides functionality even when offline using a "thick" client-side application.

## Project Structure
```
lab-4/
├── static/
│   ├── index.html       # Main HTML file
│   ├── index.css        # Stylesheet for the application
│   ├── index.js         # Client-side JavaScript
├── fetch.js              # Custom fetch implementation
├── words.js              # Word management logic
├── server.js             # Node.js server
├── package.json          # NPM configuration
├── LICENSE               # License file
```

## Getting Started

### Prerequisites
- Node.js (v16 or newer)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lab-4
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
Start the server using the following command:
```bash
node server.js
```
The server will be available at `http://localhost:3000` (default port).

### Usage
1. Navigate to `http://localhost:3000/static/index.html` to access the application.
2. Use the "Previous" and "Next" buttons to paginate through words.
3. To test dynamic word fetching, ensure the `/words` endpoint is correctly set up in `server.js`.

## Implementation Details

### Part 1: Monkey Patching Fetch
- `fetch.js` contains a custom `fetch` function that:
  - Validates URLs and HTTP methods.
  - Parses query parameters like `offset` and `count`.
  - Returns word slices or appropriate HTTP errors (e.g., 404, 405).

### Part 2: Static File Serving
- `server.js` serves files from the `/static` directory.
- Handles 404 errors for missing files and enforces HTTP GET methods.

### Part 3: Word Management
- `words.js` encapsulates logic to retrieve and serve word data.
- Integrated with the `/words` endpoint in `server.js`.

## License
This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.

## Author
Jerry Wang  
[qwang7@scu.edu](mailto:qwang7@scu.edu)

