import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST } from './consts';
import CharacterCard from './components/CharacterCard';
import PartySkillCheck from './components/PartySkillCheck';
import { saveCharacters, fetchCharacters } from './services/characterService';

interface Character {
  attributes: Record<string, number>;
  skills: Record<string, number>;
}

function App() {
  // Initialize with one character, all attributes at 0
  const [characters, setCharacters] = useState<Character[]>([{
    attributes: ATTRIBUTE_LIST.reduce((acc, attribute) => {
      acc[attribute] = 0;
      return acc;
    }, {} as Record<string, number>),
    skills: {}
  }]);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const createNewCharacter = () => {
    const newCharacter: Character = {
      attributes: ATTRIBUTE_LIST.reduce((acc, attribute) => {
        acc[attribute] = 0;
        return acc;
      }, {} as Record<string, number>),
      skills: {}
    };
    setCharacters([...characters, newCharacter]);
  };

  const deleteCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, attribute: string, value: number) => {
    setCharacters(characters.map((char, i) => {
      if (i !== index) return char;

      const newAttributes = {
        ...char.attributes,
        [attribute]: char.attributes[attribute] + value
      };
      const total = Object.values(newAttributes).reduce((sum, val) => sum + val, 0);

      // Allow decreases even if above 70, but prevent increases that would exceed 70
      if (value < 0 || total <= 70) {
        return {
          ...char,
          attributes: newAttributes
        };
      }
      
      return char;
    }));
  };

  const handleSkillsChange = (index: number, newSkills: Record<string, number>) => {
    setCharacters(characters.map((char, i) => {
      if (i !== index) return char;
      return {
        ...char,
        skills: newSkills
      };
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await saveCharacters(characters.map(char => ({
        ...char,
        lastSaved: new Date().toISOString()
      })));
      alert('Characters saved successfully!');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Save failed');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    setSaveError(null);

    try {
      const fetchedCharacters = await fetchCharacters();
      setCharacters(fetchedCharacters);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Reset failed');
      console.error('Reset error:', error);
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Character Sheet</h1>
        <div className="header-actions">
          {saveError && <div className="save-error">{saveError}</div>}
          <div className="button-group">
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving || isResetting}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="reset-button"
              onClick={handleReset}
              disabled={isSaving || isResetting}
            >
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>
            <button
              className="add-character-button"
              onClick={createNewCharacter}
              disabled={isSaving || isResetting}
            >
              Add Character
            </button>
          </div>
        </div>
      </header>
      <div className="characters-container">
        <PartySkillCheck characters={characters} />
      </div>
      <div className="characters-container">
        {characters.map((character, index) => (
          <CharacterCard
            key={index}
            character={character}
            onAttributeChange={(attribute, value) => handleAttributeChange(index, attribute, value)}
            onSkillsChange={(skills) => handleSkillsChange(index, skills)}
            onDelete={() => deleteCharacter(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
