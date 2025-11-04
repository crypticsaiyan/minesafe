"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowRight, Shield, AlertTriangle, FileText, TrendingUp, CheckCircle, Users, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      {/* Background Image for entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/bg.jpg)' }}
      />
      {/* Dark Overlay for entire page */}
      <div className="fixed inset-0 bg-black/60 z-0" />
      
      {/* Content wrapper with higher z-index */}
      <div className="relative z-10">
      {/* Navigation */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container relative mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 lg:py-32 z-10">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 animate-fade-in text-xs sm:text-sm" variant="secondary">
                <Shield className="mr-1 size-3" />
                AI-Powered Mine Safety Platform
              </Badge>
              
              <h1 className="animate-fade-in-up mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Keep Your Mine Safe with{" "}
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Intelligent Monitoring
                </span>
              </h1>
              
              <p className="animate-fade-in-up mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg text-gray-200 delay-100 px-2 sm:px-0">
                MineSafe uses advanced AI to detect hazards, prevent accidents, and ensure 
                compliance. Monitor your mining operations in real-time with intelligent alerts 
                and comprehensive audit trails.
              </p>
              
              <div className="animate-fade-in-up flex flex-col items-center justify-center gap-3 sm:gap-4 delay-200 sm:flex-row px-4 sm:px-0">
                <Button asChild size="lg" className="group w-full sm:w-auto">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up mx-auto mt-12 sm:mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:gap-8 delay-300 sm:grid-cols-3 px-4 sm:px-0">
              <div className="rounded-lg border bg-card/90 backdrop-blur-sm p-4 sm:p-6 text-center shadow-sm">
                <div className="mb-2 text-2xl sm:text-3xl font-bold">99.9%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Uptime Guarantee</div>
              </div>
              <div className="rounded-lg border bg-card/90 backdrop-blur-sm p-4 sm:p-6 text-center shadow-sm">
                <div className="mb-2 text-2xl sm:text-3xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Real-time Monitoring</div>
              </div>
              <div className="rounded-lg border bg-card/90 backdrop-blur-sm p-4 sm:p-6 text-center shadow-sm">
                <div className="mb-2 text-2xl sm:text-3xl font-bold">AI</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Powered Detection</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center px-4 sm:px-0">
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Everything You Need for Mine Safety
            </h2>
            <p className="mb-8 sm:mb-12 text-base sm:text-lg text-gray-200">
              Comprehensive tools to manage, monitor, and maintain safety standards
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <AlertTriangle className="size-6 text-primary" />
                </div>
                <CardTitle>Hazard Detection</CardTitle>
                <CardDescription>
                  AI-powered real-time hazard identification and classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Automatic hazard detection
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Priority classification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Instant notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <CardTitle>Accident Tracking</CardTitle>
                <CardDescription>
                  Comprehensive incident reporting and analysis system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Detailed incident logs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Root cause analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Preventive measures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle>Audit Management</CardTitle>
                <CardDescription>
                  Complete audit trails and compliance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Digital audit logs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Compliance tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Automated reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Visualize safety metrics and trends in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Interactive charts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Trend analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Custom reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>AI Chat Assistant</CardTitle>
                <CardDescription>
                  Get instant answers about safety protocols and procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    24/7 availability
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Context-aware responses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Multi-language support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <AlertTriangle className="size-6 text-primary" />
                </div>
                <CardTitle>Alert System</CardTitle>
                <CardDescription>
                  Intelligent notification system for critical events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Priority-based alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Multiple channels
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 size-4 text-primary" />
                    Custom triggers
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-primary/95 backdrop-blur-sm p-6 sm:p-8 md:p-12 text-center text-primary-foreground shadow-xl">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Transform Your Mine Safety?
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg opacity-90 px-4 sm:px-0">
              Join the future of intelligent mining operations. Start monitoring your site today.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
              <Button asChild size="lg" variant="secondary" className="group w-full sm:w-auto">
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                <Link href="#about">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Shield className="size-4 sm:size-5 text-primary" />
                <span className="text-sm sm:text-base font-semibold text-foreground">MineSafe</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                © 2025 MineSafe. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
      </div>
    </div>
  )
}
