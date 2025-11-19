import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Componente de tarjeta de estadística
 * @param {string} title - Título de la estadística
 * @param {number|string} value - Valor principal
 * @param {object} icon - Icono de lucide-react
 * @param {number} change - Cambio porcentual (opcional)
 * @param {string} changeLabel - Label del cambio (ej: "vs mes anterior")
 * @param {string} color - Color del tema (primary, success, warning, danger)
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  color = 'primary',
  subtitle
}) {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  const getTrendIcon = () => {
    if (!change && change !== 0) return null;
    if (change > 0) return <TrendingUp size={16} className="text-green-500" />;
    if (change < 0) return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!change && change !== 0) return '';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${colorClasses[color]}`}>
          {Icon && <Icon size={24} />}
        </div>
        <h3 className="stat-card-title">{title}</h3>
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>

        {subtitle && (
          <p className="stat-card-subtitle">{subtitle}</p>
        )}

        {(change !== undefined && change !== null) && (
          <div className="stat-card-change">
            {getTrendIcon()}
            <span className={`stat-card-change-value ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="stat-card-change-label">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
