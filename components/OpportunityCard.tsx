import React, { useState, useCallback } from 'react';
import type { BusinessOpportunity } from '../types';

interface OpportunityCardProps {
  opportunity: BusinessOpportunity;
  index: number;
  onTrackingChange: (index: number, field: 'emailSent' | 'responseReceived' | 'inProduction', value: boolean) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, index, onTrackingChange }) => {
  const [promptCopied, setPromptCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(opportunity.appCreationPrompt).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  }, [opportunity.appCreationPrompt]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(opportunity.proposalEmail.body).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }, [opportunity.proposalEmail.body]);

  const cardColors = [
    'from-blue-900/50 to-slate-900',
    'from-purple-900/50 to-slate-900',
    'from-teal-900/50 to-slate-900',
    'from-indigo-900/50 to-slate-900',
  ];
  const colorClass = cardColors[index % cardColors.length];
  
  const mailtoHref = `mailto:${opportunity.managerEmail}?subject=${encodeURIComponent(opportunity.proposalEmail.subject)}&body=${encodeURIComponent(opportunity.proposalEmail.body)}`;

  const getProbabilityBadgeColor = (rating: 'Alta' | 'Media' | 'Baja') => {
    switch (rating) {
      case 'Alta':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Media':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Baja':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl shadow-lg border border-gray-700/50 flex flex-col space-y-4 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/50`}>
      <div>
        <p className="text-sm font-semibold text-purple-400 tracking-wider uppercase">{opportunity.sector}</p>
        <h3 className="text-xl font-bold text-cyan-300 tracking-wide">{opportunity.businessType}</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-3">
            <h4 className="font-semibold text-gray-200 text-sm">Probabilidad de Aceptación:</h4>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getProbabilityBadgeColor(opportunity.acceptanceProbability.rating)}`}>
                {opportunity.acceptanceProbability.rating} ({opportunity.acceptanceProbability.score}/10)
            </span>
        </div>
        <p className="text-sm text-gray-400 italic">"{opportunity.acceptanceProbability.justification}"</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col items-center bg-gray-800/50 p-2 rounded-lg text-center">
            <span className="font-semibold text-gray-400 text-xs">Facilidad de Creación</span>
            <span className="text-lg font-bold text-cyan-300">{opportunity.easeOfCreation}/10</span>
        </div>
        <div className="flex flex-col items-center bg-gray-800/50 p-2 rounded-lg text-center">
            <span className="font-semibold text-gray-400 text-xs">Oportunidad de Ganancia</span>
            <span className="text-lg font-bold text-green-300">{opportunity.opportunityForGain}/10</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-purple-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <a href={`mailto:${opportunity.managerEmail}`} className="hover:underline truncate" title={opportunity.managerEmail}>{opportunity.managerEmail}</a>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-gray-200">Necesidad Urgente:</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{opportunity.urgentNeed}</p>
      </div>
      
      <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-lg text-gray-200">Solución de IA Propuesta: <span className="text-purple-300 font-bold">{opportunity.aiSolutionName}</span></h4>
        <p className="text-gray-300 text-sm leading-relaxed">{opportunity.aiSolutionDescription}</p>
      </div>

      <div className="flex-grow flex flex-col space-y-2">
        <div className="flex justify-between items-center">
             <h4 className="font-semibold text-lg text-gray-200">Prompt de Creación de App:</h4>
             <button
                onClick={handleCopyPrompt}
                className="px-3 py-1 text-xs font-medium text-gray-900 bg-cyan-300 rounded-md hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 transition-colors duration-200"
              >
                {promptCopied ? '¡Copiado!' : 'Copiar'}
              </button>
        </div>
        <pre className="bg-gray-900/70 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono h-48 flex-grow">
          {opportunity.appCreationPrompt}
        </pre>
      </div>
      
      <hr className="border-gray-700 my-2"/>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-gray-200">Propuesta de Email al Cliente:</h4>
            <button
                onClick={() => setShowEmail(!showEmail)}
                className="px-3 py-1 text-xs font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-400 transition-colors duration-200"
            >
                {showEmail ? 'Ocultar' : 'Mostrar'}
            </button>
        </div>
        {showEmail && (
            <div className="bg-gray-900/70 p-4 rounded-lg space-y-4">
                <div className="font-mono text-xs">
                    <p><span className="font-bold text-gray-400">Asunto: </span>{opportunity.proposalEmail.subject}</p>
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                    {opportunity.proposalEmail.body}
                </pre>
                 <div className="flex items-center space-x-2 pt-2 border-t border-gray-700/50">
                    <a
                      href={mailtoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 text-sm font-bold text-gray-900 bg-purple-400 rounded-md hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-400 transition-colors duration-200"
                    >
                      Enviar por Email
                    </a>
                    <button
                        onClick={handleCopyEmail}
                        className="flex-1 text-center px-3 py-2 text-sm font-bold text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 transition-colors duration-200"
                    >
                        {emailCopied ? '¡Copiado!' : 'Copiar Texto'}
                    </button>
                </div>
            </div>
        )}
      </div>

      <hr className="border-gray-700 my-2"/>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-gray-200">Seguimiento de Comunicación:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <label htmlFor={`emailSent-${index}`} className="flex items-center cursor-pointer text-gray-300">
              <input
                id={`emailSent-${index}`}
                type="checkbox"
                checked={opportunity.tracking.emailSent}
                onChange={(e) => onTrackingChange(index, 'emailSent', e.target.checked)}
                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-500 focus:ring-cyan-600"
              />
              <span className="ml-2">Email enviado</span>
            </label>
            {opportunity.tracking.emailSent && opportunity.tracking.emailSentDate && (
              <span className="text-xs text-gray-400 font-mono">{opportunity.tracking.emailSentDate}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor={`responseReceived-${index}`} className="flex items-center cursor-pointer text-gray-300">
              <input
                id={`responseReceived-${index}`}
                type="checkbox"
                checked={opportunity.tracking.responseReceived}
                onChange={(e) => onTrackingChange(index, 'responseReceived', e.target.checked)}
                disabled={!opportunity.tracking.emailSent}
                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-500 focus:ring-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="ml-2">Respuesta recibida</span>
            </label>
            {opportunity.tracking.responseReceived && opportunity.tracking.responseReceivedDate && (
              <span className="text-xs text-gray-400 font-mono">{opportunity.tracking.responseReceivedDate}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor={`inProduction-${index}`} className="flex items-center cursor-pointer text-gray-300">
              <input
                id={`inProduction-${index}`}
                type="checkbox"
                checked={opportunity.tracking.inProduction}
                onChange={(e) => onTrackingChange(index, 'inProduction', e.target.checked)}
                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-500 focus:ring-cyan-600"
              />
              <span className="ml-2">Aplicación en producción</span>
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OpportunityCard;