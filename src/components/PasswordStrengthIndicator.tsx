interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'Sehr schwach';
      case 2: return 'Schwach';
      case 3: return 'Mittelmäßig';
      case 4: return 'Gut';
      case 5: return 'Stark';
      default: return '';
    }
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-full rounded ${
              level <= strength
                ? getStrengthColor(strength)
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Passwort-Stärke: {getStrengthText(strength)}
      </p>
    </div>
  );
};