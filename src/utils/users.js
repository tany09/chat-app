const users = [];

const addUser = ({id, username, room}) => {
    //Clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if(!username || !room) {
        return ('please provide username and room');
    }

    //Validate the user
    const existingUser = users.find(user => user.username === username && user.room === room);
    if(existingUser) {
        return {
            error: 'Username already exists'
        }
    }

    //Add user
    const user = {
        id,
        username,
        room
    }
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    //find user
    const index = users.findIndex(user => user.id === id);
    if(index === -1) {
        return {
            error: 'User does not exist'
        }
    }

    //Remove user
    const user = users.splice(index, 1)[0];
    return user;
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}