window.onload = () => {
  const clientSocketIo = window.io('http://localhost:3000');

  const element = (id) => document.getElementById(id);

  const status = element('status');
  const messageList = element('messageList');
  const textArea = element('textarea');
  const username = element('username');
  const clearBtn = element('clear');
  const sndBtn = element('btn-send');

  // Como fazer a lógica de salvar nickname?

  // const saveBTN = element('btn-save');

  const statusDefault = status.textContent;

  const setStatus = (s) => {
    status.textContent = s;

    if (s !== statusDefault) {
      setTimeout(() => {
        setStatus(statusDefault);
      }, 4000);
    }
  };

  clientSocketIo.on('newNickName', (nickname) => {
    console.log({ nickname });
    username.value = nickname;
  });

  sndBtn.addEventListener('click', () => {
    clientSocketIo.emit('message', {
      nickname: username.value,
      chatMessage: textArea.value,
    });
  });

  clientSocketIo.on('history', (data) => {
    if (data.length) {
      data.forEach((d) => {
        // console.log(d);
        const message = document.createElement('div');
        message.setAttribute('data-testid', 'message');
        message.textContent = `${d.data} ${d.hora} ${d.nickname}: ${d.chatMessage}`;
        messageList.appendChild(message);
        messageList.insertBefore(message, messageList.firstChild);
      });
    }
  });

  clientSocketIo.on('message', (completeMessage) => {
    const message = document.createElement('div');
    message.setAttribute('data-testid', 'message');
    message.textContent = completeMessage;
    messageList.appendChild(message);
    messageList.insertBefore(message, messageList.firstChild);
  });

  clientSocketIo.on('status', (data) => {
    setStatus(typeof data === 'object' ? data.message : data);
    if (data.clear) {
      textArea.value = '';
    }
  });

  clearBtn.addEventListener('click', () => {
    clientSocketIo.emit('clear');
  });

  clientSocketIo.on('cleared', () => {
    messageList.textContent = '';
  });
};

//  TODO

// clientSocketIo.on('newUser', (username) => {
//   const divUsers = document.getElementById('users')
//   const li = document.createElement('li')
//     li.setAttribute('data-name', 'user-online')
//   li.textContent = username;

//   divUsers.append(li)
// });