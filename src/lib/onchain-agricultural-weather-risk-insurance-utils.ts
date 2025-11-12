import { type Address } from 'viem';

export interface WeatherInsurance {
  id: bigint;
  policyholder: Address;
  coverage: bigint;
  expiryDate: bigint;
  status: 'active' | 'expired' | 'claimed';
}

export function createWeatherInsurance(
  policyholder: Address,
  coverage: bigint,
  expiryDate: bigint
): WeatherInsurance {
  return {
    id: BigInt(0),
    policyholder,
    coverage,
    expiryDate,
    status: 'active',
  };
}

export function claimInsurance(
  insurance: WeatherInsurance,
  claimant: Address
): WeatherInsurance | null {
  if (insurance.status !== 'active') return null;
  if (insurance.policyholder !== claimant) return null;
  return {
    ...insurance,
    status: 'claimed',
  };
}

export function getActiveInsurance(
  insurances: WeatherInsurance[]
): WeatherInsurance[] {
  return insurances.filter((i) => i.status === 'active');
}

export function checkExpiry(
  insurance: WeatherInsurance,
  currentTime: bigint
): boolean {
  return currentTime >= insurance.expiryDate;
}

  id: bigint;
  policyholder: Address;
  coverage: bigint;
  expiryDate: bigint;
  status: 'active' | 'expired' | 'claimed';
}

export function createWeatherInsurance(
  policyholder: Address,
  coverage: bigint,
  expiryDate: bigint
): WeatherInsurance {
  return {
    id: BigInt(0),
    policyholder,
    coverage,
    expiryDate,
    status: 'active',
  };
}

export function claimInsurance(insurance: WeatherInsurance): WeatherInsurance {
  return {
    ...insurance,
    status: 'claimed',
  };
}

export function getActiveInsurance(
  insurances: WeatherInsurance[],
  currentTime: bigint
): WeatherInsurance[] {
  return insurances.filter(
    (i) => i.status === 'active' && i.expiryDate >= currentTime
  );
}

export function checkExpiry(
  insurance: WeatherInsurance,
  currentTime: bigint
): boolean {
  return currentTime >= insurance.expiryDate;
}
