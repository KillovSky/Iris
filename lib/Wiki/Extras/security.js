/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */

/* Define o lugar a salvar o IP */
let ipAddress = 'público';

/* Função para obter o IP (callback de uma solicitação JSONP) */
const getIP = (json) => ipAddress = json.ip;

/* Função para adicionar o IP na página */
const AddIP = () => document.getElementById('ip').innerText = ipAddress;
