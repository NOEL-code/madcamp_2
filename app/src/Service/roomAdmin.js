import api from '../utils/api';

export const getRoomInfo = async roomId => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};

export const updateRoomDescription = async (roomId, req) => {
  const response = await api.put(`/rooms/${roomId}`, req);
  return response.data;
};

export const getAttendanceStatus = async userId => {
  const response = await api.get(`/attendance/status/${userId}`);
  return response.data;
};

export const updateAttendanceStatus = async (userId, status) => {
  const response = await api.post(`/attendance/status/${userId}`, {status});
  return response.data;
};

export const acceptUserApplication = async (roomId, userId) => {
  const response = await api.put(`/apply/accept/${roomId}/${userId}`);
  return response.data;
};

export const rejectUserApplication = async (roomId, userId) => {
  const response = await api.put(`/apply/reject/${roomId}/${userId}`);
  return response.data;
};

export const getWaitingUsers = async roomId => {
  const response = await api.get(`/apply/waiting/${roomId}`);
  return response.data;
};

export const deleteRoom = async roomId => {
  const response = await api.delete(`/rooms/${roomId}`);
  return response.data;
};

export const deleteMember = async (roomId, userId) => {
  const response = await api.delete(`/rooms/${roomId}/member/${userId}`);
  return response.data;
};
