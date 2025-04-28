/**
 * Represents a single character's data
 */
interface CharacterData {
  attributes: Record<string, number>;
  skills: Record<string, number>;
  lastSaved: string;
}

/**
 * Represents the collection of characters to be saved/loaded
 */
interface CharacterCollection {
  characters: CharacterData[];
  lastSaved: string;
}

const API_URL = 'https://recruiting.verylongdomaintotestwith.ca/api/jessehuss/character';

/**
 * Saves all characters to the API
 * @param characters - Array of character data to save
 */
export const saveCharacters = async (characters: CharacterData[]): Promise<void> => {
  const data: CharacterCollection = {
    characters,
    lastSaved: new Date().toISOString()
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Save failed: ${response.statusText}`);
  }
};

/**
 * Fetches all characters from the API
 * @returns Array of character data
 */
export const fetchCharacters = async (): Promise<CharacterData[]> => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.body.characters || [];
}; 