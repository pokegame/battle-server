import * as jsonist from 'jsonist';
import { serve } from './serve';

const loginServer = process.env.IDENTITY_SERVER || 'http://identity.pokegame.dev';
const publicKeyEndpoint = `${loginServer}/public-key`;

const rooms = new Map();

export function loadPublicKey(endpoint) {
  return new Promise((resolve, reject) => {
    jsonist.get(endpoint, (err, body) => {
      if (err) {
        return reject(`Unable to load the public key from "${endpoint}" (${err}).`);
      }

      const pubKey = (body || {}).publicKey;

      if (!pubKey) {
        return reject('Could not retrieve public key.');
      }

      return resolve(pubKey);
    })
  });
}

loadPublicKey(publicKeyEndpoint).then(pubKey => {
  serve({rooms, pubKey});
});
