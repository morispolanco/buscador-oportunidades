import React, { useState, useCallback } from 'react';
import { generateOpportunities } from './services/geminiService';
import { AppState } from './types';
import type { BusinessOpportunity, ApiBusinessOpportunity } from './types';
import OpportunityCard from './components/OpportunityCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !country) {
      setError("Por favor, proporciona tanto una industria como un país.");
      setAppState(AppState.ERROR);
      return;
    }
    setAppState(AppState.LOADING);
    setError(null);
    setOpportunities([]);

    try {
      const results: ApiBusinessOpportunity[] = await generateOpportunities(industry, country);
      const trackedResults: BusinessOpportunity[] = results.map(opp => ({
        ...opp,
        tracking: {
          emailSent: false,
          emailSentDate: null,
          responseReceived: false,
          responseReceivedDate: null,
          inProduction: false,
        }
      }));
      setOpportunities(trackedResults);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [industry, country]);

  const handleTrackingChange = useCallback((
    index: number,
    field: 'emailSent' | 'responseReceived' | 'inProduction',
    value: boolean
  ) => {
    setOpportunities(prevOpps => {
      const newOpps = [...prevOpps];
      const oppToUpdate = { ...newOpps[index] };
      const newTracking = { ...oppToUpdate.tracking };

      newTracking[field] = value;
      
      if (field === 'emailSent') {
        newTracking.emailSentDate = value ? new Date().toLocaleDateString('es-ES') : null;
        if (!value) {
            newTracking.responseReceived = false;
            newTracking.responseReceivedDate = null;
        }
      } else if (field === 'responseReceived') {
        newTracking.responseReceivedDate = value ? new Date().toLocaleDateString('es-ES') : null;
      }
      
      oppToUpdate.tracking = newTracking;
      newOpps[index] = oppToUpdate;
      return newOpps;
    });
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <Loader />;
      case AppState.SUCCESS:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {opportunities.map((opp, index) => (
              <OpportunityCard 
                key={index} 
                opportunity={opp} 
                index={index}
                onTrackingChange={handleTrackingChange}
              />
            ))}
          </div>
        );
      case AppState.ERROR:
        return error && <ErrorMessage message={error} />;
      case AppState.IDLE:
      default:
        return (
          <div className="text-center text-gray-500">
             <div className="max-w-xl mx-auto">
                <svg className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01" />
                </svg>
                <h3 className="mt-2 text-2xl font-medium text-gray-300">¿Listo para Encontrar Oportunidades?</h3>
                <p className="mt-1 text-lg text-gray-500">
                    Ingresa una industria y un país para comenzar a generar soluciones de negocio impulsadas por IA.
                </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
            Buscador de Oportunidades de Negocio con IA
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-3xl mx-auto">
            Automatiza el descubrimiento de necesidades comerciales y genera propuestas de soluciones de IA a medida.
          </p>
        </header>

        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-6 mb-10">
          <form onSubmit={handleGenerate} className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-1">Industria / Comercio</label>
                <input
                  type="text"
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="ej., Cafeterías"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  disabled={appState === AppState.LOADING}
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">País</label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="ej., España"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  disabled={appState === AppState.LOADING}
                />
              </div>
            </div>
            <button
                type="submit"
                disabled={appState === AppState.LOADING}
                className="w-full mt-5 font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                 {appState === AppState.LOADING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  'Buscar Oportunidades'
                )}
            </button>
          </form>
        </div>
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
