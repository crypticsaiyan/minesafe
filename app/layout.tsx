import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MineSafe - AI-Powered Mine Safety Platform",
  description: "Keep your mine safe with intelligent monitoring, hazard detection, and compliance management.",
};

const sampleUpdates = [
  {
    title: 'New Feature Released',
    description: 'We have launched a new dashboard with enhanced analytics and reporting capabilities.',
    time: '2 hours ago',
    tag: 'Feature'
  },
  {
    title: 'Security Update',
    description: 'Important security patches have been applied to improve system protection.',
    time: '5 hours ago',
    tag: 'Security'
  },
  {
    title: 'Performance Improvements',
    description: 'The application now loads 40% faster with optimized code and caching.',
    time: '1 day ago',
    tag: 'Performance'
  },
  {
    title: 'Bug Fixes',
    description: 'Resolved issues with form validation and data synchronization.',
    time: '2 days ago',
    tag: 'Bug Fix'
  }
];

const sampleSuggestions = [
  {
    title: 'Enable Two-Factor Authentication',
    description: 'Add an extra layer of security to your account by enabling 2FA in settings.',
    author: 'Security Team',
    priority: 'high'
  },
  {
    title: 'Complete Your Profile',
    description: 'Add more information to help others know you better and improve recommendations.',
    author: 'System',
    priority: 'medium'
  },
  {
    title: 'Try Dark Mode',
    description: 'Switch to dark mode for a more comfortable viewing experience, especially at night.',
    author: 'UI Team',
    priority: 'low'
  },
  {
    title: 'Set Up Notifications',
    description: 'Configure notification preferences to stay updated on important events.',
    author: 'System',
    priority: 'medium'
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar updates={sampleUpdates} suggestions={sampleSuggestions} />
          <div className="flex flex-col w-full items-center bg-yellow-50">
            <Navigation />
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
