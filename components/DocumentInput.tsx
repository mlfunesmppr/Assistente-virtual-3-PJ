import React, { useRef } from 'react';

interface DocumentInputProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({ title, description, value, onChange, placeholder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <div className="mb-4 flex gap-2">
         <button 
           onClick={() => fileInputRef.current?.click()}
           className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
           Carregar .txt
         </button>
         <input 
           type="file" 
           ref={fileInputRef} 
           className="hidden" 
           accept=".txt"
           onChange={handleFileUpload}
         />
      </div>

      <textarea
        className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed resize-none"
        placeholder={placeholder || "Cole o conteúdo do documento aqui..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="mt-2 text-right text-xs text-gray-400">
        {value.length} caracteres
      </div>
    </div>
  );
};