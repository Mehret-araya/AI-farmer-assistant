# 🌱 AI Farmer Assistant

**AI-powered agricultural support for farmers — accessible, multilingual, and designed with real-world farming needs in mind.**

AI Farmer Assistant is a project focused on helping farmers understand crop health, explore possible plant diseases, and access practical agricultural guidance through an accessible digital platform.

The project aims to make agricultural information easier to access, particularly for smallholder farmers and communities where expert agricultural support may be difficult to obtain.

> **Project status:** In development. Features described as planned or in progress are not necessarily available in the current application.

## 🎯 Vision

To make useful agricultural knowledge more accessible to farmers through artificial intelligence, multilingual support, and offline-friendly workflows.

## ✨ Planned Features

- 🌿 **Tomato disease analysis:** Support for identifying healthy tomato plants, early blight, and late blight, with an uncertain result when the system cannot make a reliable assessment.
- 📸 **Crop image capture:** Capture or upload crop images for analysis.
- 🌍 **Multilingual interface:** English, Amharic, Swahili, Hindi, and Spanish.
- 📶 **Offline-friendly workflow:** Capture images and queue analysis requests while offline, then synchronize when connectivity returns.
- 🤖 **AI agricultural assistant:** Provide understandable crop-health explanations and practical farming guidance.
- 🌦️ **Weather information:** Display current weather and a five-day forecast to support farming decisions.
- 📊 **Farmer dashboard:** View crop information, recent analyses, and synchronization status.
- 📚 **Agricultural knowledge base:** Use trusted agricultural resources to support recommendations.
- 🎙️ **Voice interaction:** Offer browser-supported speech input where available.
- 🔐 **Privacy and security:** Protect user accounts and data through appropriate authentication, validation, and access controls.
- 💰 **Cost-conscious access:** Target a free tier of up to 100 crop analyses per month, enforced by the backend.

*These are roadmap goals; availability depends on implementation progress.*

## 🧪 Initial MVP Scope

The first version focuses on one crop: **tomato**.

| Area | MVP scope |
|---|---|
| Crop | Tomato |
| Conditions | Healthy, Early Blight, Late Blight, Uncertain |
| Languages | English, Amharic, Swahili, Hindi, Spanish |
| Offline support | Image capture and queued synchronization |
| Analysis limit | Target of 100 analyses per month |
| Platform | React-based Progressive Web App (PWA) |

The system is intended to return an uncertain result when the model cannot provide a sufficiently reliable assessment. AI-generated agricultural guidance should not replace qualified agricultural expertise.

## 🏗️ Planned Architecture

```text
React PWA
    |
    v
Node.js + Express API
    |
    +---- MongoDB
    |
    +---- Cloudinary image storage
    |
    +---- AI Gateway
             |
             +---- Crop vision model
             +---- Language model
             +---- Agricultural knowledge retrieval
             +---- Weather API
             +---- Voice capabilities
```

The architecture may evolve as the project develops.

## 🛠️ Technology Stack

| Technology | Intended use |
|---|---|
| React | User interface |
| Vite | Frontend development and build |
| Progressive Web App (PWA) | Installable, offline-friendly experience |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Application data storage |
| Cloudinary | Crop image storage |
| Hugging Face or Roboflow | Potential hosted crop-disease model |
| OpenWeatherMap | Weather data |
| Git and GitHub | Version control and collaboration |

Some integrations are planned and may not yet be configured.

## 🗺️ Development Roadmap

1. **Setup:** Frontend, backend, internationalization, and PWA foundation.
2. **Authentication and privacy:** Registration, login, protected endpoints, and privacy controls.
3. **Crop management:** Create, view, update, and delete crop records.
4. **Image upload and offline queue:** Compress images and synchronize queued requests.
5. **AI crop analysis:** Disease assessment, confidence handling, recommendations, and usage limits.
6. **History and dashboard:** Analysis history, filters, export, and dashboard statistics.
7. **Weather:** Current conditions, forecasts, and weather-aware guidance.
8. **AI assistant and RAG:** Agricultural knowledge retrieval with supporting sources.
9. **Voice interaction:** Browser-supported speech input and graceful fallback.
10. **AI agents:** Coordinate crop analysis, weather, knowledge search, and crop history tools.
11. **Security and privacy:** Validation, rate limiting, consent, data export, and deletion.
12. **Cost management:** Caching, image compression, usage limits, and cost monitoring.

The roadmap is a development plan, not a claim that all features have been completed.

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)

A MongoDB database and external API credentials may be required for features that depend on them.

### 1. Clone the repository

```bash
git clone https://github.com/Mehret-araya/AI-farmer-assistant.git
cd AI-farmer-assistant
```

### 2. Install dependencies

Install dependencies separately in the folders that contain a `package.json` file.

For example, if your repository contains `client/` and `server/`:

```bash
cd client
npm install
```

Then, in a second terminal from the repository root:

```bash
cd server
npm install
```

### 3. Configure environment variables

Create environment files based on the variables required by the actual application.

Typical backend configuration may include:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

These are illustrative examples, not a verified list of the repository's current configuration requirements. Check the backend code and package scripts before running the application.

**Security:** Never commit `.env` files, passwords, API keys, database credentials, or JWT secrets to GitHub. Use environment variables supplied by your hosting provider in production.

### 4. Run the application

Use the development scripts defined in each folder's `package.json`.

For a Vite frontend, the command is commonly:

```bash
npm run dev
```

For an Express backend, the command depends on the scripts configured in `server/package.json`. Check that file before starting the server.

## 🔒 Privacy and Responsible AI

AI Farmer Assistant is designed with the following principles in mind:

- Treat uploaded crop images and user information responsibly.
- Validate requests on the backend rather than trusting the frontend.
- Enforce usage limits on the server.
- Provide an uncertain result when a crop assessment is unreliable.
- Avoid presenting AI-generated recommendations as guaranteed outcomes.
- Use trusted agricultural references when developing knowledge-based responses.
- Never expose credentials or sensitive configuration in public source code.

## 🤝 Contributing

Contributions, suggestions, bug reports, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Submit a pull request describing the changes.

Please avoid including private credentials, real farmers' personal information, or sensitive images in issues and pull requests.

## 👩‍💻 Project Author

**Mehret Araya**

Software Engineering student interested in artificial intelligence, accessible technology, and practical solutions for agriculture.

- GitHub: [@Mehret-araya](https://github.com/Mehret-araya)
- Project repository: [AI Farmer Assistant](https://github.com/Mehret-araya/AI-farmer-assistant)

## 📄 License

A license has not yet been specified. Until a license is added to the repository, do not assume that the code is available for unrestricted reuse or redistribution.

---

**Building technology to help farmers make more informed decisions. 🌱**
