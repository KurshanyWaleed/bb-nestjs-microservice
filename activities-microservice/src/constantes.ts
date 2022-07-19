export const GET_USER_ACITIVITES = {
  cmd: 'GET_USER_ACITIVITES',
  role: 'MSUser',
};
export const ACTIVITIES_MS_PORT = 4001;
export const ACTIVITIES_SERVER = 4000;

export const USERS_MS_PORT = 5001;
export const USERS_SERVER = null;
export const NEW_ACTIVITY = { cmd: 'NEW_ACTIVITY', role: 'admin' };
export const UPDATE_ACTIVITY = { cmd: 'UPDATE_ACTIVITY', role: 'admin' };
export const GET_FEEDBACK_BY_ID = { cmd: 'GET_FEEDBACK_BY_ID', role: 'membre' };
export const CREATE_INFORMATION = { cmd: 'CREATE_INFORMATION', role: 'admin' };
export const DELETE_INFORMATION = { cmd: 'DELETE_INFORMATION', role: 'admin' };
export const GET_ONE_INFORMATION = {
  cmd: 'GET_ONE_INFORMATION',
  role: 'admin',
};
export const GET_INFORMATIONS = {
  cmd: 'GET_INFORMATIONS',
  role: 'admin/member',
};
export const POST_FEEDBACK = { cmd: 'POST_FEEDBACK', role: 'membre' };
export const EDIT_INFORMATION = { cmd: 'EDIT_INFORMATION', role: 'admin' };

export const API_GATEWAY_SERVER = 3000;
export const ESPACE = ' ';
export const USERS = 'USERS';
export const ACTIVITIES_OF_WEEK = 'ACTIVITIES_OF_WEEK';
export const GET_ACTIVITIES_OF_WEEK = { cmd: 'GET_ACTIVITIES_OF_WEEK' };
export const CREATE_ACTIVITIES = {
  cmd: 'CREATE_ACTIVITIES',
  role: 'scientist',
};
