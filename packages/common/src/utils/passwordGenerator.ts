export default function generatePassword(length: number = 12): string {
  if (length < 4) {
    console.log('Password length should be at least 4.');
    return '';
  }

  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Ensure the password has at least one of each type
  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  const getRandomChar = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Start with one character from each type
  let password = [
    getRandomChar(upperCaseChars),
    getRandomChar(lowerCaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars),
  ];

  // Fill the rest of the password with random characters from all types
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(allChars));
  }

  // Shuffle the password array and join to form the final password string
  password = password.sort(() => Math.random() - 0.5);

  return password.join('');
}
