import { SKILL_LIST } from '../consts';
import './CharacterComponents.css';

interface CharacterSkillsProps {
  attributes: Record<string, number>;
  onSkillsChange?: (skills: Record<string, number>) => void;
  initialSkills?: Record<string, number>;
}

const CharacterSkills = ({ attributes, onSkillsChange, initialSkills }: CharacterSkillsProps) => {
  // Calculate modifier: (attribute - 10) / 2, rounded down
  const getModifier = (attributeValue: number) => Math.floor((attributeValue - 10) / 2);

  // Calculate available skill points: 10 base + 4 per Intelligence modifier
  const intelligenceModifier = getModifier(attributes['Intelligence']);
  const totalAvailablePoints = Math.max(0, 10 + (4 * intelligenceModifier));

  // Initialize skills with default values if not provided
  const skills = initialSkills || SKILL_LIST.reduce((acc, skill) => {
    acc[skill.name] = 0;
    return acc;
  }, {} as Record<string, number>);

  const totalPointsSpent = Object.values(skills).reduce((sum, points) => sum + points, 0);
  const remainingPoints = totalAvailablePoints - totalPointsSpent;

  const handlePointChange = (skillName: string, change: number) => {
    if (!onSkillsChange) return;

    const currentPoints = skills[skillName] || 0;
    const newPoints = currentPoints + change;
    const attributeModifier = getModifier(attributes[SKILL_LIST.find(skill => skill.name === skillName)!.attributeModifier]);
    const newTotal = newPoints + attributeModifier;

    // Prevent changes that would:
    // - Make points negative
    // - Exceed available points
    // - Make total skill value negative
    if (newPoints < 0 || (change > 0 && totalPointsSpent >= totalAvailablePoints) || newTotal < 0) {
      return;
    }

    const updatedSkills = {
      ...skills,
      [skillName]: newPoints
    };
    onSkillsChange(updatedSkills);
  };

  return (
    <div className="character-card">
      <h2 className="card-header">Skills</h2>
      <div className="skills-points-info">
        <span>Total Points: {totalAvailablePoints}</span>
        <span>Remaining: {remainingPoints}</span>
      </div>
      <div className="skills-list">
        <div className="skills-header">
          <span className="skill-name">Skill</span>
          <span className="skill-points">Points</span>
          <span className="skill-controls"></span>
          <span className="skill-modifier">Modifier</span>
          <span className="skill-total">Total</span>
        </div>
        {SKILL_LIST.map((skill) => {
          const attributeModifier = getModifier(attributes[skill.attributeModifier]);
          const totalSkillValue = (skills[skill.name] || 0) + attributeModifier;
          
          return (
            <div key={skill.name} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-points">{skills[skill.name] || 0}</span>
              <div className="skill-controls">
                <button
                  className="attribute-button"
                  onClick={() => handlePointChange(skill.name, 1)}
                  disabled={remainingPoints <= 0}
                >
                  +
                </button>
                <button
                  className="attribute-button"
                  onClick={() => handlePointChange(skill.name, -1)}
                  disabled={(skills[skill.name] || 0) <= 0 || ((skills[skill.name] || 0) + attributeModifier <= 0)}
                >
                  -
                </button>
              </div>
              <span className="skill-modifier">
                ({skill.attributeModifier}): {attributeModifier}
              </span>
              <span className="skill-total">{totalSkillValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSkills;
