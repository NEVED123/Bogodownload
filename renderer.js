const download = document.getElementById('download-button')
download.addEventListener('click', () => {
    window.electronAPI.download();
})






