import Link from 'next/link';
import { ArrowRight, Globe, Zap, Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-sky-400" />
              <span className="text-xl font-bold text-white">TradeFlow</span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition">How It Works</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login" className="px-4 py-2 text-sky-400 hover:text-sky-300 transition">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Global B2B Import-Export Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-400">Frictionless</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Connect with suppliers worldwide. Find the best products, manage quotations, and scale your business with AI-powered intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="px-8 py-3 border border-sky-400 text-sky-400 hover:bg-sky-400/10 rounded-lg font-semibold transition">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Supplier Network",
                description: "Access verified suppliers from Russia, China, and beyond with real-time inventory data."
              },
              {
                icon: Zap,
                title: "AI-Powered Matching",
                description: "Smart supplier matching based on your requirements, quality standards, and pricing."
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "Get insights on market trends, pricing analytics, and competitive intelligence."
              },
              {
                icon: Shield,
                title: "Supplier Verification",
                description: "Verified suppliers with compliance tracking and reputation management."
              },
              {
                icon: Users,
                title: "Built-in CRM",
                description: "Manage leads, contacts, and relationships all in one place."
              },
              {
                icon: CheckCircle,
                title: "Compliance Ready",
                description: "Stay compliant with trade regulations and documentation requirements."
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition">
                <feature.icon className="w-12 h-12 text-sky-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">How It Works</h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Sign up and set up your company profile with your sourcing requirements."
              },
              {
                step: 2,
                title: "Post RFQ or Browse",
                description: "Post a Request for Quotation or browse our supplier catalog."
              },
              {
                step: 3,
                title: "Receive Quotations",
                description: "Get competitive quotes from verified suppliers within 24 hours."
              },
              {
                step: 4,
                title: "Manage & Order",
                description: "Compare, negotiate, and place orders all through our platform."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { number: "1000+", label: "Verified Suppliers" },
            { number: "50+", label: "Countries" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-sky-400 mb-2">{stat.number}</div>
              <div className="text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-sky-500/10 to-pink-500/10 border border-sky-400/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Global Trade?</h2>
          <p className="text-slate-300 mb-8">Join thousands of businesses already using TradeFlow to streamline their import-export operations.</p>
          <Link href="/auth/register" className="inline-block px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition transform hover:scale-105">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-sky-400" />
                <span className="font-bold text-white">TradeFlow</span>
              </div>
              <p className="text-slate-400 text-sm">Making global trade frictionless, transparent, and secure.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 TradeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
