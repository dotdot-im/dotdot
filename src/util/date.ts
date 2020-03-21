const locale = undefined;
const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const printDate = (date: Date | null) => {
  if (!date) {
    return '';
  }
  return (new Date(date)).toLocaleDateString(locale, dateOpts);
}