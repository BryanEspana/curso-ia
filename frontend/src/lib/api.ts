import type { Task, Status } from '../store/kanbanStore';

const API_URL = 'http://localhost:3000/api';

export async function fetchTickets(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tickets`);
  if (!response.ok) throw new Error('Error fetching tickets');
  const json = await response.json();
  return json.data || [];
}

export async function updateTicketStatusApi(id: string, status: Status): Promise<Task> {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Error updating ticket status');
  const json = await response.json();
  return json.data;
}
