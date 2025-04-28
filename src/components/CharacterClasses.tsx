import { useState } from 'react';
import { CLASS_LIST, ATTRIBUTE_LIST } from '../consts';
import './CharacterComponents.css';

interface CharacterClassesProps {
  attributes: Record<string, number>;
}

/**
 * Displays and manages character class information
 * - Shows available classes and their requirements
 * - Indicates if character qualifies for each class
 * - Allows expanding/collapsing class details
 */
const CharacterClasses = ({ attributes }: CharacterClassesProps) => {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // Check if character meets all requirements for a given class
  const checkClassRequirements = (className: string) => {
    const requirements = CLASS_LIST[className];
    return ATTRIBUTE_LIST.every(
      (attribute) => attributes[attribute] >= requirements[attribute]
    );
  };

  const toggleClass = (className: string) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <div className="character-card">
      <h2 className="card-header">Classes</h2>
      <div className="class-list">
        {Object.entries(CLASS_LIST).map(([className, requirements]) => {
          const meetsRequirements = checkClassRequirements(className);
          const isExpanded = expandedClass === className;
          
          return (
            <div 
              key={className} 
              className={`class-row ${meetsRequirements ? 'class-qualified' : ''} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleClass(className)}
            >
              <div className="class-header">
                <h3 className="class-name">
                  <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                  {className}
                </h3>
                <span className={`status ${meetsRequirements ? 'qualified' : 'not-qualified'}`}>
                  {meetsRequirements ? 'Qualified' : 'Not Qualified'}
                </span>
              </div>
              {isExpanded && (
                <div className="class-requirements">
                  <div className="requirements-header">
                    <span className="requirement-name">Attribute</span>
                    <span className="requirement-value">Minimum</span>
                    <span className="current-value">Current</span>
                  </div>
                  {ATTRIBUTE_LIST.map((attribute) => (
                    <div key={attribute} className="requirement-row">
                      <span className="requirement-name">{attribute}</span>
                      <span className={`requirement-value ${attributes[attribute] >= requirements[attribute] ? 'met' : 'not-met'}`}>
                        {requirements[attribute]}
                      </span>
                      <span className="current-value">{attributes[attribute]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterClasses;
