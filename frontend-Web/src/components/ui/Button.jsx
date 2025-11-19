import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullWidthClass = fullWidth ? 'btn--full' : '';
  const loadingClass = loading ? 'btn--loading' : '';
  const disabledClass = disabled ? 'btn--disabled' : '';

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle className="spinner__circle" cx="12" cy="12" r="10" />
          </svg>
        </span>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="btn__icon btn__icon--left" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      )}

      <span className="btn__text">{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="btn__icon btn__icon--right" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export { Button };
export default Button;
