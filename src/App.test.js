import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the characterService
jest.mock('./services/characterService', () => ({
  saveCharacters: jest.fn(),
  fetchCharacters: jest.fn()
}));

// Mock window.alert and console.error
global.alert = jest.fn();
console.error = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders initial character card', () => {
    render(<App />);
    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('Attributes')).toBeInTheDocument();
    expect(screen.getByText('Classes')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  test('adds new character when Add Character button is clicked', () => {
    render(<App />);
    const addButton = screen.getByText('Add Character');
    fireEvent.click(addButton);
    expect(screen.getAllByText('Character')).toHaveLength(2);
  });

  test('deletes character when Delete button is clicked', () => {
    render(<App />);
    const addButton = screen.getByText('Add Character');
    fireEvent.click(addButton);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getAllByText('Character')).toHaveLength(1);
  });

  test('increases attribute when + button is clicked', () => {
    render(<App />);
    const strengthPlusButton = screen.getAllByText('+')[0];
    fireEvent.click(strengthPlusButton);
    const strengthValue = screen.getAllByText('1').find(el => el.className === 'attribute-value');
    expect(strengthValue).toBeInTheDocument();
  });

  test('decreases attribute when - button is clicked', () => {
    render(<App />);
    const strengthPlusButton = screen.getAllByText('+')[0];
    fireEvent.click(strengthPlusButton);
    fireEvent.click(strengthPlusButton);
    const strengthMinusButton = screen.getAllByText('-')[0];
    fireEvent.click(strengthMinusButton);
    const strengthValue = screen.getAllByText('1').find(el => el.className === 'attribute-value');
    expect(strengthValue).toBeInTheDocument();
  });

  test('prevents attribute from going below 0', () => {
    render(<App />);
    const strengthMinusButton = screen.getAllByText('-')[0];
    fireEvent.click(strengthMinusButton);
    const strengthValue = screen.getAllByText('0').find(el => el.className === 'attribute-value');
    expect(strengthValue).toBeInTheDocument();
  });

  test('shows class qualification status', () => {
    render(<App />);
    // Initially should show "Not Qualified" for all classes
    expect(screen.getAllByText('Not Qualified')).toHaveLength(3); // Barbarian, Wizard, Bard
  });

  test('saves characters when Save button is clicked', async () => {
    const { saveCharacters } = require('./services/characterService');
    saveCharacters.mockResolvedValueOnce();

    render(<App />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveCharacters).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Characters saved successfully!');
    });
  });

  test('resets characters when Reset button is clicked', async () => {
    const { fetchCharacters } = require('./services/characterService');
    fetchCharacters.mockResolvedValueOnce([{
      attributes: {
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0
      },
      skills: {}
    }]);

    render(<App />);
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalled();
    });
  });

  test('shows error message when save fails', async () => {
    const { saveCharacters } = require('./services/characterService');
    saveCharacters.mockRejectedValueOnce(new Error('Save failed'));

    render(<App />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });
});
