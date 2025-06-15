import { Colors } from '../../constants/Colors';

describe('Colors', () => {
  it('exports Colors object', () => {
    expect(Colors).toBeDefined();
    expect(typeof Colors).toBe('object');
  });

  it('has light theme colors', () => {
    expect(Colors.light).toBeDefined();
    expect(typeof Colors.light).toBe('object');
  });

  it('has dark theme colors', () => {
    expect(Colors.dark).toBeDefined();
    expect(typeof Colors.dark).toBe('object');
  });

  it('light theme has required color properties', () => {
    const lightColors = Colors.light;
    
    // Basic colors that should exist
    expect(lightColors).toHaveProperty('text');
    expect(lightColors).toHaveProperty('background');
    expect(lightColors).toHaveProperty('tint');
    expect(lightColors).toHaveProperty('icon');
    expect(lightColors).toHaveProperty('tabIconDefault');
    expect(lightColors).toHaveProperty('tabIconSelected');
  });

  it('dark theme has required color properties', () => {
    const darkColors = Colors.dark;
    
    // Basic colors that should exist
    expect(darkColors).toHaveProperty('text');
    expect(darkColors).toHaveProperty('background');
    expect(darkColors).toHaveProperty('tint');
    expect(darkColors).toHaveProperty('icon');
    expect(darkColors).toHaveProperty('tabIconDefault');
    expect(darkColors).toHaveProperty('tabIconSelected');
  });

  it('all color values are strings', () => {
    const checkColorsAreStrings = (colors: Record<string, any>) => {
      Object.values(colors).forEach(color => {
        expect(typeof color).toBe('string');
      });
    };

    checkColorsAreStrings(Colors.light);
    checkColorsAreStrings(Colors.dark);
  });

  it('all color values are valid hex codes or named colors', () => {
    const isValidColor = (color: string) => {
      // Hex color pattern (#RGB, #RRGGBB, #RRGGBBAA)
      const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
      
      // Common named colors or rgba/hsla
      const namedColorPattern = /^(rgb|rgba|hsl|hsla)\(|^(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|transparent)$/i;
      
      return hexPattern.test(color) || namedColorPattern.test(color);
    };

    const checkValidColors = (colors: Record<string, any>) => {
      Object.entries(colors).forEach(([key, color]) => {
        expect(isValidColor(color)).toBe(true);
      });
    };

    checkValidColors(Colors.light);
    checkValidColors(Colors.dark);
  });

  it('light and dark themes have same color keys', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    
    expect(lightKeys).toEqual(darkKeys);
  });

  it('has contrasting colors between light and dark themes', () => {
    // Text colors should be different between light and dark
    expect(Colors.light.text).not.toBe(Colors.dark.text);
    expect(Colors.light.background).not.toBe(Colors.dark.background);
  });

  it('has consistent tint colors', () => {
    // Tint color might be the same or different between themes
    expect(Colors.light.tint).toBeDefined();
    expect(Colors.dark.tint).toBeDefined();
  });

  it('tab icon colors are properly defined', () => {
    // Tab icons should have default and selected states
    expect(Colors.light.tabIconDefault).toBeDefined();
    expect(Colors.light.tabIconSelected).toBeDefined();
    expect(Colors.dark.tabIconDefault).toBeDefined();
    expect(Colors.dark.tabIconSelected).toBeDefined();
    
    // Selected should be different from default
    expect(Colors.light.tabIconDefault).not.toBe(Colors.light.tabIconSelected);
    expect(Colors.dark.tabIconDefault).not.toBe(Colors.dark.tabIconSelected);
  });

  it('icon colors are properly defined', () => {
    expect(Colors.light.icon).toBeDefined();
    expect(Colors.dark.icon).toBeDefined();
    
    expect(typeof Colors.light.icon).toBe('string');
    expect(typeof Colors.dark.icon).toBe('string');
  });

  it('has semantic color properties if defined', () => {
    const semanticColors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
    
    semanticColors.forEach(colorName => {
      if (Colors.light.hasOwnProperty(colorName)) {
        expect(Colors.dark).toHaveProperty(colorName);
        expect(typeof Colors.light[colorName]).toBe('string');
        expect(typeof Colors.dark[colorName]).toBe('string');
      }
    });
  });

  it('exports both light and dark color schemes', () => {
    expect(Object.keys(Colors)).toContain('light');
    expect(Object.keys(Colors)).toContain('dark');
    expect(Object.keys(Colors)).toHaveLength(2);
  });

  it('color values are not empty strings', () => {
    const checkNonEmptyColors = (colors: Record<string, any>) => {
      Object.entries(colors).forEach(([key, color]) => {
        expect(color).not.toBe('');
        expect(color.trim()).toBe(color); // No leading/trailing whitespace
      });
    };

    checkNonEmptyColors(Colors.light);
    checkNonEmptyColors(Colors.dark);
  });

  it('maintains consistent color naming convention', () => {
    const checkNamingConvention = (colors: Record<string, any>) => {
      Object.keys(colors).forEach(key => {
        // Should be camelCase
        expect(key).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      });
    };

    checkNamingConvention(Colors.light);
    checkNamingConvention(Colors.dark);
  });

  it('has accessible color contrast (basic check)', () => {
    // Basic check that light theme has dark text on light background
    // and dark theme has light text on dark background
    const lightTextHex = Colors.light.text.replace('#', '');
    const lightBgHex = Colors.light.background.replace('#', '');
    const darkTextHex = Colors.dark.text.replace('#', '');
    const darkBgHex = Colors.dark.background.replace('#', '');
    
    // Convert hex to brightness (simple approximation)
    const getBrightness = (hex: string) => {
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    };
    
    if (lightTextHex.match(/^[0-9A-Fa-f]{3,6}$/) && lightBgHex.match(/^[0-9A-Fa-f]{3,6}$/)) {
      const lightTextBrightness = getBrightness(lightTextHex);
      const lightBgBrightness = getBrightness(lightBgHex);
      
      // Light theme should have sufficient contrast
      expect(Math.abs(lightTextBrightness - lightBgBrightness)).toBeGreaterThan(50);
    }
    
    if (darkTextHex.match(/^[0-9A-Fa-f]{3,6}$/) && darkBgHex.match(/^[0-9A-Fa-f]{3,6}$/)) {
      const darkTextBrightness = getBrightness(darkTextHex);
      const darkBgBrightness = getBrightness(darkBgHex);
      
      // Dark theme should have sufficient contrast
      expect(Math.abs(darkTextBrightness - darkBgBrightness)).toBeGreaterThan(50);
    }
  });
});