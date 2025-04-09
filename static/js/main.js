// Function to update queue status
async function updateQueueStatus() {
    try {
        const response = await fetch('/api/queue-size');
        const data = await response.json();
        
        document.getElementById('active-tasks').textContent = data.active_tasks;
        document.getElementById('reserved-tasks').textContent = data.reserved_tasks;
        document.getElementById('scheduled-tasks').textContent = data.scheduled_tasks;
        document.getElementById('total-tasks').textContent = data.total_reported_by_workers;
        document.getElementById('max-queue-size').textContent = data.max_queue_size_limit;
        
        if (data.error) {
            document.getElementById('queue-error').textContent = data.error;
        } else {
            document.getElementById('queue-error').textContent = '';
        }
    } catch (error) {
        console.error('Error fetching queue status:', error);
        document.getElementById('queue-error').textContent = 'Error fetching queue status';
    }
}

// Function to handle TTS request
async function handleTTSRequest(event) {
    event.preventDefault();
    
    const text = document.getElementById('text-input').value;
    const voice = document.getElementById('voice-input').value;
    
    if (!text || !voice) {
        document.getElementById('tts-error').textContent = 'Please enter both text and voice';
        return;
    }
    
    try {
        const response = await fetch('/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: text,
                voice: voice,
                response_format: 'mp3'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate speech');
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        document.getElementById('tts-error').textContent = '';
        
        // Update queue status after successful request
        updateQueueStatus();
    } catch (error) {
        console.error('Error generating speech:', error);
        document.getElementById('tts-error').textContent = error.message;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Update queue status every 5 seconds
    updateQueueStatus();
    setInterval(updateQueueStatus, 5000);
    
    // Add event listener for the TTS form
    document.getElementById('tts-form').addEventListener('submit', handleTTSRequest);
}); 