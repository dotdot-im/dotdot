export function forHumans ( seconds: number ) {
  const levels: [number, string][] = [
      [Math.floor(seconds / 31536000), 'years'],
      [Math.floor((seconds % 31536000) / 86400), 'days'],
      [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
      [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
  ];
  let returntext = '';

  for (let i = 0, max = levels.length; i < max; i++) {
      if ( levels[i][0] === 0 ) continue;
      returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
  };
  return returntext.trim();
}