import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, XCircle, Sparkles, Copy, Eye, Wand2 } from 'lucide-react';
import { Template } from '../types';
import { api } from '../services/api';
import { generateTemplateContent } from '../services/geminiService';

export const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genTone, setGenTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        setTemplates(data);
      } catch (e) {
        console.error("Failed to fetch templates");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleGenerate = async () => {
    if (!genTopic) return;
    setIsGenerating(true);
    const result = await generateTemplateContent(genTopic, genTone);
    setGeneratedText(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Message Templates</h2>
          <p className="text-slate-500 text-lg mt-1">Craft the perfect message with AI.</p>
        </div>
        <button 
          onClick={() => setShowGenerator(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 font-medium"
        >
          <Sparkles size={18} />
          <span>AI Generator</span>
        </button>
      </div>

      {/* AI Generator Panel */}
      {showGenerator && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 animate-fade-in relative shadow-xl shadow-indigo-100/50">
          <button onClick={() => setShowGenerator(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors bg-white p-2 rounded-full shadow-sm"><XCircle size={24}/></button>
          
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Wand2 size={20} />
             </div>
             <div>
                <h3 className="text-indigo-900 font-bold text-xl">Generate with Gemini</h3>
                <p className="text-indigo-600/70 text-sm font-medium">Create approved templates in seconds</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Topic</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium text-slate-800 placeholder:text-slate-400"
                  placeholder="e.g., Diwali Sale, Appointment confirmation..."
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tone</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Professional', 'Friendly', 'Urgent', 'Excited'].map(t => (
                    <button
                        key={t}
                        onClick={() => setGenTone(t)}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${genTone === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-indigo-100 text-slate-600 hover:bg-indigo-50'}`}
                    >
                        {t}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-200 mt-2"
              >
                {isGenerating ? 'Thinking...' : 'Generate Template'}
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-sm min-h-[200px] flex flex-col">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Preview</label>
              {generatedText ? (
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed flex-grow font-medium">{generatedText}</p>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-300">
                    <Sparkles size={32} className="mb-2 opacity-50"/>
                    <p className="italic text-sm">AI magic happens here...</p>
                </div>
              )}
              {generatedText && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1.5 font-bold bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                    <Copy size={16} /> Use This
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* New Template Card */}
        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all min-h-[240px] group bg-white/50">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300">
            <Plus size={32} />
          </div>
          <span className="font-bold text-lg">Create New</span>
        </div>

        {isLoading ? (
           // Skeletons
           Array(3).fill(0).map((_, i) => (
             <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 h-[240px] animate-pulse">
                <div className="flex justify-between mb-4">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                    <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-20 bg-slate-100 rounded-xl mb-6"></div>
                <div className="h-6 w-16 bg-slate-200 rounded"></div>
             </div>
           ))
        ) : (
          templates.map((template) => (
            <div key={template.id} className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 p-6 flex flex-col relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-slate-900 truncate pr-2 text-lg tracking-tight">{template.name}</span>
                {template.status === 'approved' && <div title="Approved" className="p-1 bg-green-100 rounded-full"><CheckCircle className="text-green-600 shrink-0" size={16} /></div>}
                {template.status === 'pending' && <div title="Pending" className="p-1 bg-amber-100 rounded-full"><Clock className="text-amber-600 shrink-0" size={16} /></div>}
                {template.status === 'rejected' && <div title="Rejected" className="p-1 bg-red-100 rounded-full"><XCircle className="text-red-600 shrink-0" size={16} /></div>}
              </div>
              
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 font-mono text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
                {template.content}
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
                  {template.category}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 rounded-lg shadow-sm border border-slate-200" title="Preview">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
