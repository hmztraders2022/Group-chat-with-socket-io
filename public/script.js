const socket = io("http://localhost:3000");

const clientTotal = document.getElementById("total-client");
let messageContainer = document.getElementById("message-container")
let nameInput = document.getElementById("name-input")
let messageForm = document.getElementById("message-form")
let messageInput = document.getElementById("message-input")
const messageTone = document.getElementById('message-audio');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
})

function sendMessage() {
  if (messageInput.value == '') {
    return
  }
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }

  socket.emit('message', data);
  addMessage(true, data); // DISINI ISOWNER MESSAGE NYA BERNILAI TRUE KARNA USER YANG MENGETIK DAN MENGIRIMKAN DATA KE EVENT EMIT IO
  messageInput.value = '';
}

socket.on('chat-message', (data) => {
  messageTone.play();
  addMessage(false, data); // DISINI ISOWNER MESSAGE NYA BERNILAI FALSE KARNA HANYA MENERIMA DATA DARI EVENT EMIT IO
})

function addMessage(isOwnerMessage, data) {
  clearFeedback()
  let element = `
    <li class="${isOwnerMessage ? 'message-right' : 'message-left'}">
      <p class="message">
        ${data.message}
        <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
      </p>
    </li>
  `
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom () {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('input', (e) => {
  if (e.target.value.length < 1) {
    socket.emit('feedback', {
      feedback: ``
    })
    clearFeedback();
  }
})

messageInput.addEventListener('focus', (e) => {
  if (e.target.value != '') {
    socket.emit('feedback', {
      feedback: `${nameInput.value} is typing a message`
    })
  }
})

messageInput.addEventListener('keypress', (e) => {
  if (e.target.value != '') {
    socket.emit('feedback', {
      feedback: `${nameInput.value} is typing a message`
    })
  }
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: ``
  })
  
})

socket.on('feedback', (data) => {
  clearFeedback();
  let element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `

  messageContainer.innerHTML += element;
})

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((e) => {
    e.parentNode.removeChild(e)
  })
}


socket.on("clients-total", (data) => {
  clientTotal.innerHTML = `Total Clients Join: ${data}`;
  console.log(data, "data")
})