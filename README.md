# Mama's Thali - Tiffin Service Web Application

A modern, animated web application for ordering home-cooked tiffin services, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Modern UI/UX** - Beautiful, Zomato-inspired design with smooth animations
- 🚀 **Next.js 14** - Built with the latest Next.js App Router
- ⚡ **Framer Motion** - Smooth, performant animations throughout
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎯 **TypeScript** - Type-safe codebase
- 🎨 **Tailwind CSS** - Utility-first CSS framework

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── service/[id]/       # Service detail pages
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── Categories.tsx      # Cuisine categories
│   ├── ServiceCard.tsx     # Service card component
│   ├── ServiceGrid.tsx     # Service listing grid
│   └── Footer.tsx          # Footer component
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## Key Features Implemented

### Home Page
- Animated hero section with gradient backgrounds
- Cuisine category filters
- Service listing grid with hover animations
- Search and filter functionality

### Service Detail Page
- Large image gallery
- Service information and ratings
- Interactive menu with category filtering
- Review section
- Add to cart functionality

### Components
- Fully responsive header with mobile menu
- Animated service cards
- Category navigation
- Footer with links and contact info

## Animations

The application uses Framer Motion for:
- Page transitions
- Hover effects on cards and buttons
- Staggered animations for lists
- Scroll-triggered animations
- Micro-interactions

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
- Primary colors (red/pink theme)
- Secondary colors (yellow/orange theme)

### Content
Replace mock data in components with actual API calls:
- `ServiceGrid.tsx` - Update `mockServices` array
- `app/service/[id]/page.tsx` - Replace with API call using `params.id`

## Build for Production

```bash
npm run build
npm start
```

## License

MIT License

