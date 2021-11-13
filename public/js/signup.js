window.onload = function() {
    const form = document.getElementsByTagName("form")[0];
    const emailField = document.getElementById("email");
    const nameField = document.getElementById("name");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        
        if (passwordField.value !== confirmPasswordField.value) {
            alert("Passwords do not match!");
            return ;
        }

       const requestData = {
           name: nameField.value,
           email: emailField.value, 
           password: passwordField.value
       };

        const response = await fetch('signup', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });       
        
        const responseBody = await response.json();
        const statusCode = response.status;
        const message = responseBody.message;

        console.log(responseBody);
        if (statusCode === 201  && message === "CREATED") {
            alert("Your account has been registered!");
            window.location.href = "/login";
        } else {
            switch(message) {
                case "DUPLICATE_EMAIL":
                    alert("Email is in use.");
                    break;
            }
        }
    });

    document.getElementById("login-button").addEventListener("click", () => {
        window.location.href = "/login";
    });
}

