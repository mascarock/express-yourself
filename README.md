# frontend-fiesta

This repository houses the frontend of the application built with **React**. It serves as the user interface that interacts with the backend API.

## Author

**mascarock**

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Docker Instructions](#docker-instructions)
- [Testing](#testing)
  - [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

[Backend Repository](https://github.com/mascarock/express-yourself)

## Getting Started

### Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/frontend-fiesta.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd frontend-fiesta
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Copy environment variables file:**

   ```bash
   cp .env.sample .env
   ```

5. **Personalize the `.env` file** with your specific settings, such as API URLs and other environment configurations.

### Running the App

Start the development server by running:

```bash
npm start
```

The app will start on **[localhost:3000](http://localhost:3000)** by default.

---

## Docker Instructions

### Building the Docker Image

To build the Docker image for the frontend, run the following command from the project root directory:

```bash
docker build -t frontend-fiesta .
```

### Running the Docker Container

To run the Docker container for the frontend, use the following command:

```bash
docker run -p 3000:80 --name frontend-container -e REACT_APP_API_URL=http://localhost:5005 frontend-fiesta
```

This will start the frontend container and expose it on **port 3000** on your local machine.

---

## Testing

### Running Tests

Run the test suite using **Jest** and **React Testing Library**:

```bash
npm test
```

This command runs the test suite in interactive watch mode, allowing you to verify that the UI components and interactions work as expected.

---

## Project Structure

```
frontend-fiesta/
├── public/             # Public assets and index.html
├── src/                # React components, Redux logic, and other source files
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository.**

2. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit them:**

   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a pull request.**

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Additional Information

- **Environment Variables:** Use a `.env` file to manage environment-specific settings. Refer to `.env.example` for required variables.
- **Contact:** For questions or support, please open an issue or contact the repository owner.

---

*Happy coding!*