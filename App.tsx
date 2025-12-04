import React, { useState } from 'react';
import { AppStep } from './types';
import { StepIndicator } from './components/StepIndicator';
import { DocumentInput } from './components/DocumentInput';
import { generateReplication } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INITIAL_PETITION);
  
  // State for documents
  const [initialPetition, setInitialPetition] = useState<string>("");
  const [contestation1, setContestation1] = useState<string>("");
  const [contestation2, setContestation2] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");
  
  // State for generation
  const [generatedResult, setGeneratedResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep === AppStep.INITIAL_PETITION && !initialPetition.trim()) {
      alert("Por favor, insira o texto da Petição Inicial.");
      return;
    }
    if (currentStep === AppStep.CONTESTATION && !contestation1.trim()) {
      alert("Por favor, insira o texto da primeira Contestação.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateReplication(initialPetition, contestation1, contestation2, focusArea);
      setGeneratedResult(result);
      setCurrentStep(AppStep.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResult);
    alert("Texto copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">JuridicoAI</h1>
              <p className="text-xs text-slate-500 font-medium">Assistente de Impugnação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <StepIndicator currentStep={currentStep} setStep={setCurrentStep} />

        <div className="mt-8 transition-all duration-300">
          {/* Step 1: Initial Petition */}
          {currentStep === AppStep.INITIAL_PETITION && (
            <div className="animate-fade-in">
              <DocumentInput
                title="1. Petição Inicial"
                description="Cole aqui o texto da sua Petição Inicial (Exordial). A IA usará este texto para aprender seus fundamentos e estilo de escrita."
                value={initialPetition}
                onChange={setInitialPetition}
                placeholder="Exmo. Sr. Juiz de Direito..."
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                >
                  Próximo: Contestações
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contestations */}
          {currentStep === AppStep.CONTESTATION && (
            <div className="animate-fade-in space-y-8">
              <DocumentInput
                title="2.1 Contestação (Réu 1)"
                description="Cole aqui o texto da Contestação do primeiro Réu. Campo obrigatório."
                value={contestation1}
                onChange={setContestation1}
                placeholder="Vem o Réu, perante V. Exa., apresentar defesa..."
              />
              
              <DocumentInput
                title="2.2 Contestação (Réu 2) - Opcional"
                description="Se houver um segundo Réu, cole a contestação dele aqui."
                value={contestation2}
                onChange={setContestation2}
                placeholder="(Opcional) Cole a segunda contestação aqui..."
              />

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                >
                  Próximo: Revisão
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Generate */}
          {currentStep === AppStep.REVIEW_GENERATE && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Configuração da Impugnação</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Resumo dos Dados</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 col-span-2">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Petição Inicial</div>
                        <div className="text-lg font-semibold text-slate-800">{initialPetition.length.toLocaleString()} caracteres</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Contestação 1</div>
                        <div className="text-lg font-semibold text-slate-800">{contestation1.length.toLocaleString()} caracteres</div>
                      </div>
                      {contestation2 ? (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Contestação 2</div>
                          <div className="text-lg font-semibold text-slate-800">{contestation2.length.toLocaleString()} caracteres</div>
                        </div>
                      ) : (
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-center opacity-50">
                          <span className="text-sm text-slate-400 italic">2º Réu não informado</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Instruções de Foco (Opcional)</label>
                    <textarea
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows={3}
                      placeholder="Ex: Focar na refutação da prescrição intercorrente e na legitimidade ativa do Ministério Público..."
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Indique pontos específicos que você deseja que a IA priorize na elaboração da réplica.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analisando Juridicamente...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          Gerar Impugnação
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === AppStep.RESULT && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Minuta Sugerida</h2>
                <div className="flex gap-3">
                   <button
                    onClick={() => setCurrentStep(AppStep.REVIEW_GENERATE)}
                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Refazer
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    Copiar Texto
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg border border-gray-200">
                <div className="prose prose-slate max-w-none legal-text">
                  <ReactMarkdown>
                    {generatedResult}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;