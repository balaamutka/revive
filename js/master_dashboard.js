function openModal() {
    document.getElementById('addProjectModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addProjectModal').style.display = 'none';
}

function saveProject() {
    alert("Success! Your project has been published to Portfolio.");
    closeModal();
}

window.onclick = function(event) {
    let modal = document.getElementById('addProjectModal');
    if (event.target == modal) {
        closeModal();
    }
}