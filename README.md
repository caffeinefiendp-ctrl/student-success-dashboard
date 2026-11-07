# ShelfSense — AI-Powered Library Companion

ShelfSense is a student-focused library companion designed to make discovering books, checking their recorded availability, finding their shelf locations, and managing borrowing requests easier.

It also provides a demo librarian workflow to review student requests and make borrowing or renewal decisions.

## Features

### Student experience
- Browse and search the sample library catalogue.
- View book details, recorded availability, and library location information.
- Track borrowed books and due dates.
- Submit borrowing and renewal requests.
- View request status and librarian decision details.

### Librarian experience
- View and manage student requests.
- Approve or reject requests.
- Add a reason when rejecting a request.

### AI-assisted request analysis
- Generate a structured message for a student request.
- Copy the message and manually share it in the `ShelfSense-Library` Switch room.
- The connected AI agent can analyse the request and provide a summary for the librarian.
- The librarian remains responsible for the final decision.

## Demo Workflow

1. A student browses the catalogue and submits a borrowing or renewal request.
2. The request is saved in the current browser session.
3. On **My Requests**, the student selects **Copy room message**.
4. The student manually pastes and sends the message in the `ShelfSense-Library` Switch room.
5. The AI agent analyses the request and provides information for review.
6. A human librarian reviews the request and approves or rejects it through the Librarian → Request Management area.
7. The student returns to **My Requests** in the same browser session to view the decision and any rejection reason.

## Technology Stack

- React
- TypeScript
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Lucide icons

## Run Locally

### Prerequisites
- Node.js
- npm
- Git

### Installation

```bash
git clone https://github.com/caffeinefiendp-ctrl/student-success-dashboard.git
cd student-success-dashboard
npm install
npm run dev
```

Open the local URL shown in your terminal. The current development setup uses:

`http://localhost:8080/`

## Demo Scope and Limitations

ShelfSense is a prototype built for demonstration purposes.

- The catalogue and inventory details are fictional sample data, not live college-library records.
- There is currently no integration with a real library database, RFID system, or barcode scanner.
- The request-to-Switch-room handoff is manual copy and paste. No automatic webhook integration is implemented.
- Student requests are stored in the browser session rather than a shared production database.
- AI-agent analysis is advisory. It does not automatically approve requests or update their status in the app.
- The demo role switcher is for demonstration and is not production authentication or access control.

Actual book availability and borrowing or renewal decisions must be confirmed by the library.

## Project Goal

ShelfSense aims to make college library services more accessible and convenient for students while giving librarians a simple way to review and manage requests.