**Project: Reflecto - Real-Time Feedback Platform**

Developed **Reflecto**, a real-time feedback platform using modern web technologies:

- **Frontend**: Built with **Next.js 14**, **Tailwind CSS**, and **shadcn/ui** for a responsive, polished UI.
- **Backend & Authentication**: Integrated **Auth.js** for secure user authentication, and used **Prisma** with **MongoDB** for scalable data management.
- **API Routes**:
  - **Review Fetching**: Created a custom **Next.js API route** to allow users to fetch reviews via API keys with **pagination** support, delivering responses in **JSON format**.
  - **Review Submission**: Developed another **API route** for submitting user reviews, ensuring smooth and secure data handling.
- **Real-Time Data Fetching**: Utilized **Tanstack/react-query** to efficiently manage review data fetching with pagination.
- **Payments & Storage**: Integrated **Stripe** for payments, **Upstash** for rate-limiting, and **Uploadthing** for secure file storage.
- **Notifications**: Set up real-time **Discord** notifications to alert users about new feedback or member activity.

Reflecto enables users to capture, manage, and analyze feedback in real-time, providing an intuitive and scalable platform for feedback collection and insights.
