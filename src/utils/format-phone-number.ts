export function formatPhoneNumber(phoneNumber: string) {
  const isMobile = phoneNumber.length === 11

  return isMobile
    ? phoneNumber
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{3})(\d)/, '$1 $2')
        .replace(/(\s\d{3})(\d)/, '$1 $2')
        .replace(/(\s\d{3})\d+?$/, '$1')
    : phoneNumber
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(-\d{4})\d+?$/, '$1')
}
