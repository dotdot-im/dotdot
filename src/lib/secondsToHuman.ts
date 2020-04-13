export function forHumans ( seconds: number ) {
  const levels: [number, string][] = [
      [Math.floor(seconds / 31536000), 'y'],
      [Math.floor((seconds % 31536000) / 86400), 'd'],
      [Math.floor(((seconds % 31536000) % 86400) / 3600), 'h'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'm'],
      [(((seconds % 31536000) % 86400) % 3600) % 60, 's'],
  ];
  let returntext = '';

  for (let i = 0, max = levels.length; i < max; i++) {
      if ( levels[i][0] === 0 ) continue;
      returntext += ' ' + levels[i][0] + levels[i][1];
  };
  return returntext.trim();
}