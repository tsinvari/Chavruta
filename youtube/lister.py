import subprocess
import json
import sys
import os

def list_youtube_channel_videos(channel_url):
    """
    Lists video titles and IDs from a given YouTube channel URL using yt-dlp.

    Args:
        channel_url (str): The URL of the YouTube channel.

    Returns:
        list: A list of dictionaries, where each dictionary contains
              'title' and 'id' for a video. Returns an empty list on error.
    """
    print(f"Attempting to fetch videos from: {channel_url}")
    try:
        # Use subprocess to run yt-dlp and capture its JSON output
        # -j or --dump-json: Dump JSON information for each video
        # --flat-playlist: Extract only the video URLs, do not extract the videos
        # --skip-download: Do not download the video files
        # --playlist-items 1-100: Limit to the first 100 videos to avoid excessive fetching
        #                         (can be adjusted or removed for all videos)
        command = [
            sys.executable, "-m", "yt_dlp",
            "--dump-json",
            "--flat-playlist",
            "--skip-download",
            channel_url
        ]
        # Run the command and capture stdout and stderr
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True # Raise an exception for non-zero exit codes
        )

        videos_info = []
        # yt-dlp outputs one JSON object per line when --dump-json is used
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    video_data = json.loads(line)
                    # Extract title and ID
                    title = video_data.get('title', 'N/A')
                    video_id = video_data.get('id', 'N/A')
                    videos_info.append({"title": title, "id": video_id})
                except json.JSONDecodeError:
                    print(f"Warning: Could not decode JSON line: {line[:100]}...") # Print first 100 chars
                    continue

        return videos_info

    except FileNotFoundError:
        print("Error: 'yt-dlp' was not found. Please ensure it is installed and in your PATH.")
        print("You can install it using: pip install yt-dlp")
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error running yt-dlp: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

if __name__ == "__main__":
    channel_url = "https://www.youtube.com/@MiriamAnzovin"
    output_filename = "miriam_anzovin_videos.json"

    videos = list_youtube_channel_videos(channel_url)

    if videos:
        print("\n--- Video Titles and IDs ---")
        for i, video in enumerate(videos):
            print(f"{i+1}. Title: {video['title']}\n   ID: {video['id']}\n")

        # Save the list to a JSON file
        try:
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(videos, f, ensure_ascii=False, indent=4)
            print(f"Successfully saved video list to '{output_filename}'")
            print(f"File saved in: {os.getcwd()}") # Indicate where the file is saved
        except IOError as e:
            print(f"Error saving file '{output_filename}': {e}")
    else:
        print("No videos found or an error occurred. No JSON file was created.")

