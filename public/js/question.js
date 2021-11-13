const ansForm = document.getElementById("ans-form");


ansForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const answer = document.getElementById("content-t").value;
    
    const requestData = {
        questionId: window.location.pathname.split("/").pop(),
        answer: answer
    };

    const response = await fetch("/answer", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(requestData)
    });

    const responseBody = await response.json();
    
    const message = responseBody.message; 

    switch (message) {
        case "ADDED":
            alert("Added answer!");
            window.location.reload();
            break;
    }
});


const deleteBts = document.getElementsByClassName("delete");
if (deleteBts) {
    Array.from(deleteBts).forEach(el => {
        el.addEventListener("click", async () => {
            const aid = el.getAttribute("data-aid");
            
            const requestData = {
                aid: aid,
                qid: window.location.pathname.split("/").pop()
            };

            const response = await fetch("/answer", {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(requestData)
            });

            const responseBody = await response.json(); 
            const message = responseBody.message; 

            if (message === "DELETED") {
                alert("Answer has been deleted!");
                window.location.reload();
            } else {
                alert("Could not delete answer");
            }
        });
    });
}

const delAnswer = document.getElementById("del-ans");

if (delAnswer) {
    delAnswer.addEventListener("click", async () => {
        const requestData = {
            qid: window.location.pathname.split("/").pop()
        };

        const response = await fetch("/question", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const responseBody = await response.json();
        const message = responseBody.message; 

        if (message === "DELETED") {
            alert("Question has been deleted!");
            window.location.href = "/dashboard";
        } else {
            alert("Could not delete answer  ");
        }
        
    });
}

const editQuestionBt = document.getElementById("question-edit");
const initView = document.getElementById("initial-view");
const editView = document.getElementById("edit-view");

if (editQuestionBt) {
    editQuestionBt.addEventListener("click", () => {
        initView.style.display = "none";
        editView.style.display = "block";
    });
}

if (editView) {
    editView.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("edit-title").value;
        const content = document.getElementById("edit-content").value;

        
        let category = "";
        for (let categoryField of document.getElementsByName("edit-cat")) {
            if (categoryField.checked) {
                category = categoryField.value;
                break;
            }
        }

        const requestData = {
            qid: window.location.pathname.split("/").pop(),
            title: title, 
            content: content,
            category: category
        };

        const response = await fetch("/question", {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(requestData)
        });

        const responseBody = await response.json(); 
        const message = responseBody.message;

        if (message === "UPDATED") {
            alert("Question has been updated!");
            window.location.reload();
        } else {
            alert("Error updating question!");
            initView.style.display = "block";
            editView.style.display = "none";
        }
    });
}

const answerLabel = document.getElementById("label-answer");
if (answerLabel) {
    answerLabel.addEventListener("click", () => {
        document.getElementById("static-view").style.display = "none";
        document.getElementById("answer-view").style.display = "block";
    });

    document.getElementById("cancel-answer").addEventListener("click", () => {
        document.getElementById("static-view").style.display = "block";
        document.getElementById("answer-view").style.display = "none";
    });
}


document.getElementsByClassName("upvote")[0].addEventListener("click", async () => {
    const requestData = {
        questionId: window.location.pathname.split("/").pop()
    };

    const response = await fetch("/upvote", {
        method: "post", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(requestData)
    });

    const responseJson = await response.json();
    const responseMessage = responseJson.message; 

    switch (responseMessage) {
        case "UPDATED":
            alert("Upvote has been added!");
            window.location.reload();
    }
});