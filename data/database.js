
class Message {}

var messages = [
    {
        id: 1,
        text: 'Hello World',
        user: 'user'
    }
].map((_message) => {

    var message = new Message();

    message.id = _message.id;
    message.text = _message.text;
    message.user = _message.user;
    message.date = (new Date()).toISOString();

    return message;
});


class User {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

function createMessage(text) {

    var message = new Message();

    message.id = message.id = messages.length + 1;
    message.text = text;
    message.user = 'user';
    message.date = (new Date()).toISOString();

    messages.push(message);

    return message;
}

function updateMessage(id, text) {

    var idDecoded = String(new Buffer(id, 'base64')).split(':')[1];

    var message = messages.find(w => w.id === Number(idDecoded));

    if (!message) {
        return null;
    }

    message.text = text;

    return message;
}

function removeMessage(id) {

    var idDecoded = String(new Buffer(id, 'base64')).split(':')[1];

    var index = messages.findIndex(w => w.id === Number(idDecoded));

    if (index === -1) {
        return null;
    }

    messages.splice(index, 1);

    return index;
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  User,

  getMessage: (id) => messages.find(w => w.id === id),
  getMessages: () => messages,
  createMessage: createMessage,
  updateMessage: updateMessage,
  removeMessage: removeMessage,
  Message
};
