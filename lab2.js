const nameInput = document.getElementById("name");
const greetButton = document.getElementById("greet");
const title = document.getElementById("title");
const list = document.getElementById("list");

greetButton.addEventListener("click", function () {
    const name = nameInput.value;

    if (name === "") {
        title.textContent = "Please enter your name.";
        return;
    }

    title.textContent = "Hello, " + name;

   const li = document.createElement("li");
   li.textContent = name;
   list.appendChild(li);

   if (nameInput.value == list.textContent) {
        title.textContent = "Goodbye, " + name;
        list.remove(nameInput.value);
        }
    });
