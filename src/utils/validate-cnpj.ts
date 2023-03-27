export function validateCNPJ(cnpj: string) {
  const REGISTER_NUMBER_LENGTH = 12
  const WEIGHT_REFERENCE_FIRST_DIGIT = '543298765432'
  const WEIGHT_REFERENCE_SECOND_DIGIT = '6543298765432'

  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (cnpj.length !== 14) {
    return false
  }

  // verify cnpj like 00000000000000, 11111111111111...
  if (
    /0{14}?|1{14}?|2{14}?|3{14}?|4{14}?|5{14}?|6{14}?|7{14}?|8{14}?|9{14}?/g.test(
      cnpj,
    )
  ) {
    return false
  }
  let registerNumber = cnpj.substring(0, REGISTER_NUMBER_LENGTH)
  const digits = cnpj.substring(REGISTER_NUMBER_LENGTH)

  let sum = Array.from(registerNumber).reduce(
    (prev, curr, index) =>
      prev + Number(curr) * Number(WEIGHT_REFERENCE_FIRST_DIGIT[index]),
    0,
  )
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  if (String(result) !== digits.charAt(0)) {
    return false
  }

  // register number length + first verification digit
  registerNumber = cnpj.substring(0, REGISTER_NUMBER_LENGTH + 1)
  sum = Array.from(registerNumber).reduce(
    (prev, curr, index) =>
      prev + Number(curr) * Number(WEIGHT_REFERENCE_SECOND_DIGIT[index]),
    0,
  )
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return String(result) === digits.charAt(1)
}
