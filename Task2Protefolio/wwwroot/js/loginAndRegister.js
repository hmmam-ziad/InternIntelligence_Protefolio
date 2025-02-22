//Login
$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        $.ajax({
            url: '/api/accountapi/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ UserName: username, Password: password }),
            success: function (response) {
                localStorage.setItem("adminLoggedIn", "true");
                window.location.href = "index.html";
            },
            error: function (xhr) {
                $('#message').text('Invalid username or password').css('color', 'red');
            }
        });
    });
});

//Register
$(document).ready(function () {
    $('#registerForm').submit(function (event) {
        event.preventDefault();

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmpassword = $('#confirmPassword').val();


        if (!username || !email || !password || !confirmpassword) {
            $('#message').text('Please fill in all fields.').css('color', 'red');
            return;
        }


        $.ajax({
            url: '/api/accountapi/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, email: email, password: password, confirmPassword: confirmpassword }),
            success: function (response) {
                $('#message').text(response.message).css('color', 'green');
            },
            error: function (xhr) {
                var errorMessage = 'An error occurred, please try again.';
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    errorMessage = xhr.responseJSON.errors.join(', ');
                }
                $('#message').text(errorMessage).css('color', 'red');
            }
        });
    });
});

