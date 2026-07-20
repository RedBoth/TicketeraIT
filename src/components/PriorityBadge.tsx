interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  // Normalizamos el texto a mayúsculas para evitar problemas de tipeo
  const normalizedPriority = priority.toUpperCase();

  // Definimos las clases según la prioridad
  const getStyles = () => {
    switch (normalizedPriority) {
      case "CRITICAL":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "NORMAL":
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  // Helper para mostrar un texto más amigable en español si preferís
  const getLabel = () => {
    switch (normalizedPriority) {
      case "CRITICAL":
        return "Crítica";
      case "HIGH":
        return "Alta";
      case "NORMAL":
      default:
        return "Normal";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStyles()} select-none`}>
      {getLabel()}
    </span>
  );
}