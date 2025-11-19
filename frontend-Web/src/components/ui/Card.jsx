import PropTypes from 'prop-types';
import './Card.css';

function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
  ...props
}) {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const hoverClass = hover ? 'card--hover' : '';
  const clickableClass = onClick ? 'card--clickable' : '';

  const cardClasses = [
    baseClass,
    variantClass,
    paddingClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'bordered', 'elevated', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  hover: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

// Card Sub-components
export function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>;
}

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardTitle({ children, className = '' }) {
  return <h3 className={`card__title ${className}`}>{children}</h3>;
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardDescription({ children, className = '' }) {
  return <p className={`card__description ${className}`}>{children}</p>;
}

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardBody({ children, className = '' }) {
  return <div className={`card__body ${className}`}>{children}</div>;
}

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Card };
export default Card;
