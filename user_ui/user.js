// const { Socket } = require("socket.io")



(async function () {
    try {
        let res = await fetch('http://localhost:8080/books', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let result = await res.json();
        displaybooks(result);
    } catch (error) {
        console.log("Error fetching books:", error);
    }
})();


const container = document.getElementById("container")
const filter = document.getElementById("filter")
const search = document.getElementById("srch")



function displaybooks(arr) {

    arr.forEach((book) => {
        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
            <div>
                <img src="${book.cover_image}" alt="">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.publication_year}</p>
                <p>${book.description}</p>
                <button class="borrow" data-id="${book._id}">Borrow</button>
                <button class="reserve" data-id="${book._id}">Reserve</button>
                
            </div>
        `;
        
        if(!book.is_available){
            card.querySelector(".borrow").style.display = "none"
            card.querySelector(".reserve").style.display = "block"
            

        }
        container.appendChild(card)
    });
    attachEventListeners()

}


function attachEventListeners() {
    const borrow = document.querySelectorAll(".borrow")

    borrow.forEach((button) => {
        button.addEventListener("click", (e) => {
            const bookId = e.target.getAttribute("data-id");
            const userId = "2345"; 
            socket.emit("borrow-request", { bookId, userId });
            alert("Borrow request sent");

        });
    });

    document.querySelectorAll(".reserve").forEach((button) => {
        button.addEventListener("click", (e) => {
            const bookId = e.target.getAttribute("data-id");
            const userId = "userId"; // Replace with actual user ID
            socket.emit("reserve-request", { userId, bookId });
            alert("Reserve request sent");
        });
    });
}

// function searchBook(arr, key, filter) {
//     if (key == "" || filter == "")
//         return arr

//     else if (filter_value == "") {
//         const arr1 = result.filter((ele) =>
//             ele["title"]?.toLowerCase().includes(key) ||
//             ele["author"]?.toLowerCase().includes(key) ||
//             ele["publication_year"]?.toString().toLowerCase().includes(key) ||
//             ele["description"]?.toLowerCase().includes(key) ||
//             ele["is_available"]?.toString().toLowerCase().includes(key))
//         return arr1
//     }
//     let ansArr = arr.filter((ele) => ele[filter].toLowerCase().includes(key))
//     return ansArr
// }




search.addEventListener("input", async () => {
    container.innerHTML = ``
    try {
        let res = await fetch('http://localhost:8080/books',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        const result = await res.json()
        const ipt = search.value.toLowerCase()
        const filter_value = filter.value
        // const arr = searchBook(result,ipt,filter_value)
        // console.log(arr)
        // displaybooks(arr)


        if (filter_value == "") {
            const arr = result.filter((ele) =>
                ele["title"]?.toLowerCase().includes(ipt) ||
                ele["author"]?.toLowerCase().includes(ipt) ||
                ele["publication_year"]?.toString().toLowerCase().includes(ipt) ||
                ele["description"]?.toLowerCase().includes(ipt) ||
                ele["is_available"]?.toString().toLowerCase().includes(ipt))
            console.log(filter_value, arr)
            displaybooks(arr)
            if (arr.length == 0) {
                container.innerHTML = `<h2>no book found</h2>`
            }

        }
        else {
            const arr = result.filter((ele) => ele[filter_value] && ele[filter_value].toLowerCase().includes(ipt))
            console.log(filter_value, arr)
            if (arr.length == 0) {
                container.innerHTML = `<h2>no book found</h2>`
            }
            displaybooks(arr)
        }
    } catch (error) {
        console.log("error while search", error)
    }
})



filter.addEventListener("change", async () => {
    container.innerHTML = ``
    try {
        let res = await fetch('http://localhost:8080/books',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        const result = await res.json()
        const ipt = search.value.toLowerCase()
        const filter_value = filter.value

        if (filter_value == "" || ipt == "") {
            displaybooks(result)
        } else {
            const arr = result.filter((ele) => ele[filter_value] && ele[filter_value].toLowerCase().includes(ipt))
            console.log(filter_value, arr)
        }
        if (arr.length == 0) {
            container.innerHTML = `<h2>no book found</h2>`
        }
        displaybooks(arr)
    } catch (error) {
        console.log("error while search", error)
    }


})

// borrow.document.querySelectorAll("")

// borrow.addEventListener("click", async (e) => {
//     try {
//         e.preventDefault()
//         if (borrow.parentElement[is_available == true]) {
//             borrow.parentElement[is_available] = false
//             alert("borrow request sent")
//             borrow.style.display = "none"
//             reserve.style.display = "block"
//         }
//     } catch (error) {

//     }
// })






