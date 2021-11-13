    const submitButton = document.getElementById("submit-button");
    const titleField = document.getElementById("title");
    const contentField = document.getElementById("content-t");
    const categoryFields = document.getElementsByName("cat");

    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        let category = "";
        for (let categoryField of categoryFields) {
            if (categoryField.checked) {
                category = categoryField.value;
                break;
            }
        }

        const requestData = {
            title: titleField.value, 
            content: contentField.value,
            space: category
        };
        const response = await fetch('/question', {
            method: 'post', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });       
        
        const responseBody = await response.json();
        const statusCode = response.status;
        const message = responseBody.message;

        
        if (statusCode === 201) {
            alert("Question has been posted!");
            window.location.href = "/dashboard";
        } else {
            alert("Oops error!");
        }
    });
