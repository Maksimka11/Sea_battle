let user_id;

function sendRequest(method, url, body = null) {
    return new Promise( (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status >= 400)
                reject(xhr.response);
            else
                resolve(xhr.response);
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send(JSON.stringify(body));
    })
}


function loginValidate(username, password) {
    if (username.length == 0) {
        alert("Введите имя пользователя");
    } else if (password.length == 0) {
        alert("Введите пароль");
    } else {
        sendRequest('GET', 'http://localhost:3000/api/user/' + username)
        .then(res => {
            if (res == null)
                alert("Неправильное имя пользователя");
            else if (res.password != password) {
                alert("Неправильный пароль");
            } else {
                localStorage.setItem('user_id', res.id);
                window.location.href = 'index.html';
            }
        })
    }
}

function registerValidate(username, pass, rep) {
    if (username.length == 0) {
        alert("Введите логин");
    } else if (pass.length == 0) {
        alert("Введите пароль");
    } else if (rep.length == 0) {
        alert("Повторите пароль");
    } else if (pass != rep) {
        alert("Пароли не совпадают");
    } else {
        sendRequest('GET', 'http://localhost:3000/api/user/' + username)
        .then(res => {
            if (res == null) {
                sendRequest("POST", 'http://localhost:3000/api/user', {
                    username: username,
                    password: pass
                }).then(res => {
                    localStorage.setItem('user_id', res.id); 
                    window.location.href = 'index.html';
                })
            }
            else {
                alert("Пользователь с таким ником уже зарегистрирован");
            }
    })
}
}


function indexLoad() {
    user_id = localStorage.getItem('user_id');
    if (user_id == null) {
        window.location.href = "signin.html";
    } else {
    sendRequest('GET', 'http://localhost:3000/api/stat/' + user_id)
    .then(res => {
        if (res === null)
            sendRequest('POST', 'http://localhost:3000/api/stat', {
                id: user_id
            })
    })    
}
}


async function logout() {
    localStorage.removeItem('user_id');
    window.location.href = 'signin.html'
}