import { useState } from 'react';
import { SKILL_LIST } from '../consts';
import './CharacterComponents.css';

interface CharacterSkillCheckProps {
  skills: Record<string, number>;
  attributes: Record<string, number>;
}

const CharacterSkillCheck = ({ skills, attributes }: CharacterSkillCheckProps) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(10);
  const [rollResult, setRollResult] = useState<{
    roll: number;
    total: number;
    success: boolean;
  } | null>(null);

  const getModifier = (attributeValue: number) => Math.floor((attributeValue - 10) / 2);

  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const skillPoints = skills[selectedSkill] || 0;
    const skillAttribute = SKILL_LIST.find(skill => skill.name === selectedSkill)?.attributeModifier || 'Strength';
    const attributeModifier = getModifier(attributes[skillAttribute]);
    const total = roll + skillPoints + attributeModifier;
    const success = total >= dc;

    setRollResult({
      roll,
      total,
      success
    });
  };

  return (
    <div className="character-card">
      <h2 className="card-header">Skill Check</h2>
      <div className="skill-check-controls">
        <div className="skill-check-row">
          <label htmlFor="skill-select">Skill:</label>
          <select
            id="skill-select"
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
          <label htmlFor="dc-input">DC:</label>
          <input
            id="dc-input"
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

export default CharacterSkillCheck; 