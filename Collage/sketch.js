document.querySelectorAll('.collage-img').forEach(img => {
    
    img.style.top = Math.random() * (window.innerHeight - img.clientHeight) + 'px';
    img.style.left = Math.random() * (window.innerWidth - img.clientWidth) + 'px';

    img.addEventListener('mouseover', () => {
        img.style.opacity = '1';
    });

    img.addEventListener('mousedown', (e) => {
        img.style.cursor = 'grabbing';
        let shiftX = e.clientX - img.getBoundingClientRect().left;
        let shiftY = e.clientY - img.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            img.style.left = pageX - shiftX + 'px';
            img.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        img.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            img.style.cursor = 'grab';
        });

        img.addEventListener('dragstart', () => false);
    });
});


function checkAllImagesVisible() {
    return Array.from(document.querySelectorAll('.collage-img')).every(img => img.style.opacity == '1');
}


function reverseColors() {
    document.body.style.filter = 'invert(1)';
}

// Check every second if all images are visible
let checkInterval = setInterval(() => {
    if (checkAllImagesVisible()) {
        clearInterval(checkInterval);
        setTimeout(reverseColors, 5000); // Wait for 5 seconds before reversing colors
    }
}, 1000);