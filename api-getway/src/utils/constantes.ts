export const ACTIVITIES_MS_PORT = 4001;
export const ACTIVITIES_SERVER = 4000;
export const USER_MS_PORT = 5001;
export const USER_SERVER = null;
export const API_GATEWAY_PORT_SERVER = 3000;
export const FORUM_MS_PORT = 7001;

export const USERS = 'USERS';
export const FORUM = 'FORUM';
export const ESPACE = ' ';
export const GET_ALL_USERS = { cmd: 'getAllUser', role: 'user/admin' };

export const INSCRI_ADMIN = { cmd: 'inscriptionAdmin', role: 'user' };
export const INSCRIPTION = { cmd: 'inscription', role: 'user' };
export const GET_USER_INFO = { cmd: 'getUser', role: 'user' };
export const LOGIN = { cmd: 'login', role: 'user' };
export const UPDATING = { cmd: 'updating', role: 'user' };
export const DELETING = { cmd: 'deleting', role: 'user' };
export const TESTING = { cmd: 'getdata', role: 'user' };
export const GET_BY_NAME = { cmd: 'getUserbyName', role: 'user' };
export const REFRESH_TOKEN = { cmd: 'refresh_token', role: 'user' };
export const UPDATE_PASS = { cmd: 'UPDATE_PASS', role: 'user' };
export const UPERMESSION = { cmd: 'UPDATE_PERMISSION', role: 'email' };
export const CONFIRM_ACCOUNT = { cmd: 'CONFIRM_ACCOUNT', role: 'email' };
export const BASE_URL_USERS = 'http://localhost:3000/api-gateway/users/';
export const BASE_URL = 'http://localhost:3000/api-gateway/';
export const UPDATE_PASS_DATA = { cmd: 'UPDATE_PASS_DATA', role: 'user' };
