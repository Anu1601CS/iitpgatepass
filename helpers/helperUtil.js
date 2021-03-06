const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const Promise = require('bluebird');
const url = require('url');
const randomstring = require('randomstring');

module.exports = {
  randomId() {
    const current_date = new Date().valueOf().toString();
    const random = Math.random().toString();
    return crypto
      .createHash('sha1')
      .update(current_date + random)
      .digest('hex');
  },

  encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  },

  decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },

  getHostUrlFromReq(req, includePath) {
    if (includePath) {
      return url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        pathname: req.originalUrl
      });
    }
    return url.format({
      protocol: req.protocol,
      hostname: req.hostname
    });
  },

  getRandomAlphaNumericString(length, charset) {
    return randomstring.generate({
      charset: charset || '0123456789abcdefghijklmnopqrstuvwxyz',
      length: length || 8
    });
  },

  queryDatabase(connector, sql, params = []) {
    return new Promise((resolve, reject) =>
      connector.query(sql, params, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      })
    );
  },

  getMD5HashSync(data, salt = 'SONAMGUPTABEWAFAHAI') {
    if (data == null) data = 'N/A';
    data = data.toString() + salt;
    return crypto
      .createHash('md5')
      .update(data)
      .digest('hex');
  }
};
