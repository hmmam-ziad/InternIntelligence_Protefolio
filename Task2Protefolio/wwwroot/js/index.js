//Api Contact
$(document).ready(function () {
    if (localStorage.getItem('adminLoggedIn')) {
        $.ajax({
            url: '/api/Contact/GetAllContacts',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                
                $('.contact-ad').empty();

                
                response.forEach(function (msg) {
                    $('.contact-ad').append(
                        `<div class="messages-container">
                    <div class="message-card">
                        <h4>${msg.name}</h4>
                        <p><strong>Email:</strong> ${msg.email}</p>
                        <p>${msg.message}</p>
                    </div>
                </div>`
                    );
                });
            },
            error: function (xhr) {
                console.log('Failed to get contacts. Try again.');
            }
        });

    }
    else {
        document.querySelector('.contact-ad').style.display = 'none';
        document.querySelector('.contact-fo').style.display = 'block';

        $("#contactForm").submit(function (event) {

            event.preventDefault();

            var name = $("#name").val();
            var email = $("#email").val();
            var message = $("#message").val();

            $.ajax({
                url: "/api/Contact/CreateContact",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                }),
                success: function (response) {
                    $('#messageI').text("Message sent successfully!").css('color', 'green');
                    $("#name").val("");
                    $("#email").val("");
                    $("#message").val("");
                },
                error: function (xhr, status, error) {
                    console.error("Error:", xhr.responseText);
                    alert("Failed to send message. Try again.");
                }
            });
        });
    }
});

//Admin
$(document).ready(function () {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (isAdmin === "true") {
        $('#admin-logout').append('<a id="logoutButton" class="nav__link">Logout</a>');
        
        $('#logoutButton').on('click', function () {
            $.ajax({
                url: '/api/accountapi/logout',
                type: 'POST',
                contentType: 'application/json',
                success: function (response) {
                    localStorage.removeItem("adminLoggedIn");
                    window.location.href = 'index.html';
                },
                error: function (xhr) {
                    alert('Logout failed');
                }
            });
        });
    }
    
});







//Get Skills
$(document).ready(function () {
    $.ajax({
        url: '/api/Skills/GetAllSkills',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            //console.log(response);
            response.forEach(skill => {
                $('.skills-grids').append(
                    `<div class="skills__data" data-id=${skill.skillId}>
                        <div class="skills__names">
                            <i class='bx bxl-${skill.name} skills__icon'></i>
                            <span class="skills__name">${skill.name}</span>
                        </div>
                        <div class="skills__bar skill-level" data-level="${skill.level}">

                        </div>
                        <div>
                            <span class="skills__percentage" data-level="${skill.level}">${skill.level}%</span>
                        </div>
                        <div class="skills__buttons">
                        </div>
                    </div>`
                );
            });
            if (localStorage.getItem('adminLoggedIn')) {
                $('.skill-title').after('<button class="button button-contant create-btn" style="margin-left: 254px;">Create New</button>');
                $('.skills__buttons').each(function () {
                    $(this).append('<button class="action-btn edit-btn">Edit</button> <button class= "action-btn delete-btn">Delete</button > ');
                });
            }
            animateSkillBars();
        },
        error: function (xhr) {
            $('#message').text('Failed to get skills. Try again.').css('color', 'red');
        }
    });
});

// Bar Animation Function
function animateSkillBars() {
    document.querySelectorAll(".skill-level").forEach(skill => {
        let level = parseInt(skill.getAttribute("data-level"));

        setTimeout(() => {
            skill.style.width = level + "%";

            
            if (level >= 80) {
                skill.style.background = "#4CAF50";
            } else if (level >= 60) {
                skill.style.background = "#FFC107";
            } else {
                skill.style.background = "#F44336";
            }
        }, 500);

    });
}

//Delete Skill
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        let skillItem = event.target.closest('.skills__data');

        let skillId = skillItem.getAttribute('data-id');

        if (!skillId) return;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                $.ajax({
                    url: `/api/Skills/${skillId}`,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (response) {
                        skillItem.remove();
                    },
                    error: function (xhr) {
                        alert('Failed to delete skill. Try again.');
                    }
                });
            }
        });
    }
});



// Edit Skill //Add Form And Create Skill
document.addEventListener('click', function (event) {
    const skillForm = document.getElementById('skill-div');
    const skillSection = document.getElementById('skills-section-div');
    const skillNameInput = document.getElementById('skill-name');
    const skillLevelInput = document.getElementById('skill-level');
    const submitButton = document.querySelector('.btn-edit-skill');

    if (event.target.classList.contains('create-btn')) {
        skillForm.style.display = 'block';
        skillSection.style.display = 'none';
        submitButton.textContent = "Add Skill";
        submitButton.setAttribute('data-mode', 'create');
        skillNameInput.value = '';
        skillLevelInput.value = '';
    }

    if (event.target.classList.contains('close-btn')) {
        skillForm.style.display = 'none';
        skillSection.style.display = 'block';
    }

    if (event.target.classList.contains('btn-edit-skill')) {
        event.preventDefault();

        const mode = submitButton.getAttribute('data-mode');
        const name = skillNameInput.value.trim();
        const level = skillLevelInput.value.trim();

        if (name === '' || level === '' || isNaN(level) || level < 0 || level > 100) {
            alert('Please enter a valid skill name and level (0-100).');
            return;
        }

        if (mode === 'create') {
            $.ajax({
                url: '/api/Skills/CreateSkill',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: name, level: level }),
                success: function () {
                    skillForm.style.display = 'none';
                    skillSection.style.display = 'block';
                    location.reload();
                },
                error: function () {
                    alert('Failed to create skill. Try again.');
                }
            });
        } else if (mode === 'edit') {
            const skillId = submitButton.getAttribute('data-id');
            $.ajax({
                url: `/api/Skills/${skillId}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name: name, level: level }),
                success: function () {
                    document.querySelector(`[data-id='${skillId}'] .skills__name`).textContent = name;
                    document.querySelector(`[data-id='${skillId}'] .skills__percentage`).textContent = level + '%';
                    skillForm.style.display = 'none';
                    skillSection.style.display = 'block';
                },
                error: function () {
                    alert('Failed to update skill. Try again.');
                }
            });
        }
    }

    if (event.target.classList.contains('edit-btn')) {
        let skillItem = event.target.closest('.skills__data');
        let skillId = skillItem.getAttribute('data-id');
        let skillName = skillItem.querySelector('.skills__name').textContent;
        let skillLevel = skillItem.querySelector('.skills__percentage').textContent.replace('%', '');

        skillForm.style.display = 'block';
        skillSection.style.display = 'none';

        skillNameInput.value = skillName;
        skillLevelInput.value = skillLevel;
        submitButton.textContent = "Update Skill";
        submitButton.setAttribute('data-mode', 'edit');
        submitButton.setAttribute('data-id', skillId);
    }
});


//get All Projects
$(document).ready(function () {
    $.ajax({
        url: '/api/Project',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            //console.log(response);
                response.forEach(project => {
                    $('.work__container').append(`
                         <div class="work__card" data-id="${project.projectId}">
                            <img src="../Images/${project.imageUrl}" alt="" class="work__img">
                            <div class="work__info">
                                <h3 class="work__title">${project.projectTitle}</h3>
                                <p class="work__description">${project.projectDescription}</p>
                                <a href="${project.projectLink}" class="work__link">View Project in Githup</a>
                                <div class="projects__buttons">
                                    
                                </div>
                            </div>
                        </div>
                    `);
                });
            if (localStorage.getItem('adminLoggedIn')) {
                $('.project-title').after('<button class="button button-contant create-btn-project" style="margin-left: 254px;">Create New</button>');
                $('.projects__buttons').each(function () {
                    $(this).append('<button class="action-btn edit-btn-project">Edit</button> <button class= "action-btn delete-btn-project">Delete</button > ');
                });
            }
        },
         
    });
});

//delete Project
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn-project')) {
        let projectItem = event.target.closest('.work__card');

        let projectId = projectItem.getAttribute('data-id');

        if (!projectId) return;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                $.ajax({
                    url: `/api/Project/${projectId}`,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: function (response) {
                        projectItem.remove();
                    },
                    error: function (xhr) {
                        alert('Failed to delete skill. Try again.');
                    }
                });
            }
        });
    }
});

// create and update project
function closeForm() {
    document.getElementById('project-div').style.display = 'none';
    document.getElementById('project-section-div').style.display = 'block';
    let submitButton = document.querySelector('.btn-create-project');
    submitButton.textContent = "Add Project";
}

document.addEventListener('click', function (event) {
    const projectForm = document.getElementById('project-div');
    const projectSection = document.getElementById('project-section-div');

    
    if (event.target.classList.contains('create-btn-project')) {
        projectSection.style.display = 'none';
        projectForm.style.display = 'block';
        let submitButton = document.querySelector('.btn-create-project');
        submitButton.textContent = "Add Project";
    }

    
    if (event.target.classList.contains('close-btn')) {
        closeForm();
    }

    // Create Project
    if (event.target.classList.contains('btn-create-project') && event.target.textContent === "Add Project") {
        event.preventDefault();

        const name = document.getElementById('project-name').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const link = document.getElementById('project-link').value.trim();
        const img = document.getElementById('project-img').files[0];

        if (!name || !description || !link || !img) {
            alert('Please enter valid data');
            return;
        }

        let formData = new FormData();
        formData.append("ProjectTitle", name);
        formData.append("ProjectDescription", description);
        formData.append("ProjectLink", link);
        formData.append("Image", img);

        $.ajax({
            url: '/api/Project/CreateProject',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                closeForm();
                location.reload();
            },
            error: function () {
                alert('Failed to create project. Try again.');
            }
        });
    }

    // Update Project
    if (event.target.classList.contains('edit-btn-project')) {
        let projectItem = event.target.closest('.work__card');
        let projectId = projectItem.getAttribute('data-id');
        let projectName = projectItem.querySelector('.work__title').textContent;
        let projectDescription = projectItem.querySelector('.work__description').textContent;
        let projectLink = projectItem.querySelector('.work__link').href;

        document.getElementById('project-div').style.display = 'block';
        document.getElementById('project-section-div').style.display = 'none';

        document.getElementById('project-name').value = projectName;
        document.getElementById('project-description').value = projectDescription;
        document.getElementById('project-link').value = projectLink;

        let submitButton = document.querySelector('.btn-create-project');
        submitButton.textContent = "Update Project";

        function updateProject(e) {
            e.preventDefault();

            const updatedName = document.getElementById('project-name').value.trim();
            const updatedDescription = document.getElementById('project-description').value.trim();
            const updatedLink = document.getElementById('project-link').value.trim();

            if (!updatedName || !updatedDescription || !updatedLink) {
                alert('Please enter valid data');
                return;
            }

            let formData = new FormData();
            formData.append("ProjectTitle", updatedName);
            formData.append("ProjectDescription", updatedDescription);
            formData.append("ProjectLink", updatedLink);

            const imageInput = document.getElementById('project-img');
            if (imageInput.files.length > 0) {
                formData.append("Image", imageInput.files[0]);
            }

            $.ajax({
                url: `/api/Project/${projectId}`,
                type: 'PUT',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    projectItem.querySelector('.work__title').textContent = updatedName;
                    projectItem.querySelector('.work__description').textContent = updatedDescription;
                    projectItem.querySelector('.work__link').href = updatedLink;
                    closeForm();
                },
                error: function (xhr, status, error) {
                    console.log("Status: " + status);
                    console.log("Error: " + error);
                    console.log("Response Text: " + xhr.responseText);
                    alert('Failed to update project. Try again.');
                }
            });
        }
        document.querySelector('.btn-create-project').addEventListener('click', updateProject);
    }
});





