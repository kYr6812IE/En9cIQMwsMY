// 代码生成时间: 2025-09-16 15:51:38
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import CryptoJS from 'crypto-js';

// PasswordEncryptionUtility provides password encryption and decryption functionality.
class PasswordEncryptionUtility {
  // Encrypts the given plaintext password using AES encryption algorithm.
  static async encryptPassword(plaintextPassword) {
    check(plaintextPassword, String);

    // Check if the plaintext password is not empty.
    if (!plaintextPassword) {
      throw new Error('Password cannot be empty.');
    }

    // Generate a random initialization vector for AES.
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    // Encrypt the password using AES algorithm.
    const encrypted = CryptoJS.AES.encrypt(plaintextPassword, Random.secret(), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Return the encrypted password as a base64 string.
    return encrypted.toString();
  }

  // Decrypts the given encrypted password using AES decryption algorithm.
  static async decryptPassword(encryptedPassword) {
    check(encryptedPassword, String);

    // Check if the encrypted password is not empty.
    if (!encryptedPassword) {
      throw new Error('Encrypted password cannot be empty.');
    }

    // Parse the encrypted password to retrieve the AES parts.
    const encryptedWords = CryptoJS.enc.Base64.parse(encryptedPassword);
    const encryptedPasswordWords = CryptoJS.lib.WordArray.create(encryptedWords);
    const ivWords = CryptoJS.lib.WordArray.create(encryptedWords.words.slice(0, 4));
    const iv = CryptoJS.lib.WordArray.create(ivWords);
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedPasswordWords
    });

    // Decrypt the password using AES algorithm.
    const decrypted = CryptoJS.AES.decrypt(encrypted, Random.secret(), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Return the decrypted password as a string.
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

// Example usage of the PasswordEncryptionUtility.
if (Meteor.isServer) {
  Meteor.startup(() => {
    try {
      const plaintextPassword = 'mySecretPassword123';
      const encryptedPassword = await PasswordEncryptionUtility.encryptPassword(plaintextPassword);
      console.log('Encrypted Password:', encryptedPassword);

      const decryptedPassword = await PasswordEncryptionUtility.decryptPassword(encryptedPassword);
      console.log('Decrypted Password:', decryptedPassword);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}
