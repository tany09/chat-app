const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $inputFromForm = document.querySelector('input');
const $buttonFromForm = document.querySelector('button');
const $buttonFromLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//query String options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render($messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('k:mm a')
    });
    $messages.insertAdjacentHTML('beforeEnd', html);
    autoscroll();
});

socket.on('locationMessage', (urlObj) => {
    console.log(urlObj);
    const html = Mustache.render($locationTemplate, {
        username: urlObj.username,
        url: urlObj.url,
        createdAt: moment(urlObj.createdAt).format('k:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageForm.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        $inputFromForm.removeAttribute('disabled');
        $inputFromForm.value = '';
        $inputFromForm.focus();
        if(error) {
            return console.log(error);
        }   

        console.log('Message Delivered');
    });
});

$buttonFromLocation.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        if(!navigator.geolocation) {
            return alert('Your browser does not support geolocation');
        }
        $buttonFromLocation.setAttribute('disabled', 'disabled');
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, () => {
            $buttonFromLocation.removeAttribute('disabled');
            console.log('Location Shared');
        });
    });
});

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
    
});