

(async function () {
    try {
        let res = await fetch('http://localhost:8080/books/all', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let result = await res.json();
        displayBooks(result);
    } catch (error) {
        console.log("Error fetching books:", error);
    }
})();


const container = document.getElementById("container")
const filter = document.getElementById("filter")
const search = document.getElementById("srch")



function displayBooks(arr) {
    container.innerHTML = ""

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

        if (!book.is_available) {
            card.querySelector(".borrow").style.display = "none"
            card.querySelector(".reserve").style.display = "block"


        }
        container.appendChild(card)
    });
    attachEventListeners()

}


function attachEventListeners() {
    const borrow = document.querySelectorAll(".borrow");

    borrow.forEach((button) => {
        button.addEventListener("click", (e) => {
            const bookId = e.target.getAttribute("data-id");
         
            const userId = 1234
            socket.emit("borrow-request", { bookId, userId });

            alert("Borrow request sent");
        });
    });

    document.querySelectorAll(".reserve").forEach((button) => {
        button.addEventListener("click", (e) => {
            const bookId = e.target.getAttribute("data-id");

            const userId = 1234
            socket.emit("reserve-request", { userId, bookId });

            alert("Reserve request sent");
        });
    });
}


search.addEventListener("input", () => filterBooks());
filter.addEventListener("change", () => filterBooks());

async function filterBooks() {
    let res = await fetch('http://localhost:8080/books/all');
    let books = await res.json();
    let query = search.value.toLowerCase();
    let filterValue = filter.value;

    let filteredBooks = books.filter(book => {
        if (!query) return true;
        if (!filterValue) {
            return Object.values(book).some(value => value?.toString().toLowerCase().includes(query));
        }
        return book[filterValue]?.toString().toLowerCase().includes(query);
    });

    displayBooks(filteredBooks);
}








