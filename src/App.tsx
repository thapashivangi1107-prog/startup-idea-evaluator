/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Search, 
  ArrowRight, 
  Loader2,
  ShieldAlert,
  BarChart3,
  Sparkles,
  Compass,
  Target,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SYSTEM_INSTRUCTION = `You are an elite startup consultant and venture capital analyst. 
When provided with a business idea, analyze it with precision and provide a structured evaluation.
Your response MUST include:
1. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
2. Risk Assessment (Financial, Market, Operational)
3. Strategic Suggestions to improve the idea and increase success chances.
Use clear headings and bullet points. Be critical but constructive.
Maintain a professional, encouraging, and insightful tone.`;

export default function App() {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateIdea = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate this startup business idea: ${idea}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      if (response.text) {
        setResult(response.text);
      } else {
        throw new Error("No response generated");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Failed to evaluate the idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1C1917] font-sans selection:bg-stone-200 selection:text-stone-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between glass-card rounded-full px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-bold tracking-tight text-stone-900">IdeaEvaluator</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900 transition-colors">Methodology</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Case Studies</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Pricing</a>
          </div>
          <button className="text-sm font-semibold bg-stone-900 text-white px-5 py-2 rounded-full hover:bg-stone-800 transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-serif italic mb-6 tracking-tight leading-[0.9]">
            The Future of <br />
            <span className="text-stone-400">Business Analysis</span>
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Transform your raw concepts into structured business intelligence. 
            Our AI engine provides deep insights for the next generation of founders.
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto mb-24"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 p-8 md:p-12 border border-stone-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                <Lightbulb size={24} />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">What's your vision?</h2>
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea in detail... (e.g., A marketplace for sustainable fashion using blockchain for transparency)"
              className="w-full h-48 p-6 bg-stone-50/50 border-none rounded-2xl focus:ring-2 focus:ring-stone-200 transition-all resize-none text-lg leading-relaxed placeholder:text-stone-300"
            />

            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-900 flex items-center justify-center text-[10px] text-white font-bold">
                  +1.2k
                </div>
                <span className="ml-4 text-sm font-medium text-stone-400 self-center pl-4">Trusted by founders globally</span>
              </div>

              <button
                onClick={evaluateIdea}
                disabled={isLoading || !idea.trim()}
                className={cn(
                  "group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all overflow-hidden",
                  isLoading || !idea.trim()
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-900 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/20 active:scale-95"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Concept
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-stone-100 rounded-full -z-10 blur-2xl opacity-50" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-stone-200 rounded-full -z-10 blur-3xl opacity-30" />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-12 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600"
            >
              <ShieldAlert size={24} />
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Strategic Intelligence Report</span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Analysis */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8 md:p-12 prose prose-stone max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-4xl font-serif italic mb-8 mt-12 first:mt-0 text-stone-900">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif italic mb-6 mt-10 border-b pb-4 border-stone-50 text-stone-800">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold mb-4 mt-8 text-stone-800">{children}</h3>,
                        ul: ({ children }) => <ul className="list-none pl-0 space-y-4 mb-8">{children}</ul>,
                        li: ({ children }) => (
                          <li className="flex gap-4 text-stone-600 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
                            <span>{children}</span>
                          </li>
                        ),
                        p: ({ children }) => <p className="text-stone-600 leading-relaxed mb-6 text-lg">{children}</p>,
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="sticky top-32 space-y-8">
                    <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
                        <BarChart3 size={16} />
                        Executive Summary
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
                            <Compass size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 mb-1">Market Fit</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">Analysis of target demographics and demand.</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
                            <Target size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 mb-1">Execution</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">Operational feasibility and scalability.</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 mb-1">Resilience</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">Risk mitigation and long-term stability.</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-10 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-900 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2">
                        Download PDF Report
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="bg-stone-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">Founder Insight</h3>
                        <p className="text-lg font-serif italic leading-relaxed opacity-90 mb-6">
                          "The best way to predict the future is to create it. Use these insights to build something that matters."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold">AI</div>
                          <span className="text-xs font-bold tracking-widest opacity-50 uppercase">Strategic Advisor</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-xs font-bold text-stone-400 uppercase tracking-widest mb-8">
              <Search size={12} />
              Ready for your vision
            </div>
            <p className="text-2xl font-serif italic text-stone-300">Your startup journey begins with a single insight.</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <span className="font-bold tracking-tight text-xl">IdeaEvaluator</span>
              </div>
              <p className="text-stone-500 max-w-sm leading-relaxed">
                Empowering the next generation of founders with AI-driven strategic intelligence and market insights.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li><a href="#" className="hover:text-stone-900 transition-colors">Analysis Engine</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Risk Modeling</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Market Trends</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li><a href="#" className="hover:text-stone-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-stone-300 uppercase tracking-widest">© 2026 IdeaEvaluator AI. All rights reserved.</p>
            <div className="flex gap-6">
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer">
                <span className="text-[10px] font-bold">TW</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer">
                <span className="text-[10px] font-bold">LI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
