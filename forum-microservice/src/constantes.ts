export const ACTIVITIES_MS_PORT = 4001;
export const ACTIVITIES_SERVER = 4000;
export const USER_MS_PORT = 5001;
export const USER_SERVER = null;
export const API_GATEWAY_PORT_SERVER = 3000;
export const FORUM_MS_PORT = 7001;

export const ANSWER_QUESTION = { cmd: 'ANSWER_QUESTION', role: 'user/admin' };
export const NEW_QUESTION = { cmd: 'NEW_QUESTION', role: 'user/admin' };
export const UPDATE_QUESTION = { cmd: 'UPDATE_QUESTION', role: 'user/admin' };
export const DELETE_QUESTION = { cmd: 'DELETE_QUESTION', role: 'user/admin' };
export const GET_QUESTION_BY_ID = {
  cmd: ' GET_QUESTION_BY_ID',
  role: 'user/admin',
};
export const GET_ALL_QUESTIONS = {
  cmd: 'GET_ALL_QUESTIONS',
  role: 'user/admin',
};
export const NEW_GROUP = { cmd: 'ADD_NEW_GROUP', role: 'user/admin' };
export const CONFIRM_GROUP_JOIN = { cmd: 'CONFIRM_GROUP_JOIN', role: 'user' };
export const REQUEST_TO_JOIN_GROUP = {
  cmd: 'REQUEST_TO_JOIN_GROUP',
  role: 'user',
};

export const USERS = 'USERS';
