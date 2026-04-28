/* ============================================
   LOAD PHOTOS AND VIDEOS
   ============================================ */

// Load photos on page load
function loadPhotos() {
    fetch('/api/photos')
        .then(response => response.json())
        .then(data => {
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '';
            
            if (data.photos.length === 0) {
                galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No photos uploaded yet. Upload your first photo!</p>';
                return;
            }
            
            data.photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = `/uploads/${photo}`;
                img.alt = photo;
                img.className = 'gallery-item';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                img.style.cursor = 'pointer';
                img.style.transition = 'all 0.3s ease';
                
                img.addEventListener('mouseenter', function() {
                    this.style.filter = 'brightness(1.1)';
                    this.style.transform = 'scale(1.02)';
                });
                img.addEventListener('mouseleave', function() {
                    this.style.filter = 'brightness(1)';
                    this.style.transform = 'scale(1)';
                });
                
                galleryGrid.appendChild(img);
            });
        })
        .catch(error => console.error('Error loading photos:', error));
}

// Load videos on page load
function loadVideos() {
    fetch('/api/videos')
        .then(response => response.json())
        .then(data => {
            const videoGrid = document.getElementById('videoGrid');
            videoGrid.innerHTML = '';
            
            if (data.videos.length === 0) {
                videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No videos added yet. Add your first video!</p>';
                return;
            }
            
            data.videos.forEach(embedUrl => {
                if (!embedUrl) return;
                
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'video-item';
                
                const iframe = document.createElement('iframe');
                iframe.className = 'video-iframe';
                iframe.src = embedUrl;
                iframe.title = 'YouTube video';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                videoWrapper.appendChild(iframe);
                videoGrid.appendChild(videoWrapper);
            });
        })
        .catch(error => console.error('Error loading videos:', error));
}

// Upload photo handler
document.getElementById('uploadPhotoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('photoInput');
    const formData = new FormData();
    formData.append('photo', fileInput.files[0]);
    
    fetch('/upload/photo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Photo uploaded successfully!');
            fileInput.value = '';
            loadPhotos();
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Upload error: ' + error);
        console.error('Error uploading photo:', error);
    });
});

// Upload video handler
document.getElementById('uploadVideoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const videoInput = document.getElementById('videoInput');
    const url = videoInput.value;
    
    fetch('/upload/video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Video added successfully!');
            videoInput.value = '';
            loadVideos();
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Error: ' + error);
        console.error('Error uploading video:', error);
    });
});

// Load photos and videos when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPhotos();
    loadVideos();
});

/* ============================================
   INTERACTIVE FEATURES
   ============================================ */

// Smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active nav link highlighting based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// CTA Button interaction
document.querySelector('.cta-button').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
});

console.log('Portfolio loaded successfully!');
