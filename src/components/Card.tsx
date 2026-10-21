import type { ReactNode } from 'react';
import { Icon } from './Icons';

interface CardProps {
  title: string;
  expandable?: boolean;
  className?: string;
  children: ReactNode;
}

/** Tarjeta con título y chevron opcional (como en Apple Fitness). */
export function Card({ title, expandable = false, className = '', children }: CardProps) {
  return (
    <section className={`card ${className}`}>
      <header className="card-head">
        <h3>{title}</h3>
        {expandable && (
          <span className="more">
            <Icon name="chevron" size={16} />
          </span>
        )}
      </header>
      {children}
    </section>
  );
}
