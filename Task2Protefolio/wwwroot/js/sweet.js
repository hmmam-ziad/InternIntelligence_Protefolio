const form = document.getElementById("contactForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your message has been sent",
        showConfirmButton: false,
        timer: 2000
    });
});

