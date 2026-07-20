interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  // Definimos las clases según el estado de la base de datos
  const getStyles = () => {
    switch (normalizedStatus) {
      case "OPEN":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "RESOLVED":
      case "CLOSED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  // Helper para mostrar un texto limpio en español
  const getLabel = () => {
    switch (normalizedStatus) {
      case "OPEN":
        return "Abierto";
      case "IN_PROGRESS":
        return "En Progreso";
      case "RESOLVED":
        return "Resuelto";
      case "CLOSED":
        return "Cerrado";
      default:
        return status.toLowerCase().replace("_", " ");
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStyles()} select-none capitalize`}>
      {getLabel()}
    </span>
  );
}