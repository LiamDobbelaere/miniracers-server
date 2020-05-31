const dgram = require("dgram");
const server = dgram.createSocket('udp4');
const playerData = {};

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);

  const clientId = rinfo.address.toString() + rinfo.port.toString();

  playerData[clientId] = msg;

  const filteredPlayerData = Object.keys(playerData).reduce((acc, key) => {
    if (key !== clientId) {
      return [...acc, playerData[key]];
    }

    return acc;
  }, []);

  const bytesToSend = Buffer.concat(filteredPlayerData);
  server.send(/*msg*/ bytesToSend, rinfo.port, rinfo.address);

  console.log(`server sent: ${bytesToSend.length} bytes to ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(11435);