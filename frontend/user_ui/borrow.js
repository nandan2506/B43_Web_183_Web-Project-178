const bookModel = require("../models/book.model.js")


    (async function () {
        const book = await fetch('http://localhost:8080/books/borrow/:${bookId}',{
            method:"POST",
            headers: application/json,
            body: json.stringfy({

            })
        })
        const res = await book.json()

        const title = document.getElementById("title")
        title.innerText=book

        const author = document.getElementById("author")


        const borrow_book_container = document.getElementById("borrow-book")
    })