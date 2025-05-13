import { render, screen, fireEvent } from '@testing-library/react';
import CharacterSkillCheck from './CharacterSkillCheck';

// Mock Math.random to return a predictable value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5; // This will result in a roll of 10 (0.5 * 20 + 1)
global.Math = mockMath;

describe('CharacterSkillCheck Component', () => {
  const mockSkills = {
    'Acrobatics': 2,
    'Athletics': 0,
  };

  const mockAttributes = {
    'Strength': 12,
    'Dexterity': 14,
    'Constitution': 10,
    'Intelligence': 10,
    'Wisdom': 10,
    'Charisma': 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders skill check controls', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    expect(screen.getByLabelText('Skill:')).toBeInTheDocument();
    expect(screen.getByLabelText('DC:')).toBeInTheDocument();
    expect(screen.getByText('Roll')).toBeInTheDocument();
  });

  test('allows selecting different skills', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    const select = screen.getByLabelText('Skill:');
    fireEvent.change(select, { target: { value: 'Athletics' } });
    
    expect(select).toHaveValue('Athletics');
  });

  test('allows changing DC value', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    const input = screen.getByLabelText('DC:');
    fireEvent.change(input, { target: { value: '15' } });
    
    expect(input).toHaveValue(15);
  });

  test('calculates and displays successful roll result', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    // Set DC to 15
    const dcInput = screen.getByLabelText('DC:');
    fireEvent.change(dcInput, { target: { value: '15' } });
    
    // Select Acrobatics (Dexterity-based skill)
    const skillSelect = screen.getByLabelText('Skill:');
    fireEvent.change(skillSelect, { target: { value: 'Acrobatics' } });
    
    // Click roll button
    const rollButton = screen.getByText('Roll');
    fireEvent.click(rollButton);
    
    // Check results
    expect(screen.getByText(/Roll: 11/)).toBeInTheDocument();
    expect(screen.getByText(/Total: 15/)).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  test('calculates and displays failed roll result', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    // Set DC to 10
    const dcInput = screen.getByLabelText('DC:');
    fireEvent.change(dcInput, { target: { value: '10' } });
    
    // Select Acrobatics (Dexterity-based skill)
    const skillSelect = screen.getByLabelText('Skill:');
    fireEvent.change(skillSelect, { target: { value: 'Acrobatics' } });
    
    // Click roll button
    const rollButton = screen.getByText('Roll');
    fireEvent.click(rollButton);
    
    // Check results
    expect(screen.getByText(/Roll: 11/)).toBeInTheDocument();
    expect(screen.getByText(/Total: 15/)).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  test('handles skill with no points', () => {
    render(<CharacterSkillCheck skills={mockSkills} attributes={mockAttributes} />);
    
    // Set DC to 10
    const dcInput = screen.getByLabelText('DC:');
    fireEvent.change(dcInput, { target: { value: '10' } });
    
    // Select Athletics (Strength-based skill with 0 points)
    const skillSelect = screen.getByLabelText('Skill:');
    fireEvent.change(skillSelect, { target: { value: 'Athletics' } });
    
    // Click roll button
    const rollButton = screen.getByText('Roll');
    fireEvent.click(rollButton);
    
    // Check results
    expect(screen.getByText(/Roll: 11/)).toBeInTheDocument();
    expect(screen.getByText(/Total: 12/)).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
}); 