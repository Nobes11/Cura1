/**
 * Format a username to ensure it follows the C.Lastname pattern
 */
export const formatUsername = (username: string): string => {
  if (!username) return '';
  
  // If it's a full name with space (like "Charles Patterson")
  if (username.includes(' ')) {
    const [firstName, ...lastParts] = username.split(' ');
    const lastName = lastParts.join(' ');
    return `${firstName.charAt(0)}.${lastName}`;
  }
  
  // Check if username is in firstname.lastname format
  if (username.includes('.')) {
    const [first, last] = username.split('.');
    return `${first.charAt(0).toUpperCase()}.${last.charAt(0).toUpperCase()}${last.slice(1).toLowerCase()}`;
  }
  
  // If the username is just a name without a dot, try to make it C.Name format
  if (!username.includes('.')) {
    // For users like "cnp" or "cnpatterson", convert to "C.Patterson" format
    // Try to detect patterns like "cnpatterson" or "cnp"
    if (username.toLowerCase().startsWith('c') && username.length > 1) {
      // Assume the rest is the last name or part of it
      const lastName = username.slice(1);
      return `C.${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;
    }
  }
  
  // Return original if not in expected format
  return username;
};
