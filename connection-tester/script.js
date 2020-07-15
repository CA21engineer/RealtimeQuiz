const logPre = document.getElementById('log');
const log = (str) => logPre.textContent += '\n' + str;


const deploySocket = (roomId, number, span = 250, msgHandler) => {
    return new Promise((resolve) => {
        let connectionNum = 0;
        const sockets = [];

        const interval = setInterval(() => {
            connectionNum++;
            const id = Math.floor(Math.random() * 10000000000000)
            const socket = new WebSocket(`wss://quiz.anyfrog.net/ws/room/${roomId}/accountId/${id}`);
            // const socket = new WebSocket(`ws://localhost:18080/ws/room/${roomId}/accountId/${id}`);
            socket.addEventListener('open', () => {
                log('open connection');

                socket.addEventListener('message', (event) => {
                    msgHandler(event, socket, id);
                });
            });
            socket.addEventListener('error', () => log('error connection'));
            socket.addEventListener('close', () => log('close connection'));

            sockets.push(socket);

            if (connectionNum === number) {
                clearInterval(interval);
                resolve(sockets);
            }
        }, span);
    });
}

const test10Connection = async () => {
    const roomName = '負荷試験' + Date.now();

    const accountId = 'admin';
    const res = await fetch(`https://quiz.anyfrog.net/api/room/accountId/${accountId}`,
    // const res = await fetch(`http://localhost:18080/api/room/accountId/${accountId}`,
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({roomName}),
        }).then(r => r.json());

    console.log(res);
    log(`roomId => ${res.roomId}`)

    let nameChanged = false;
    const sockets = deploySocket(res.roomId, 10, 250, (msg, socket, id) => {
        const json = JSON.parse(event.data);

        log(`incoming message on connection ${id} ${json.type}`);

        if (nameChanged) {
            nameChanged = true;
            setTimeout(() => {
                socket.send(JSON.stringify({
                    type: 'ChangeName',
                    data: {
                        accountName: String(id)
                    }
                }));
            }, 500);
        }

    });
    log(`done deploy => ${res.roomId}`)

}



test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();
test100Connection();