# TurnitinCheck

AI and plagiarism detection web application built with Next.js. Upload documents, get instant analysis, and download detailed PDF reports.

## Features

- Document upload with drag & drop support (PDF, DOC, DOCX, TXT)
- AI-generated content detection
- Plagiarism checking
- Downloadable PDF reports
- Real-time status tracking
- Check history with filtering

## Getting Started
<img width="1879" height="913" alt="image" src="https://github.com/user-attachments/assets/cdc2c6fc-323c-47c2-a9f7-5fd219a80c98" />
<img width="1887" height="908" alt="image" src="https://github.com/user-attachments/assets/2adac7f0-f162-4a68-9d66-5917d34a234d" />
<img width="1890" height="901" alt="image" src="https://github.com/user-attachments/assets/1b3e0d67-40ef-4268-bac6-ebd480c34ab7" />

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/turnitincheck.git
cd turnitincheck
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your API credentials:



4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:3000

## File Requirements

- Formats: PDF, DOC, DOCX, TXT
- Max size: 100 MB
- Word count: 300 - 30,000 words
- Languages: English, Spanish, Japanese (60%+ content)
- Max pages: 800

## Project Structure

```
src/
├── app/
│   ├── api/           # API route handlers
│   ├── check/         # Check details page
│   ├── history/       # Check history page
│   ├── upload/        # File upload page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Dashboard
├── components/        # React components
└── types/             # TypeScript types
```

## API Endpoints

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | /api/key/details            | Get API key info           |
| POST   | /api/check                  | Submit document            |
| GET    | /api/check/[id]             | Get check details          |
| GET    | /api/checks                 | List all checks            |
| DELETE | /api/checks                 | Delete all checks          |
| GET    | /api/report/ai/[id]         | Download AI report         |
| GET    | /api/report/plagiarism/[id] | Download plagiarism report |

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
