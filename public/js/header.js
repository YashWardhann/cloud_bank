window.onload = () => {
    const logoutButton = document.getElementById("logout");
    
    const authMode = (logoutButton === null) ? false : true;
    
    if (authMode) {
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

    if (!authMode) {
        document.getElementById("login").addEventListener("click", () => {
            window.location.href = "/login"
        });

        document.getElementById("reg").addEventListener("click", () => {
            window.location.href = "/signup";
        });
    }

    const search = document.getElementById("search");
    const questions = document.getElementsByClassName("question-tab");
    
    search.addEventListener("keyup", () => {
        const searchQuery = search.value.toLowerCase();
        const shownQuestions = Array.from(questions).filter(el => el.style.borderStyle != "ridge");
        
        for (let i = 0; i < shownQuestions.length; i++) {
            const questionTitle = shownQuestions[i].querySelector(".tab-heading").innerText.toLowerCase();
            if (questionTitle.includes(searchQuery) || searchQuery ==="") {
                shownQuestions[i].style.display = "block";
            } else {
                shownQuestions[i].style.display = "none";
            }
        }
    });
}