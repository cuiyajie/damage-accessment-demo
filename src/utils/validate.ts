export function validateVIN(vin: string): boolean {
  return /^[A-Z0-9]{17}$/.test(vin)
}