import { ATTRIBUTE_LIST } from '../consts';
import './CharacterComponents.css';

interface CharacterAttributesProps {
  attributes: Record<string, number>;
  onAttributeChange: (attribute: string, value: number) => void;
}

/**
 * Displays and manages a character's attributes
 * - Shows current value and modifier for each attribute
 * - Allows increasing/decreasing attribute values
 * - Calculates modifiers based on attribute values
 */
const CharacterAttributes = ({ attributes, onAttributeChange }: CharacterAttributesProps) => {
  // Calculate modifier: (attribute - 10) / 2, rounded down
  const getModifier = (attributeValue: number) => Math.floor((attributeValue - 10) / 2);

  return (
    <div className="character-card">
      <h2 className="card-header">Attributes</h2>
      <div className="attributes-total">
        Total Points: {Object.values(attributes).reduce((sum, val) => sum + val, 0)} / 70
      </div>
      <div className="attributes-header">
        <span className="attribute-name">Attribute</span>
        <span className="attribute-value">Value</span>
        <span className="attribute-modifier">Modifier</span>
        <span className="attribute-controls"></span>
      </div>
      {ATTRIBUTE_LIST.map((attribute) => (
        <div key={attribute} className="attribute-row">
          <span className="attribute-name">{attribute}</span>
          <span className="attribute-value">{attributes[attribute]}</span>
          <span className="attribute-modifier">
            {getModifier(attributes[attribute])}
          </span>
          <div className="attribute-controls">
            <button 
              className="attribute-button"
              onClick={() => onAttributeChange(attribute, 1)}
            >
              +
            </button>
            <button 
              className="attribute-button"
              onClick={() => onAttributeChange(attribute, -1)}
            >
              -
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterAttributes; 