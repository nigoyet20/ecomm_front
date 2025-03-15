// import { setConnected, setDisconnected, addEvent } from '../reducer/waitingUsers';
// import axiosInstance from '../../axios/axios';
// import socket from '../../axios/socket';
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { AxiosError } from "axios";

// export const initializeSocket = () => (dispatch) => {
//   // Écouter la connexion
//   socket.on('connect', () => {
//     console.log('Connexion établie avec le serveur Socket.IO');
//     console.log('Mon socket ID est :', socket.id);

//     // Émettre un événement pour rejoindre une room
//     socket.emit('join-room', 'action123');
//   });

//   // Écouter les mises à jour
//   socket.on('action-updated', (data) => {
//     console.log('Mise à jour reçue :', data);
//   });

//   // Écouter la déconnexion
//   socket.on('disconnect', () => {
//     console.log('Déconnecté du serveur Socket.IO');
//   });

// };

// // export const createActionAndListen = (data: string) => async (dispatch) => {
// //   try {
// //     // Envoyer une requête au backend avec axiosInstance
// //     const response = await axiosInstance.post('/actions', data);

// //     console.log(response.data);

// //     // Écouter l'événement en temps réel via WebSocket
// //     socket.on(`action-updated-${response.data.id}`, (update) => {
// //       console.log('Mise à jour reçue via WebSocket :', update);
// //       dispatch(addEvent(update));
// //     });
// //   } catch (error) {
// //     console.error('Erreur lors de la création de l\'action :', error);
// //   }
// // };

// export const createActionAndListen = createAsyncThunk(
//   'socket/ADD_ACTION_AND_LISTEN',
//   async (payload, thunkAPI) => {
//     try {
//       // Envoyer une requête au backend avec axiosInstance
//       const response = await axiosInstance.post('/action');

//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       return thunkAPI.rejectWithValue(axiosError.response?.data);
//     }
//   }
// );

// export const fetchPendingActions = async () => {
//   try {
//     const response = await axiosInstance.get('/action');
//     console.log(response.data);

//     return response.data;
//   } catch (err) {
//     console.error('Erreur lors de la récupération des actions:', err);
//     return [];
//   }
// };

// export const updateActionStatus = async (id, status) => {
//   try {
//     const response = await axiosInstance.patch(`/action/${id}`, { status });
//     return response.data; // Action mise à jour
//   } catch (err) {
//     console.error('Erreur lors de la mise à jour de l\'action:', err);
//     throw err;
//   }
// };


