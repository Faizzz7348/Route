import { useState, useEffect } from "react";
import { Bot, ArrowLeft, Sun, Moon, Sparkles, MessageCircle, Zap, Shield, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpChatbot } from "@/components/help-chatbot";
import { useTheme } from "@/components/theme-provider";

export default function HelpPage() {
  const [, setLocation] = useLocation();
  const [showChatbot, setShowChatbot] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Auto-open chatbot when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatbot(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Natural Conversations",
      description: "Ask questions in your own words - the AI understands context and intent"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Language Support",
      description: "Switch between English, Bahasa Melayu, Tamil, and Chinese seamlessly"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Responses",
      description: "Get immediate answers with detailed explanations and step-by-step guides"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Always Available",
      description: "24/7 assistance for all your questions about the route management system"
    }
  ];

  return (
    <>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full border-b-2 border-blue-500/50 dark:border-blue-400/50 bg-white dark:bg-black shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between text-[12px]">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                  <img 
                    src="/assets/FamilyMart.png" 
                    alt="Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-600 dark:text-slate-300" style={{ fontSize: '12px' }}>AI Help Assistant</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Advanced chatbot powered by AI</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="btn-glass w-8 h-8 p-0 pagination-button rounded-xl group transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 active:shadow-none"
                data-testid="button-toggle-theme"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-yellow-500 transition-all duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-500 transition-all duration-300" />
                )}
              </Button>
              
              {/* Back Button */}
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                size="sm"
                className="btn-glass w-8 h-8 p-0 pagination-button rounded-xl group transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 active:shadow-none"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-all duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-white dark:bg-black" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top) + 2rem)', paddingBottom: '2rem' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mb-6">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              AI Help Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Your intelligent companion for navigating the Route Management System. Get instant answers, step-by-step guides, and expert tips in multiple languages.
            </p>
            
            {/* CTA Button */}
            <Button
              onClick={() => setShowChatbot(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Chatting Now
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">4</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Languages Supported</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Always Available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 border-pink-200 dark:border-pink-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">∞</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unlimited Questions</p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the button below to open the AI assistant and start asking questions!
            </p>
            <Button
              onClick={() => setShowChatbot(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <Bot className="w-5 h-5 mr-2" />
              Open AI Assistant
            </Button>
          </div>
        </div>
      </main>

      {/* Chatbot Modal */}
      <HelpChatbot open={showChatbot} onOpenChange={setShowChatbot} />
    </>
  );
}
