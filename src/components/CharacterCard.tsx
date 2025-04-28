import { ATTRIBUTE_LIST } from '../consts';
import CharacterAttributes from './CharacterAttributes';
import CharacterClasses from './CharacterClasses';
import CharacterSkills from './CharacterSkills';
import CharacterSkillCheck from './CharacterSkillCheck';

/**
 * Props for the CharacterCard component
 * @param character - The character's data (attributes and skills)
 * @param onAttributeChange - Callback for when attributes are modified
 * @param onSkillsChange - Callback for when skills are modified
 * @param onDelete - Callback for when the character is deleted
 */
interface CharacterCardProps {
  character: {
    attributes: Record<string, number>;
    skills: Record<string, number>;
  };
  onAttributeChange: (attribute: string, value: number) => void;
  onSkillsChange: (skills: Record<string, number>) => void;
  onDelete: () => void;
}

/**
 * CharacterCard component that displays and manages a single character's
 * attributes, classes, and skills in a horizontal layout
 */
const CharacterCard = ({ character, onAttributeChange, onSkillsChange, onDelete }: CharacterCardProps) => {
  return (
    <div className="character-card-container">
      <div className="character-card-header">
        <h3>Character</h3>
        <button className="delete-character-button" onClick={onDelete}>
          Delete
        </button>
      </div>
      <CharacterSkillCheck
        attributes={character.attributes}
        skills={character.skills}
      />
      <div className="character-card-content">
        <CharacterAttributes 
          attributes={character.attributes}
          onAttributeChange={onAttributeChange}
        />
        <CharacterClasses attributes={character.attributes} />
        <CharacterSkills 
          attributes={character.attributes}
          onSkillsChange={onSkillsChange}
          initialSkills={character.skills}
        />
      </div>
    </div>
  );
};

export default CharacterCard; 