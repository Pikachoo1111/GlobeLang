# GlobeLang
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <style>
        #messages { border: 1px solid #ccc; height: 300px; overflow-y: scroll; }
        #message-input { width: 100%; }
    </style>
</head>
<body>
    <h1>Chat Application</h1>
    <div id="messages"></div>
    <input id="message-input" type="text" placeholder="Type your message..." />
    <button id="send-button">Send</button>

    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js"></script>
    <script src="app.js"></script>
</body>
</html>


const firebaseConfig= {

