
export function formatDate(date, showTime = true) {
  // format date to dd/mm/yyyy hh:mm
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  if (!showTime) {
    return [day, month, year].join('/');
  }
  const hours = '' + d.getHours();
  const minutes = '' + d.getMinutes();
  return [day, month, year].join('/') + ' ' + [hours, minutes].join(':');
}