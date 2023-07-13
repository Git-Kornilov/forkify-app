// for function which reUse more time

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// for prevent run forever getJSON with bad internet
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Fetch all data and post data
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // race promice - fetchPro(url) and timeout
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // throw error into async function in others module (to model) with async function
  }
};

// // async fetch data and return data.json()
// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // race promice - fetchPro(url) and timeout
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err; // throw error into async function in others module (to model) with async function
//   }
// };

// // send data (new recipe)
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // race promice - fetchPro(url) and timeout
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err; // throw error into async function in others module (to model) with async function
//   }
// };
