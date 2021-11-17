
window.onload = function() {

        document.getElementById("reg-button").addEventListener("click", () => {
            window.location.href = "/signup";
        });

        const emailField = document.getElementById("email");
        const passwordField = document.getElementById("password");

        const faceButton = document.getElementById("face-button");

        faceButton.addEventListener("click", async (e) => {
            e.preventDefault()
            const requestData = {
                email: emailField.value, 
                password: passwordField.value
            }

            console.log("sending request...");

            const response = await fetch('/face-login', {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseBody = await response.json();
            const statusCode = response.status;
            const message = responseBody.message;

            if (statusCode == 200) {
                if (message === "FACE_RECOGNIZED") {
                    await execQuery(`INSERT INTO login_history VALUES('2', '${new Date()}')`);
                    localStorage.setItem('username', 'Aryak Kumar');
                    Swal.fire(
                        'Success!',
                        'You have been successfully logged in!',
                        'success'
                    )	
                    window.location.href = "dashboard"
                }
            }
        });

        document.getElementsByTagName("form")[0].addEventListener("submit", async (e) => {
            e.preventDefault();

            const requestData = {
                email: emailField.value, 
                password: passwordField.value
            };
            const response = await fetch('login', {
                method: 'post', 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });       
            
            const responseBody = await response.json();
            const statusCode = response.status;
            const message = responseBody.message;

            if (statusCode === 200) {
                alert("You have been logged in!");
                await execQuery(`INSERT INTO login_history VALUES('2', '${new Date().toMysqlFormat()}')`);
                localStorage.setItem('username', emailField.value);
                window.location.href = "dashboard";
            } else {
                switch(message) {
                    case "INVALID_EMAIL":
                        alert("User is not registered.");
                        break;
                    case "INVALID_PASSWORD":
                        alert("Unauthorized access.");
                        break;        
                }
        
                emailField.value = "";
                passwordField.value = "";
            }
        });
    }

    async function execQuery(query) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch("query", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: query })
            });
            const responseBody = await response.json();
            resolve(JSON.parse(responseBody.data));
        });
    }
    

    