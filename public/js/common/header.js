window.onload = () => {
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const response = await fetch("logout", {
            method: "POST", 
            header: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        window.location.href = "login";
    });
}