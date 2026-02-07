const API_BASE = '/api';

export async function fetchRaces() {
  const res = await fetch(`${API_BASE}/races`);
  if (!res.ok) throw new Error('Failed to fetch races');
  return res.json();
}

export async function submitPrediction(predictionData: any) {
  const res = await fetch(`${API_BASE}/predictions/race`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(predictionData),
  });
  if (!res.ok) throw new Error('Failed to submit prediction');
  return res.json();
}
