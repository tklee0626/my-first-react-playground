import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface CalculationResult {
  result: number;
}

async function fetchCalculation(
  operation: string,
  a: number,
  b: number
): Promise<number> {
  const response = await axios.get<CalculationResult>(
    `${API_BASE_URL}/${operation}`,
    { params: { a, b } }
  );

  return response.data.result;
}

export async function add(a: number, b: number): Promise<number> {
  return fetchCalculation('add', a, b);
}

export async function minus(a: number, b: number): Promise<number> {
  return fetchCalculation('minus', a, b);
}

export async function multiply(a: number, b: number): Promise<number> {
  return fetchCalculation('multiply', a, b);
}

export async function divide(a: number, b: number): Promise<number> {
  return fetchCalculation('divide', a, b);
}
