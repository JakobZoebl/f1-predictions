const API_BASE = '/api';

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
