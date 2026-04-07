import '../../styles/components/card.css';

function Card({ as: Component = 'article', children, className = '', tone = 'default' }) {
  return (
    <Component className={`card card--${tone} ${className}`.trim()}>
      {children}
    </Component>
  );
}

export default Card;
