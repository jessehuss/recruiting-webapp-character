import { useState } from 'react';
import { SKILL_LIST } from '../consts';
import './CharacterComponents.css';

interface Character {
  attributes: Record<string, number>;
  skills: Record<string, number>;
}

interface PartySkillCheckProps {
  characters: Character[];
}

const PartySkillCheck = ({ characters }: PartySkillCheckProps) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(10);
  const [rollResult, setRollResult] = useState<{
    roll: number;
    total: number;
    success: boolean;
    selectedCharacterIndex: number;
  } | null>(null);

  const getModifier = (attributeValue: number) => Math.floor((attributeValue - 10) / 2);

  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    
    // Find the character with the highest skill total
    let highestTotal = -Infinity;
    let selectedCharacterIndex = 0;
    
    characters.forEach((character, index) => {
      const skillPoints = character.skills[selectedSkill] || 0;
      const skillAttribute = SKILL_LIST.find(skill => skill.name === selectedSkill)?.attributeModifier || 'Strength';
      const attributeModifier = getModifier(character.attributes[skillAttribute]);
      const total = skillPoints + attributeModifier;
      
      if (total > highestTotal) {
        highestTotal = total;
        selectedCharacterIndex = index;
      }
    });

    const finalTotal = roll + highestTotal;
    const success = finalTotal >= dc;

    setRollResult({
      roll,
      total: finalTotal,
      success,
      selectedCharacterIndex
    });
  };

  if (characters.length === 0) {
    return (
      <div className="character-card">
        <h2 className="card-header">Party Skill Check</h2>
        <div className="no-characters-message">
          <p>No characters available for party skill check.</p>
          <p>Please add at least one character to perform party skill checks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="character-card">
      <h2 className="card-header">Party Skill Check</h2>
      <div className="skill-check-controls">
        <div className="skill-check-row">
          <label htmlFor="party-skill-select">Skill:</label>
          <select
            id="party-skill-select"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            {SKILL_LIST.map(skill => (
              <option key={skill.name} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
        <div className="skill-check-row">
          <label htmlFor="party-dc-input">DC:</label>
          <input
            id="party-dc-input"
            type="number"
            min="1"
            value={dc}
            onChange={(e) => setDc(Number(e.target.value))}
          />
        </div>
        <button className="roll-button" onClick={handleRoll}>
          Roll
        </button>
      </div>
      {rollResult && (
        <div className="roll-result">
          <div className="roll-details">
            <span>Selected Character: {rollResult.selectedCharacterIndex + 1}</span>
            <span>Roll: {rollResult.roll}</span>
            <span>Total: {rollResult.total}</span>
          </div>
          <div className={`roll-outcome ${rollResult.success ? 'success' : 'failure'}`}>
            {rollResult.success ? 'Success!' : 'Failure!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartySkillCheck; 